import React, { useState, useMemo } from 'react';
import { Ruler } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

interface HexagonInputs {
  targetWidth: number;
  targetHeight: number;
  edgeSize: number;
  gap: number;
  depth: number;
}

const HexagonCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [inputs, setInputs] = useState<HexagonInputs>({
    targetWidth: 48,
    targetHeight: 24,
    edgeSize: 2,
    gap: 0.125,
    depth: 0.75,
  });

  const unitLabel = unitSystem === 'metric' ? 'cm' : 'in';
  const volumeLabel = unitSystem === 'metric' ? 'ml' : 'fl oz';
  const volumeLabelLarge = unitSystem === 'metric' ? 'L' : 'gal';

  const calculations = useMemo(() => {
    const { targetWidth, targetHeight, edgeSize, gap, depth } = inputs;
    const s = edgeSize;
    const g = gap;

    // Pointy-top hexagon dimensions
    const hexWidth = Math.sqrt(3) * s;
    const hexHeight = 2 * s;

    // Calculate how many columns we need to fully cover the target width
    // We need to ensure the rightmost hexagons extend to or beyond targetWidth
    // Formula: hexWidth + (cols - 1) * (hexWidth/2 + g) >= targetWidth
    const numColumns = Math.ceil((targetWidth - hexWidth) / (hexWidth / 2 + g)) + 1;

    // Calculate how many rows we need to fully cover the target height
    // We need to account for offset columns which can extend the pattern higher
    // The offset columns shift by (3*s + g)/2
    // We need the pattern to cover from 0 to targetHeight
    // Formula: we need enough rows so that even offset columns cover the full height
    // For even columns: 2*s + (rows - 1) * (3*s + g) >= targetHeight
    // For odd columns (shifted): s + (3*s + g)/2 + (rows - 1) * (3*s + g) >= targetHeight
    // We use the stricter constraint (even columns)
    const numRows = Math.ceil((targetHeight - 2 * s) / (3 * s + g)) + 1;

    // Calculate actual pattern dimensions
    // The pattern needs to account for the offset columns extending lower
    // Odd columns are shifted down by (3*s + g)/2
    const maxYEvenCol = 2 * s + (numRows - 1) * (3 * s + g);
    const maxYOddCol = s + (3 * s + g) / 2 + (numRows - 1) * (3 * s + g);
    const patternWidth = hexWidth + (numColumns - 1) * (hexWidth / 2 + g);
    const patternHeight = Math.max(maxYEvenCol, maxYOddCol);

    const totalHexagons = numColumns * numRows;

    // Epoxy volume calculation (gaps only within the target rectangle area)
    const hexArea = ((3 * Math.sqrt(3)) / 2) * s * s;
    const totalHexArea = totalHexagons * hexArea;
    const patternArea = targetWidth * targetHeight; // Use target area for epoxy calculation
    const gapArea =
      patternArea - (totalHexArea * (targetWidth * targetHeight)) / (patternWidth * patternHeight);
    const epoxyVolume = gapArea * depth;

    // Convert volume to appropriate units
    let volumeSmall: number;
    let volumeLarge: number;

    if (unitSystem === 'metric') {
      volumeSmall = epoxyVolume;
      volumeLarge = epoxyVolume / 1000;
    } else {
      volumeSmall = epoxyVolume * 0.554113;
      volumeLarge = epoxyVolume / 231;
    }

    return {
      numColumns,
      numRows,
      patternWidth,
      patternHeight,
      totalHexagons,
      hexWidth,
      hexHeight,
      epoxyVolumeSmall: volumeSmall,
      epoxyVolumeLarge: volumeLarge,
    };
  }, [inputs, unitSystem]);

  const handleInputChange = (field: keyof HexagonInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  // SVG rendering
  const renderDiagram = () => {
    const { edgeSize, gap } = inputs;
    const { numColumns, numRows, patternWidth, patternHeight } = calculations;

    const padding = 40;
    const svgWidth = 800;
    const svgHeight = 600;
    const scale = Math.min(
      (svgWidth - 2 * padding) / patternWidth,
      (svgHeight - 2 * padding) / patternHeight
    );

    const scaledPatternWidth = patternWidth * scale;
    const scaledPatternHeight = patternHeight * scale;
    const offsetX = (svgWidth - scaledPatternWidth) / 2;
    const offsetY = (svgHeight - scaledPatternHeight) / 2;

    const hexagons: JSX.Element[] = [];
    const s = edgeSize;
    const g = gap;

    // Calculate the minimum Y to center the pattern
    let minY = s; // Even columns start at y = s
    let maxY = s + (numRows - 1) * (3 * s + g) + s; // Even columns end here

    if (numColumns > 1) {
      // Odd columns are offset
      const oddMinY = s + (3 * s + g) / 2;
      const oddMaxY = oddMinY + (numRows - 1) * (3 * s + g) + s;
      minY = Math.min(minY, oddMinY);
      maxY = Math.max(maxY, oddMaxY);
    }

    const actualPatternHeight = maxY - minY;
    const verticalOffset = (patternHeight - actualPatternHeight) / 2 - minY;

    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
        let x = (Math.sqrt(3) / 2) * s + col * ((Math.sqrt(3) / 2) * s + g);
        let y = s + row * (3 * s + g) + verticalOffset;

        if (col % 2 === 1) {
          y += (3 * s + g) / 2;
        }

        const points = generateHexagonPoints(x * scale + offsetX, y * scale + offsetY, s * scale);
        hexagons.push(
          <polygon
            key={`hex-${row}-${col}`}
            points={points}
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="1"
          />
        );
      }
    }

    // Target rectangle overlay - centered on the pattern
    const rectScaledWidth = inputs.targetWidth * scale;
    const rectScaledHeight = inputs.targetHeight * scale;
    const rectX = offsetX + (scaledPatternWidth - rectScaledWidth) / 2;
    const rectY = offsetY + (scaledPatternHeight - rectScaledHeight) / 2;

    return (
      <svg
        width={svgWidth}
        height={svgHeight}
        className="border border-gray-300 rounded-lg bg-gray-50"
      >
        {/* Target rectangle */}
        <rect
          x={rectX}
          y={rectY}
          width={rectScaledWidth}
          height={rectScaledHeight}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {hexagons}

        {/* Pattern boundary */}
        <rect
          x={offsetX}
          y={offsetY}
          width={scaledPatternWidth}
          height={scaledPatternHeight}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
        />

        <text
          x={offsetX + scaledPatternWidth / 2}
          y={offsetY - 10}
          textAnchor="middle"
          fill="#2563eb"
          fontSize="14"
          fontWeight="bold"
        >
          {patternWidth.toFixed(2)} {unitLabel}
        </text>
        <text
          x={offsetX - 10}
          y={offsetY + scaledPatternHeight / 2}
          textAnchor="end"
          fill="#2563eb"
          fontSize="14"
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {patternHeight.toFixed(2)} {unitLabel}
        </text>

        <text
          x={rectX + rectScaledWidth / 2}
          y={rectY - 5}
          textAnchor="middle"
          fill="#ef4444"
          fontSize="12"
          fontWeight="bold"
        >
          Target: {inputs.targetWidth} × {inputs.targetHeight} {unitLabel}
        </text>
      </svg>
    );
  };

  const generateHexagonPoints = (cx: number, cy: number, size: number): string => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 6 + (i * Math.PI) / 3;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push([x, y]);
    }
    return points.map((p) => p.join(',')).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Ruler className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-800">Hexagon Tabletop Calculator</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit System
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUnitSystem('imperial')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          unitSystem === 'imperial'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        Imperial
                      </button>
                      <button
                        onClick={() => setUnitSystem('metric')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          unitSystem === 'metric'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        Metric
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Target Dimensions</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Width ({unitLabel})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      value={inputs.targetWidth}
                      onChange={(e) => handleInputChange('targetWidth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Height ({unitLabel})
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      value={inputs.targetHeight}
                      onChange={(e) => handleInputChange('targetHeight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hexagon Edge Size ({unitLabel})
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={inputs.edgeSize}
                      onChange={(e) => handleInputChange('edgeSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gap Between Hexagons ({unitLabel})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={inputs.gap}
                      onChange={(e) => handleInputChange('gap', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depth ({unitLabel})
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={inputs.depth}
                      onChange={(e) => handleInputChange('depth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Diagram */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Pattern Preview
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Red dashed line = target dimensions, Hexagons extend beyond to fully cover
                </p>
                {renderDiagram()}
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Actual Pattern Size</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {calculations.patternWidth.toFixed(2)} × {calculations.patternHeight.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">{unitLabel}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Hexagon Layout</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {calculations.numColumns} × {calculations.numRows}
                  </p>
                  <p className="text-sm text-gray-600">columns × rows</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Hexagons</h3>
                  <p className="text-3xl font-bold text-gray-800">{calculations.totalHexagons}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Epoxy Required (Gaps)</h3>
                  <p className="text-xl font-bold text-gray-800">
                    {calculations.epoxyVolumeSmall.toFixed(2)} {volumeLabel}
                  </p>
                  <p className="text-sm text-gray-600">
                    ({calculations.epoxyVolumeLarge.toFixed(3)} {volumeLabelLarge})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexagonCalculator;
