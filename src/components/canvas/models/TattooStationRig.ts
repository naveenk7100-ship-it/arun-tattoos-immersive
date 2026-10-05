import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';

/**
 * High-detail architectural 3D rig for Zone 05: Sterile Tattoo Station
 * Accurate human architectural scale:
 * - Matte black steel & frosted glass sanitary privacy partition screen (2.4m height)
 * - Hydraulic client tattoo chair with split-leg rests, headrest, and protective barrier bib
 * - Stainless steel Mayo stand with Bishop rotary machine, Critical digital power supply, Kwadron cartridges
 * - 3-tier rolling instrument cart with paper towel roll, spare wash bottles & supply containers
 * - Articulating surgical daylight lamp (5500K CRI 98) focused on procedure bed
 * - Ergonomic adjustable client forearm positioning rest
 * - Artist rolling saddle stool with pneumatic lever
 * - Foot pedal switch with coiled silicone cable
 * - Biohazard step-pedal waste bin with marking
 */
export function createTattooStationRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'TattooStationRig';

  // 1. Sanitary Privacy Partition Screen on the side (Matte Steel + Frosted Glass)
  const partitionGroup = new THREE.Group();
  partitionGroup.position.set(-1.9, 0, -5.8);

  const partitionFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 2.2), materials.matteSteel);
  partitionFrame.position.y = 1.2;
  partitionGroup.add(partitionFrame);

  // Frosted glass panels inside partition frame
  [-0.5, 0.5].forEach((zOffset) => {
    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.2, 0.95), materials.frostedGlass);
    glassPanel.position.set(0, 1.2, zOffset);
    partitionGroup.add(glassPanel);
  });

  group.add(partitionGroup);

  // 2. Hydraulic Client Tattoo Bed / Recliner (Seat height ~0.65m)
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, 0, -5.9);

  // Heavy circular base & chrome hydraulic pump cylinder
  const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.08, 32), materials.matteSteel);
  baseMesh.position.y = 0.04;
  baseMesh.receiveShadow = true;
  chairGroup.add(baseMesh);

  const cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.48, 24), materials.chromeHardware);
  cylinderMesh.position.y = 0.28;
  cylinderMesh.castShadow = true;
  chairGroup.add(cylinderMesh);

  // Foot pump pedal
  const pedalArm = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.28), materials.chromeHardware);
  pedalArm.position.set(0, 0.1, 0.38);
  const pedalPad = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.025, 0.07), materials.brushedStainlessSteel);
  pedalPad.position.set(0, 0.11, 0.52);
  chairGroup.add(pedalArm);
  chairGroup.add(pedalPad);

  // Main Seat Frame & Cushion
  const seatFrame = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.72), materials.matteSteel);
  seatFrame.position.y = 0.54;
  chairGroup.add(seatFrame);

  const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 0.7), materials.leatherRecliner);
  seatCushion.position.y = 0.62;
  seatCushion.castShadow = true;
  seatCushion.receiveShadow = true;
  chairGroup.add(seatCushion);

  // Reclining Backrest Group (tilted back 20 degrees)
  const backrestGroup = new THREE.Group();
  backrestGroup.position.set(0, 0.62, -0.35);
  backrestGroup.rotation.x = -0.28;

  const backrestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.85), materials.leatherRecliner);
  backrestMesh.position.set(0, 0, -0.42);
  backrestMesh.castShadow = true;
  backrestGroup.add(backrestMesh);

  // Blue disposable surgical barrier drape across head of backrest
  const barrierBib = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.005, 0.32),
    new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.85 })
  );
  barrierBib.position.set(0, 0.065, -0.65);
  backrestGroup.add(barrierBib);

  // Adjustable Headrest Cushion
  const headrestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.26), materials.leatherRecliner);
  headrestMesh.position.set(0, 0.02, -0.96);
  backrestGroup.add(headrestMesh);

  // Chrome support bars for headrest
  const hrBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 12), materials.chromeHardware);
  hrBar1.position.set(-0.1, -0.04, -0.87);
  hrBar1.rotation.x = Math.PI / 2;
  const hrBar2 = hrBar1.clone();
  hrBar2.position.x = 0.1;
  backrestGroup.add(hrBar1);
  backrestGroup.add(hrBar2);

  chairGroup.add(backrestGroup);

  // Split-leg rests (left and right)
  const legRestL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.68), materials.leatherRecliner);
  legRestL.position.set(-0.2, 0.52, 0.62);
  legRestL.rotation.x = 0.35;
  legRestL.castShadow = true;
  chairGroup.add(legRestL);

  const legRestR = legRestL.clone();
  legRestR.position.x = 0.2;
  chairGroup.add(legRestR);

  // Adjustable armrests (left & right)
  [-0.46, 0.46].forEach((xOffset) => {
    const armSupport = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.28, 12), materials.chromeHardware);
    armSupport.position.set(xOffset, 0.66, -0.05);
    const armPad = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.44), materials.leatherRecliner);
    armPad.position.set(xOffset, 0.8, -0.05);
    chairGroup.add(armSupport);
    chairGroup.add(armPad);
  });

  group.add(chairGroup);

  // 3. Articulating Surgical Daylight Lamp (5500K)
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-1.15, 0, -5.2);

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.06, 24), materials.brushedStainlessSteel);
  lampBase.position.y = 0.03;
  lampGroup.add(lampBase);

  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 16), materials.chromeHardware);
  lampPole.position.y = 0.6;
  lampGroup.add(lampPole);

  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 12), materials.chromeHardware);
  arm1.position.set(0.15, 1.35, 0);
  arm1.rotation.z = -0.52;
  lampGroup.add(arm1);

  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.58, 12), materials.chromeHardware);
  arm2.position.set(0.48, 1.65, 0);
  arm2.rotation.z = 0.42;
  lampGroup.add(arm2);

  // Dual-head surgical LED lamp hood
  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.2, 24, 1, true), materials.brushedStainlessSteel);
  hood.position.set(0.72, 1.72, 0);
  hood.rotation.z = Math.PI + 0.35;
  lampGroup.add(hood);

  // Surgical Daylight Disc
  const lightDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.15, 24),
    new THREE.MeshBasicMaterial({ color: 0xf5f8ff })
  );
  lightDisc.position.set(0.72, 1.64, 0);
  lightDisc.rotation.x = Math.PI / 2;
  lampGroup.add(lightDisc);

  const surgicalTaskLight = new THREE.PointLight(0xf2f7ff, 3.4, 4.5);
  surgicalTaskLight.position.set(0.72, 1.6, 0);
  surgicalTaskLight.castShadow = true;
  lampGroup.add(surgicalTaskLight);

  group.add(lampGroup);

  // 4. Stainless Steel Mayo Instrument Stand
  const mayoGroup = new THREE.Group();
  mayoGroup.position.set(1.05, 0, -5.7);

  // U-base with casters
  const uBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.45), materials.matteSteel);
  uBase.position.y = 0.025;
  mayoGroup.add(uBase);

  const mayoRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 16), materials.chromeHardware);
  mayoRod.position.set(0, 0.5, 0);
  mayoGroup.add(mayoRod);

  // Stainless surgical tray top (height 0.92m)
  const mayoTray = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.44), materials.brushedStainlessSteel);
  mayoTray.position.set(0, 0.94, 0);
  mayoGroup.add(mayoTray);

  // Blue surgical sterile barrier drape over tray
  const blueDrape = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.005, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.9 })
  );
  blueDrape.position.set(0, 0.955, 0);
  mayoGroup.add(blueDrape);

  // Digital Power Supply unit (Critical Tattoo style) with voltage display
  const psu = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.1), materials.matteSteel);
  psu.position.set(-0.2, 0.98, -0.12);
  mayoGroup.add(psu);

  const psuLcd = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.01, 0.03),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee })
  );
  psuLcd.position.set(-0.2, 1.005, -0.12);
  mayoGroup.add(psuLcd);

  // Bishop Rotary Tattoo Machine on tray with grip wrap
  const machineBody = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.12, 16), materials.matteSteel);
  machineBody.position.set(-0.12, 0.98, 0.06);
  machineBody.rotation.z = Math.PI / 2;
  mayoGroup.add(machineBody);

  // Grip wrap (cohesive black bandage around machine grip)
  const gripWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.06, 16), materials.leatherRecliner);
  gripWrap.position.set(-0.08, 0.98, 0.06);
  gripWrap.rotation.z = Math.PI / 2;
  mayoGroup.add(gripWrap);

  // Wireless battery pack on top of machine
  const battery = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.045, 16), materials.charredWood);
  battery.position.set(-0.19, 0.98, 0.06);
  battery.rotation.z = Math.PI / 2;
  mayoGroup.add(battery);

  // Kwadron needle cartridge inserted in front
  const needleTip = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.04, 12), materials.acrylicWhiteLightbox);
  needleTip.position.set(-0.03, 0.98, 0.06);
  needleTip.rotation.z = -Math.PI / 2;
  mayoGroup.add(needleTip);

  // Black nitrile glove dispenser box
  const gloveBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.065, 0.11),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
  );
  gloveBox.position.set(0.18, 0.99, -0.12);
  mayoGroup.add(gloveBox);

  // Green soap squeeze wash bottle
  const washBottle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 0.14, 16),
    new THREE.MeshPhysicalMaterial({ color: 0x22c55e, roughness: 0.3, transmission: 0.7, transparent: true, opacity: 0.85 })
  );
  washBottle.position.set(0.2, 1.03, 0.1);
  mayoGroup.add(washBottle);

  const washNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.06, 8), materials.chromeHardware);
  washNozzle.position.set(0.2, 1.13, 0.08);
  washNozzle.rotation.x = 0.3;
  mayoGroup.add(washNozzle);

  // Palette of disposable ink caps
  const inkColors = [0x0a0a0a, 0x333333, 0x666666, 0xb91c1c];
  inkColors.forEach((color, idx) => {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.012, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
    );
    cap.position.set(-0.04 + idx * 0.024, 0.965, -0.08);
    mayoGroup.add(cap);
  });

  group.add(mayoGroup);

  // 5. Rolling 3-Tier Storage Trolley Cart on the side
  const trolleyGroup = new THREE.Group();
  trolleyGroup.position.set(-1.3, 0, -6.4);

  // Steel tubular frame
  const tFrame = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.82, 0.42), materials.matteSteel);
  tFrame.position.y = 0.44;
  trolleyGroup.add(tFrame);

  // 3 Stainless Shelves
  [0.12, 0.45, 0.8].forEach((shelfY) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.02, 0.4), materials.brushedStainlessSteel);
    shelf.position.y = shelfY;
    trolleyGroup.add(shelf);
  });

  // Paper towel roll (blue shop roll) mounted on top rail
  const towelRoll = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.26, 16),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.9 })
  );
  towelRoll.position.set(-0.12, 0.9, 0);
  towelRoll.rotation.z = Math.PI / 2;
  trolleyGroup.add(towelRoll);

  // Box of sterile barrier film rolls
  const filmBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
  );
  filmBox.position.set(0.15, 0.86, 0);
  trolleyGroup.add(filmBox);

  // Spare Kwadron cartridge boxes on middle shelf
  const needleBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.05, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
  );
  needleBox.position.set(0, 0.49, 0);
  trolleyGroup.add(needleBox);

  group.add(trolleyGroup);

  // 6. Adjustable Client Armrest Stand for Forearm/Sleeve Work
  const armrestGroup = new THREE.Group();
  armrestGroup.position.set(0.85, 0, -5.0);

  const armrestBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.04, 16), materials.matteSteel);
  armrestBase.position.y = 0.02;
  armrestGroup.add(armrestBase);

  const armrestStem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.72, 12), materials.chromeHardware);
  armrestStem.position.y = 0.38;
  armrestGroup.add(armrestStem);

  const armrestCushion = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.22), materials.leatherRecliner);
  armrestCushion.position.set(0, 0.76, 0);
  armrestCushion.rotation.z = -0.12;
  armrestGroup.add(armrestCushion);

  group.add(armrestGroup);

  // 7. Artist Ergonomic Saddle Stool
  const stoolGroup = new THREE.Group();
  stoolGroup.position.set(-0.65, 0, -5.7);

  const sBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.04, 16), materials.chromeHardware);
  sBase.position.y = 0.02;
  stoolGroup.add(sBase);

  const sPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.44, 12), materials.chromeHardware);
  sPiston.position.y = 0.24;
  stoolGroup.add(sPiston);

  // Ergonomic contoured saddle seat
  const sSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.32), materials.leatherRecliner);
  sSaddle.position.set(0, 0.48, 0);
  stoolGroup.add(sSaddle);

  group.add(stoolGroup);

  // 8. Foot Pedal Switch on the floor
  const pedalSwitch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.018, 20), materials.matteSteel);
  pedalSwitch.position.set(0.45, 0.009, -5.2);
  group.add(pedalSwitch);

  // 9. Stainless Steel Step-Pedal Biohazard Waste Bin
  const binGroup = new THREE.Group();
  binGroup.position.set(1.5, 0, -6.6);

  const binBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 24), materials.brushedStainlessSteel);
  binBody.position.y = 0.21;
  binGroup.add(binBody);

  const binLid = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.025, 24), materials.brushedStainlessSteel);
  binLid.position.y = 0.43;
  binGroup.add(binLid);

  const bioMarking = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.08, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 })
  );
  bioMarking.position.set(-0.16, 0.24, 0);
  binGroup.add(bioMarking);

  group.add(binGroup);

  // 10. Ground Contact Shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.4), materials.shadowPlane);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.008, -5.8);
  group.add(shadow);

  return group;
}
