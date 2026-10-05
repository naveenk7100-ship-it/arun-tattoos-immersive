import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';
import { assetUrl } from '../../../utils/assetUrl';

/**
 * Procedural high-resolution canvas texture generators for Arun Tattoos Art Gallery
 * Creates authentic high-contrast black & grey tattoo artwork with fine linework,
 * sacred geometry, and stippling without external network latency.
 */
function createShivaArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep museum canvas background
  const bgGrad = ctx.createRadialGradient(256, 384, 50, 256, 384, 400);
  bgGrad.addColorStop(0, '#1c1c22');
  bgGrad.addColorStop(0.7, '#0d0d10');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 768);

  // Sacred Moon Crescent behind head
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(280, 260, 95, -0.6, 2.2);
  ctx.stroke();

  // Sacred Trishula (Trident) central axis
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(256, 120);
  ctx.lineTo(256, 680);
  ctx.stroke();

  // Trishula prongs
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(210, 180);
  ctx.quadraticCurveTo(210, 250, 256, 260);
  ctx.quadraticCurveTo(302, 250, 302, 180);
  ctx.stroke();

  // Concentric Sacred Halo Rings
  for (let r = 70; r <= 190; r += 30) {
    ctx.strokeStyle = `rgba(255, 230, 160, ${0.35 - (r / 600)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(256, 300, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Sacred Ash Vibhuti 3 Horizontal Lines on Forehead
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(206, 360 + i * 14, 100, 5);
  }
  // Vermilion Kumkum Dot
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(256, 375, 6, 0, Math.PI * 2);
  ctx.fill();

  // Stylized Lord Shiva profile linework & sacred matted locks (Jata)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Nose & brow curve
  ctx.moveTo(256, 350);
  ctx.lineTo(268, 430);
  ctx.lineTo(252, 455);
  ctx.lineTo(262, 490);
  ctx.lineTo(248, 520);
  ctx.stroke();

  // Meditative closed eye
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(235, 415, 18, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Stippled dotwork shading texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  for (let i = 0; i < 3000; i++) {
    const rx = 256 + (Math.random() - 0.5) * 260;
    const ry = 384 + (Math.random() - 0.5) * 450;
    ctx.fillRect(rx, ry, 1.2, 1.2);
  }

  // Arun Tattoos signature insignia
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 13px serif';
  ctx.fillText('ARUN TATTOOS • SACRED DEVOTIONAL', 135, 730);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createPortraitArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const bgGrad = ctx.createRadialGradient(256, 350, 40, 256, 350, 360);
  bgGrad.addColorStop(0, '#221e1a');
  bgGrad.addColorStop(0.7, '#100e0d');
  bgGrad.addColorStop(1, '#060505');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 700);

  // Hyper-realism Portrait Chiaroscuro shading
  ctx.fillStyle = 'rgba(240, 215, 190, 0.7)';
  ctx.beginPath();
  ctx.ellipse(256, 330, 110, 150, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shadow mask
  const shadowGrad = ctx.createLinearGradient(160, 200, 350, 480);
  shadowGrad.addColorStop(0, 'rgba(10, 8, 8, 0.05)');
  shadowGrad.addColorStop(0.5, 'rgba(10, 8, 8, 0.65)');
  shadowGrad.addColorStop(1, 'rgba(5, 4, 4, 0.95)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(256, 330, 112, 152, 0, 0, Math.PI * 2);
  ctx.fill();

  // Photorealistic Eye & Iris
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(215, 310, 24, 12, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e1b18';
  ctx.beginPath();
  ctx.arc(215, 310, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(218, 308, 3, 0, Math.PI * 2);
  ctx.fill();

  // Realistic hair & beard flowing strokes
  ctx.strokeStyle = '#38322c';
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 180; i++) {
    ctx.beginPath();
    const startX = 170 + Math.random() * 170;
    const startY = 400 + Math.random() * 50;
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (Math.random() - 0.5) * 30, startY + 60, startX + (Math.random() - 0.5) * 40, startY + 140);
    ctx.stroke();
  }

  // Signature
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 13px serif';
  ctx.fillText('ARUN TATTOOS • CUSTOM PORTRAITURE', 125, 665);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createBotanicalArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#0a0d0c';
  ctx.fillRect(0, 0, 512, 700);

  // Single-Needle Fine Line Peony & Foliage
  ctx.strokeStyle = '#e2f0e6';
  ctx.lineWidth = 1.8;

  // Center flower petals
  for (let layer = 5; layer >= 1; layer--) {
    const petals = 6 + layer * 2;
    const rad = 25 + layer * 22;
    for (let p = 0; p < petals; p++) {
      const angle = (p * Math.PI * 2) / petals;
      ctx.beginPath();
      ctx.arc(256 + Math.cos(angle) * rad, 320 + Math.sin(angle) * rad, 32, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Stems and leaves
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(256, 450);
  ctx.quadraticCurveTo(240, 540, 270, 620);
  ctx.stroke();

  // Fine line geometric framing rhombus
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(256, 120);
  ctx.lineTo(400, 340);
  ctx.lineTo(256, 560);
  ctx.lineTo(112, 340);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 13px serif';
  ctx.fillText('ARUN TATTOOS • MICRO REALISM & BOTANICAL', 105, 665);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createMandalaArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#0c0a10';
  ctx.fillRect(0, 0, 512, 700);

  // Concentric Sacred Mandala with 12-fold symmetry
  const cx = 256;
  const cy = 340;

  for (let r = 25; r <= 210; r += 28) {
    ctx.strokeStyle = r % 56 === 0 ? '#d4af37' : '#94a3b8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Sacred petal flourishes
    const count = Math.floor(r / 10) * 2;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Radiant dotwork rays
  ctx.fillStyle = '#ffffff';
  for (let a = 0; a < 24; a++) {
    const angle = (a * Math.PI * 2) / 24;
    for (let dist = 70; dist < 240; dist += 12) {
      ctx.fillRect(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 1.5, 1.5);
    }
  }

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 13px serif';
  ctx.fillText('ARUN TATTOOS • SACRED MANDALA SLEEVE', 115, 665);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Museum-grade 3D Art Gallery wall rig for Zone 03
 * Accurate human architectural scale:
 * - Museum hanging center standard at 1.65m eye level
 * - 4 curated masterpieces with procedural high-res artwork textures
 * - Multi-tier charred ash & gold fillet frames
 * - Individual brass gooseneck picture lights with focused downward beam
 * - Laser-engraved brass museum accession cards beneath each piece
 * - Architectural gallery viewing bench with tufted black leather cushion in the corridor
 */
export function createGalleryWallRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'GalleryWallRig';

  // Generate authentic masterwork textures
  const shivaTex = createShivaArtTexture();
  const portraitTex = createPortraitArtTexture();
  const botanicalTex = createBotanicalArtTexture();
  const mandalaTex = createMandalaArtTexture();

  const artworks = [
    { z: -2.4, title: 'Lord Shiva Mahakal Trishul', width: 1.25, height: 1.7, texture: shivaTex, imgUrl: assetUrl('/images/gallery/shiva-mahakal-trishul.png') },
    { z: -0.2, title: 'Hyper-Realism Portrait Tribute', width: 1.15, height: 1.55, texture: portraitTex, imgUrl: assetUrl('/images/gallery/realism-portrait-tribute.png') },
    { z: 2.0, title: 'Compass & Geometric Band', width: 0.95, height: 1.35, texture: botanicalTex, imgUrl: assetUrl('/images/gallery/compass-geometric-band.png') },
    { z: 4.2, title: 'Goddess Kali Sacred Backpiece', width: 1.2, height: 1.6, texture: mandalaTex, imgUrl: assetUrl('/images/gallery/kali-goddess-backpiece.jpg') },
  ];

  const EYE_LEVEL_Y = 1.65; // Standard international museum hanging centerline

  artworks.forEach((art) => {
    const artGroup = new THREE.Group();
    artGroup.position.set(-6.15, EYE_LEVEL_Y, art.z);

    // 1. Deep Beveled Charred Ash Outer Frame
    const frameOuter = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, art.height + 0.2, art.width + 0.2),
      materials.charredWood
    );
    frameOuter.castShadow = true;
    artGroup.add(frameOuter);

    // 2. Inner Brushed Gold Leaf Fillet
    const innerGold = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, art.height + 0.04, art.width + 0.04),
      materials.goldTrim
    );
    artGroup.add(innerGold);

    // 3. Archival Textured Mat Board & Canvas with Artwork Texture
    const canvasMat = new THREE.MeshStandardMaterial({
      map: art.texture,
      roughness: 0.38,
      metalness: 0.12,
      emissive: 0x111115,
      emissiveIntensity: 0.2,
    });

    if (art.imgUrl) {
      new THREE.TextureLoader().load(art.imgUrl, (realTex) => {
        realTex.colorSpace = THREE.SRGBColorSpace;
        canvasMat.map = realTex;
        canvasMat.needsUpdate = true;
      });
    }

    const canvasPlane = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, art.height - 0.02, art.width - 0.02),
      canvasMat
    );
    canvasPlane.position.x = 0.045;
    artGroup.add(canvasPlane);

    // 4. Solid Brass Curved Gooseneck Picture Spotlight mounted above
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.28, 12),
      materials.goldTrim
    );
    lampStem.position.set(0.18, art.height / 2 + 0.22, 0);
    lampStem.rotation.z = Math.PI / 3.2;
    artGroup.add(lampStem);

    // Horizontal tubular brass reflector hood
    const lampReflector = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.38, 16),
      materials.goldTrim
    );
    lampReflector.position.set(0.28, art.height / 2 + 0.32, 0);
    lampReflector.rotation.x = Math.PI / 2;
    artGroup.add(lampReflector);

    // Focused downward picture spotlight
    const pictureSpot = new THREE.SpotLight(0xffeed6, 2.2, 3.8);
    pictureSpot.position.set(0.3, art.height / 2 + 0.3, 0);
    pictureSpot.target.position.set(0.05, 0, 0);
    pictureSpot.angle = Math.PI / 4.2;
    pictureSpot.penumbra = 0.65;
    artGroup.add(pictureSpot);
    artGroup.add(pictureSpot.target);

    // 5. Laser-engraved Brass Identification Plaque underneath
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.07, 0.22),
      materials.goldTrim
    );
    plaque.position.set(0.06, -(art.height / 2 + 0.18), 0);
    artGroup.add(plaque);

    group.add(artGroup);
  });

  // 6. Minimalist Gallery Viewing Bench in the corridor
  const benchGroup = new THREE.Group();
  benchGroup.position.set(-4.2, 0, 1.0);

  // Charred timber bench plinth
  const benchBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 1.8), materials.charredWood);
  benchBase.position.y = 0.16;
  benchBase.castShadow = true;
  benchBase.receiveShadow = true;
  benchGroup.add(benchBase);

  // Recessed brass reveal strip between base and cushion
  const benchReveal = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.02, 1.76), materials.goldTrim);
  benchReveal.position.y = 0.33;
  benchGroup.add(benchReveal);

  // Tufted black leather cushion top (sitting height 0.45m)
  const benchCushion = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 1.84), materials.leatherRecliner);
  benchCushion.position.y = 0.4;
  benchCushion.castShadow = true;
  benchGroup.add(benchCushion);

  // Ground shadow under bench
  const benchShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.2), materials.shadowPlane);
  benchShadow.rotation.x = -Math.PI / 2;
  benchShadow.position.set(0, 0.008, 0);
  benchGroup.add(benchShadow);

  group.add(benchGroup);

  return group;
}
