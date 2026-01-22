/**
 * Rule Space Heatmap Visualization
 *
 * Creates 512×512 images where each pixel represents a rule,
 * colored by λ, D, or γ value.
 *
 * X-axis: birth mask (0-511)
 * Y-axis: survival mask (0-511)
 */

/**
 * Color maps for different value ranges
 */
const colorMaps = {
  // Blue to red (for lambda - stability to chaos)
  diverging: (t) => {
    // t in [0, 1]
    if (t < 0.5) {
      // Blue to white
      const s = t * 2;
      return { r: Math.floor(50 + 200 * s), g: Math.floor(100 + 150 * s), b: Math.floor(200 - 50 * s) };
    } else {
      // White to red
      const s = (t - 0.5) * 2;
      return { r: Math.floor(250 - 50 * s), g: Math.floor(250 - 200 * s), b: Math.floor(150 - 120 * s) };
    }
  },

  // Black to green to yellow (for dimension)
  viridis: (t) => {
    const r = Math.floor(68 + 187 * t);
    const g = Math.floor(1 + 180 * t + 75 * t * t);
    const b = Math.floor(84 - 50 * t + 50 * t * t);
    return { r: Math.min(255, r), g: Math.min(255, g), b: Math.min(255, b) };
  },

  // Purple to orange (for gamma)
  plasma: (t) => {
    const r = Math.floor(13 + 240 * t);
    const g = Math.floor(8 + 90 * t + 100 * t * t);
    const b = Math.floor(135 - 100 * t);
    return { r: Math.min(255, r), g: Math.min(255, g), b: Math.max(0, b) };
  },

  // Classification colors
  classification: (classification) => {
    switch (classification) {
      case 'extinct': return { r: 30, g: 30, b: 30 };
      case 'fixed': return { r: 50, g: 100, b: 130 };
      case 'periodic': return { r: 130, g: 100, b: 50 };
      case 'aperiodic': return { r: 50, g: 130, b: 50 };
      default: return { r: 50, g: 50, b: 50 };
    }
  }
};

/**
 * Create a heatmap canvas from survey data
 *
 * @param {Array} data - Array of survey results
 * @param {string} metric - Which metric to visualize: 'lambda', 'D', 'gamma', 'classification'
 * @param {Object} options - Configuration options
 * @returns {HTMLCanvasElement}
 */
export function createHeatmap(data, metric = 'lambda', options = {}) {
  const {
    width = 512,
    height = 512,
    colorMap = metric === 'lambda' ? 'diverging' : metric === 'D' ? 'viridis' : 'plasma',
    minValue = null,
    maxValue = null
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fill with background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  // Build lookup from rule_id -> data
  const dataMap = new Map();
  for (const d of data) {
    dataMap.set(d.rule_id, d);
  }

  // Compute value range if not specified
  let vMin = minValue;
  let vMax = maxValue;

  if (metric !== 'classification' && (vMin === null || vMax === null)) {
    const values = data.map(d => d[metric]).filter(v => v !== undefined && v > -10);
    if (values.length > 0) {
      vMin = vMin ?? Math.min(...values);
      vMax = vMax ?? Math.max(...values);
    } else {
      vMin = 0;
      vMax = 1;
    }
  }

  const range = vMax - vMin || 1;

  // Get color function
  const getColor = colorMaps[colorMap] || colorMaps.viridis;

  // Create image data
  const imageData = ctx.createImageData(width, height);
  const pixels = imageData.data;

  // Scale factors (512 positions -> 512 mask values)
  const scaleX = 512 / width;
  const scaleY = 512 / height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const birthMask = Math.floor(x * scaleX);
      const survivalMask = Math.floor(y * scaleY);
      const ruleId = birthMask * 512 + survivalMask;

      const d = dataMap.get(ruleId);
      let color;

      if (!d) {
        // No data for this rule
        color = { r: 20, g: 20, b: 20 };
      } else if (metric === 'classification') {
        color = colorMaps.classification(d.classification);
      } else {
        const value = d[metric];
        if (value === undefined || value <= -10) {
          color = { r: 20, g: 20, b: 20 };
        } else {
          const t = Math.max(0, Math.min(1, (value - vMin) / range));
          color = getColor(t);
        }
      }

      const i = (y * width + x) * 4;
      pixels[i] = color.r;
      pixels[i + 1] = color.g;
      pixels[i + 2] = color.b;
      pixels[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add axis labels
  ctx.fillStyle = '#666';
  ctx.font = '10px monospace';
  ctx.fillText('Birth →', 5, height - 5);
  ctx.save();
  ctx.translate(12, height - 5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Survival →', 0, 0);
  ctx.restore();

  return canvas;
}

/**
 * Create all three metric heatmaps
 */
export function createAllHeatmaps(data, options = {}) {
  return {
    lambda: createHeatmap(data, 'lambda', options),
    D: createHeatmap(data, 'D', options),
    gamma: createHeatmap(data, 'gamma', options),
    classification: createHeatmap(data, 'classification', options)
  };
}

/**
 * Add colorbar/legend to a canvas
 */
export function addColorbar(canvas, metric, minValue, maxValue, colorMap = 'viridis') {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const barWidth = 20;
  const barHeight = height - 60;
  const barX = width - 35;
  const barY = 30;

  const getColor = colorMaps[colorMap] || colorMaps.viridis;

  // Draw gradient bar
  for (let i = 0; i < barHeight; i++) {
    const t = 1 - (i / barHeight);
    const color = getColor(t);
    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.fillRect(barX, barY + i, barWidth, 1);
  }

  // Border
  ctx.strokeStyle = '#333';
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  // Labels
  ctx.fillStyle = '#666';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(maxValue.toFixed(2), barX + barWidth + 5, barY + 10);
  ctx.fillText(minValue.toFixed(2), barX + barWidth + 5, barY + barHeight);
  ctx.fillText(metric, barX, barY - 10);
}

/**
 * Download canvas as PNG
 */
export function downloadHeatmap(canvas, filename = 'heatmap.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Create combined visualization with all heatmaps
 */
export function createCombinedHeatmaps(data, options = {}) {
  const {
    size = 256
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = size * 2 + 30;
  canvas.height = size * 2 + 30;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create individual heatmaps
  const lambdaMap = createHeatmap(data, 'lambda', { width: size, height: size });
  const dMap = createHeatmap(data, 'D', { width: size, height: size });
  const gammaMap = createHeatmap(data, 'gamma', { width: size, height: size });
  const classMap = createHeatmap(data, 'classification', { width: size, height: size });

  // Draw them in a 2x2 grid
  ctx.drawImage(lambdaMap, 0, 0);
  ctx.drawImage(dMap, size + 10, 0);
  ctx.drawImage(gammaMap, 0, size + 10);
  ctx.drawImage(classMap, size + 10, size + 10);

  // Labels
  ctx.fillStyle = '#888';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('λ (Lyapunov)', size / 2, 15);
  ctx.fillText('D (Dimension)', size + 10 + size / 2, 15);
  ctx.fillText('γ (BDM Growth)', size / 2, size + 25);
  ctx.fillText('Classification', size + 10 + size / 2, size + 25);

  return canvas;
}
