import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';

/**
 * Architectural 3D model for Zone 08: Aftercare & Preservation Bar
 * Accurate human architectural scale:
 * - 0.92m high clinical washing & display counter with matte black quartz
 * - Undermount ceramic wash basin & matte black gooseneck faucet
 * - Illuminated frosted glass product display shelves
 * - Antimicrobial foam cleanser bottles, SecondSkin film rolls, amber balm jars
 * - Rolled charcoal guest hand towels in wire basket
 * - Framed "Hygiene & Aftercare Protocol" on the wall
 */
export function createAftercareBarRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AftercareBarRig';
  group.position.set(3.8, 0, 3.4);

  // 1. Clinical Counter Cabinet (0.92m height)
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.86, 0.58), materials.charredWood);
  cabinet.position.y = 0.43;
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  group.add(cabinet);

  // Quartz Countertop with subtle overhang
  const countertop = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.05, 0.64), materials.matteSteel);
  countertop.position.y = 0.885;
  countertop.castShadow = true;
  countertop.receiveShadow = true;
  group.add(countertop);

  // Undermount Wash Basin
  const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.38), materials.ceramicGloss);
  sinkBasin.position.set(-0.45, 0.905, 0.02);
  group.add(sinkBasin);

  // Matte Black Gooseneck Faucet
  const faucetGroup = new THREE.Group();
  faucetGroup.position.set(-0.45, 0.91, -0.16);

  const faucetBase = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.025, 0.04, 16), materials.matteSteel);
  faucetBase.position.y = 0.02;
  faucetGroup.add(faucetBase);

  const faucetStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 12), materials.matteSteel);
  faucetStem.position.y = 0.16;
  faucetGroup.add(faucetStem);

  const faucetSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 12), materials.matteSteel);
  faucetSpout.position.set(0, 0.3, 0.07);
  faucetSpout.rotation.x = Math.PI / 2.5;
  faucetGroup.add(faucetSpout);

  group.add(faucetGroup);

  // Matte Black Sensor Soap Dispenser
  const soapDispenser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.03, 0.14, 16),
    materials.matteSteel
  );
  soapDispenser.position.set(-0.15, 0.98, -0.14);
  group.add(soapDispenser);

  // 2. Wall-Mounted Illuminated Glass Display Shelf Tier above counter
  const shelfTier = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.025, 0.32), materials.frostedGlass);
  shelfTier.position.set(0, 1.45, -0.12);
  group.add(shelfTier);

  // Soft cool-white clinical shelf uplight
  const shelfLight = new THREE.PointLight(0xe8f4ff, 2.0, 3.2);
  shelfLight.position.set(0, 1.55, -0.05);
  group.add(shelfLight);

  // 3. Clinical Product Bottle Displays:
  // Foaming Cleanser pump bottles on the shelf
  [-0.65, -0.4, -0.15].forEach((xOffset) => {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.35 })
    );
    bottle.position.set(xOffset, 1.54, -0.12);
    const pump = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.035, 0.05), materials.matteSteel);
    pump.position.set(xOffset, 1.64, -0.12);
    group.add(bottle);
    group.add(pump);
  });

  // SecondSkin / Dermalize Protective Film boxes
  const filmBox1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.55 })
  );
  filmBox1.position.set(0.25, 1.51, -0.12);
  group.add(filmBox1);

  // Amber Glass Jars of Organic Tattoo Balm with Gold Lids
  [0.55, 0.72].forEach((xOffset) => {
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 0.055, 16),
      new THREE.MeshPhysicalMaterial({
        color: 0x6e431f,
        roughness: 0.25,
        transmission: 0.55,
        transparent: true,
        opacity: 0.85,
      })
    );
    jar.position.set(xOffset, 1.49, -0.12);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.039, 0.018, 16), materials.goldTrim);
    lid.position.set(xOffset, 1.53, -0.12);
    group.add(jar);
    group.add(lid);
  });

  // 4. Charcoal Rolled Guest Hand Towels on countertop
  const towelBasket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.24), materials.matteSteel);
  towelBasket.position.set(0.58, 0.95, 0.04);
  group.add(towelBasket);

  for (let i = 0; i < 4; i++) {
    const towel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.95 })
    );
    towel.position.set(0.46 + i * 0.08, 0.96, 0.04);
    towel.rotation.x = Math.PI / 2;
    group.add(towel);
  }

  // 5. Framed "Hygiene & Aftercare Protocol" Certificate on wall
  const frameGroup = new THREE.Group();
  frameGroup.position.set(0, 1.95, -0.26);

  const certFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.52, 0.025), materials.charredWood);
  frameGroup.add(certFrame);

  const certGold = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.03), materials.goldTrim);
  frameGroup.add(certGold);

  const certPaper = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.42, 0.035),
    new THREE.MeshStandardMaterial({ color: 0xf4f0e6, roughness: 0.85 })
  );
  frameGroup.add(certPaper);

  group.add(frameGroup);

  // 6. Ground shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), materials.shadowPlane);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.008, 0);
  group.add(shadow);

  return group;
}
