import React, { useState, useMemo } from 'react';
import {
  Card,
  InputNumber,
  Row,
  Col,
  Statistic,
  Space,
  Typography,
  Segmented,
  Divider
} from 'antd';
import {
  ColumnWidthOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  DashboardOutlined
} from '@ant-design/icons';

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

    const padding = 80;
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

    const hexagons: React.JSX.Element[] = [];
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
        // Alternate between two gradients for visual variety
        const gradientId = (row + col) % 2 === 0 ? 'woodGradient' : 'woodGradient2';
        hexagons.push(
          <polygon
            key={`hex-${row}-${col}`}
            points={points}
            fill={`url(#${gradientId})`}
            stroke="#654321"
            strokeWidth="1.5"
            filter="url(#hexShadow)"
            opacity="0.95"
            className="transition-opacity hover:opacity-100"
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
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          background: '#fafafa',
          display: 'block'
        }}
      >
        {/* Define gradients for hexagons */}
        <defs>
          <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#D2691E', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="woodGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#CD853F', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#A0522D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="hexShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Background grid pattern */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

        {/* Target rectangle */}
        <rect
          x={rectX}
          y={rectY}
          width={rectScaledWidth}
          height={rectScaledHeight}
          fill="none"
          stroke="#ff4d4f"
          strokeWidth="3"
          strokeDasharray="8,4"
          opacity="0.8"
        />

        {hexagons}

        {/* Pattern boundary */}
        <rect
          x={offsetX}
          y={offsetY}
          width={scaledPatternWidth}
          height={scaledPatternHeight}
          fill="none"
          stroke="#1890ff"
          strokeWidth="3"
          opacity="0.8"
        />

        {/* Pattern width label with white outline */}
        <text
          x={offsetX + scaledPatternWidth / 2}
          y={offsetY - 10}
          textAnchor="middle"
          stroke="white"
          strokeWidth="4"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {patternWidth.toFixed(2)} {unitLabel}
        </text>
        <text
          x={offsetX + scaledPatternWidth / 2}
          y={offsetY - 10}
          textAnchor="middle"
          fill="#1890ff"
          fontSize="14"
          fontWeight="bold"
        >
          {patternWidth.toFixed(2)} {unitLabel}
        </text>

        {/* Pattern height label with white outline */}
        <text
          x={offsetX - 10}
          y={offsetY + scaledPatternHeight / 2}
          textAnchor="end"
          stroke="white"
          strokeWidth="4"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {patternHeight.toFixed(2)} {unitLabel}
        </text>
        <text
          x={offsetX - 10}
          y={offsetY + scaledPatternHeight / 2}
          textAnchor="end"
          fill="#1890ff"
          fontSize="14"
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {patternHeight.toFixed(2)} {unitLabel}
        </text>

        {/* Target label with white outline */}
        <text
          x={rectX + rectScaledWidth / 2}
          y={rectY - 5}
          textAnchor="middle"
          stroke="white"
          strokeWidth="4"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          Target: {inputs.targetWidth} × {inputs.targetHeight} {unitLabel}
        </text>
        <text
          x={rectX + rectScaledWidth / 2}
          y={rectY - 5}
          textAnchor="middle"
          fill="#ff4d4f"
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

  const { Title, Text } = Typography;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <Card
          style={{ marginBottom: 24 }}
          variant="borderless"
        >
          <Space orientation="vertical" size="small">
            <Title level={2} style={{ margin: 0 }}>
              <AppstoreOutlined /> Hexagon Tabletop Calculator
            </Title>
            <Text type="secondary">Design your perfect hexagonal pattern for woodworking projects</Text>
          </Space>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Left Column - Inputs */}
          <Col xs={24} lg={8}>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              {/* Settings Card */}
              <Card title={<><ColumnWidthOutlined /> Settings</>} variant="borderless">
                <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Unit System</Text>
                    <Segmented
                      options={[
                        { label: 'Imperial (in)', value: 'imperial' },
                        { label: 'Metric (cm)', value: 'metric' }
                      ]}
                      value={unitSystem}
                      onChange={(value) => setUnitSystem(value as UnitSystem)}
                      block
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </Space>
              </Card>

              {/* Dimensions Card */}
              <Card title={<><DashboardOutlined /> Dimensions</>} variant="borderless">
                <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Target Width ({unitLabel})</Text>
                    <InputNumber
                      id="targetWidth"
                      min={1}
                      step={0.1}
                      value={inputs.targetWidth}
                      onChange={(value) => handleInputChange('targetWidth', String(value || 0))}
                      style={{ width: '100%', marginTop: 8 }}
                      size="large"
                    />
                  </div>

                  <div>
                    <Text strong>Target Height ({unitLabel})</Text>
                    <InputNumber
                      id="targetHeight"
                      min={1}
                      step={0.1}
                      value={inputs.targetHeight}
                      onChange={(value) => handleInputChange('targetHeight', String(value || 0))}
                      style={{ width: '100%', marginTop: 8 }}
                      size="large"
                    />
                  </div>

                  <Divider />

                  <div>
                    <Text strong>Hexagon Edge Size ({unitLabel})</Text>
                    <InputNumber
                      id="edgeSize"
                      min={0.1}
                      step={0.1}
                      value={inputs.edgeSize}
                      onChange={(value) => handleInputChange('edgeSize', String(value || 0))}
                      style={{ width: '100%', marginTop: 8 }}
                      size="large"
                    />
                  </div>

                  <div>
                    <Text strong>Gap Between Hexagons ({unitLabel})</Text>
                    <InputNumber
                      id="gap"
                      min={0}
                      step={0.01}
                      value={inputs.gap}
                      onChange={(value) => handleInputChange('gap', String(value || 0))}
                      style={{ width: '100%', marginTop: 8 }}
                      size="large"
                    />
                  </div>

                  <div>
                    <Text strong>Depth ({unitLabel})</Text>
                    <InputNumber
                      id="depth"
                      min={0.1}
                      step={0.1}
                      value={inputs.depth}
                      onChange={(value) => handleInputChange('depth', String(value || 0))}
                      style={{ width: '100%', marginTop: 8 }}
                      size="large"
                    />
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>

          {/* Right Column - Diagram and Results */}
          <Col xs={24} lg={16}>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              {/* Pattern Preview Card */}
              <Card
                title={<><AppstoreOutlined /> Pattern Preview</>}
                variant="borderless"
              >
                <div style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: 8 }}>
                  <Space size="middle">
                    <Space size="small">
                      <div style={{ width: 20, height: 3, background: '#ff4d4f', borderStyle: 'dashed', border: '1px dashed #ff4d4f' }} />
                      <Text>Target dimensions</Text>
                    </Space>
                    <Space size="small">
                      <div style={{ width: 20, height: 3, background: '#1890ff' }} />
                      <Text>Pattern boundary</Text>
                    </Space>
                  </Space>
                </div>
                {renderDiagram()}
              </Card>

              {/* Results Card */}
              <Card title={<><BgColorsOutlined /> Results</>} variant="borderless">
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={12}>
                    <Statistic
                      title="Actual Pattern Size"
                      value={`${calculations.patternWidth.toFixed(2)} × ${calculations.patternHeight.toFixed(2)}`}
                      suffix={unitLabel}
                      styles={{ content: { color: '#52c41a' } }}
                    />
                  </Col>
                  <Col xs={12} sm={12}>
                    <Statistic
                      title="Hexagon Layout"
                      value={`${calculations.numColumns} × ${calculations.numRows}`}
                      suffix="cols × rows"
                      styles={{ content: { color: '#722ed1' } }}
                    />
                  </Col>
                  <Col xs={12} sm={12}>
                    <Statistic
                      title="Total Hexagons"
                      value={calculations.totalHexagons}
                      styles={{ content: { color: '#fa8c16', fontSize: 32 } }}
                    />
                  </Col>
                  <Col xs={12} sm={12}>
                    <Statistic
                      title="Epoxy Required"
                      value={calculations.epoxyVolumeSmall.toFixed(2)}
                      suffix={volumeLabel}
                      styles={{ content: { color: '#1890ff' } }}
                      prefix={<BgColorsOutlined />}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({calculations.epoxyVolumeLarge.toFixed(3)} {volumeLabelLarge})
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HexagonCalculator;
