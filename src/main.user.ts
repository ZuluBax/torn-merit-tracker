// ==UserScript==
// @name         Torn Merits Tracker
// @namespace    https://github.com/torn-merits
// @version      1.4.1
// @description  Track and warn about near-completed merits in Torn.com
// @author       Torn Player
// @match        *://*.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

import { getApiKey } from './api';
import { Merit, MeritStatus, MeritWithStatus, checkMerits } from './merits';
import { showMeritPanel, showMeritStatusBox, showSettingsPanel, showSetupPrompt } from './ui';

const STORAGE_KEYS = {
  API_KEY: 'torn_api_key',
  SELECTED_MERITS: 'torn_selected_merits',
  DISPLAY_MODE: 'torn_display_mode',
};

const CHECK_INTERVAL = 60000; // 1 minute
const NEAR_COMPLETION_THRESHOLD = 5; // Warn when within 5 of completion

// Display modes
export const DISPLAY_MODES = {
  TOP3: 'top3',           // Top 3 by progress
  SELECTED: 'selected',   // User-selected merits only
  ALL_INCOMPLETE: 'all',  // All incomplete merits
};

async function main(): Promise<void> {
  let apiKey = GM_getValue<string>(STORAGE_KEYS.API_KEY, '');

  if (!apiKey) {
    showSetupPrompt((key: string) => {
      GM_setValue(STORAGE_KEYS.API_KEY, key);
      apiKey = key;
      checkMeritsNow(apiKey);
    });
    return;
  }

  await checkMeritsNow(apiKey);

  // Periodically check merits
  setInterval(() => checkMeritsNow(apiKey), CHECK_INTERVAL);
}

async function checkMeritsNow(apiKey: string): Promise<void> {
  try {
    const result = await checkMerits(apiKey, NEAR_COMPLETION_THRESHOLD);

    if (result.error) {
      console.error('Torn Merits: Error checking merits', result.error);
      return;
    }

    console.log('[Torn Merits] Received merit data:', result);

    // Get saved preferences
    const displayMode = GM_getValue<string>(STORAGE_KEYS.DISPLAY_MODE, DISPLAY_MODES.TOP3);
    const selectedMerits = GM_getValue<string[]>(STORAGE_KEYS.SELECTED_MERITS, []);

    // Create settings callback function
    const openSettings = () => {
      showSettingsPanel(result.allMerits, (mode: string, selected: string[]) => {
        // Save new settings
        GM_setValue(STORAGE_KEYS.DISPLAY_MODE, mode);
        GM_setValue(STORAGE_KEYS.SELECTED_MERITS, selected);
        console.log('[Torn Merits] Settings saved:', { mode, selected });
        // Redraw status box with new settings
        showMeritStatusBox(result.allMerits, mode, selected, openSettings);
      }, () => {
        // Change API key callback
        GM_setValue(STORAGE_KEYS.API_KEY, '');
        showSetupPrompt((key: string) => {
          GM_setValue(STORAGE_KEYS.API_KEY, key);
          checkMeritsNow(key);
        });
      });
    };

    // Show status box with settings callback
    showMeritStatusBox(result.allMerits, displayMode, selectedMerits, openSettings);
  } catch (err) {
    console.error('Torn Merits: Exception checking merits:', err);
  }
}

// Start the script
main();
