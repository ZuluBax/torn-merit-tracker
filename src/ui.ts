import type { MeritWithStatus } from './merits';

// Torn-style color palette
const TORN = {
  bgDark: '#0f0f0f',
  bgMedium: '#1a1a1a',
  bgLight: '#252525',
  border: '#333333',
  borderLight: '#3a3a3a',
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  accent: '#d3ab56',      // Torn gold
  accentHover: '#e8c878',
  success: '#6b8f6b',    // Torn green
  warning: '#e3a005',     // Torn orange/yellow
  error: '#c0392b',
};

let meritPanel: HTMLElement | null = null;
let statusBox: HTMLElement | null = null;
let settingsPanel: HTMLElement | null = null;

// Display modes
const DISPLAY_MODES = {
  TOP3: 'top3',
  SELECTED: 'selected',
  ALL: 'all',
};

export function showSetupPrompt(onSubmit: (apiKey: string) => void): void {
  const existing = document.getElementById('torn-merits-setup');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'torn-merits-setup';
  overlay.innerHTML = `
    <style>
      #torn-merits-setup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: 'Mukta Malar', 'Segoe UI', sans-serif;
      }
      #torn-merits-setup .t-m-container {
        background: ${TORN.bgMedium};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      }
      #torn-merits-setup .t-m-header {
        background: ${TORN.bgLight};
        padding: 16px 20px;
        border-bottom: 1px solid ${TORN.border};
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #torn-merits-setup .t-m-header-icon {
        width: 24px;
        height: 24px;
        background: ${TORN.accent};
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: ${TORN.bgDark};
        font-weight: bold;
      }
      #torn-merits-setup .t-m-header-title {
        font-size: 16px;
        font-weight: 600;
        color: ${TORN.textPrimary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-setup .t-m-body {
        padding: 24px 20px;
      }
      #torn-merits-setup .t-m-desc {
        color: ${TORN.textSecondary};
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      #torn-merits-setup .t-m-desc a {
        color: ${TORN.accent};
        text-decoration: none;
      }
      #torn-merits-setup .t-m-desc a:hover {
        text-decoration: underline;
      }
      #torn-merits-setup .t-m-info-box {
        background: ${TORN.bgDark};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 20px;
      }
      #torn-merits-setup .t-m-info-title {
        font-size: 13px;
        font-weight: 600;
        color: ${TORN.textPrimary};
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-setup .t-m-info-list {
        margin: 0;
        padding: 0 0 0 20px;
        font-size: 13px;
        color: ${TORN.textSecondary};
        line-height: 1.8;
      }
      #torn-merits-setup .t-m-info-list li {
        margin-bottom: 4px;
      }
      #torn-merits-setup .t-m-info-note {
        font-size: 12px;
        color: ${TORN.textMuted};
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid ${TORN.border};
      }
      #torn-merits-setup .t-m-info-note strong {
        color: ${TORN.accent};
      }
      #torn-merits-setup .t-m-input-wrap {
        margin-bottom: 16px;
      }
      #torn-merits-setup .t-m-label {
        display: block;
        color: ${TORN.textMuted};
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }
      #torn-merits-setup .t-m-input {
        width: 100%;
        padding: 12px 14px;
        background: ${TORN.bgDark};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        color: ${TORN.textPrimary};
        font-size: 16px;
        font-family: 'Courier New', monospace;
        letter-spacing: 2px;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }
      #torn-merits-setup .t-m-input:focus {
        outline: none;
        border-color: ${TORN.accent};
      }
      #torn-merits-setup .t-m-input.error {
        border-color: ${TORN.error};
      }
      #torn-merits-setup .t-m-error {
        color: ${TORN.error};
        font-size: 12px;
        margin-top: 8px;
        display: none;
      }
      #torn-merits-setup .t-m-error.show {
        display: block;
      }
      #torn-merits-setup .t-m-footer {
        padding: 16px 20px;
        background: ${TORN.bgDark};
        border-top: 1px solid ${TORN.border};
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      #torn-merits-setup .t-m-btn {
        padding: 10px 24px;
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-setup .t-m-btn-secondary {
        background: ${TORN.bgLight};
        color: ${TORN.textSecondary};
      }
      #torn-merits-setup .t-m-btn-secondary:hover {
        background: ${TORN.border};
        color: ${TORN.textPrimary};
      }
      #torn-merits-setup .t-m-btn-primary {
        background: ${TORN.accent};
        color: ${TORN.bgDark};
        border-color: ${TORN.accent};
      }
      #torn-merits-setup .t-m-btn-primary:hover {
        background: ${TORN.accentHover};
        border-color: ${TORN.accentHover};
      }
    </style>
    <div class="t-m-container">
      <div class="t-m-header">
        <div class="t-m-header-icon">M</div>
        <div class="t-m-header-title">Torn Merits Tracker</div>
      </div>
      <div class="t-m-body">
        <div class="t-m-desc">
          Enter your Torn API key to start tracking merit progress.
        </div>
        <div class="t-m-info-box">
          <div class="t-m-info-title">API Key Requirements</div>
          <ul class="t-m-info-list">
            <li>Create a <strong>new</strong> API key for this script</li>
            <li>Key type: <strong>Limited</strong> (not Full Access)</li>
            <li>Select: <strong>User &gt; Merits</strong> permission</li>
            <li>Access type: <strong>Read Only</strong></li>
          </ul>
          <div class="t-m-info-note">
            <strong>Important:</strong> Your key must have "Merits" access to read your merit progress.
          </div>
        </div>
        <div class="t-m-input-wrap">
          <label class="t-m-label">API Key</label>
          <input type="text" id="torn-merits-key" class="t-m-input" placeholder="XXXXXXXXXXXXXXXX" maxlength="16" />
          <div id="torn-merits-error" class="t-m-error">Invalid API key. Must be 16 characters.</div>
        </div>
        <div style="font-size: 12px; color: ${TORN.textMuted}; margin-top: 8px;">
          Don't have a key? <a href="https://www.torn.com/preferences.php#api=API" target="_blank" style="color: ${TORN.accent};">Create one here</a>
        </div>
      </div>
      <div class="t-m-footer">
        <button id="torn-merits-cancel" class="t-m-btn t-m-btn-secondary">Cancel</button>
        <button id="torn-merits-submit" class="t-m-btn t-m-btn-primary">Start Tracking</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = document.getElementById('torn-merits-key') as HTMLInputElement;
  const errorEl = document.getElementById('torn-merits-error') as HTMLElement;
  const submitBtn = document.getElementById('torn-merits-submit') as HTMLButtonElement;
  const cancelBtn = document.getElementById('torn-merits-cancel') as HTMLButtonElement;

  const submit = () => {
    const key = input.value.trim();
    if (key.length === 16) {
      overlay.remove();
      onSubmit(key);
    } else {
      input.classList.add('error');
      errorEl.classList.add('show');
    }
  };

  const cancel = () => {
    overlay.remove();
  };

  submitBtn.addEventListener('click', submit);
  cancelBtn.addEventListener('click', cancel);
  input.addEventListener('input', () => {
    input.classList.remove('error');
    errorEl.classList.remove('show');
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submit();
  });
}

export function showMeritPanel(merits: MeritWithStatus[]): void {
  if (meritPanel) meritPanel.remove();

  meritPanel = document.createElement('div');
  meritPanel.id = 'torn-merits-panel';

  const completedCount = merits.filter(m => m.isComplete).length;
  const nearCount = merits.filter(m => m.isNear).length;

  meritPanel.innerHTML = `
    <style>
      #torn-merits-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${TORN.bgMedium};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        width: 360px;
        max-height: 400px;
        z-index: 999998;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        font-family: 'Mukta Malar', 'Segoe UI', sans-serif;
        animation: t-m-slideUp 0.3s ease;
      }
      @keyframes t-m-slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      #torn-merits-panel .t-m-panel-header {
        background: ${TORN.bgLight};
        padding: 12px 16px;
        border-bottom: 1px solid ${TORN.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #torn-merits-panel .t-m-panel-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #torn-merits-panel .t-m-panel-icon {
        width: 28px;
        height: 28px;
        background: ${TORN.accent};
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: ${TORN.bgDark};
        font-weight: bold;
      }
      #torn-merits-panel .t-m-panel-name {
        font-size: 14px;
        font-weight: 600;
        color: ${TORN.textPrimary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-panel .t-m-panel-actions {
        display: flex;
        gap: 8px;
      }
      #torn-merits-panel .t-m-panel-btn {
        background: none;
        border: none;
        color: ${TORN.textMuted};
        cursor: pointer;
        font-size: 18px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
      }
      #torn-merits-panel .t-m-panel-btn:hover {
        background: ${TORN.border};
        color: ${TORN.textPrimary};
      }
      #torn-merits-panel .t-m-panel-stats {
        padding: 12px 16px;
        background: ${TORN.bgDark};
        border-bottom: 1px solid ${TORN.border};
        display: flex;
        gap: 16px;
      }
      #torn-merits-panel .t-m-stat {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      #torn-merits-panel .t-m-stat-value {
        font-size: 18px;
        font-weight: 700;
        color: ${TORN.accent};
      }
      #torn-merits-panel .t-m-stat-label {
        font-size: 11px;
        color: ${TORN.textMuted};
        text-transform: uppercase;
      }
      #torn-merits-panel .t-m-panel-body {
        max-height: 300px;
        overflow-y: auto;
      }
      #torn-merits-panel .t-m-merit-item {
        padding: 12px 16px;
        border-bottom: 1px solid ${TORN.border};
        transition: background 0.2s;
      }
      #torn-merits-panel .t-m-merit-item:last-child {
        border-bottom: none;
      }
      #torn-merits-panel .t-m-merit-item:hover {
        background: ${TORN.bgLight};
      }
      #torn-merits-panel .t-m-merit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      #torn-merits-panel .t-m-merit-name {
        font-size: 14px;
        color: ${TORN.textPrimary};
        font-weight: 500;
      }
      #torn-merits-panel .t-m-merit-progress {
        font-size: 13px;
        color: ${TORN.textSecondary};
        font-family: 'Courier New', monospace;
      }
      #torn-merits-panel .t-m-merit-progress .t-m-complete {
        color: ${TORN.success};
      }
      #torn-merits-panel .t-m-merit-progress .t-m-near {
        color: ${TORN.warning};
      }
      #torn-merits-panel .t-m-bar {
        height: 6px;
        background: ${TORN.bgDark};
        border-radius: 3px;
        overflow: hidden;
      }
      #torn-merits-panel .t-m-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }
      #torn-merits-panel .t-m-bar-fill.complete {
        background: ${TORN.success};
      }
      #torn-merits-panel .t-m-bar-fill.near {
        background: ${TORN.warning};
      }
      #torn-merits-panel .t-m-bar-fill.normal {
        background: ${TORN.accent};
      }
      #torn-merits-panel .t-m-empty {
        padding: 40px 20px;
        text-align: center;
        color: ${TORN.textMuted};
      }
      #torn-merits-panel .t-m-empty-icon {
        font-size: 32px;
        margin-bottom: 10px;
      }
      /* Scrollbar styling */
      #torn-merits-panel .t-m-panel-body::-webkit-scrollbar {
        width: 8px;
      }
      #torn-merits-panel .t-m-panel-body::-webkit-scrollbar-track {
        background: ${TORN.bgDark};
      }
      #torn-merits-panel .t-m-panel-body::-webkit-scrollbar-thumb {
        background: ${TORN.border};
        border-radius: 4px;
      }
      #torn-merits-panel .t-m-panel-body::-webkit-scrollbar-thumb:hover {
        background: ${TORN.borderLight};
      }
    </style>
    <div class="t-m-panel-header">
      <div class="t-m-panel-title">
        <div class="t-m-panel-icon">M</div>
        <div class="t-m-panel-name">Merits Tracker</div>
      </div>
      <div class="t-m-panel-actions">
        <button class="t-m-panel-btn" id="torn-merits-minimize" title="Minimize">−</button>
        <button class="t-m-panel-btn" id="torn-merits-close" title="Close">×</button>
      </div>
    </div>
    <div class="t-m-panel-stats">
      <div class="t-m-stat">
        <span class="t-m-stat-value">${merits.length}</span>
        <span class="t-m-stat-label">Total</span>
      </div>
      <div class="t-m-stat">
        <span class="t-m-stat-value t-m-complete">${completedCount}</span>
        <span class="t-m-stat-label">Complete</span>
      </div>
      <div class="t-m-stat">
        <span class="t-m-stat-value t-m-near">${nearCount}</span>
        <span class="t-m-stat-label">Near</span>
      </div>
    </div>
    <div class="t-m-panel-body">
      ${merits.length === 0 ? `
        <div class="t-m-empty">
          <div class="t-m-empty-icon">📊</div>
          <div>No merits to track</div>
        </div>
      ` : merits.map(m => {
        const isComplete = m.isComplete;
        const isNear = m.isNear;
        const percent = Math.min(100, Math.round((m.current / m.required) * 100));
        const barClass = isComplete ? 'complete' : isNear ? 'near' : 'normal';
        const progressClass = isComplete ? 't-m-complete' : isNear ? 't-m-near' : '';
        return `
          <div class="t-m-merit-item">
            <div class="t-m-merit-header">
              <span class="t-m-merit-name">${m.name}</span>
              <span class="t-m-merit-progress ${progressClass}">${m.current}/${m.required}</span>
            </div>
            <div class="t-m-bar">
              <div class="t-m-bar-fill ${barClass}" style="width: ${percent}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.body.appendChild(meritPanel);

  // Event listeners
  document.getElementById('torn-merits-close')?.addEventListener('click', () => {
    meritPanel?.remove();
    meritPanel = null;
  });

  document.getElementById('torn-merits-minimize')?.addEventListener('click', () => {
    const body = meritPanel?.querySelector('.t-m-panel-body') as HTMLElement;
    const stats = meritPanel?.querySelector('.t-m-panel-stats') as HTMLElement;
    if (body) {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }
    if (stats) {
      stats.style.display = stats.style.display === 'none' ? 'flex' : 'none';
    }
  });
}

export function showMeritStatusBox(
  merits: MeritWithStatus[],
  displayMode: string = DISPLAY_MODES.TOP3,
  selectedMerits: string[] = [],
  onOpenSettings?: () => void
): void {
  if (statusBox) statusBox.remove();

  // Filter to incomplete merits
  const incompleteMerits = merits.filter(m => !m.isComplete);

  // Sort by progress (highest first)
  incompleteMerits.sort((a, b) => {
    const percentA = a.required > 0 ? a.current / a.required : 0;
    const percentB = b.required > 0 ? b.current / b.required : 0;
    return percentB - percentA;
  });

  // Apply display mode filter
  let displayMerits: MeritWithStatus[] = [];

  switch (displayMode) {
    case DISPLAY_MODES.TOP3:
      // Top 3 by progress (always show top 3)
      displayMerits = incompleteMerits.slice(0, 3);
      break;
    case DISPLAY_MODES.SELECTED:
      // User-selected merits only, or default to top 3 if none selected
      displayMerits = incompleteMerits.filter(m => selectedMerits.includes(m.name));
      if (displayMerits.length === 0) {
        displayMerits = incompleteMerits.slice(0, 3);
      }
      break;
    case DISPLAY_MODES.ALL:
      // All incomplete merits (limited to 5 for display)
      displayMerits = incompleteMerits.slice(0, 5);
      break;
  }

  // Sort by remaining (lowest first) for display
  displayMerits.sort((a, b) => a.remaining - b.remaining);

  statusBox = document.createElement('div');
  statusBox.id = 'torn-merits-status-box';

  const modeLabel = displayMode === DISPLAY_MODES.TOP3 ? 'Top 3' :
                    displayMode === DISPLAY_MODES.SELECTED ? 'Selected' : 'All';

  statusBox.innerHTML = `
    <style>
      #torn-merits-status-box {
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${TORN.bgMedium};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        width: 300px;
        z-index: 999997;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        font-family: 'Mukta Malar', 'Segoe UI', sans-serif;
        animation: t-m-fadeIn 0.3s ease;
      }
      @keyframes t-m-fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #torn-merits-status-box .t-m-status-header {
        background: ${TORN.bgLight};
        padding: 10px 14px;
        border-bottom: 1px solid ${TORN.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #torn-merits-status-box .t-m-status-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 600;
        color: ${TORN.textPrimary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-status-box .t-m-status-icon {
        width: 20px;
        height: 20px;
        background: ${TORN.accent};
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        color: ${TORN.bgDark};
        font-weight: bold;
      }
      #torn-merits-status-box .t-m-status-actions {
        display: flex;
        gap: 4px;
      }
      #torn-merits-status-box .t-m-status-btn {
        background: none;
        border: none;
        color: ${TORN.textMuted};
        cursor: pointer;
        font-size: 14px;
        padding: 4px 6px;
        border-radius: 3px;
        transition: all 0.2s;
      }
      #torn-merits-status-box .t-m-status-btn:hover {
        background: ${TORN.border};
        color: ${TORN.textPrimary};
      }
      #torn-merits-status-box .t-m-status-mode {
        font-size: 9px;
        color: ${TORN.textMuted};
        background: ${TORN.bgDark};
        padding: 2px 6px;
        border-radius: 3px;
        text-transform: uppercase;
      }
      #torn-merits-status-box .t-m-status-list {
        padding: 8px 0;
      }
      #torn-merits-status-box .t-m-status-empty {
        padding: 20px 14px;
        text-align: center;
        color: ${TORN.textMuted};
        font-size: 13px;
      }
      #torn-merits-status-box .t-m-status-item {
        padding: 8px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background 0.2s;
        cursor: default;
      }
      #torn-merits-status-box .t-m-status-item:hover {
        background: ${TORN.bgLight};
      }
      #torn-merits-status-box .t-m-status-item:not(:last-child) {
        border-bottom: 1px solid ${TORN.border};
      }
      #torn-merits-status-box .t-m-status-bar-wrap {
        flex: 1;
      }
      #torn-merits-status-box .t-m-status-name {
        font-size: 13px;
        color: ${TORN.textPrimary};
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #torn-merits-status-box .t-m-status-bar {
        height: 4px;
        background: ${TORN.bgDark};
        border-radius: 2px;
        overflow: hidden;
      }
      #torn-merits-status-box .t-m-status-bar-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.3s ease;
      }
      #torn-merits-status-box .t-m-status-bar-fill.high {
        background: ${TORN.warning};
      }
      #torn-merits-status-box .t-m-status-bar-fill.very-high {
        background: ${TORN.error};
      }
      #torn-merits-status-box .t-m-status-bar-fill.normal {
        background: ${TORN.accent};
      }
      #torn-merits-status-box .t-m-status-progress {
        font-size: 12px;
        font-family: 'Courier New', monospace;
        min-width: 60px;
        text-align: right;
      }
      #torn-merits-status-box .t-m-status-progress.high {
        color: ${TORN.warning};
      }
      #torn-merits-status-box .t-m-status-progress.very-high {
        color: ${TORN.error};
        font-weight: 600;
      }
      #torn-merits-status-box .t-m-status-remaining {
        font-size: 10px;
        color: ${TORN.textMuted};
        margin-top: 2px;
      }
    </style>
    <div class="t-m-status-header">
      <div class="t-m-status-title">
        <div class="t-m-status-icon">M</div>
        <span>Merits</span>
        <span class="t-m-status-mode">${modeLabel}</span>
      </div>
      <div class="t-m-status-actions">
        <button class="t-m-status-btn" id="torn-merits-settings" title="Settings">&#9881;</button>
        <button class="t-m-status-btn" id="torn-merits-status-close" title="Close">×</button>
      </div>
    </div>
    <div class="t-m-status-list">
      ${displayMerits.length === 0 ? `
        <div class="t-m-status-empty">No merits to display.<br>Open settings to select merits.</div>
      ` : displayMerits.map(m => {
        const percent = m.required > 0 ? Math.round((m.current / m.required) * 100) : 0;
        const isHigh = percent >= 90 && percent < 95;
        const isVeryHigh = percent >= 95;
        const barClass = isVeryHigh ? 'very-high' : isHigh ? 'high' : 'normal';
        const progressClass = isVeryHigh ? 'very-high' : isHigh ? 'high' : '';

        return `
          <div class="t-m-status-item">
            <div class="t-m-status-bar-wrap">
              <div class="t-m-status-name" title="${m.name}">${m.name}</div>
              <div class="t-m-status-bar">
                <div class="t-m-status-bar-fill ${barClass}" style="width: ${percent}%"></div>
              </div>
              <div class="t-m-status-remaining">${m.remaining} left</div>
            </div>
            <div class="t-m-status-progress ${progressClass}">${percent}%</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.body.appendChild(statusBox);

  // Close button handler
  document.getElementById('torn-merits-status-close')?.addEventListener('click', () => {
    statusBox?.remove();
    statusBox = null;
  });

  // Settings button handler
  document.getElementById('torn-merits-settings')?.addEventListener('click', () => {
    if (onOpenSettings) onOpenSettings();
  });
}

export function showSettingsPanel(
  merits: MeritWithStatus[],
  onSave: (mode: string, selected: string[]) => void,
  onChangeApiKey?: () => void
): void {
  if (settingsPanel) settingsPanel.remove();
  if (statusBox) statusBox.remove();

  // Get current selections from localStorage-like storage
  const currentMode = GM_getValue('torn_display_mode', DISPLAY_MODES.TOP3);
  const currentSelected = GM_getValue<string[]>('torn_selected_merits', []);
  const currentApiKey = GM_getValue<string>('torn_api_key', '');

  settingsPanel = document.createElement('div');
  settingsPanel.id = 'torn-merits-settings-panel';

  const allMeritNames = merits.map(m => m.name);

  // Mask API key for display
  const maskedApiKey = currentApiKey.length > 0
    ? currentApiKey.substring(0, 4) + '••••••••' + currentApiKey.substring(12)
    : 'Not set';

  settingsPanel.innerHTML = `
    <style>
      #torn-merits-settings-panel {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: 'Mukta Malar', 'Segoe UI', sans-serif;
      }
      #torn-merits-settings-panel .t-m-settings-container {
        background: ${TORN.bgMedium};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        max-width: 480px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      #torn-merits-settings-panel .t-m-settings-header {
        background: ${TORN.bgLight};
        padding: 16px 20px;
        border-bottom: 1px solid ${TORN.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #torn-merits-settings-panel .t-m-settings-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
        color: ${TORN.textPrimary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-settings-panel .t-m-settings-icon {
        width: 24px;
        height: 24px;
        background: ${TORN.accent};
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: ${TORN.bgDark};
        font-weight: bold;
      }
      #torn-merits-settings-panel .t-m-settings-close {
        background: none;
        border: none;
        color: ${TORN.textMuted};
        cursor: pointer;
        font-size: 20px;
        padding: 4px 8px;
        border-radius: 3px;
        transition: all 0.2s;
      }
      #torn-merits-settings-panel .t-m-settings-close:hover {
        background: ${TORN.border};
        color: ${TORN.textPrimary};
      }
      #torn-merits-settings-panel .t-m-settings-body {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
      }
      #torn-merits-settings-panel .t-m-settings-section {
        margin-bottom: 24px;
      }
      #torn-merits-settings-panel .t-m-settings-section:last-child {
        margin-bottom: 0;
      }
      #torn-merits-settings-panel .t-m-settings-label {
        font-size: 14px;
        font-weight: 600;
        color: ${TORN.textPrimary};
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-settings-panel .t-m-settings-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      #torn-merits-settings-panel .t-m-settings-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: ${TORN.bgDark};
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }
      #torn-merits-settings-panel .t-m-settings-option:hover {
        border-color: ${TORN.accent};
      }
      #torn-merits-settings-panel .t-m-settings-option.selected {
        border-color: ${TORN.accent};
        background: ${TORN.bgLight};
      }
      #torn-merits-settings-panel .t-m-settings-option input[type="radio"] {
        display: none;
      }
      #torn-merits-settings-panel .t-m-settings-radio {
        width: 16px;
        height: 16px;
        border: 2px solid ${TORN.border};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      #torn-merits-settings-panel .t-m-settings-option.selected .t-m-settings-radio {
        border-color: ${TORN.accent};
      }
      #torn-merits-settings-panel .t-m-settings-radio::after {
        content: '';
        width: 8px;
        height: 8px;
        background: ${TORN.accent};
        border-radius: 50%;
        display: none;
      }
      #torn-merits-settings-panel .t-m-settings-option.selected .t-m-settings-radio::after {
        display: block;
      }
      #torn-merits-settings-panel .t-m-settings-option-text {
        flex: 1;
      }
      #torn-merits-settings-panel .t-m-settings-option-title {
        font-size: 14px;
        color: ${TORN.textPrimary};
        margin-bottom: 2px;
      }
      #torn-merits-settings-panel .t-m-settings-option-desc {
        font-size: 12px;
        color: ${TORN.textMuted};
      }
      #torn-merits-settings-panel .t-m-settings-merits {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        background: ${TORN.bgDark};
      }
      #torn-merits-settings-panel .t-m-settings-merits-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        border-bottom: 1px solid ${TORN.border};
        cursor: pointer;
        transition: background 0.2s;
      }
      #torn-merits-settings-panel .t-m-settings-merits-item:last-child {
        border-bottom: none;
      }
      #torn-merits-settings-panel .t-m-settings-merits-item:hover {
        background: ${TORN.bgLight};
      }
      #torn-merits-settings-panel .t-m-settings-merits-item input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: ${TORN.accent};
        cursor: pointer;
      }
      #torn-merits-settings-panel .t-m-settings-merits-item span {
        font-size: 13px;
        color: ${TORN.textPrimary};
      }
      #torn-merits-settings-panel .t-m-settings-footer {
        padding: 16px 20px;
        background: ${TORN.bgDark};
        border-top: 1px solid ${TORN.border};
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      #torn-merits-settings-panel .t-m-settings-btn {
        padding: 10px 24px;
        border: 1px solid ${TORN.border};
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #torn-merits-settings-panel .t-m-settings-btn-secondary {
        background: ${TORN.bgLight};
        color: ${TORN.textSecondary};
      }
      #torn-merits-settings-panel .t-m-settings-btn-secondary:hover {
        background: ${TORN.border};
        color: ${TORN.textPrimary};
      }
      #torn-merits-settings-panel .t-m-settings-btn-primary {
        background: ${TORN.accent};
        color: ${TORN.bgDark};
        border-color: ${TORN.accent};
      }
      #torn-merits-settings-panel .t-m-settings-btn-primary:hover {
        background: ${TORN.accentHover};
        border-color: ${TORN.accentHover};
      }
      /* Scrollbar */
      #torn-merits-settings-panel .t-m-settings-merits::-webkit-scrollbar,
      #torn-merits-settings-panel .t-m-settings-body::-webkit-scrollbar {
        width: 8px;
      }
      #torn-merits-settings-panel .t-m-settings-merits::-webkit-scrollbar-track,
      #torn-merits-settings-panel .t-m-settings-body::-webkit-scrollbar-track {
        background: ${TORN.bgDark};
      }
      #torn-merits-settings-panel .t-m-settings-merits::-webkit-scrollbar-thumb,
      #torn-merits-settings-panel .t-m-settings-body::-webkit-scrollbar-thumb {
        background: ${TORN.border};
        border-radius: 4px;
      }
    </style>
    <div class="t-m-settings-container">
      <div class="t-m-settings-header">
        <div class="t-m-settings-title">
          <div class="t-m-settings-icon">&#9881;</div>
          <span>Merits Settings</span>
        </div>
        <button class="t-m-settings-close" id="torn-settings-close">×</button>
      </div>
      <div class="t-m-settings-body">
        <div class="t-m-settings-section">
          <div class="t-m-settings-label">API Key</div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="flex: 1; background: ${TORN.bgDark}; border: 1px solid ${TORN.border}; border-radius: 4px; padding: 10px 14px;">
              <div style="font-size: 12px; color: ${TORN.textMuted}; margin-bottom: 4px;">Current Key</div>
              <div style="font-size: 14px; color: ${TORN.textPrimary}; font-family: 'Courier New', monospace; letter-spacing: 2px;">${maskedApiKey}</div>
            </div>
            <button class="t-m-settings-btn t-m-settings-btn-secondary" id="torn-change-api-key" style="padding: 10px 16px;">
              Change
            </button>
          </div>
        </div>
        <div class="t-m-settings-section">
          <div class="t-m-settings-label">Display Mode</div>
          <div class="t-m-settings-options">
            <label class="t-m-settings-option ${currentMode === DISPLAY_MODES.TOP3 ? 'selected' : ''}" data-mode="${DISPLAY_MODES.TOP3}">
              <input type="radio" name="display-mode" value="${DISPLAY_MODES.TOP3}" ${currentMode === DISPLAY_MODES.TOP3 ? 'checked' : ''} />
              <div class="t-m-settings-radio"></div>
              <div class="t-m-settings-option-text">
                <div class="t-m-settings-option-title">Top 3</div>
                <div class="t-m-settings-option-desc">Always show your top 3 closest merits</div>
              </div>
            </label>
            <label class="t-m-settings-option ${currentMode === DISPLAY_MODES.SELECTED ? 'selected' : ''}" data-mode="${DISPLAY_MODES.SELECTED}">
              <input type="radio" name="display-mode" value="${DISPLAY_MODES.SELECTED}" ${currentMode === DISPLAY_MODES.SELECTED ? 'checked' : ''} />
              <div class="t-m-settings-radio"></div>
              <div class="t-m-settings-option-text">
                <div class="t-m-settings-option-title">Selected Merits</div>
                <div class="t-m-settings-option-desc">Choose specific merits to track below</div>
              </div>
            </label>
            <label class="t-m-settings-option ${currentMode === DISPLAY_MODES.ALL ? 'selected' : ''}" data-mode="${DISPLAY_MODES.ALL}">
              <input type="radio" name="display-mode" value="${DISPLAY_MODES.ALL}" ${currentMode === DISPLAY_MODES.ALL ? 'checked' : ''} />
              <div class="t-m-settings-radio"></div>
              <div class="t-m-settings-option-text">
                <div class="t-m-settings-option-title">All Incomplete</div>
                <div class="t-m-settings-option-desc">Show all incomplete merits (up to 5)</div>
              </div>
            </label>
          </div>
        </div>
        <div class="t-m-settings-section" id="merit-selection-section">
          <div class="t-m-settings-label">Select Merits to Track</div>
          <div class="t-m-settings-merits">
            ${merits.filter(m => !m.isComplete).map(m => `
              <label class="t-m-settings-merits-item">
                <input type="checkbox" value="${m.name}" ${currentSelected.includes(m.name) ? 'checked' : ''} />
                <span>${m.name} (${m.current}/${m.required})</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="t-m-settings-footer">
        <button class="t-m-settings-btn t-m-settings-btn-secondary" id="torn-settings-cancel">Cancel</button>
        <button class="t-m-settings-btn t-m-settings-btn-primary" id="torn-settings-save">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(settingsPanel);

  // Handle display mode selection
  const optionLabels = settingsPanel.querySelectorAll('.t-m-settings-option');
  optionLabels.forEach(label => {
    label.addEventListener('click', () => {
      optionLabels.forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      (label.querySelector('input') as HTMLInputElement).checked = true;
    });
  });

  // Handle cancel button
  document.getElementById('torn-settings-cancel')?.addEventListener('click', () => {
    settingsPanel?.remove();
    settingsPanel = null;
  });

  // Handle close button
  document.getElementById('torn-settings-close')?.addEventListener('click', () => {
    settingsPanel?.remove();
    settingsPanel = null;
  });

  // Handle save button
  document.getElementById('torn-settings-save')?.addEventListener('click', () => {
    // Get selected mode
    const selectedMode = (settingsPanel?.querySelector('input[name="display-mode"]:checked') as HTMLInputElement)?.value || DISPLAY_MODES.TOP3;

    // Get selected merits
    const checkedMerits = Array.from(settingsPanel?.querySelectorAll('.t-m-settings-merits-item input:checked') || [])
      .map((cb: Element) => (cb as HTMLInputElement).value);

    // Save and close
    onSave(selectedMode, checkedMerits);
    settingsPanel?.remove();
    settingsPanel = null;
  });

  // Handle change API key button
  document.getElementById('torn-change-api-key')?.addEventListener('click', () => {
    settingsPanel?.remove();
    settingsPanel = null;
    if (onChangeApiKey) {
      onChangeApiKey();
    }
  });
}
