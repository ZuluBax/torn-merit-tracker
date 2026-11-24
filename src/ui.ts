import type { HonorStatus, MedalStatus, HonorProgress, MedalProgress } from './merits';

const TORN = {
  bgDark: '#0f0f0f',
  bgMedium: '#1a1a1a',
  bgLight: '#252525',
  border: '#333333',
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  accent: '#d3ab56',
  warning: '#e3a005',
  success: '#6b8f6b',
  honor: '#7b9fd4',
  medal: '#d4a574',
};

// Stored (not just in-memory) because the status box is torn down and rebuilt on every
// data refresh and page load; without this it would pop back open each minute.
const MINIMISED_KEY = 'torn_minimised';

type DockEdge = 'left' | 'right' | 'top' | 'bottom';
interface Dock { edge: DockEdge; pos: number } // pos = px along the edge (top for left/right, left for top/bottom)
const DOCK_EDGES: DockEdge[] = ['left', 'right', 'top', 'bottom'];
const DOCK_EDGE_KEY = 'torn_dock_edge';
const DOCK_POS_KEY = 'torn_dock_pos';
// Below this a press-and-release is a click (expand), not a drag (move the tab).
const DRAG_THRESHOLD_PX = 5;

// Module-level so a rebuild of the box mid-drag (the 1-minute refresh) keeps the live position.
let dock: Dock | null = null;

function loadDock(): Dock {
  if (dock) return dock;
  const edge = GM_getValue<string>(DOCK_EDGE_KEY, 'right');
  const pos = GM_getValue<number>(DOCK_POS_KEY, -1);
  // Before docking existed the tab sat on the right at the box's saved height; keep it there.
  const legacyTop = GM_getValue<number>('torn_box_top', -1);
  dock = {
    edge: (DOCK_EDGES as string[]).includes(edge) ? (edge as DockEdge) : 'right',
    pos: Number.isFinite(pos) && pos >= 0 ? pos : legacyTop >= 0 ? legacyTop : 100,
  };
  return dock;
}

function applyDock(box: HTMLElement, d: Dock): void {
  DOCK_EDGES.forEach(e => box.classList.toggle('t-dock-' + e, e === d.edge));
  box.style.setProperty('--t-pos', d.pos + 'px');
}

// Click the tab to expand; press-and-drag it and it snaps to whichever screen edge is nearest.
function enableTabDocking(tab: HTMLElement, box: HTMLElement, onActivate: () => void): void {
  let start: { x: number; y: number } | null = null;
  let moved = false;
  let swallowClick = false; // the click the browser fires right after a drag must not expand the box

  tab.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    start = { x: e.clientX, y: e.clientY };
    moved = false;
    swallowClick = false;
    tab.setPointerCapture(e.pointerId);
  });

  tab.addEventListener('pointermove', (e) => {
    if (!start) return;
    if (!moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) < DRAG_THRESHOLD_PX) return;
    moved = true;
    box.classList.add('t-dragging');

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap: Record<DockEdge, number> = { left: e.clientX, right: vw - e.clientX, top: e.clientY, bottom: vh - e.clientY };
    const d = loadDock();
    d.edge = DOCK_EDGES.reduce((a, b) => (gap[b] < gap[a] ? b : a));
    applyDock(box, d); // switch orientation first: the tab's length along the edge depends on it

    const rect = box.getBoundingClientRect();
    const vertical = d.edge === 'left' || d.edge === 'right';
    const length = vertical ? rect.height : rect.width;
    const room = (vertical ? vh : vw) - length;
    d.pos = Math.min(Math.max(0, (vertical ? e.clientY : e.clientX) - length / 2), Math.max(0, room));
    applyDock(box, d);
  });

  const finish = () => {
    if (!start) return;
    start = null;
    box.classList.remove('t-dragging');
    if (!moved) return;
    swallowClick = true;
    const d = loadDock();
    GM_setValue(DOCK_EDGE_KEY, d.edge);
    GM_setValue(DOCK_POS_KEY, Math.round(d.pos));
  };
  tab.addEventListener('pointerup', finish);
  tab.addEventListener('pointercancel', finish);

  tab.addEventListener('click', () => {
    if (swallowClick) { swallowClick = false; return; }
    onActivate();
  });
}

let statusBox: HTMLElement | null = null;
let settingsPanel: HTMLElement | null = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let activeTab: 'honors' | 'medals' = 'honors';
let setupDragging = false;
let setupDragOffset = { x: 0, y: 0 };
let settingsDragging = false;
let settingsDragOffset = { x: 0, y: 0 };

// Close all UI panels
export function closeAllPanels(): void {
  if (statusBox) {
    statusBox.remove();
    statusBox = null;
  }
  if (settingsPanel) {
    settingsPanel.remove();
    settingsPanel = null;
  }
  const setupBox = document.getElementById('torn-tracker-setup');
  if (setupBox) {
    setupBox.remove();
  }
}

export function showSetupPrompt(onSubmit: (apiKey: string) => void): void {
  const existing = document.getElementById('torn-tracker-setup');
  if (existing) existing.remove();

  const setupBox = document.createElement('div');
  setupBox.id = 'torn-tracker-setup';
  setupBox.innerHTML = `
    <style>
      #torn-tracker-setup {
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        background: ${TORN.bgMedium}; border: 1px solid ${TORN.border}; border-radius: 4px;
        max-width: 480px; width: 90%; padding: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        z-index: 999999; font-family: 'Mukta Malar', 'Segoe UI', sans-serif;
        animation: t-fadeIn 0.3s ease;
      }
      @keyframes t-fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      .t-setup-header {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; cursor: move;
      }
      .t-title {
        font-size: 18px; font-weight: 600; color: ${TORN.textPrimary}; text-transform: uppercase;
        display: flex; align-items: center; gap: 10px;
      }
      .t-icon {
        width: 32px; height: 32px; background: linear-gradient(135deg, ${TORN.honor}, ${TORN.medal});
        border-radius: 6px; display: flex; align-items: center; justify-content: center;
        font-size: 14px; color: ${TORN.bgDark}; font-weight: bold;
      }
      .t-close-btn {
        background: none; border: none; color: ${TORN.textMuted}; cursor: pointer;
        font-size: 18px; padding: 4px 8px; border-radius: 3px;
      }
      .t-close-btn:hover { background: ${TORN.border}; color: ${TORN.textPrimary}; }
      .t-desc { color: ${TORN.textSecondary}; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
      .t-info-box {
        background: ${TORN.bgDark}; border: 1px solid ${TORN.border}; border-radius: 4px;
        padding: 16px; margin-bottom: 20px;
      }
      .t-info-title { font-size: 13px; font-weight: 600; color: ${TORN.textPrimary}; margin-bottom: 10px; text-transform: uppercase; }
      .t-info-list { margin: 0; padding: 0 0 0 20px; font-size: 13px; color: ${TORN.textSecondary}; line-height: 1.8; }
      .t-input-wrap { margin-bottom: 16px; }
      .t-label {
        display: block; color: ${TORN.textMuted}; font-size: 12px; text-transform: uppercase;
        letter-spacing: 0.5px; margin-bottom: 8px;
      }
      .t-input {
        width: 100%; padding: 12px 14px; background: ${TORN.bgDark}; border: 1px solid ${TORN.border};
        border-radius: 4px; color: ${TORN.textPrimary}; font-size: 16px;
        font-family: 'Courier New', monospace; letter-spacing: 2px; box-sizing: border-box;
      }
      .t-input:focus { outline: none; border-color: ${TORN.accent}; }
      .t-btn {
        padding: 10px 24px; border: 1px solid ${TORN.border}; border-radius: 4px;
        font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-transform: uppercase;
      }
      .t-btn-primary { background: ${TORN.accent}; color: ${TORN.bgDark}; border-color: ${TORN.accent}; }
      .t-btn-primary:hover { background: #e8c878; }
      .t-btn-secondary { background: ${TORN.bgLight}; color: ${TORN.textSecondary}; border-color: ${TORN.border}; }
      .t-btn-secondary:hover { background: ${TORN.border}; color: ${TORN.textPrimary}; }
      .t-btn-row { display: flex; gap: 12px; }
      .t-btn-row .t-btn { flex: 1; }
    </style>
    <div class="t-setup-header">
      <div class="t-title">
        <div class="t-icon">HM</div>
        Torn Honors & Medals Tracker
      </div>
      <button class="t-close-btn" id="t-setup-close">x</button>
    </div>
    <div class="t-desc">
      Enter your Torn API key to track honors and medals progress.
    </div>
    <div class="t-info-box">
      <div class="t-info-title">API Key Requirements</div>
      <ul class="t-info-list">
        <li>Create a <strong>Full Access</strong> API key</li>
        <li>Access type: <strong>Read Only</strong></li>
      </ul>
    </div>
    <div class="t-input-wrap">
      <label class="t-label">API Key</label>
      <input type="text" id="torn-api-key" class="t-input" placeholder="XXXXXXXXXXXXXXXX" maxlength="16" />
    </div>
    <div class="t-btn-row">
      <button id="torn-dismiss" class="t-btn t-btn-secondary">Dismiss (1 min)</button>
      <button id="torn-submit" class="t-btn t-btn-primary">Start Tracking</button>
    </div>
  `;

  document.body.appendChild(setupBox);

  const input = document.getElementById('torn-api-key') as HTMLInputElement;
  const submitBtn = document.getElementById('torn-submit') as HTMLButtonElement;
  const dismissBtn = document.getElementById('torn-dismiss') as HTMLButtonElement;
  const closeBtn = document.getElementById('t-setup-close') as HTMLButtonElement;

  submitBtn.addEventListener('click', () => {
    const key = input.value.trim();
    if (key.length === 16) {
      setupBox.remove();
      onSubmit(key);
    }
  });

  dismissBtn.addEventListener('click', () => {
    setupBox.remove();
    GM_setValue('torn_setup_dismissed', Date.now());
    setTimeout(() => {
      showSetupPrompt(onSubmit);
    }, 60000);
  });

  closeBtn.addEventListener('click', () => {
    setupBox.remove();
  });

  // Make setup box draggable
  const header = setupBox.querySelector('.t-setup-header') as HTMLElement;
  if (header) {
    header.addEventListener('mousedown', (e) => {
      setupDragging = true;
      const rect = setupBox.getBoundingClientRect();
      setupDragOffset.x = e.clientX - rect.left;
      setupDragOffset.y = e.clientY - rect.top;
      setupBox.style.left = rect.left + 'px';
      setupBox.style.top = rect.top + 'px';
      setupBox.style.right = 'auto';
      setupBox.style.transform = 'none';
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (!setupDragging) return;
    e.preventDefault();
    const newLeft = e.clientX - setupDragOffset.x;
    const newTop = e.clientY - setupDragOffset.y;
    setupBox.style.left = Math.max(0, newLeft) + 'px';
    setupBox.style.top = Math.max(0, newTop) + 'px';
  });

  document.addEventListener('mouseup', () => {
    setupDragging = false;
  });
}

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return Math.round(n).toString();
}

function renderProgressItem(h: HonorProgress | MedalProgress, type: 'honor' | 'medal'): string {
  const barClass = h.progress >= 80 ? 'high' : 'normal';
  const color = type === 'honor' ? TORN.honor : TORN.medal;
  const wikiUrl = type === 'honor' ? 'https://wiki.torn.com/wiki/Honors' : 'https://wiki.torn.com/wiki/Medals';
  return `
    <div class="t-item">
      <div class="t-item-row">
        <span class="t-item-name" style="border-left: 3px solid ${color}; padding-left: 8px;">
          <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer" class="t-wiki-link">${h.name} <span class="t-wiki-icon">&#8599;</span></a>
          ${h.isNear ? ' <small style="color: ${TORN.warning}; background: transparent;">NEAR</small>' : ''}
        </span>
        <span class="t-item-nums">
          <span class="t-item-current">${formatNum(h.current)}</span><span class="t-item-target">/${formatNum(h.target)}</span>
        </span>
      </div>
      <div class="t-bar"><div class="t-bar-fill ${barClass}" style="width: ${h.progress}%; background: ${color};"></div></div>
      <div class="t-item-remain">${formatNum(Math.max(0, h.remaining))} remaining (${h.progress}%)</div>
    </div>
  `;
}

export function showStatusBox(
  honorStatus: HonorStatus,
  medalStatus: MedalStatus,
  onOpenSettings?: () => void
): void {
  if (statusBox) statusBox.remove();

  const showCount = GM_getValue<number>('torn_show_count', 5);
  const medalsShowCount = GM_getValue<number>('torn_medals_show_count', 5);

  // Filter honors (no threshold, just count)
  let displayHonors = honorStatus.progress.slice(0, showCount);

  // Show medals
  let displayMedals = medalStatus.progress.slice(0, medalsShowCount);

  statusBox = document.createElement('div');
  statusBox.id = 'torn-status-box';
  // Set before insertion so a minimised box never flashes open on refresh.
  if (GM_getValue<boolean>(MINIMISED_KEY, false)) statusBox.classList.add('t-minimised');
  applyDock(statusBox, loadDock());
  statusBox.innerHTML = `
    <style>
      #torn-status-box {
        position: fixed; top: 100px; right: 20px; background: ${TORN.bgMedium};
        border: 1px solid ${TORN.border}; border-radius: 4px; width: 340px;
        max-height: 550px; z-index: 999997; box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        font-family: 'Mukta Malar', 'Segoe UI', sans-serif; animation: t-fadeIn 0.3s ease;
        overflow: hidden; display: flex; flex-direction: column;
      }
      @keyframes t-fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      .t-header {
        background: ${TORN.bgLight}; padding: 10px 14px; border-bottom: 1px solid ${TORN.border};
        display: flex; align-items: center; justify-content: space-between; cursor: move; user-select: none;
      }
      .t-header-left { display: flex; align-items: center; gap: 8px; }
      .t-header-icon {
        width: 24px; height: 24px;
        background: linear-gradient(135deg, ${TORN.honor}, ${TORN.medal});
        border-radius: 4px; display: flex; align-items: center; justify-content: center;
        font-size: 10px; color: ${TORN.bgDark}; font-weight: bold;
      }
      .t-header-title { font-size: 12px; font-weight: 600; color: ${TORN.textPrimary}; text-transform: uppercase; }
      .t-header-btn {
        background: none; border: none; color: ${TORN.textMuted}; cursor: pointer;
        font-size: 14px; padding: 4px 6px; border-radius: 3px;
      }
      .t-header-btn:hover { background: ${TORN.border}; color: ${TORN.textPrimary}; }
      .t-tabs {
        display: flex; padding: 8px 14px; gap: 8px; background: ${TORN.bgDark};
        border-bottom: 1px solid ${TORN.border};
      }
      .t-tab {
        flex: 1; padding: 8px 12px; border: 1px solid ${TORN.border}; border-radius: 4px;
        background: ${TORN.bgLight}; color: ${TORN.textSecondary}; font-size: 12px;
        font-weight: 600; cursor: pointer; text-align: center; text-transform: uppercase;
        transition: all 0.2s;
      }
      .t-tab:hover { border-color: ${TORN.accent}; }
      .t-tab.active.honor { background: ${TORN.honor}; border-color: ${TORN.honor}; color: ${TORN.bgDark}; }
      .t-tab.active.medal { background: ${TORN.medal}; border-color: ${TORN.medal}; color: ${TORN.bgDark}; }
      .t-stats {
        padding: 12px 14px; background: ${TORN.bgDark}; border-bottom: 1px solid ${TORN.border}; display: flex; gap: 16px;
      }
      .t-stat { display: flex; align-items: center; gap: 8px; }
      .t-stat-dot { width: 12px; height: 12px; border-radius: 2px; }
      .t-stat-dot.honor { background: ${TORN.honor}; }
      .t-stat-dot.medal { background: ${TORN.medal}; }
      .t-stat-value { font-size: 18px; font-weight: 700; color: ${TORN.textPrimary}; }
      .t-stat-label { font-size: 10px; color: ${TORN.textMuted}; text-transform: uppercase; }
      .t-body { flex: 1; overflow-y: auto; max-height: 400px; }
      .t-section-header {
        padding: 10px 14px; background: ${TORN.bgLight}; font-size: 11px; font-weight: 600;
        color: ${TORN.textMuted}; text-transform: uppercase; display: flex; justify-content: space-between;
      }
      .t-item { padding: 10px 14px; border-bottom: 1px solid ${TORN.border}; }
      .t-item:last-child { border-bottom: none; }
      .t-item:hover { background: ${TORN.bgLight}; }
      .t-item-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
      .t-item-name { font-size: 13px; color: ${TORN.textPrimary}; }
      .t-item-name a { color: ${TORN.textPrimary}; text-decoration: underline; cursor: pointer; }
      .t-item-name a:hover { color: ${TORN.accent}; }
      .t-wiki-icon { font-size: 10px; opacity: 0.6; margin-left: 4px; }
      .t-item-nums { font-size: 12px; font-family: 'Courier New', monospace; }
      .t-item-current { color: ${TORN.textSecondary}; }
      .t-item-target { color: ${TORN.textMuted}; }
      .t-bar { height: 6px; background: ${TORN.bgDark}; border-radius: 3px; overflow: hidden; }
      .t-bar-fill { height: 100%; border-radius: 3px; }
      .t-bar-fill.high { background: ${TORN.warning}; }
      .t-bar-fill.normal { background: ${TORN.honor}; }
      .t-item-remain { font-size: 10px; color: ${TORN.textMuted}; margin-top: 4px; }
      .t-body::-webkit-scrollbar { width: 8px; }
      .t-body::-webkit-scrollbar-track { background: ${TORN.bgDark}; }
      .t-body::-webkit-scrollbar-thumb { background: ${TORN.border}; border-radius: 4px; }
      .t-tab-content { display: none; }
      .t-tab-content.active { display: block; }
      .t-min-tab { display: none; }
      /* Minimised: a slim, faded tab docked to one screen edge. --t-pos is its offset along
         that edge; min() keeps it on-screen if the window is later made smaller. */
      #torn-status-box.t-minimised {
        max-height: none; opacity: 0.45; animation: none; transition: opacity 0.2s;
      }
      #torn-status-box.t-minimised:hover,
      #torn-status-box.t-minimised:focus-within,
      #torn-status-box.t-minimised.t-dragging { opacity: 1; }
      #torn-status-box.t-minimised > :not(.t-min-tab) { display: none; }
      #torn-status-box.t-minimised .t-min-tab {
        display: flex; flex: 1; align-items: center; justify-content: center; gap: 6px;
        background: ${TORN.bgLight}; border: none; color: ${TORN.accent}; cursor: grab;
        font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        font-family: inherit; touch-action: none; user-select: none;
      }
      #torn-status-box.t-dragging .t-min-tab { cursor: grabbing; }
      /* The arrow points the way the box will open, i.e. away from the docked edge. */
      #torn-status-box.t-minimised .t-min-tab::after { content: '\\25C0'; }
      #torn-status-box.t-minimised.t-dock-left .t-min-tab::after { content: '\\25B6'; }
      #torn-status-box.t-minimised.t-dock-top .t-min-tab::after { content: '\\25BC'; }
      #torn-status-box.t-minimised.t-dock-bottom .t-min-tab::after { content: '\\25B2'; }

      #torn-status-box.t-minimised.t-dock-right {
        left: auto !important; right: 0 !important; bottom: auto !important;
        top: min(var(--t-pos), calc(100vh - 72px)) !important;
        width: 28px; border-right: none; border-radius: 6px 0 0 6px;
      }
      #torn-status-box.t-minimised.t-dock-left {
        left: 0 !important; right: auto !important; bottom: auto !important;
        top: min(var(--t-pos), calc(100vh - 72px)) !important;
        width: 28px; border-left: none; border-radius: 0 6px 6px 0;
      }
      #torn-status-box.t-minimised.t-dock-top {
        top: 0 !important; bottom: auto !important; right: auto !important;
        left: min(var(--t-pos), calc(100vw - 72px)) !important;
        width: auto; height: 28px; border-top: none; border-radius: 0 0 6px 6px;
      }
      #torn-status-box.t-minimised.t-dock-bottom {
        bottom: 0 !important; top: auto !important; right: auto !important;
        left: min(var(--t-pos), calc(100vw - 72px)) !important;
        width: auto; height: 28px; border-bottom: none; border-radius: 6px 6px 0 0;
      }
      #torn-status-box.t-minimised.t-dock-left .t-min-tab,
      #torn-status-box.t-minimised.t-dock-right .t-min-tab { writing-mode: vertical-rl; padding: 12px 0; }
      #torn-status-box.t-minimised.t-dock-top .t-min-tab,
      #torn-status-box.t-minimised.t-dock-bottom .t-min-tab { padding: 0 12px; }
      @media (prefers-reduced-motion: reduce) {
        #torn-status-box.t-minimised { transition: none; }
      }
    </style>
    <div class="t-header">
      <div class="t-header-left">
        <div class="t-header-icon">HM</div>
        <span class="t-header-title">Honors & Medals</span>
      </div>
      <div>
        <button class="t-header-btn" id="t-minimise" title="Minimise" aria-label="Minimise to side tab">&#8211;</button>
        <button class="t-header-btn" id="t-settings">&#9881;</button>
        <button class="t-header-btn" id="t-close">x</button>
      </div>
    </div>
    <div class="t-tabs">
      <button class="t-tab honor active" data-tab="honors">Honors</button>
      <button class="t-tab medal" data-tab="medals">Medals</button>
    </div>
    <div class="t-stats">
      <div class="t-stat">
        <div class="t-stat-dot honor"></div>
        <div><div class="t-stat-value">${honorStatus.totalAwarded}</div><div class="t-stat-label">Honors</div></div>
      </div>
      <div class="t-stat">
        <div class="t-stat-dot medal"></div>
        <div><div class="t-stat-value">${medalStatus.totalAwarded}</div><div class="t-stat-label">Medals</div></div>
      </div>
    </div>
    <div class="t-body">
      <div id="t-honors-content" class="t-tab-content active">
        <div class="t-section-header">
          <span>Closest Honors</span>
          <span style="font-size: 10px; opacity: 0.7">Top ${showCount}</span>
        </div>
        ${displayHonors.length > 0 ? displayHonors.map(h => renderProgressItem(h, 'honor')).join('') : '<div style="padding: 20px; text-align: center; color: ' + TORN.textMuted + '">No honors in progress</div>'}
      </div>
      <div id="t-medals-content" class="t-tab-content">
        <div class="t-section-header">
          <span>Closest Medals</span>
          <span style="font-size: 10px; opacity: 0.7">Top ${medalsShowCount}</span>
        </div>
        ${displayMedals.length > 0 ? displayMedals.map(m => renderProgressItem(m, 'medal')).join('') : '<div style="padding: 20px; text-align: center; color: ' + TORN.textMuted + '">No medals in progress</div>'}
      </div>
    </div>
    <button class="t-min-tab" title="Click to open, drag to move" aria-label="Expand Honors and Medals tracker (drag to move to another screen edge)">HM</button>
  `;

  document.body.appendChild(statusBox);

  const setMinimised = (minimised: boolean) => {
    GM_setValue(MINIMISED_KEY, minimised);
    statusBox?.classList.toggle('t-minimised', minimised);
  };
  document.getElementById('t-minimise')?.addEventListener('click', () => setMinimised(true));
  const minTab = statusBox.querySelector('.t-min-tab') as HTMLElement | null;
  if (minTab) enableTabDocking(minTab, statusBox, () => setMinimised(false));

  document.getElementById('t-close')?.addEventListener('click', () => { statusBox?.remove(); statusBox = null; });
  document.getElementById('t-settings')?.addEventListener('click', () => { if (onOpenSettings) onOpenSettings(); });

  // Tab switching
  document.querySelectorAll('.t-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const tabName = target.dataset.tab as 'honors' | 'medals';

      document.querySelectorAll('.t-tab').forEach(t => t.classList.remove('active'));
      target.classList.add('active');

      document.querySelectorAll('.t-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`t-${tabName}-content`)?.classList.add('active');

      activeTab = tabName;
    });
  });

  // Restore tab state
  const savedTab = GM_getValue<'honors' | 'medals'>('torn_active_tab', 'honors');
  if (savedTab !== 'honors') {
    document.querySelectorAll('.t-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.t-tab-content').forEach(c => c.classList.remove('active'));
    const tabBtn = document.querySelector(`.t-tab[data-tab="${savedTab}"]`) as HTMLElement;
    tabBtn?.classList.add('active');
    document.getElementById(`t-${savedTab}-content`)?.classList.add('active');
    activeTab = savedTab;
  }

  // Position persistence
  const savedLeft = GM_getValue<number>('torn_box_left', -1);
  const savedTop = GM_getValue<number>('torn_box_top', -1);
  if (savedLeft >= 0 && savedTop >= 0 && statusBox) {
    statusBox.style.left = savedLeft + 'px';
    statusBox.style.right = 'auto';
    statusBox.style.top = savedTop + 'px';
  }

  // Dragging
  const header = statusBox.querySelector('.t-header') as HTMLElement;
  if (header) {
    header.addEventListener('mousedown', (e) => {
      // Clicking a header button must not start a drag (mouseup would then save a bogus position).
      if ((e.target as HTMLElement).closest('button')) return;
      isDragging = true;
      const rect = statusBox!.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      statusBox!.style.right = 'auto';
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !statusBox) return;
    statusBox.style.left = Math.max(0, e.clientX - dragOffset.x) + 'px';
    statusBox.style.top = Math.max(0, e.clientY - dragOffset.y) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging && statusBox) {
      GM_setValue('torn_box_left', parseInt(statusBox.style.left));
      GM_setValue('torn_box_top', parseInt(statusBox.style.top));
      GM_setValue('torn_active_tab', activeTab);
    }
    isDragging = false;
  });
}

export function showSettingsPanel(
  honorStatus: HonorStatus,
  medalStatus: MedalStatus,
  onClose: () => void,
  onChangeApiKey?: () => void
): void {
  if (settingsPanel) settingsPanel.remove();
  if (statusBox) statusBox.remove();

  const apiKey = GM_getValue<string>('torn_api_key', '');
  const masked = apiKey.length > 0 ? apiKey.substring(0, 4) + '........' + apiKey.substring(12) : 'Not set';
  const showCount = GM_getValue<number>('torn_show_count', 5);
  const medalsShowCount = GM_getValue<number>('torn_medals_show_count', 5);

  settingsPanel = document.createElement('div');
  settingsPanel.id = 't-settings-panel';
  settingsPanel.innerHTML = `
    <style>
      #t-settings-panel {
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        background: ${TORN.bgMedium}; border: 1px solid ${TORN.border}; border-radius: 4px;
        max-width: 480px; width: 90%; max-height: 80vh; overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        z-index: 999999; font-family: 'Mukta Malar', 'Segoe UI', sans-serif;
        animation: t-fadeIn 0.3s ease; display: flex; flex-direction: column;
      }
      @keyframes t-fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      .t-panel-header {
        background: ${TORN.bgLight}; padding: 16px 20px; border-bottom: 1px solid ${TORN.border};
        display: flex; align-items: center; justify-content: space-between; cursor: move;
      }
      .t-panel-title {
        display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600;
        color: ${TORN.textPrimary}; text-transform: uppercase;
      }
      .t-panel-icon {
        width: 24px; height: 24px;
        background: linear-gradient(135deg, ${TORN.honor}, ${TORN.medal});
        border-radius: 4px; display: flex; align-items: center; justify-content: center;
        font-size: 12px; color: ${TORN.bgDark};
      }
      .t-close-btn {
        background: none; border: none; color: ${TORN.textMuted}; cursor: pointer;
        font-size: 18px; padding: 4px 8px; border-radius: 3px;
      }
      .t-close-btn:hover { background: ${TORN.border}; color: ${TORN.textPrimary}; }
      .t-panel-body { padding: 20px; overflow-y: auto; flex: 1; }
      .t-section { margin-bottom: 24px; }
      .t-section-label { font-size: 14px; font-weight: 600; color: ${TORN.textPrimary}; margin-bottom: 12px; text-transform: uppercase; }
      .t-stat-row {
        display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${TORN.border};
      }
      .t-stat-row:last-child { border-bottom: none; }
      .t-stat-row-label { display: flex; align-items: center; gap: 8px; color: ${TORN.textSecondary}; }
      .t-stat-dot { width: 10px; height: 10px; border-radius: 2px; }
      .t-stat-dot.honor { background: ${TORN.honor}; }
      .t-stat-dot.medal { background: ${TORN.medal}; }
      .t-stat-row-value { font-size: 16px; font-weight: 600; color: ${TORN.textPrimary}; }
      .t-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
      .t-btn-toggle {
        padding: 6px 12px; background: ${TORN.bgDark}; border: 1px solid ${TORN.border}; border-radius: 4px;
        color: ${TORN.textSecondary}; font-size: 12px; cursor: pointer;
      }
      .t-btn-toggle:hover { border-color: ${TORN.accent}; color: ${TORN.textPrimary}; }
      .t-btn-toggle.active { background: ${TORN.accent}; border-color: ${TORN.accent}; color: ${TORN.bgDark}; }
      .t-panel-footer { padding: 16px 20px; background: ${TORN.bgDark}; border-top: 1px solid ${TORN.border}; display: flex; justify-content: space-between; }
      .t-btn {
        padding: 10px 24px; border: 1px solid ${TORN.border}; border-radius: 4px; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: all 0.2s; text-transform: uppercase;
      }
      .t-btn-secondary { background: ${TORN.bgLight}; color: ${TORN.textSecondary}; }
      .t-btn-secondary:hover { background: ${TORN.border}; color: ${TORN.textPrimary}; }
      .t-btn-primary { background: ${TORN.accent}; color: ${TORN.bgDark}; border-color: ${TORN.accent}; }
      .t-btn-primary:hover { background: #e8c878; }
    </style>
    <div class="t-panel-header">
      <div class="t-panel-title">
        <div class="t-panel-icon">&#9881;</div>
        <span>Settings</span>
      </div>
      <button class="t-close-btn" id="t-settings-close">x</button>
    </div>
    <div class="t-panel-body">
      <div class="t-section">
        <div class="t-section-label">API Key</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="flex: 1; background: ${TORN.bgDark}; border: 1px solid ${TORN.border}; border-radius: 4px; padding: 10px 14px;">
            <div style="font-size: 12px; color: ${TORN.textMuted}; margin-bottom: 4px;">Current Key</div>
            <div style="font-size: 14px; color: ${TORN.textPrimary}; font-family: 'Courier New', monospace; letter-spacing: 2px;">${masked}</div>
          </div>
          <button class="t-btn t-btn-secondary" id="t-change-key">Change</button>
        </div>
      </div>
      <div class="t-section">
        <div class="t-section-label">Display Settings</div>
        <div style="margin-bottom: 12px;">
          <div style="font-size: 12px; color: ${TORN.textMuted}; margin-bottom: 8px; text-transform: uppercase;">Honors - Show Nearest</div>
          <div class="t-btns">
            ${[3, 5, 10, 25, 50, 100, 9999].map(v => '<button class="t-btn-toggle' + (showCount === v ? ' active' : '') + '" data-count="' + v + '">' + (v === 9999 ? 'All' : v) + '</button>').join('')}
          </div>
        </div>
        <div>
          <div style="font-size: 12px; color: ${TORN.textMuted}; margin-bottom: 8px; text-transform: uppercase;">Medals - Show Nearest</div>
          <div class="t-btns">
            ${[3, 5, 10, 25, 50, 100, 9999].map(v => '<button class="t-btn-toggle' + (medalsShowCount === v ? ' active' : '') + '" data-medals-count="' + v + '">' + (v === 9999 ? 'All' : v) + '</button>').join('')}
          </div>
        </div>
      </div>
      <div class="t-section">
        <div class="t-section-label">Support</div>
        <div style="background: ${TORN.bgDark}; border: 1px solid ${TORN.border}; border-radius: 4px; padding: 16px; text-align: center;">
          <div style="color: ${TORN.textSecondary}; font-size: 13px; margin-bottom: 12px; line-height: 1.5;">
            Donations are not required but do help add new features to the script!
          </div>
          <a href="https://ko-fi.com/lordzulu" target="_blank" rel="noopener noreferrer" class="t-btn t-btn-primary" style="text-decoration: none; display: inline-block;">
            Donations/Tips
          </a>
        </div>
      </div>
    </div>
    <div class="t-panel-footer">
      <button class="t-btn t-btn-secondary" id="t-settings-cancel">Close</button>
      <button class="t-btn t-btn-primary" id="t-settings-save">Done</button>
    </div>
  `;

  document.body.appendChild(settingsPanel);

  document.querySelectorAll('.t-btn-toggle[data-count]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.t-btn-toggle[data-count]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      GM_setValue('torn_show_count', parseInt((btn as HTMLElement).dataset.count || '5'));
    });
  });

  document.querySelectorAll('.t-btn-toggle[data-medals-count]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.t-btn-toggle[data-medals-count]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      GM_setValue('torn_medals_show_count', parseInt((btn as HTMLElement).dataset.medalsCount || '5'));
    });
  });

  document.getElementById('t-settings-cancel')?.addEventListener('click', () => { settingsPanel?.remove(); settingsPanel = null; onClose(); });
  document.getElementById('t-settings-close')?.addEventListener('click', () => { settingsPanel?.remove(); settingsPanel = null; onClose(); });
  document.getElementById('t-settings-save')?.addEventListener('click', () => { settingsPanel?.remove(); settingsPanel = null; onClose(); });
  document.getElementById('t-change-key')?.addEventListener('click', () => {
    settingsPanel?.remove(); settingsPanel = null;
    if (onChangeApiKey) onChangeApiKey();
  });

  // Make settings panel draggable
  const header = settingsPanel.querySelector('.t-panel-header') as HTMLElement;
  if (header) {
    header.addEventListener('mousedown', (e) => {
      settingsDragging = true;
      const rect = settingsPanel!.getBoundingClientRect();
      settingsDragOffset.x = e.clientX - rect.left;
      settingsDragOffset.y = e.clientY - rect.top;
      settingsPanel!.style.left = rect.left + 'px';
      settingsPanel!.style.top = rect.top + 'px';
      settingsPanel!.style.right = 'auto';
      settingsPanel!.style.transform = 'none';
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (!settingsDragging) return;
    e.preventDefault();
    const newLeft = e.clientX - settingsDragOffset.x;
    const newTop = e.clientY - settingsDragOffset.y;
    settingsPanel!.style.left = Math.max(0, newLeft) + 'px';
    settingsPanel!.style.top = Math.max(0, newTop) + 'px';
  });

  document.addEventListener('mouseup', () => {
    settingsDragging = false;
  });
}
