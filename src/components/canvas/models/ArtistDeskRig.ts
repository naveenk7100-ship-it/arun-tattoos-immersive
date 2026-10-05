import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';

/**
 * Architectural 3D model for Zone 04: Master Artist Atelier
 * Accurate human architectural scale:
 * - 0.78m high solid walnut drafting desk with matte black steel trestles
 * - Wacom Cintiq 27" Pro digital tablet angled at 25° with glowing active linework & stylus dock
 * - Secondary reference monitor mounted on an articulated desktop arm
 * - Reference tattoo flash sheets and anatomical sketches
 * - Articulated architect drafting lamp with focused warm task light
 * - 16-bottle tattoo pigment rack with colorful Eternal/Dynamic inks
 * - Open Moleskine sketchbook with fine-liners and drawing compass
 * - Cable management grommet with black conduit
 * - Low storage drawer credenza in dark walnut
 * - Rolling artist drafting stool with chrome base and foot ring
 * - Framed TTC Fine Arts Teaching Certificate and award ribbons on the wall
 */
export function createArtistDeskRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'ArtistDeskRig';
  group.position.set(-3.5, 0, -5.6);

  // 1. Solid Dark Walnut Drafting Table Top (0.78m height standard desk)
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.06, 1.15), materials.walnutWood);
  tableTop.position.y = 0.75;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  group.add(tableTop);

  // Industrial Matte Steel Trestle Legs (left & right A-frames)
  [-0.95, 0.95].forEach((xPos) => {
    const trestleGroup = new THREE.Group();
    trestleGroup.position.set(xPos, 0, 0);

    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.78, 12), materials.matteSteel);
    leg1.position.set(0, 0.38, -0.38);
    leg1.rotation.x = -0.16;
    trestleGroup.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.78, 12), materials.matteSteel);
    leg2.position.set(0, 0.38, 0.38);
    leg2.rotation.x = 0.16;
    trestleGroup.add(leg2);

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.72, 12), materials.matteSteel);
    crossbar.position.set(0, 0.22, 0);
    crossbar.rotation.x = Math.PI / 2;
    trestleGroup.add(crossbar);

    group.add(trestleGroup);
  });

  // 2. Wacom Cintiq Pro 27" Tablet (angled 25 degrees)
  const tabletGroup = new THREE.Group();
  tabletGroup.position.set(-0.15, 0.82, 0.08);

  const tabletBezel = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.46, 0.035), materials.matteSteel);
  tabletBezel.rotation.x = -0.42;
  tabletGroup.add(tabletBezel);

  const tabletGlass = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.4, 0.015), materials.cintiqScreen);
  tabletGlass.position.set(0, 0.008, 0.015);
  tabletGlass.rotation.x = -0.42;
  tabletGroup.add(tabletGlass);

  // Digital Stylus resting in weighted dock
  const stylusStand = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.035, 16), materials.brushedStainlessSteel);
  stylusStand.position.set(0.45, 0.01, 0.15);
  tabletGroup.add(stylusStand);

  const stylus = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.004, 0.16, 12), materials.matteSteel);
  stylus.position.set(0.45, 0.08, 0.15);
  stylus.rotation.z = 0.22;
  tabletGroup.add(stylus);

  // Black cable grommet & coiled wire
  const grommet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16), materials.matteSteel);
  grommet.position.set(-0.15, 0.785, -0.42);
  group.add(grommet);

  group.add(tabletGroup);

  // 3. Secondary Art Reference Monitor on Articulated Desktop Arm
  const refMonitorGroup = new THREE.Group();
  refMonitorGroup.position.set(0.65, 0.78, -0.32);

  // Desktop clamp base
  const mClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16), materials.matteSteel);
  refMonitorGroup.add(mClamp);

  // Articulating arm
  const mArm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.35, 12), materials.matteSteel);
  mArm.position.set(0, 0.18, 0);
  refMonitorGroup.add(mArm);

  // 24" Reference Screen (portrait orientation for anatomical references)
  const refBezel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.02), materials.matteSteel);
  refBezel.position.set(-0.08, 0.42, 0.05);
  refBezel.rotation.y = -0.35;
  refMonitorGroup.add(refBezel);

  const refScreen = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.48, 0.008), materials.cintiqScreen);
  refScreen.position.set(-0.08, 0.42, 0.062);
  refScreen.rotation.y = -0.35;
  refMonitorGroup.add(refScreen);

  group.add(refMonitorGroup);

  // 4. Tattoo Flash Reference Sheets pinned / resting on desk
  const sheetMat = new THREE.MeshStandardMaterial({ color: 0xf5edd6, roughness: 0.85 });
  const sheet1 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.002, 0.2), sheetMat);
  sheet1.position.set(0.65, 0.783, 0.22);
  sheet1.rotation.y = -0.15;
  group.add(sheet1);

  const sheet2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.002, 0.18), sheetMat);
  sheet2.position.set(0.48, 0.784, 0.28);
  sheet2.rotation.y = 0.2;
  group.add(sheet2);

  // 5. Multi-tier Tattoo Pigment Rack with 16 colorful ink bottles
  const inkRack = new THREE.Group();
  inkRack.position.set(-0.78, 0.78, -0.35);

  const rackBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.28), materials.charredWood);
  rackBase.position.y = 0.03;
  inkRack.add(rackBase);

  const inkColors = [
    0x0a0a0a, 0x1a1a24, 0x900c3f, 0xc70039,
    0xff5733, 0xffc300, 0x2e7d32, 0x1565c0,
    0x6a1b9a, 0x4e342e, 0x37474f, 0x212121,
    0xd4af37, 0x00838f, 0xef6c00, 0xffffff,
  ];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      const bottleGroup = new THREE.Group();
      bottleGroup.position.set(-0.22 + col * 0.062, 0.06 + row * 0.025, -0.06 + row * 0.1);

      const bottleMat = new THREE.MeshStandardMaterial({
        color: inkColors[row * 8 + col],
        roughness: 0.3,
        metalness: 0.1,
      });
      const bottleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.07, 12), bottleMat);
      bottleMesh.position.y = 0.035;
      bottleGroup.add(bottleMesh);

      const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, 0.025, 10), materials.acrylicWhiteLightbox);
      capMesh.position.y = 0.08;
      bottleGroup.add(capMesh);

      inkRack.add(bottleGroup);
    }
  }
  group.add(inkRack);

  // 6. Open Moleskine Sketchbook with Sakura Pigma Micron drawing pens
  const sketchGroup = new THREE.Group();
  sketchGroup.position.set(-0.72, 0.79, 0.15);
  sketchGroup.rotation.y = 0.12;

  const sketchCover = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.26), materials.charredWood);
  sketchGroup.add(sketchCover);

  const sketchPaper = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.022, 0.24),
    new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.85 })
  );
  sketchPaper.position.y = 0.01;
  sketchGroup.add(sketchPaper);

  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 8), materials.matteSteel);
  pen.position.set(0.12, 0.024, 0.04);
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.3;
  sketchGroup.add(pen);

  group.add(sketchGroup);

  // 7. Drafting Architect Spring Task Lamp
  const deskLamp = new THREE.Group();
  deskLamp.position.set(-0.95, 0.78, -0.38);

  const lampClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16), materials.matteSteel);
  deskLamp.add(lampClamp);

  const lArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.48, 10), materials.matteSteel);
  lArm1.position.set(0.1, 0.24, 0.08);
  lArm1.rotation.z = -0.42;
  deskLamp.add(lArm1);

  const lHood = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.16, 20, 1, true), materials.matteSteel);
  lHood.position.set(0.35, 0.45, 0.15);
  lHood.rotation.z = Math.PI + 0.38;
  deskLamp.add(lHood);

  const lampLight = new THREE.PointLight(0xffeaad, 2.2, 3.2);
  lampLight.position.set(0.35, 0.4, 0.15);
  deskLamp.add(lampLight);

  group.add(deskLamp);

  // 8. Low Storage Drawer Credenza in dark walnut
  const credenza = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.45), materials.walnutWood);
  credenza.position.set(-1.45, 0.28, -0.2);
  group.add(credenza);

  // Brass drawer pull handles
  [-0.12, 0.12].forEach((yOff) => {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.02), materials.goldTrim);
    handle.position.set(-1.02, 0.28 + yOff, -0.2);
    group.add(handle);
  });

  // 9. Atelier Stool with black leather cushion
  const stool = new THREE.Group();
  stool.position.set(0, 0, 0.78);

  const stoolBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 20), materials.chromeHardware);
  stoolBase.position.y = 0.03;
  stool.add(stoolBase);

  const stoolPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 16), materials.chromeHardware);
  stoolPiston.position.y = 0.25;
  stool.add(stoolPiston);

  const stoolRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 8, 24), materials.chromeHardware);
  stoolRing.position.y = 0.2;
  stoolRing.rotation.x = Math.PI / 2;
  stool.add(stoolRing);

  const stoolCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.09, 24), materials.leatherRecliner);
  stoolCushion.position.y = 0.52;
  stoolCushion.castShadow = true;
  stool.add(stoolCushion);

  group.add(stool);

  // 10. Framed TTC Fine Arts Teaching Certificate & Awards on wall behind desk
  const certGroup = new THREE.Group();
  certGroup.position.set(0, 2.1, -2.4);

  const certFrame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.03), materials.charredWood);
  certGroup.add(certFrame);

  const certGold = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.04), materials.goldTrim);
  certGroup.add(certGold);

  const certPaper = new THREE.Mesh(
    new THREE.BoxGeometry(0.74, 0.54, 0.045),
    new THREE.MeshStandardMaterial({ color: 0xf6f0e0, roughness: 0.85 })
  );
  certGroup.add(certPaper);

  // Convention award ribbons flanking certificate
  [-0.6, 0.6].forEach((xOff) => {
    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.28, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 })
    );
    ribbon.position.set(xOff, 0, 0.02);
    certGroup.add(ribbon);
  });

  group.add(certGroup);

  // 11. Ground shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.4), materials.shadowPlane);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.008, 0.15);
  group.add(shadow);

  return group;
}
