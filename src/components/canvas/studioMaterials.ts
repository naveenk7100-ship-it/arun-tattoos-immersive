import * as THREE from 'three';

/**
 * Procedural texture and physically-based material generator for Arun Tattoos Virtual Studio
 * Creates authentic surface imperfections, terrazzo flecks, brushed steel, wood grain and leather
 * with ZERO external network requests or large image assets.
 */

// Helper to generate procedural terrazzo floor texture
function createTerrazzoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep matte charcoal base
  ctx.fillStyle = '#101014';
  ctx.fillRect(0, 0, 512, 512);

  // Micro surface noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.floor(Math.random() * 25 + 15);
    ctx.fillStyle = `rgb(${shade},${shade},${shade + 2})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Polished terrazzo stone flecks (graphite, bronze, muted cream)
  const fleckColors = [
    'rgba(35, 35, 42, 0.8)',
    'rgba(24, 24, 28, 0.9)',
    'rgba(45, 40, 32, 0.6)',
    'rgba(180, 150, 90, 0.25)', // subtle bronze fleck
    'rgba(70, 70, 80, 0.5)',
  ];

  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 3.5 + 1;
    ctx.fillStyle = fleckColors[Math.floor(Math.random() * fleckColors.length)];
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * (Math.random() * 0.6 + 0.4), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// Helper to generate brushed metal roughness texture
function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#888888';
  ctx.fillRect(0, 0, 256, 256);

  // Directional brush streaks
  for (let i = 0; i < 1200; i++) {
    const y = Math.random() * 256;
    const len = Math.random() * 80 + 30;
    const x = Math.random() * 256;
    const brightness = Math.floor(Math.random() * 50 + 100);
    ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
    ctx.fillRect(x, y, len, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Helper to generate charred wood / Shou Sugi Ban grain texture
function createCharredWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#161311';
  ctx.fillRect(0, 0, 256, 512);

  // Vertical wood fibers and grain lines
  for (let x = 0; x < 256; x += 2) {
    const shade = Math.floor(Math.random() * 15 + 16);
    ctx.fillStyle = `rgb(${shade},${shade - 2},${shade - 4})`;
    ctx.fillRect(x, 0, 1.5, 512);
  }

  // Soft wavy grain bands
  ctx.fillStyle = 'rgba(10, 8, 7, 0.4)';
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.ellipse(128, y, 120, 25, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Helper to generate soft leather micro-pore bump map
function createLeatherBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const shade = Math.random() > 0.5 ? 140 : 110;
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(x, y, 1.2, 1.2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Helper to generate fine architectural plaster bump texture
function createPlasterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Micro stipple and trowel marks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const v = Math.floor(128 + (Math.random() - 0.5) * 36);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// Helper to generate warm walnut grain texture
function createWalnutTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#342217';
  ctx.fillRect(0, 0, 256, 512);

  // Organic wood grain bands
  for (let y = 0; y < 512; y += 4) {
    const shadeR = Math.floor(45 + Math.sin(y * 0.04) * 12 + Math.random() * 8);
    const shadeG = Math.floor(30 + Math.sin(y * 0.04) * 8 + Math.random() * 6);
    const shadeB = Math.floor(20 + Math.sin(y * 0.04) * 6 + Math.random() * 5);
    ctx.fillStyle = `rgb(${shadeR},${shadeG},${shadeB})`;
    ctx.fillRect(0, y, 256, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export interface StudioMaterialSet {
  terrazzoFloor: THREE.MeshStandardMaterial;
  darkMatteWall: THREE.MeshStandardMaterial;
  charredWood: THREE.MeshStandardMaterial;
  walnutWood: THREE.MeshStandardMaterial;
  matteSteel: THREE.MeshStandardMaterial;
  leatherRecliner: THREE.MeshStandardMaterial;
  brushedStainlessSteel: THREE.MeshStandardMaterial;
  chromeHardware: THREE.MeshStandardMaterial;
  bronzeAccent: THREE.MeshStandardMaterial;
  goldTrim: THREE.MeshStandardMaterial;
  acrylicWhiteLightbox: THREE.MeshStandardMaterial;
  cintiqScreen: THREE.MeshStandardMaterial;
  flutedGlass: THREE.MeshPhysicalMaterial;
  frostedGlass: THREE.MeshPhysicalMaterial;
  ceramicGloss: THREE.MeshStandardMaterial;
  stencilCarbon: THREE.MeshStandardMaterial;
  shadowPlane: THREE.MeshBasicMaterial;
}

export function createStudioMaterials(): StudioMaterialSet {
  const terrazzoTex = createTerrazzoTexture();
  const brushedTex = createBrushedMetalTexture();
  const woodTex = createCharredWoodTexture();
  const walnutTex = createWalnutTexture();
  const leatherTex = createLeatherBumpTexture();
  const plasterTex = createPlasterTexture();

  // 1. Polished Terrazzo Floor with anisotropic reflection & micro roughness
  const terrazzoFloor = new THREE.MeshStandardMaterial({
    map: terrazzoTex,
    color: 0x141418,
    roughness: 0.28,
    metalness: 0.35,
    roughnessMap: terrazzoTex,
  });

  // 2. Matte Architectural Graphite Wall (chalky, non-reflective)
  const darkMatteWall = new THREE.MeshStandardMaterial({
    color: 0x0f0f13,
    roughness: 0.92,
    metalness: 0.08,
    bumpMap: plasterTex,
    bumpScale: 0.008,
  });

  // 3. Charred Timber / Dark Shou Sugi Ban Wood
  const charredWood = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0x1a1614,
    roughness: 0.65,
    metalness: 0.12,
  });

  // 3b. Warm Dark Walnut Wood (desks, consultation tables)
  const walnutWood = new THREE.MeshStandardMaterial({
    map: walnutTex,
    color: 0x3d271d,
    roughness: 0.55,
    metalness: 0.08,
  });

  // 3c. Matte Black Architectural Steel (partitions, frames, tracks)
  const matteSteel = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.42,
    metalness: 0.82,
  });

  // 4. Black Medical-Grade Nappa Leather
  const leatherRecliner = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.55,
    metalness: 0.18,
    bumpMap: leatherTex,
    bumpScale: 0.02,
  });

  // 5. Brushed Surgical Stainless Steel (Mayo trays, tool arms)
  const brushedStainlessSteel = new THREE.MeshStandardMaterial({
    color: 0xd8d8de,
    roughness: 0.24,
    metalness: 0.92,
    roughnessMap: brushedTex,
  });

  // 6. Mirror Chrome Hardware (telescoping hydraulic shafts, lamp springs)
  const chromeHardware = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.08,
    metalness: 0.98,
  });

  // 7. Brushed Architectural Bronze / Deep Antique Gold (Arun Tattoos Crest)
  const bronzeAccent = new THREE.MeshStandardMaterial({
    color: 0xc89d38,
    roughness: 0.32,
    metalness: 0.88,
    emissive: 0x241a06,
    emissiveIntensity: 0.3,
  });

  // 8. Warm Polished Gold Accent (threshold trims, frame fillets)
  const goldTrim = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.18,
    metalness: 0.95,
    emissive: 0x3d3008,
    emissiveIntensity: 0.35,
  });

  // 9. Translucent Illuminated White Acrylic (Design light-box)
  const acrylicWhiteLightbox = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.05,
    emissive: 0xe8f0fe,
    emissiveIntensity: 0.85,
  });

  // 10. Wacom Cintiq Glowing Display Glass
  const cintiqScreen = new THREE.MeshStandardMaterial({
    color: 0x182030,
    roughness: 0.1,
    metalness: 0.2,
    emissive: 0x22385c,
    emissiveIntensity: 0.65,
  });

  // 11. Industrial Ribbed Fluted Glass (Entrance door panels)
  const flutedGlass = new THREE.MeshPhysicalMaterial({
    color: 0x889098,
    metalness: 0.1,
    roughness: 0.35,
    transmission: 0.75,
    thickness: 0.8,
    transparent: true,
    opacity: 0.85,
  });

  // 11b. Architectural Frosted Privacy Glass (partition screens)
  const frostedGlass = new THREE.MeshPhysicalMaterial({
    color: 0xa0a8b0,
    metalness: 0.05,
    roughness: 0.52,
    transmission: 0.82,
    thickness: 0.6,
    transparent: true,
    opacity: 0.88,
  });

  // 11c. Glossy Ceramic Vitreous China (sink basin, planters)
  const ceramicGloss = new THREE.MeshStandardMaterial({
    color: 0x1a1a1f,
    roughness: 0.12,
    metalness: 0.15,
  });

  // 11d. Stencil Thermal Carbon Indigo/Violet
  const stencilCarbon = new THREE.MeshStandardMaterial({
    color: 0x4842a6,
    roughness: 0.6,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  });

  // 12. Soft Contact Shadow Plane under heavy furniture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const radGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    radGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = radGrad;
    sCtx.fillRect(0, 0, 128, 128);
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowPlane = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });

  return {
    terrazzoFloor,
    darkMatteWall,
    charredWood,
    walnutWood,
    matteSteel,
    leatherRecliner,
    brushedStainlessSteel,
    chromeHardware,
    bronzeAccent,
    goldTrim,
    acrylicWhiteLightbox,
    cintiqScreen,
    flutedGlass,
    frostedGlass,
    ceramicGloss,
    stencilCarbon,
    shadowPlane,
  };
}
