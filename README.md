# Hexagon Tabletop Calculator

A React-based web application for calculating hexagon tile patterns and epoxy requirements for tabletop projects. Perfect for woodworkers and makers creating hexagonal patterns with precise measurements.

🌐 **Live Demo**: [https://mkokes.github.io/hexcalculator/](https://mkokes.github.io/hexcalculator/)

## Features

- 🎯 **Pattern Calculation**: Automatically calculates the number of hexagons needed to cover a target area
- 📐 **Precise Measurements**: Supports both metric (cm) and imperial (inches) units
- 🎨 **Visual Preview**: Real-time SVG visualization of the hexagon pattern with dimension labels
- � **Hexagon Details**: Detailed view of a single hexagon showing edge size, width, and height measurements
- �💧 **Epoxy Calculator**: Calculates the volume of epoxy needed to fill gaps
- ⚙️ **Customizable Parameters**: Adjust hexagon size, gap width, and depth
- 💾 **Persistent Settings**: All inputs are automatically saved to localStorage and restored on page reload
- 📱 **Installable PWA**: Install to your home screen or desktop and use it offline

## Tech Stack

- **React 19.2.3** - UI framework
- **TypeScript** - Type safety
- **Vite 7.3.0** - Fast build tool and dev server
- **Ant Design 6.1.1** - Comprehensive React UI library
- **Ant Design Icons** - Icon library
- **ESLint** - Code linting

## Prerequisites

- Node.js 18.18.0 or higher
- Yarn 4.x (Berry)

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

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with hot reload at http://localhost:3000/hexcalculator/ |
| `yarn build` | Build optimized production bundle |
| `yarn preview` | Preview production build locally |
| `yarn lint` | Run ESLint to check code quality |
| `yarn generate-pwa-assets` | Regenerate PWA icons from `public/favicon.svg` |

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
├── src/
│   ├── App.tsx          # Main calculator component with Ant Design Layout
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles and animations
├── dist/                # Production build output
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions deployment workflow
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration with GitHub Pages base path
└── package.json         # Project dependencies and scripts
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic Deployment**: Every push to the `main` branch triggers a deployment
2. **Build Process**: Vite builds the production bundle with base path `/hexcalculator/`
3. **GitHub Pages**: Deployed to https://mkokes.github.io/hexcalculator/

### Manual Deployment

```bash
# Build for production
yarn build

# The dist/ folder contains the production build
# GitHub Actions automatically deploys this to GitHub Pages
```

## Code Quality

This project uses:
- **ESLint** with TypeScript and React plugins for code quality
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

