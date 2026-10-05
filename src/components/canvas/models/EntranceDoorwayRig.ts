import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';

/**
 * Architectural 3D model for Zone 01 (Entrance) and Zone 09 (Exit)
 * Accurate human architectural scale:
 * - 2.65m tall heavy steel & smoked fluted glass pivot door
 * - Brushed bronze vertical architectural bar handle at 1.05m human grasp height
 * - Polished brass floor threshold & recessed charcoal walk-off entry mat
 * - Front studio facade wall with black steel storefront display windows
 * - Illuminated architectural bronze EXIT sign on transom header
 * - Recessed overhead entrance soffit downlight and exterior Bandar Road ambient spill
 * - Cylindrical solid brass umbrella stand beside doorway
 */
export function createEntranceDoorwayRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EntranceDoorwayRig';
  group.position.set(0, 0, 7.8);

  const DOOR_HEIGHT = 2.65;
  const WALL_HEIGHT = 3.5;

  // 1. Black Architectural Steel Door Frame
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.22), materials.matteSteel);
  frameTop.position.set(0, DOOR_HEIGHT, 0);
  group.add(frameTop);

  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.1, DOOR_HEIGHT, 0.22), materials.matteSteel);
  frameL.position.set(-1.15, DOOR_HEIGHT / 2, 0);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.1, DOOR_HEIGHT, 0.22), materials.matteSteel);
  frameR.position.set(1.15, DOOR_HEIGHT / 2, 0);
  group.add(frameL);
  group.add(frameR);

  // Transom wall above door up to ceiling (3.5m)
  const transomHeight = WALL_HEIGHT - DOOR_HEIGHT;
  const transomWall = new THREE.Mesh(new THREE.BoxGeometry(2.4, transomHeight, 0.2), materials.darkMatteWall);
  transomWall.position.set(0, DOOR_HEIGHT + transomHeight / 2, 0);
  group.add(transomWall);

  // Illuminated EXIT Sign above door (facing into studio for Zone 09)
  const exitSignGroup = new THREE.Group();
  exitSignGroup.position.set(0, DOOR_HEIGHT + 0.25, -0.12);

  const exitPlate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.03), materials.matteSteel);
  exitSignGroup.add(exitPlate);

  const exitGlow = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.12, 0.015),
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    })
  );
  exitGlow.position.z = -0.015;
  exitSignGroup.add(exitGlow);

  group.add(exitSignGroup);

  // 2. Pivot Door Leaf (Left Main Leaf: 1.35m wide, Right Sidelite: 0.85m wide)
  const doorStileL = new THREE.Mesh(new THREE.BoxGeometry(0.12, DOOR_HEIGHT - 0.04, 0.06), materials.charredWood);
  doorStileL.position.set(-1.04, DOOR_HEIGHT / 2, 0);
  const doorStileR = new THREE.Mesh(new THREE.BoxGeometry(0.12, DOOR_HEIGHT - 0.04, 0.06), materials.charredWood);
  doorStileR.position.set(0.19, DOOR_HEIGHT / 2, 0);
  group.add(doorStileL);
  group.add(doorStileR);

  const doorRailTop = new THREE.Mesh(new THREE.BoxGeometry(1.23, 0.12, 0.06), materials.charredWood);
  doorRailTop.position.set(-0.425, DOOR_HEIGHT - 0.08, 0);
  const doorRailBot = new THREE.Mesh(new THREE.BoxGeometry(1.23, 0.22, 0.06), materials.charredWood);
  doorRailBot.position.set(-0.425, 0.11, 0);
  group.add(doorRailTop);
  group.add(doorRailBot);

  // Main door fluted glass insert
  const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(1.05, DOOR_HEIGHT - 0.38, 0.03), materials.flutedGlass);
  doorGlass.position.set(-0.425, DOOR_HEIGHT / 2 + 0.02, 0);
  group.add(doorGlass);

  // Brass protective kickplate at bottom of door
  const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(1.23, 0.18, 0.065), materials.goldTrim);
  kickPlate.position.set(-0.425, 0.09, 0.005);
  group.add(kickPlate);

  // Fixed sidelite on the right
  const sideliteGlass = new THREE.Mesh(new THREE.BoxGeometry(0.85, DOOR_HEIGHT - 0.04, 0.03), materials.flutedGlass);
  sideliteGlass.position.set(0.68, DOOR_HEIGHT / 2, 0);
  group.add(sideliteGlass);

  // Horizontal steel muntin bars across sidelite
  [0.85, 1.7].forEach((yPos) => {
    const muntin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.05), materials.matteSteel);
    muntin.position.set(0.68, yPos, 0);
    group.add(muntin);
  });

  // 3. Ergonomic Long Solid Bronze Architectural Bar Handle (grasp height 0.7m to 1.5m, centered at 1.1m)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 16), materials.bronzeAccent);
  handle.position.set(0.12, 1.1, 0.09);
  group.add(handle);

  const hStems = [
    new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 12), materials.bronzeAccent),
    new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 12), materials.bronzeAccent),
  ];
  hStems[0].position.set(0.12, 1.45, 0.045);
  hStems[0].rotation.x = Math.PI / 2;
  hStems[1].position.set(0.12, 0.75, 0.045);
  hStems[1].rotation.x = Math.PI / 2;
  group.add(hStems[0]);
  group.add(hStems[1]);

  // Back-side handle for exit (Zone 09)
  const handleBack = handle.clone();
  handleBack.position.z = -0.09;
  group.add(handleBack);
  const hStemsBack = [hStems[0].clone(), hStems[1].clone()];
  hStemsBack[0].position.z = -0.045;
  hStemsBack[1].position.z = -0.045;
  group.add(hStemsBack[0]);
  group.add(hStemsBack[1]);

  // 4. Polished Brass Floor Threshold Transition Strip & Inset Entry Mat
  const threshold = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.012, 0.14), materials.goldTrim);
  threshold.position.set(0, 0.006, 0);
  group.add(threshold);

  const entryMat = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.008, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x1b1b20, roughness: 0.95, metalness: 0.05 })
  );
  entryMat.position.set(-0.2, 0.004, -0.65);
  group.add(entryMat);

  const matBorder = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.009, 1.24), materials.goldTrim);
  matBorder.position.set(-0.2, 0.003, -0.65);
  group.add(matBorder);

  // 5. Front Storefront Facade Wall flanking the entrance
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(5.0, WALL_HEIGHT, 0.22), materials.darkMatteWall);
  wallL.position.set(-3.7, WALL_HEIGHT / 2, 0);
  group.add(wallL);

  const windowL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.3, 0.04), materials.flutedGlass);
  windowL.position.set(-3.7, 1.6, 0);
  group.add(windowL);

  const winFrameL = new THREE.Mesh(new THREE.BoxGeometry(3.7, 2.4, 0.12), materials.matteSteel);
  winFrameL.position.set(-3.7, 1.6, 0);
  group.add(winFrameL);

  const wallR = new THREE.Mesh(new THREE.BoxGeometry(5.0, WALL_HEIGHT, 0.22), materials.darkMatteWall);
  wallR.position.set(3.7, WALL_HEIGHT / 2, 0);
  group.add(wallR);

  const windowR = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.3, 0.04), materials.flutedGlass);
  windowR.position.set(3.7, 1.6, 0);
  group.add(windowR);

  const winFrameR = new THREE.Mesh(new THREE.BoxGeometry(3.7, 2.4, 0.12), materials.matteSteel);
  winFrameR.position.set(3.7, 1.6, 0);
  group.add(winFrameR);

  // 6. Solid Brass Umbrella Stand beside doorway
  const umbrellaStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.55, 20),
    materials.goldTrim
  );
  umbrellaStand.position.set(1.45, 0.275, -0.4);
  group.add(umbrellaStand);

  // 7. Brass Address & Studio Plaque beside the door
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.02), materials.bronzeAccent);
  plaque.position.set(1.4, 1.45, -0.12);
  group.add(plaque);

  // 8. Lighting: Recessed overhead entrance spotlight & exterior street spill
  const entranceDownlight = new THREE.SpotLight(0xfff0d8, 2.8, 6.0);
  entranceDownlight.position.set(-0.2, 3.3, -0.6);
  entranceDownlight.target.position.set(-0.2, 0, -0.6);
  entranceDownlight.angle = Math.PI / 4.2;
  entranceDownlight.penumbra = 0.7;
  group.add(entranceDownlight);
  group.add(entranceDownlight.target);

  const streetSpill = new THREE.SpotLight(0xffd8a8, 2.2, 8.5);
  streetSpill.position.set(0, 3.2, 2.5);
  streetSpill.target.position.set(0, 0.5, -1.0);
  streetSpill.angle = Math.PI / 3.0;
  streetSpill.penumbra = 0.85;
  group.add(streetSpill);
  group.add(streetSpill.target);

  return group;
}
