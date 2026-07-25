# Changelog

All notable changes to Torn Honors & Medals Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [3.2.0] - 2026-07-24

### Added
- Attempts multiple API approaches (v1 and v2) to get personal stats
- Tries v2 selections: personalstats, stats, combat, combatstats, attributes, progression

---

## [3.1.0] - 2026-07-24

### Fixed
- **Updated to Torn API v2** - fixed "Wrong fields" and "API v2" errors
- API base changed to `api.torn.com/v2`
- Selection names updated for v2 API (personalstats, etc.)
- Stat paths updated to match v2 format

---

## [3.0.1] - 2026-07-24

### Fixed
- Added detailed logging for API debugging
- Better error messages when stats fail to load

---

## [3.0.0] - 2026-07-24

### Added
- **Honor progress tracking** - Shows progress bars for honors closest to completion
- Uses PROGRESS_MAP with 100+ honors from Torn City Merit Tracker data
- Displays current value, target, and percentage for each honor
- Color-coded progress bars (normal/high/very-high based on progress)
- "NEAR" badge for honors within 5 of completion

### Changed
- Stats now show "Earned" vs "Remaining" instead of just total count
- Shows Top 5 closest honors with detailed progress
- Honors tracked: ~100+ specific honors with known requirements

### API Requirements
- Requires API selections: attacking, bounties, crimes, hospital, jail, drugs, travel, jobs, racing, other, items, trading

---

## [2.0.0] - 2026-07-24

### Changed
- **Complete rewrite** - Changed from tracking merits to tracking honors and medals
- Honors and medals now tracked simultaneously
- Visual distinction: blue for honors, bronze/gold for medals
- Simplified display modes: Top 3 or Show All

### Removed
- Merit tracking (replaced with honors/medals)
- Individual merit selection (simplified to display modes)

---

## [1.4.1] - 2026-07-23

### Fixed
- "Top 3" mode now always shows top 3 merits regardless of progress
- "Selected" mode now defaults to top 3 if no merits are selected
- Updated settings description for "Top 3" to clarify it always shows merits

---

## [1.4.0] - 2026-07-23

### Added
- Settings panel now shows current API key (masked for security)
- "Change" button to reset and enter a new API key
- Clear API key requirements in setup prompt (Limited, User > Merits, Read Only)

---

## [1.3.1] - 2026-07-23

### Added
- Setup prompt now explains what type of API key is needed (Limited, User > Merits, Read Only)
- Includes step-by-step instructions for creating the correct key

### Fixed
- Settings now properly re-attach after saving changes
- Added debug logging for settings changes

---

## [1.3.0] - 2026-07-23

### Added
- **Settings panel** (gear icon) to configure display options
- **Display modes**:
  - Top 3: Shows your 3 closest merits to completion
  - Selected: Choose specific merits to track with checkboxes
  - All Incomplete: Shows all incomplete merits (up to 5)
- Settings persist between sessions

---

## [1.2.0] - 2026-07-23

### Fixed
- API parsing now correctly reads merit names and values from Torn API
- Merit names now display correctly (Nerve Bar, Critical Hit Rate, etc.)
- Progress calculated correctly based on spent points vs max level

### Changed
- Only show compact status box (top right) by default
- Hidden full panel that was covering game chat
- Status box moved to top-right corner

---

## [1.1.1] - 2026-07-23

### Fixed
- API call now uses `selections=merits` parameter to fetch merit data
- Merit parsing now correctly reads progress from API response

---

## [1.1.0] - 2026-07-23

### Added
- **Top-right status box** showing top 3 closest incomplete merits
- Status box highlights merits over 95% complete in red, 90-95% in orange
- Compact design with progress bars, percentages, and remaining points
- Close button on status box

### Changed
- Switched from warning popup to persistent status box
- Updated UI styling for consistency

---

## [1.0.0] - 2026-07-23

### Added
- Initial release
- API key setup prompt with Torn-styled modal
- Full merits panel with dark theme matching Torn's design
- Stats display (total, complete, near-completion counts)
- Progress bars for each merit with color coding
- Minimize and close functionality on main panel
- Automatic periodic checks (every 60 seconds)
