const API_BASE = 'https://api.torn.com';
const API_V2_BASE = 'https://api.torn.com/v2';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export function getApiKey(): string {
  return GM_getValue<string>('torn_api_key', '');
}

export function setApiKey(key: string): void {
  GM_setValue('torn_api_key', key);
}

interface TornApiError {
  error: {
    code: number;
    error: string;
  };
}

export async function fetchFromApi<T>(endpoint: string, apiKey: string, selections?: string[]): Promise<ApiResponse<T>> {
  const isV2 = endpoint.startsWith('/v2/');
  const base = isV2 ? API_V2_BASE : API_BASE;
  let path = endpoint.startsWith('/v2') ? endpoint.replace('/v2', '') : endpoint;
  const hasQueryParams = path.includes('?');

  return new Promise((resolve) => {
    let url = `${base}${path}${hasQueryParams ? '&' : '?'}key=${apiKey}`;

    if (selections && selections.length > 0 && !path.includes('selections=')) {
      url += `&selections=${selections.join(',')}`;
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (response) => {
        try {
          const data = JSON.parse(response.responseText);

          if ('error' in data) {
            const apiError = data as TornApiError;
            console.error('[Torn API] Error:', apiError.error.error);
            resolve({ error: apiError.error.error });
            return;
          }

          resolve({ data: data as T });
        } catch (e) {
          resolve({ error: 'Failed to parse API response' });
        }
      },
      onerror: () => {
        resolve({ error: 'Network error' });
      },
    });
  });
}

// Medal name cache
let medalNamesCache: Record<number, string> | null = null;

export async function fetchMedalNames(apiKey: string): Promise<Record<number, string>> {
  if (medalNamesCache) return medalNamesCache;

  const resp = await fetchFromApi<Record<string, { name?: string }>>('/torn/medals', apiKey);
  const data = resp.data || {};

  medalNamesCache = {};
  for (const [idStr, medal] of Object.entries(data)) {
    const id = parseInt(idStr);
    if (!isNaN(id) && medal.name) {
      medalNamesCache[id] = medal.name;
    }
  }

  return medalNamesCache;
}

export function clearMedalNamesCache(): void {
  medalNamesCache = null;
}
