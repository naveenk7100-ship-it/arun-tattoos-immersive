import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';
import { assetUrl } from '../../../utils/assetUrl';

/**
 * Architectural 3D model for Zone 02: Reception & Concierge
 * Accurate human architectural scale:
 * - 1.0m high monolithic charred timber reception counter with satin bronze slab
 * - Recessed warm 2700K LED ribbon beneath countertop overhang
 * - 3D embossed bronze Arun Tattoos crest plaque
 * - Rear storage cabinet credenza behind reception desk
 * - Ergonomic reception swivel chair behind desk
 * - Client consultation iMac terminal with keyboard and cable grommet
 * - Studio consultation brochures stacked neatly
 * - Open leather-bound flash lookbook and brass business card holder
 * - Snake plant (Sansevieria) in ribbed architectural ceramic planter
 */
export function createReceptionRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'ReceptionRig';
  group.position.set(0, 0, 0.4);

  // 1. Recessed Floor Plinth / Baseboard (10cm height)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 0.78), materials.matteSteel);
  plinth.position.set(0, 0.05, 0);
  group.add(plinth);

  // 2. Monolithic Counter Body (Shou Sugi Ban Charred Wood)
  const deskBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.88, 0.88), materials.charredWood);
  deskBody.position.set(0, 0.54, 0);
  deskBody.castShadow = true;
  deskBody.receiveShadow = true;
  group.add(deskBody);

  // Vertical fluted wood texture relief strips along front
  for (let x = -1.65; x <= 1.65; x += 0.15) {
    const batten = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.86, 0.03), materials.walnutWood);
    batten.position.set(x, 0.54, 0.45);
    group.add(batten);
  }

  // 3. Floating Satin Bronze Countertop Top Surface (overhanging 6cm)
  const counterSlab = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.06, 1.02), materials.bronzeAccent);
  counterSlab.position.set(0, 1.01, 0);
  counterSlab.castShadow = true;
  counterSlab.receiveShadow = true;
  group.add(counterSlab);

  // Recessed warm 2700K LED strip lighting right underneath counter overhang
  const ledStripLight = new THREE.PointLight(0xffdf99, 1.9, 2.8);
  ledStripLight.position.set(0, 0.95, 0.52);
  group.add(ledStripLight);

  // 4. Backlit Embossed Bronze "ARUN TATTOOS" Signboard Plate
  const plaqueBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.42, 0.04), materials.charredWood);
  plaqueBase.position.set(0, 0.58, 0.47);
  group.add(plaqueBase);

  const plaqueBronze = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.34, 0.025), materials.goldTrim);
  plaqueBronze.position.set(0, 0.58, 0.49);
  group.add(plaqueBronze);

  // Official Arun Tattoos Logo Medallion on Reception Desk
  const logoMedallionGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.015, 32);
  logoMedallionGeo.rotateX(Math.PI / 2);
  const logoMedallionMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.15,
    roughness: 0.35,
  });
  const logoMedallionMesh = new THREE.Mesh(logoMedallionGeo, logoMedallionMat);
  logoMedallionMesh.position.set(0, 0.58, 0.505);
  group.add(logoMedallionMesh);

  new THREE.TextureLoader().load(assetUrl('/images/branding/arun-tattoos-logo.jpg'), (logoTex) => {
    logoTex.colorSpace = THREE.SRGBColorSpace;
    logoMedallionMat.map = logoTex;
    logoMedallionMat.needsUpdate = true;
  });

  // 5. Desktop Accessories:
  // Minimalist Client iMac / Consultation terminal on brushed aluminum swivel stand
  const imacGroup = new THREE.Group();
  imacGroup.position.set(0.95, 1.04, 0.05);
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

  // Wireless keyboard & precision mouse on desk mat
  const deskPad = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.004, 0.25), materials.leatherRecliner);
  deskPad.position.set(0.05, 0.002, 0.16);
  imacGroup.add(deskPad);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.008, 0.1), materials.brushedStainlessSteel);
  keyboard.position.set(0, 0.006, 0.16);
  imacGroup.add(keyboard);

  const mouseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.08), materials.brushedStainlessSteel);
  mouseMesh.position.set(0.18, 0.008, 0.16);
  imacGroup.add(mouseMesh);

  // Cable grommet
  const cGrommet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.01, 12), materials.matteSteel);
  cGrommet.position.set(0, 0.005, -0.15);
  imacGroup.add(cGrommet);

  group.add(imacGroup);

  // Open Leather-bound Tattoo Flash Portfolio / Lookbook
  const lookbookGroup = new THREE.Group();
  lookbookGroup.position.set(-0.75, 1.04, 0.06);
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

  // Studio Consultation Brochures
  const brochureGroup = new THREE.Group();
  brochureGroup.position.set(0.15, 1.04, 0.15);

  const brochureHolder = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.08), materials.flutedGlass);
  brochureHolder.position.y = 0.04;
  brochureGroup.add(brochureHolder);

  const brochureStack = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.12, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xfaf5eb, roughness: 0.75 })
  );
  brochureStack.position.set(0, 0.06, 0);
  brochureGroup.add(brochureStack);

  group.add(brochureGroup);

  // Solid Brass Business Card Holder
  const cardHolder = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.035, 0.07), materials.goldTrim);
  cardHolder.position.set(-1.3, 1.06, 0.12);
  cardHolder.rotation.y = -0.15;
  group.add(cardHolder);

  // Ceramic Pen Tumbler with Fine-liners
  const penPot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.042, 0.1, 16), materials.ceramicGloss);
  penPot.position.set(-1.4, 1.09, -0.15);
  group.add(penPot);

  const pen1 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 8), materials.chromeHardware);
  pen1.position.set(-1.4, 1.15, -0.15);
  pen1.rotation.z = 0.14;
  group.add(pen1);

  // 6. Rear Storage Credenza Cabinet behind the reception counter (z = -1.1m)
  const rearCabinet = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.85, 0.45), materials.charredWood);
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
  plantGroup.position.set(-2.25, 0, 0.3);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.55, 24), materials.ceramicGloss);
  pot.position.y = 0.275;
  plantGroup.add(pot);

  const leafMat = new THREE.MeshStandardMaterial({ color: 0x223825, roughness: 0.6, metalness: 0.1 });
  for (let i = 0; i < 9; i++) {
    const angle = (i * Math.PI * 2) / 9 + Math.random() * 0.2;
    const rad = 0.06 + Math.random() * 0.08;
    const leafHeight = 0.55 + Math.random() * 0.35;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.08, leafHeight, 0.012), leafMat);
    leaf.position.set(Math.cos(angle) * rad, 0.55 + leafHeight / 2, Math.sin(angle) * rad);
    leaf.rotation.y = angle;
    leaf.rotation.z = (Math.random() - 0.5) * 0.15;
    plantGroup.add(leaf);
  }

  group.add(plantGroup);

  // 9. Ground Contact Shadow
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.6), materials.shadowPlane);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0, 0.008, -0.2);
  group.add(contactShadow);

  return group;
}
