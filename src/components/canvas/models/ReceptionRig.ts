import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';
import { assetUrl } from '../../../utils/assetUrl';

/**
 * Architectural 3D model for Zone 02: Reception & Concierge
 * Accurate human architectural scale:
 * - 1.02m high monolithic charred timber reception counter with satin bronze slab
 * - Recessed warm 2700K LED ribbon beneath countertop overhang
 * - Prominent 0.70m diameter illuminated authentic ARUN TATTOOS architectural logo medallion
 * - Rear storage credenza cabinet behind reception desk
 * - Ergonomic reception swivel chair behind desk
 * - Client consultation iMac terminal with keyboard and desk pad
 * - Open leather-bound tattoo flash lookbook and brass business card holder
 * - Ceramic pen tumbler with fine-liners
 * - Lush snake plant (Sansevieria) in ribbed architectural ceramic planter
 * - Physically correct contact shadow plane grounding the desk to the floor
 */
export function createReceptionRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'ReceptionRig';
  group.position.set(0, 0, 0.45);

  // 1. Recessed Floor Plinth Baseboard (8cm height)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 0.82), materials.matteSteel);
  plinth.position.set(0, 0.04, 0);
  group.add(plinth);

  // Brushed brass accent reveal strip above plinth
  const plinthReveal = new THREE.Mesh(new THREE.BoxGeometry(3.52, 0.015, 0.83), materials.goldTrim);
  plinthReveal.position.set(0, 0.08, 0);
  group.add(plinthReveal);

  // 2. Monolithic Counter Body (Shou Sugi Ban Charred Wood)
  const deskBody = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.90, 0.90), materials.charredWood);
  deskBody.position.set(0, 0.53, 0);
  deskBody.castShadow = true;
  deskBody.receiveShadow = true;
  group.add(deskBody);

  // Vertical architectural fluted wood battens along front face
  for (let x = -1.75; x <= 1.75; x += 0.12) {
    // Leave center cavity clear for the logo medallion
    if (Math.abs(x) < 0.42) continue;

    const batten = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.88, 0.035), materials.walnutWood);
    batten.position.set(x, 0.53, 0.465);
    batten.castShadow = true;
    group.add(batten);
  }

  // 3. Floating Satin Bronze Countertop Top Surface (overhanging 8cm in front)
  const counterSlab = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.08, 1.06), materials.bronzeAccent);
  counterSlab.position.set(0, 1.02, 0);
  counterSlab.castShadow = true;
  counterSlab.receiveShadow = true;
  group.add(counterSlab);

  // Recessed warm 2700K linear LED strip lighting underneath counter overhang
  const ledStripLight = new THREE.PointLight(0xffdf99, 2.2, 3.2);
  ledStripLight.position.set(0, 0.96, 0.54);
  group.add(ledStripLight);

  // 4. AUTHENTIC ARUN TATTOOS ARCHITECTURAL LOGO SIGNBOARD
  // Prominently mounted on the front face of the reception desk
  const logoGroup = new THREE.Group();
  logoGroup.position.set(0, 0.54, 0.465);

  // Outer Cast Bronze Architectural Bezel Collar (0.74m outer diameter)
  const bezelGeo = new THREE.CylinderGeometry(0.37, 0.37, 0.035, 64);
  bezelGeo.rotateX(Math.PI / 2);
  const bezelMesh = new THREE.Mesh(bezelGeo, materials.goldTrim);
  bezelMesh.position.z = 0.015;
  logoGroup.add(bezelMesh);

  // Inner Dark Bronze Backplate (0.72m diameter)
  const backplateGeo = new THREE.CylinderGeometry(0.355, 0.355, 0.02, 64);
  backplateGeo.rotateX(Math.PI / 2);
  const backplateMesh = new THREE.Mesh(backplateGeo, materials.bronzeAccent);
  backplateMesh.position.z = 0.025;
  logoGroup.add(backplateMesh);

  // Front Circular Face Disc displaying Authentic Arun Tattoos Logo (0.70m diameter)
  const logoFaceGeo = new THREE.CylinderGeometry(0.345, 0.345, 0.012, 64);
  logoFaceGeo.rotateX(Math.PI / 2);
  const logoFaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.22,
    roughness: 0.28,
    emissive: 0x221808,
    emissiveIntensity: 0.45,
  });
  const logoFaceMesh = new THREE.Mesh(logoFaceGeo, logoFaceMat);
  logoFaceMesh.position.z = 0.033;
  logoGroup.add(logoFaceMesh);

  // Load authentic Arun Tattoos logo texture
  new THREE.TextureLoader().load(assetUrl('/images/branding/arun-tattoos-logo.jpg'), (logoTex) => {
    logoTex.colorSpace = THREE.SRGBColorSpace;
    logoFaceMat.map = logoTex;
    logoFaceMat.needsUpdate = true;
  });

  // Architectural Backlight Halo behind the logo medallion
  const logoBacklight = new THREE.PointLight(0xffdca0, 1.8, 2.0);
  logoBacklight.position.set(0, 0, -0.01);
  logoGroup.add(logoBacklight);

  group.add(logoGroup);

  // 5. Desktop Accessories:
  // Minimalist Client iMac / Consultation terminal on brushed aluminum swivel stand
  const imacGroup = new THREE.Group();
  imacGroup.position.set(0.98, 1.06, 0.05);
  imacGroup.rotation.y = -0.32;

  const imacStandBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.008, 0.16), materials.brushedStainlessSteel);
  imacStandBase.position.y = 0.004;
  imacGroup.add(imacStandBase);

  const imacStem = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.015), materials.brushedStainlessSteel);
  imacStem.position.set(0, 0.09, -0.02);
  imacStem.rotation.x = -0.2;
  imacGroup.add(imacStem);

  const displayBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.018), materials.matteSteel);
  displayBody.position.set(0, 0.26, 0);
  imacGroup.add(displayBody);

  const displayScreen = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.32, 0.005), materials.cintiqScreen);
  displayScreen.position.set(0, 0.26, 0.01);
  imacGroup.add(displayScreen);

  // Wireless keyboard & precision mouse on leather desk mat
  const deskPad = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.004, 0.26), materials.leatherRecliner);
  deskPad.position.set(0.05, 0.002, 0.16);
  imacGroup.add(deskPad);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.008, 0.1), materials.brushedStainlessSteel);
  keyboard.position.set(0, 0.006, 0.16);
  imacGroup.add(keyboard);

  const mouseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.08), materials.brushedStainlessSteel);
  mouseMesh.position.set(0.18, 0.008, 0.16);
  imacGroup.add(mouseMesh);

  group.add(imacGroup);

  // Open Leather-bound Tattoo Flash Portfolio / Lookbook on left side
  const lookbookGroup = new THREE.Group();
  lookbookGroup.position.set(-0.85, 1.06, 0.06);
  lookbookGroup.rotation.y = 0.18;

  const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.34), materials.leatherRecliner);
  lookbookGroup.add(bookCover);

  const bookPages = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.028, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.85 })
  );
  bookPages.position.y = 0.012;
  lookbookGroup.add(bookPages);

  group.add(lookbookGroup);

  // Solid Brass Business Card Holder
  const cardHolder = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.035, 0.07), materials.goldTrim);
  cardHolder.position.set(-1.4, 1.08, 0.12);
  cardHolder.rotation.y = -0.15;
  group.add(cardHolder);

  // Ceramic Pen Tumbler with Fine-liners
  const penPot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.042, 0.1, 16), materials.ceramicGloss);
  penPot.position.set(-1.48, 1.11, -0.15);
  group.add(penPot);

  const pen1 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 8), materials.chromeHardware);
  pen1.position.set(-1.48, 1.17, -0.15);
  pen1.rotation.z = 0.14;
  group.add(pen1);

  // 6. Rear Storage Credenza Cabinet behind the reception counter (z = -1.1m)
  const rearCabinet = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 0.45), materials.charredWood);
  rearCabinet.position.set(0, 0.425, -1.1);
  group.add(rearCabinet);

  // Satin brass handles on rear cabinet
  [-0.6, 0.6].forEach((xOff) => {
    const rHandle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.02), materials.goldTrim);
    rHandle.position.set(xOff, 0.55, -0.86);
    group.add(rHandle);
  });

  // 7. Ergonomic Swivel Reception Chair behind counter
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0.3, 0, -0.65);
  chairGroup.rotation.y = 0.15;

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.04), materials.chromeHardware);
    legMesh.position.set(Math.cos(angle) * 0.15, 0.06, Math.sin(angle) * 0.15);
    legMesh.rotation.y = -angle;
    chairGroup.add(legMesh);
  }

  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.38, 16), materials.chromeHardware);
  piston.position.y = 0.26;
  chairGroup.add(piston);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.09, 0.46), materials.leatherRecliner);
  seat.position.set(0, 0.48, 0);
  chairGroup.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.06), materials.leatherRecliner);
  backrest.position.set(0, 0.72, -0.2);
  chairGroup.add(backrest);

  group.add(chairGroup);

  // 8. Architectural Feature Plant (Snake Plant in textured ceramic pot)
  const plantGroup = new THREE.Group();
  plantGroup.position.set(-2.35, 0, 0.35);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.20, 0.58, 24), materials.ceramicGloss);
  pot.position.y = 0.29;
  pot.castShadow = true;
  plantGroup.add(pot);

  const leafMat = new THREE.MeshStandardMaterial({ color: 0x223825, roughness: 0.6, metalness: 0.1 });
  for (let i = 0; i < 11; i++) {
    const angle = (i * Math.PI * 2) / 11 + Math.random() * 0.2;
    const rad = 0.06 + Math.random() * 0.09;
    const leafHeight = 0.6 + Math.random() * 0.4;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.085, leafHeight, 0.012), leafMat);
    leaf.position.set(Math.cos(angle) * rad, 0.58 + leafHeight / 2, Math.sin(angle) * rad);
    leaf.rotation.y = angle;
    leaf.rotation.z = (Math.random() - 0.5) * 0.18;
    leaf.castShadow = true;
    plantGroup.add(leaf);
  }

  group.add(plantGroup);

  // 9. Ground Contact Shadow
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.8), materials.shadowPlane);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0, 0.008, -0.2);
  group.add(contactShadow);

  return group;
}
