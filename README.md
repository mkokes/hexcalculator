# Hexagon Tabletop Calculator

A React-based web application for calculating hexagon tile patterns and epoxy requirements for tabletop projects. Perfect for woodworkers and makers creating hexagonal patterns with precise measurements.

## Features

- 🎯 **Pattern Calculation**: Automatically calculates the number of hexagons needed to cover a target area
- 📐 **Precise Measurements**: Supports both metric (cm) and imperial (inches) units
- 🎨 **Visual Preview**: Real-time SVG visualization of the hexagon pattern
- 💧 **Epoxy Calculator**: Calculates the volume of epoxy needed to fill gaps
- ⚙️ **Customizable Parameters**: Adjust hexagon size, gap width, and depth

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **ESLint** - Code linting
- **Prettier** - Code formatting

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
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build optimized production bundle |
| `yarn preview` | Preview production build locally |
| `yarn lint` | Run ESLint to check code quality |
| `yarn lint:fix` | Automatically fix ESLint issues |
| `yarn format` | Format code with Prettier |
| `yarn format:check` | Check code formatting without changes |

## Usage

1. **Select Unit System**: Choose between Imperial (inches) or Metric (cm)
2. **Set Target Dimensions**: Enter the width and height of your desired tabletop
3. **Configure Hexagon Size**: Set the edge length of each hexagon tile
4. **Adjust Gap**: Specify the gap between hexagons
5. **Set Depth**: Enter the depth for epoxy volume calculation

The calculator will display:
- Number of columns and rows needed
- Total hexagon count
- Actual pattern dimensions (may exceed target to ensure full coverage)
- Required epoxy volume in both small and large units

## Project Structure

```
hexcalculator/
├── src/
│   ├── App.tsx          # Main calculator component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── .eslintrc            # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies and scripts
```

## Code Quality

This project uses:
- **ESLint** with TypeScript and React plugins for code quality
- **Prettier** for consistent code formatting
- **TypeScript** strict mode for type safety

Run `yarn lint` and `yarn format:check` before committing changes.

## License

ISC

## Contributing

Contributions are welcome! Please ensure all code passes linting and formatting checks before submitting.

---

Built with ❤️ for makers and woodworkers

