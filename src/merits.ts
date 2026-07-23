import { fetchFromApi } from './api';

export interface Merit {
  id: number;
  name: string;
  current: number;
  required: number;
  progress: number; // Percentage
}

export interface MeritWithStatus extends Merit {
  isComplete: boolean;
  isNear: boolean;
  remaining: number;
}

export interface MeritStatus {
  nearCompletion: Merit[];
  completed: Merit[];
  allMerits: MeritWithStatus[];
  totalMerits: number;
}

// Merit names mapping - key is the API name, value is display info
interface MeritInfo {
  id: number;
  name: string;
  maxLevel: number;
}

const MERIT_INFO: Record<string, MeritInfo> = {
  // These are the 27 merit categories from Torn
  'Nerve Bar': { id: 1, name: 'Nerve Bar', maxLevel: 100 },
  'Critical Hit Rate': { id: 2, name: 'Critical Hit Rate', maxLevel: 100 },
  'Life Points': { id: 3, name: 'Life Points', maxLevel: 100 },
  'Crime XP': { id: 4, name: 'Crime XP', maxLevel: 100 },
  'Education Length': { id: 5, name: 'Education Length', maxLevel: 50 },
  'Awareness': { id: 6, name: 'Awareness', maxLevel: 100 },
  'Bank Interest': { id: 7, name: 'Bank Interest', maxLevel: 100 },
  'Masterful Looting': { id: 8, name: 'Masterful Looting', maxLevel: 100 },
  'Stealth': { id: 9, name: 'Stealth', maxLevel: 100 },
  'Hospitalizing': { id: 10, name: 'Hospitalizing', maxLevel: 100 },
  'Addiction Mitigation': { id: 11, name: 'Addiction Mitigation', maxLevel: 100 },
  'Employee Effectiveness': { id: 12, name: 'Employee Effectiveness', maxLevel: 100 },
  'Brawn': { id: 13, name: 'Brawn', maxLevel: 100 },
  'Protection': { id: 14, name: 'Protection', maxLevel: 100 },
  'Sharpness': { id: 15, name: 'Sharpness', maxLevel: 100 },
  'Evasion': { id: 16, name: 'Evasion', maxLevel: 100 },
  'Heavy Artillery Mastery': { id: 17, name: 'Heavy Artillery Mastery', maxLevel: 100 },
  'Machine Gun Mastery': { id: 18, name: 'Machine Gun Mastery', maxLevel: 100 },
  'Rifle Mastery': { id: 19, name: 'Rifle Mastery', maxLevel: 100 },
  'SMG Mastery': { id: 20, name: 'SMG Mastery', maxLevel: 100 },
  'Shotgun Mastery': { id: 21, name: 'Shotgun Mastery', maxLevel: 100 },
  'Pistol Mastery': { id: 22, name: 'Pistol Mastery', maxLevel: 100 },
  'Club Mastery': { id: 23, name: 'Club Mastery', maxLevel: 100 },
  'Piercing Mastery': { id: 24, name: 'Piercing Mastery', maxLevel: 100 },
  'Slashing Mastery': { id: 25, name: 'Slashing Mastery', maxLevel: 100 },
  'Mechanical Mastery': { id: 26, name: 'Mechanical Mastery', maxLevel: 100 },
  'Temporary Mastery': { id: 27, name: 'Temporary Mastery', maxLevel: 100 },
};

// Torn API response structure for merits
// Response has a "merits" key containing the actual merit data
// Merit data can be either a number (current spent) or an object {current, max}
type TornMeritValue = number | { current: number; max?: number };

interface TornMeritsResponse {
  merits: Record<string, TornMeritValue>;
}

export async function checkMerits(apiKey: string, threshold: number): Promise<MeritStatus> {
  // Fetch with selections=merits to get merit data
  const response = await fetchFromApi<TornMeritsResponse>('/user', apiKey, ['merits']);

  if (response.error || !response.data) {
    console.error('[Torn Merits] API Error:', response.error);
    return {
      nearCompletion: [],
      completed: [],
      allMerits: [],
      totalMerits: 0,
    };
  }

  console.log('[Torn Merits] Raw merits data:', response.data);

  const merits: MeritWithStatus[] = [];
  const nearCompletion: Merit[] = [];
  const completed: Merit[] = [];

  // The merit data is nested under a "merits" key
  const meritData = response.data.merits || response.data;

  if (!meritData || typeof meritData !== 'object') {
    console.error('[Torn Merits] No merit data found');
    return {
      nearCompletion: [],
      completed: [],
      allMerits: [],
      totalMerits: 0,
    };
  }

  // Parse merits from API response
  for (const [meritKey, value] of Object.entries(meritData)) {
    let current: number;
    let required: number;

    const meritInfo = MERIT_INFO[meritKey];
    required = meritInfo?.maxLevel || 100;

    if (typeof value === 'number') {
      // Value is just the current spent points
      current = value;
    } else if (typeof value === 'object' && value !== null) {
      // Value is an object with current and optionally max
      current = value.current || 0;
      if (value.max) required = value.max;
    } else {
      console.log(`[Torn Merits] Skipping ${meritKey}: unexpected value type`);
      continue;
    }

    const meritId = meritInfo?.id || Object.keys(MERIT_INFO).indexOf(meritKey) + 1;
    const meritName = meritInfo?.name || meritKey;

    // Calculate progress percentage
    const progress = required > 0 ? Math.round((current / required) * 100) : 0;

    const merit: MeritWithStatus = {
      id: meritId,
      name: meritName,
      current: current,
      required: required,
      progress: progress,
      isComplete: current >= required,
      isNear: (required - current) <= threshold && current < required && current > 0,
      remaining: Math.max(0, required - current),
    };

    merits.push(merit);

    if (merit.isComplete) {
      completed.push(merit);
    } else if (merit.isNear) {
      nearCompletion.push(merit);
    }

    console.log(`[Torn Merits] ${meritName}: ${current}/${required} (${progress}%)`);
  }

  console.log(`[Torn Merits] Parsed ${merits.length} merits, ${completed.length} complete, ${nearCompletion.length} near`);

  return {
    nearCompletion,
    completed,
    allMerits: merits,
    totalMerits: merits.length,
  };
}
