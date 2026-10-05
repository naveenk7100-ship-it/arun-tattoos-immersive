import * as THREE from 'three';

/**
 * Creates soft volumetric light beams and realistic floating dust motes
 * for cinematic atmospheric studio lighting.
 */

export function createVolumetricLightBeam(
  height: number,
  radiusTop: number,
  radiusBottom: number,
  color: number = 0xffeedd,
  opacity: number = 0.15
): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32, 1, true);
  // Shift origin to top of cone
  geo.translate(0, -height / 2, 0);

  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'VolumetricLightBeam';
  return mesh;
}

export interface AtmosphericDustSystem {
  points: THREE.Points;
  update: (elapsedTime: number) => void;
}

export function createAtmosphericDustSystem(particleCount: number = 240): AtmosphericDustSystem {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Spread in the central active studio area
    positions[i] = (Math.random() - 0.5) * 16;
    positions[i + 1] = Math.random() * 5.2 + 0.2;
    positions[i + 2] = (Math.random() - 0.5) * 16;

    speeds[i] = (Math.random() - 0.5) * 0.003;
    speeds[i + 1] = Math.random() * 0.004 + 0.001; // gentle upward draft
    speeds[i + 2] = (Math.random() - 0.5) * 0.003;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Circular soft particle texture
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 32;
  pCanvas.height = 32;
  const pCtx = pCanvas.getContext('2d');
  if (pCtx) {
    const grad = pCtx.createRadialGradient(16, 16, 2, 16, 16, 15);
    grad.addColorStop(0, 'rgba(255, 235, 190, 1.0)');
    grad.addColorStop(0.5, 'rgba(255, 220, 160, 0.4)');
    grad.addColorStop(1, 'rgba(255, 200, 140, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 32, 32);
  }
  const pTexture = new THREE.CanvasTexture(pCanvas);

  const mat = new THREE.PointsMaterial({
    map: pTexture,
    size: 0.075,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);

  const update = (elapsedTime: number) => {
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] += Math.sin(elapsedTime * 0.4 + i) * 0.0015;
      pos[i + 1] += speeds[i + 1];
      pos[i + 2] += Math.cos(elapsedTime * 0.3 + i) * 0.0015;

      // Wrap around ceiling/floor
      if (pos[i + 1] > 6.0) pos[i + 1] = 0.3;
    }
    geo.attributes.position.needsUpdate = true;
  };

  return { points, update };
}
