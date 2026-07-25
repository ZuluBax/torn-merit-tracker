# Torn Honors & Medals Tracker

A Tampermonkey script to track your honors and medals progress in [Torn.com](https://www.torn.com).

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-orange)

## Features

- **Real-time tracking** - Automatically monitors your honors and medals progress every minute
- **Top-right status box** - Compact display showing your closest honors and medals
- **Visual distinction** - Blue for honors, bronze/gold for medals
- **Near-completion warnings** - Highlights items within 5 of completion
- **Torn-styled UI** - Dark theme matching Torn.com's design
- **Persistent settings** - Your preferences are saved between sessions

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click the Tampermonkey icon and select "Create a new script..."
3. Copy the contents of `dist/torn-honors-medals-tracker.user.js` and paste into the editor
4. Save the script (Ctrl+S)
5. Visit [Torn.com](https://www.torn.com) and enter your API key

## API Key Setup

The script requires a Torn API key with specific permissions:

1. Go to [Torn.com → Preferences → API](https://www.torn.com/preferences.php#api=API)
2. Create a **new** API key with these settings:
   - **Key type:** Limited (not Full Access)
   - **Permission:** User → Honors (read access)
   - **Permission:** User → Medals (read access)
   - **Access type:** Read Only

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

```bash
# Install dependencies
npm install

# Build the script
npm run build

# Development mode (auto-rebuild on changes)
npm run dev
```

### Project Structure

```
torn-honors-medals-tracker/
├── src/
│   ├── main.user.ts    # Entry point
│   ├── api.ts          # Torn API wrapper
│   ├── merits.ts       # Honors & medals parsing logic
│   └── ui.ts          # UI components
├── dist/               # Built script (torn-honors-medals-tracker.user.js)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CHANGELOG.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This script is not affiliated with Torn.com or its developers. Use at your own risk. Always follow Torn's Terms of Service.
