import * as THREE from 'three';
import type { StudioMaterialSet } from '../studioMaterials';

/**
 * Architectural 3D model for Zone 06: Concept & Stencil Table
 * Accurate human architectural scale:
 * - 0.88m high consultation table with walnut top and matte steel edge trim
 * - Integrated flush A3 LED backlight tracing pad with upward daylight wash
 * - Purple/blue thermal stencil carbon sheet
 * - Thermal stencil printer unit with power indicator
 * - Precision metal drafting calipers, surgical skin markers, and steel ruler
 * - Drafting stool with leather cushion
 */
export function createDesignTableRig(materials: StudioMaterialSet): THREE.Group {
  const group = new THREE.Group();
  group.name = 'DesignTableRig';
  group.position.set(3.5, 0, -5.6);

  // 1. Solid Consultation Worktable (0.88m height)
  const tableBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.82, 1.1), materials.charredWood);
  tableBase.position.y = 0.41;
  tableBase.castShadow = true;
  tableBase.receiveShadow = true;
  group.add(tableBase);

  // Walnut top surface
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.05, 1.16), materials.walnutWood);
  tableTop.position.y = 0.845;
  group.add(tableTop);

  // Brushed steel edge trim around table top
  const edgeTrim = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.03, 1.18), materials.brushedStainlessSteel);
  edgeTrim.position.y = 0.835;
  group.add(edgeTrim);

  // 2. Embedded Luminous A3 Lightbox (translucent acrylic glow surface)
  const lightbox = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.02, 0.72), materials.acrylicWhiteLightbox);
  lightbox.position.set(-0.25, 0.875, 0);
  group.add(lightbox);

  // Real soft daylight upward wash from lightbox
  const boxLight = new THREE.PointLight(0xe8f2ff, 1.8, 2.2);
  boxLight.position.set(-0.25, 1.05, 0);
  group.add(boxLight);

  // 3. Purple/Blue Thermal Stencil Carbon Sheet lying partially on the lightbox
  const stencilPaper = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.004, 0.36), materials.stencilCarbon);
  stencilPaper.position.set(-0.35, 0.89, 0.05);
  stencilPaper.rotation.y = 0.14;
  group.add(stencilPaper);

  // 4. Thermal Stencil Printer (Brother PocketJet style) on table right
  const printerGroup = new THREE.Group();
  printerGroup.position.set(0.72, 0.87, -0.22);

  const printerBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.09), materials.matteSteel);
  printerBody.position.y = 0.025;
  printerGroup.add(printerBody);

  // Green status LED
  const pLed = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.005, 0.01),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  pLed.position.set(0.12, 0.052, 0.02);
  printerGroup.add(pLed);

  group.add(printerGroup);

  // 5. Stencil Stuff Transfer Primer Pump Bottle
  const primerBottle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
  );
  primerBottle.position.set(0.72, 0.93, 0.18);
  const primerPump = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.03, 0.04), materials.matteSteel);
  primerPump.position.set(0.72, 1.0, 0.18);
  group.add(primerBottle);
  group.add(primerPump);

  // 6. Precision Metal Vernier Calipers
  const caliperBeam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.008, 0.018), materials.brushedStainlessSteel);
  caliperBeam.position.set(0.15, 0.88, -0.25);
  caliperBeam.rotation.y = 0.32;
  group.add(caliperBeam);

  // Surgical Skin Marker (dual-tip purple)
  const marker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8),
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.4 })
  );
  marker.position.set(0.25, 0.88, 0.28);
  marker.rotation.z = Math.PI / 2;
  marker.rotation.y = -0.25;
  group.add(marker);

  // 7. Metal Steel Ruler (30cm)
  const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.004, 0.035), materials.chromeHardware);
  ruler.position.set(-0.25, 0.88, 0.42);
  group.add(ruler);

  // 8. Stool with leather cushion
  const stool = new THREE.Group();
  stool.position.set(0, 0, 0.8);

  const stoolBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16), materials.matteSteel);
  stoolBase.position.y = 0.02;
  stool.add(stoolBase);

  const stoolPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.48, 12), materials.chromeHardware);
  stoolPiston.position.y = 0.26;
  stool.add(stoolPiston);

  const stoolCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20), materials.leatherRecliner);
  stoolCushion.position.y = 0.54;
  stool.add(stoolCushion);

  group.add(stool);

  // 9. Ground shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), materials.shadowPlane);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.008, 0);
  group.add(shadow);

  return group;
}
