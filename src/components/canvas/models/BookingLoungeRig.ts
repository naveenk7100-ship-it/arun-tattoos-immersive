import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';

/**
 * Architectural 3D model for Zone 07: Booking & Consultation Lounge
 * Accurate human architectural scale:
 * - Mid-century tufted black leather sofa & matching armchair
 * - Smoked glass & brass round coffee table (0.42m height)
 * - Hardcover consultation lookbook & pricing portfolio
 * - Sculptural brass arc floor lamp with warm 2700K pool of light
 * - Lush potted Monstera plant in ribbed brass planter
 */
export function createBookingLoungeRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'BookingLoungeRig';
  group.position.set(4.6, 0, 0.4);

  // 1. Black Nappa Leather Lounge Sofa (Seat height 0.42m)
  const sofaGroup = new THREE.Group();
  sofaGroup.position.set(0.65, 0, -0.3);
  sofaGroup.rotation.y = -0.15;

  // Slender brushed brass legs
  [
    [-0.85, -0.42], [0.85, -0.42],
    [-0.85, 0.42], [0.85, 0.42],
  ].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.22, 12), materials.goldTrim);
    leg.position.set(x, 0.11, z);
    sofaGroup.add(leg);
  });

  // Main thick leather seat cushion
  const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.22, 0.95), materials.leatherRecliner);
  seatCushion.position.set(0, 0.32, 0);
  seatCushion.castShadow = true;
  seatCushion.receiveShadow = true;
  sofaGroup.add(seatCushion);

  // Tufted backrest cushion
  const backCushion = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.44, 0.22), materials.leatherRecliner);
  backCushion.position.set(0, 0.58, -0.38);
  backCushion.castShadow = true;
  sofaGroup.add(backCushion);

  // Armrests (left & right)
  [-0.96, 0.96].forEach((xOffset) => {
    const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.95), materials.leatherRecliner);
    armrest.position.set(xOffset, 0.48, 0);
    sofaGroup.add(armrest);
  });

  group.add(sofaGroup);

  // 2. Matching Leather Armchair (angled toward coffee table)
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-0.75, 0, 0.85);
  chairGroup.rotation.y = 1.95;

  // Brass legs
  [
    [-0.38, -0.38], [0.38, -0.38],
    [-0.38, 0.38], [0.38, 0.38],
  ].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.011, 0.22, 12), materials.goldTrim);
    leg.position.set(x, 0.11, z);
    chairGroup.add(leg);
  });

  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.2, 0.82), materials.leatherRecliner);
  chairSeat.position.set(0, 0.31, 0);
  chairGroup.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.42, 0.18), materials.leatherRecliner);
  chairBack.position.set(0, 0.56, -0.34);
  chairGroup.add(chairBack);

  group.add(chairGroup);

  // 3. Smoked Glass & Brass Round Coffee Table (0.42m height)
  const tableGroup = new THREE.Group();
  tableGroup.position.set(-0.25, 0, 0.2);

  // Three angled brass legs
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 12), materials.goldTrim);
    leg.position.set(Math.cos(angle) * 0.32, 0.21, Math.sin(angle) * 0.32);
    leg.rotation.z = Math.cos(angle) * 0.08;
    tableGroup.add(leg);
  }

  // Smoked glass circular top
  const glassTop = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.025, 32), materials.flutedGlass);
  glassTop.position.y = 0.42;
  tableGroup.add(glassTop);

  // Hardcover Consultation Lookbook on table
  const lookbook = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.22), materials.charredWood);
  lookbook.position.set(0.05, 0.44, 0.02);
  lookbook.rotation.y = 0.28;
  tableGroup.add(lookbook);

  group.add(tableGroup);

  // 4. Sculptural Brass Arc Floor Lamp
  const arcLamp = new THREE.Group();
  arcLamp.position.set(1.4, 0, 0.95);

  // Heavy circular base
  const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.04, 24), materials.goldTrim);
  lBase.position.y = 0.02;
  arcLamp.add(lBase);

  // Upright and curved arm
  const lStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.8, 12), materials.goldTrim);
  lStem.position.set(0, 0.9, 0);
  arcLamp.add(lStem);

  const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.95, 12), materials.goldTrim);
  lArm.position.set(-0.4, 1.8, 0);
  lArm.rotation.z = Math.PI / 3;
  arcLamp.add(lArm);

  // Dome shade
  const lDome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), materials.goldTrim);
  lDome.position.set(-0.85, 1.65, 0);
  arcLamp.add(lDome);

  // Warm 2700K pool of light over seating
  const loungeLight = new THREE.PointLight(0xffdf99, 2.2, 4.0);
  loungeLight.position.set(-0.85, 1.55, 0);
  arcLamp.add(loungeLight);

  group.add(arcLamp);

  // 5. Lush Potted Monstera Deliciosa
  const monsteraGroup = new THREE.Group();
  monsteraGroup.position.set(-1.15, 0, -0.65);

  const mPot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.48, 20), materials.goldTrim);
  mPot.position.y = 0.24;
  monsteraGroup.add(mPot);

  // Monstera fan leaves
  const mLeafMat = new THREE.MeshStandardMaterial({ color: 0x18341e, roughness: 0.5, metalness: 0.1 });
  for (let i = 0; i < 7; i++) {
    const angle = (i * Math.PI * 2) / 7;
    const leaf = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.008, 12), mLeafMat);
    leaf.position.set(Math.cos(angle) * 0.25, 0.48 + Math.random() * 0.22, Math.sin(angle) * 0.25);
    leaf.rotation.x = Math.sin(angle) * 0.4;
    leaf.rotation.z = -Math.cos(angle) * 0.4;
    monsteraGroup.add(leaf);
  }

  group.add(monsteraGroup);

  // 6. Soft ground shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.8), materials.shadowPlane);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.008, 0);
  group.add(shadow);

  return group;
}
