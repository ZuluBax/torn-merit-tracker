// ==UserScript==
// @name         Torn Honors & Medals Tracker
// @namespace    https://github.com/torn-merits
// @version      4.0.4
// @description  Track your honors and medals progress in Torn.com
// @author       Torn Player
// @match        *://*.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

import { checkHonorsAndMedals } from './merits';
import type { HonorStatus, MedalStatus } from './merits';
import { showStatusBox, showSettingsPanel, showSetupPrompt } from './ui';

const STORAGE_KEY = 'torn_api_key';
const DISMISS_KEY = 'torn_setup_dismissed';
const DISMISS_DURATION = 60000; // 60 seconds
const CHECK_INTERVAL = 60000;

async function main(): Promise<void> {
  let apiKey = GM_getValue<string>(STORAGE_KEY, '');

  if (!apiKey) {
    // Check if dismissed recently
    const dismissedAt = GM_getValue<number>(DISMISS_KEY, 0);
    const now = Date.now();

    if (dismissedAt > 0 && now - dismissedAt < DISMISS_DURATION) {
      // Still within dismiss period, wait for remaining time
      const remainingTime = DISMISS_DURATION - (now - dismissedAt);
      console.log('[Torn Honors] Setup dismissed, showing in', Math.round(remainingTime / 1000), 'seconds');
      setTimeout(() => {
        showSetupPrompt((key: string) => {
          GM_setValue(STORAGE_KEY, key);
          GM_deleteValue(DISMISS_KEY);
          checkNow(key);
        });
      }, remainingTime);
      return;
    }

    // Show setup prompt
    showSetupPrompt((key: string) => {
      GM_setValue(STORAGE_KEY, key);
      GM_deleteValue(DISMISS_KEY);
      checkNow(apiKey);
    });
    return;
  }

  await checkNow(apiKey);
  setInterval(() => checkNow(apiKey), CHECK_INTERVAL);
}

async function checkNow(apiKey: string): Promise<void> {
  try {
    const result = await checkHonorsAndMedals(apiKey);
    if (!result) {
      console.error('Torn Honors & Medals: Error checking data');
      return;
    }

    console.log('[Torn Honors & Medals] Data:', result);

    const openSettings = () => {
      showSettingsPanel(result.honorStatus, result.medalStatus, () => {
        showStatusBox(result.honorStatus, result.medalStatus, openSettings);
      }, () => {
        GM_setValue(STORAGE_KEY, '');
        showSetupPrompt((key: string) => {
          GM_setValue(STORAGE_KEY, key);
          checkNow(key);
        });
      });
    };

    showStatusBox(result.honorStatus, result.medalStatus, openSettings);
  } catch (err) {
    console.error('Torn Honors & Medals: Exception:', err);
  }
}

main();
