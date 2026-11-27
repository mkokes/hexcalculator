# Hexagon Tabletop Calculator

A React-based web application for calculating hexagon tile patterns and epoxy requirements for tabletop projects. Perfect for woodworkers and makers creating hexagonal patterns with precise measurements.

🌐 **Live Demo**: [https://mkokes.github.io/hexcalculator/](https://mkokes.github.io/hexcalculator/)

## Features

- 🎯 **Pattern Calculation**: Automatically calculates the number of hexagons needed to cover a target area
- 📐 **Precise Measurements**: Supports both metric (cm) and imperial (inches) units
- 🎨 **Visual Preview**: Real-time SVG visualization of the hexagon pattern with dimension labels
- 🔍 **Hexagon Details**: Detailed view of a single hexagon showing edge size, width, and height measurements
- 💧 **Epoxy Calculator**: Calculates the volume of epoxy needed to fill gaps
- ⚙️ **Customizable Parameters**: Adjust hexagon size, gap width, and depth
- 💾 **Persistent Settings**: All inputs are automatically saved to localStorage and restored on page reload
- 📱 **Installable PWA**: Install to your home screen or desktop and use it offline

## Tech Stack

- **React 19** (`^19.3.1`) - UI framework
- **TypeScript** (`^5.9.3`) - Type safety
- **Vite 8** (`^8.3.6`) - Build tool and dev server
- **Ant Design 6** (`^6.7.0`) - React UI library
- **Ant Design Icons** (`^6.3.4`) + **Lucide React** (`^1.73.0`) - Icon libraries
- **Tailwind CSS 4** (`^4.3.5`) - Utility CSS and design tokens
- **`vite-plugin-pwa` 2** - Installable offline PWA (Workbox service worker)
- **@fontsource/inter** & **@fontsource/poppins** - Self-hosted fonts
- **[mk-styleguide](https://github.com/mkokes/mk-styleguide)** - Shared design system (lime and greys, Poppins and Inter, light/dark modes), vendored in `styleguide/`
- **Oxlint** / **Oxfmt** - Linting and formatting

## Styling

The app follows the shared mk-styleguide design system. Read [styleguide/STYLEGUIDE.md](styleguide/STYLEGUIDE.md) before changing styles.

- **Tokens:** `styleguide/tailwind.css` is a Tailwind v4 entry that defines every token. `src/index.css` imports it, and CSS uses the role variables (`--color-bg`, `--color-text`, `--color-link`...), which follow `<html data-theme>`.
- **antd:** `src/theme.ts` mirrors the tokens as hex, because antd can't read CSS variables. Keep the two in step.
- **Diagrams:** measurement annotations use the status roles. Danger is the target and edge, info is the pattern boundary and width, and success is the height. The wood-grain fills are content and stay as they are.

## Prerequisites

- Node.js 20 or higher (CI uses Node 20)
- Yarn 4.x (Berry, via Corepack)

## Getting Started

### Installation

```bash
# Install dependencies
yarn install
```

### Development

```bash
# Start development server (opens at http://localhost:3000)
yarn dev
```

### Build

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

## Available Scripts

| Command                    | Description                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- |
| `yarn dev`                 | Start development server with hot reload at http://localhost:3000/hexcalculator/ |
| `yarn build`               | Typecheck (`tsc`) and build production bundle (`vite build`)                     |
| `yarn preview`             | Preview production build locally                                                 |
| `yarn lint`                | Run oxlint to check code quality                                                 |
| `yarn lint:fix`            | Run oxlint with automatic fixes                                                  |
| `yarn format`              | Format the codebase with oxfmt                                                   |
| `yarn format:check`        | Check formatting with oxfmt without modifying files                              |
| `yarn generate-pwa-assets` | Regenerate PWA icons from `public/favicon.svg`                                   |

## Usage

1. **Select Unit System**: Choose between Imperial (inches) or Metric (cm)
2. **Set Target Dimensions**: Enter the width and height of your desired tabletop
3. **Configure Hexagon Size**: Set the edge length of each hexagon tile
4. **Adjust Gap**: Specify the gap between hexagons
5. **Set Depth**: Enter the depth for epoxy volume calculation

The calculator will display:

- **Pattern Preview**: Visual representation of the hexagon layout with dimension labels
- **Hexagon Details**: Detailed view showing individual hexagon measurements (edge, width, height)
- **Results**: Number of columns and rows needed, total hexagon count
- **Actual Pattern Size**: Final dimensions (may exceed target to ensure full coverage)
- **Epoxy Required**: Volume needed in both small and large units

All settings are automatically saved to your browser's localStorage and will be restored when you return to the page.

## Project Structure

```
hexcalculator/
├── public/              # Favicons and generated PWA icons
├── src/
│   ├── App.tsx          # Main calculator component with Ant Design Layout
│   ├── Root.tsx         # Theme provider (antd ConfigProvider + light/system/dark preference)
│   ├── theme.ts         # antd theme: hex mirror of the mk-styleguide tokens
│   ├── useThemeMode.ts  # Light/system/dark preference, stored in localStorage
│   ├── main.tsx         # Application entry point
│   └── index.css        # Tokens import, global styles and diagram colours
├── styleguide/          # Vendored mk-styleguide (tailwind.css, STYLEGUIDE.md); don't edit here
├── dist/                # Production build output
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions deployment workflow
├── .oxfmtrc.json        # Oxfmt formatting configuration
├── .oxlintrc.json       # Oxlint configuration
├── .yarn/               # Yarn 4 Berry state & PnP artifacts (.pnp.cjs)
├── postcss.config.js    # PostCSS + Tailwind CSS config
├── pwa-assets.config.ts # PWA icon generation config
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite + VitePWA configuration with /hexcalculator/ base path
└── package.json         # Project dependencies and scripts
```

## Deployment

This project is deployed to GitHub Pages using GitHub Actions (`.github/workflows/deploy.yml`):

1. **Automatic Deployment**: Pushes to `main` (or manual `workflow_dispatch`) run `yarn install --immutable` and `yarn build` on Node 20
2. **Build Process**: Vite builds the production bundle with `base: '/hexcalculator/'`
3. **GitHub Pages**: Deployed to https://mkokes.github.io/hexcalculator/

Note: CI runs the build only, so run `yarn lint` and `yarn format:check` locally before committing.

### Manual Deployment

```bash
# Build for production
yarn build

# The dist/ folder contains the production build
# GitHub Actions automatically deploys this to GitHub Pages
```

## Code Quality

This project uses:

- **Oxlint** with TypeScript and React plugins for code quality, and **Oxfmt** for formatting
- **TypeScript** strict mode for type safety

Run `yarn lint` before committing changes.

## Key Features Explained

### localStorage Persistence

All user inputs (target dimensions, edge size, gap, depth, and unit system) are automatically saved to the browser's localStorage. This means your settings persist across page refreshes and browser sessions.

### Hexagon Geometry

The calculator uses pointy-top hexagon orientation with the following relationships:

- **Edge Size**: Length of one side of the hexagon
- **Width** (point to point): √3 × edge size
- **Height** (flat to flat): 2 × edge size

### Pattern Layout

The calculator arranges hexagons in a honeycomb pattern with offset rows, ensuring efficient coverage of the target area. The actual pattern size may slightly exceed the target dimensions to ensure complete coverage.

### Visual Feedback

- **Pattern Preview**: Shows the complete hexagon layout with color-coded dimension lines
- **Hexagon Details**: Displays a single hexagon with labeled measurements for reference
- **Real-time Updates**: All calculations and visualizations update instantly as you adjust parameters

## License

Copyright (C) 2025-2026 Marty Kokes

Licensed under the GNU General Public License v3.0 or later. See [LICENSE](LICENSE).

## Contributing

Contributions are welcome! Please ensure all code passes linting checks before submitting.

---

Built with ❤️ for makers and woodworkers
