const API_BASE = 'https://api.torn.com';

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
  return new Promise((resolve) => {
    let url = `${API_BASE}${endpoint}?key=${apiKey}`;

    // Add selections if provided
    if (selections && selections.length > 0) {
      url += `&selections=${selections.join(',')}`;
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (response) => {
        try {
          const data = JSON.parse(response.responseText);

          // Check for API errors
          if ('error' in data) {
            const apiError = data as TornApiError;
            console.error('[Torn Merits] API Error:', apiError.error);
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
