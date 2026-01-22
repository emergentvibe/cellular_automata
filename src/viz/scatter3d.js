/**
 * 3D Scatter Plot for (λ, D, γ) space
 *
 * Uses Three.js for WebGL rendering
 * Each point represents a rule, colored by classification
 */

/**
 * Create a 3D scatter plot visualization
 *
 * @param {HTMLElement} container - DOM element to render into
 * @param {Array} data - Array of {lambda, D, gamma, classification, rule_string, ...}
 * @param {Object} options - Configuration options
 */
export function createScatter3D(container, data, options = {}) {
  const {
    width = container.clientWidth || 800,
    height = container.clientHeight || 600,
    pointSize = 2,
    showAxes = true,
    showLabels = true,
    knownRules = ['B3/S23', 'B2/S', 'B36/S23', 'B3678/S34678']
  } = options;

  // Check if Three.js is available
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded. Include it before using scatter3d.');
    container.innerHTML = '<p style="color: #f66;">Three.js required for 3D visualization</p>';
    return null;
  }

  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(3, 3, 3);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Controls (if OrbitControls available)
  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  // Color map for classifications
  const classColors = {
    extinct: 0x333333,
    fixed: 0x3388aa,
    periodic: 0xaa8833,
    aperiodic: 0x33aa33
  };

  // Normalize data to [-1, 1] range for visualization
  const lambdas = data.map(d => d.lambda).filter(l => l > -10);
  const dims = data.map(d => d.D);
  const gammas = data.map(d => d.gamma);

  const lambdaMin = Math.min(...lambdas);
  const lambdaMax = Math.max(...lambdas);
  const dimMin = Math.min(...dims);
  const dimMax = Math.max(...dims);
  const gammaMin = Math.min(...gammas);
  const gammaMax = Math.max(...gammas);

  const normalize = (val, min, max) => {
    if (max === min) return 0;
    return ((val - min) / (max - min)) * 2 - 1;
  };

  // Create points
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  for (const d of data) {
    if (d.lambda <= -10) continue;  // Skip healed points

    const x = normalize(d.lambda, lambdaMin, lambdaMax);
    const y = normalize(d.D, dimMin, dimMax);
    const z = normalize(d.gamma, gammaMin, gammaMax);

    positions.push(x, y, z);

    const color = new THREE.Color(classColors[d.classification] || 0x666666);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: pointSize * 0.01,
    vertexColors: true,
    transparent: true,
    opacity: 0.7
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Axes
  if (showAxes) {
    const axesHelper = new THREE.AxesHelper(1.2);
    scene.add(axesHelper);

    // Axis labels using sprites
    if (showLabels) {
      const createLabel = (text, position) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        ctx.fillStyle = '#666666';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, 64, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(0.5, 0.25, 1);
        return sprite;
      };

      scene.add(createLabel('λ', new THREE.Vector3(1.4, 0, 0)));
      scene.add(createLabel('D', new THREE.Vector3(0, 1.4, 0)));
      scene.add(createLabel('γ', new THREE.Vector3(0, 0, 1.4)));
    }
  }

  // Highlight known rules
  const highlightGeometry = new THREE.BufferGeometry();
  const highlightPositions = [];
  const highlightLabels = [];

  for (const d of data) {
    if (knownRules.includes(d.rule_string)) {
      const x = normalize(d.lambda, lambdaMin, lambdaMax);
      const y = normalize(d.D, dimMin, dimMax);
      const z = normalize(d.gamma, gammaMin, gammaMax);
      highlightPositions.push(x, y, z);
      highlightLabels.push({ text: d.rule_string, pos: new THREE.Vector3(x, y, z) });
    }
  }

  if (highlightPositions.length > 0) {
    highlightGeometry.setAttribute('position', new THREE.Float32BufferAttribute(highlightPositions, 3));
    const highlightMaterial = new THREE.PointsMaterial({
      size: pointSize * 0.03,
      color: 0xff6644
    });
    const highlights = new THREE.Points(highlightGeometry, highlightMaterial);
    scene.add(highlights);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Handle resize
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // Return control object
  return {
    scene,
    camera,
    renderer,
    controls,
    dispose: () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    },
    setPointSize: (size) => {
      material.size = size * 0.01;
    },
    highlightRule: (ruleString) => {
      // Find and highlight specific rule
      for (const d of data) {
        if (d.rule_string === ruleString) {
          camera.lookAt(
            normalize(d.lambda, lambdaMin, lambdaMax),
            normalize(d.D, dimMin, dimMax),
            normalize(d.gamma, gammaMin, gammaMax)
          );
          break;
        }
      }
    }
  };
}

/**
 * Create a 2D projection scatter plot (for simpler visualization without Three.js)
 */
export function createScatter2D(canvas, data, options = {}) {
  const {
    xAxis = 'lambda',
    yAxis = 'D',
    pointRadius = 2,
    showGrid = true
  } = options;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  // Clear
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  // Filter valid data
  const validData = data.filter(d => d[xAxis] > -10 && d[yAxis] !== undefined);

  if (validData.length === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('No data to display', width / 2, height / 2);
    return;
  }

  // Compute ranges
  const xValues = validData.map(d => d[xAxis]);
  const yValues = validData.map(d => d[yAxis]);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  // Scale functions
  const scaleX = (val) => padding + ((val - xMin) / xRange) * (width - 2 * padding);
  const scaleY = (val) => height - padding - ((val - yMin) / yRange) * (height - 2 * padding);

  // Classification colors
  const classColors = {
    extinct: '#444444',
    fixed: '#4488aa',
    periodic: '#aa8844',
    aperiodic: '#44aa44'
  };

  // Draw grid
  if (showGrid) {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * (width - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
  }

  // Draw axes
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#666';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(xAxis, width / 2, height - 10);

  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yAxis, 0, 0);
  ctx.restore();

  // Draw points
  for (const d of validData) {
    const x = scaleX(d[xAxis]);
    const y = scaleY(d[yAxis]);

    ctx.fillStyle = classColors[d.classification] || '#666';
    ctx.beginPath();
    ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw range labels
  ctx.fillStyle = '#444';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(xMin.toFixed(2), padding, height - padding + 15);
  ctx.textAlign = 'right';
  ctx.fillText(xMax.toFixed(2), width - padding, height - padding + 15);
  ctx.textAlign = 'left';
  ctx.fillText(yMax.toFixed(2), padding + 5, padding + 5);
  ctx.fillText(yMin.toFixed(2), padding + 5, height - padding - 5);
}
