import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { StudioZone } from '../../types';
import { createStudioMaterials } from './studioMaterials';
import { createTattooStationRig } from './models/TattooStationRig';
import { createReceptionRig } from './models/ReceptionRig';
import { createGalleryWallRig } from './models/GalleryWallRig';
import { createArtistDeskRig } from './models/ArtistDeskRig';
import { createDesignTableRig } from './models/DesignTableRig';
import { createBookingLoungeRig } from './models/BookingLoungeRig';
import { createAftercareBarRig } from './models/AftercareBarRig';
import { createEntranceDoorwayRig } from './models/EntranceDoorwayRig';
import { createVolumetricLightBeam, createAtmosphericDustSystem } from './VolumetricLight';

interface StudioCanvasProps {
  currentZone: StudioZone;
  isReducedMotion?: boolean;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  currentZone,
  isReducedMotion = false,
}) => {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth camera interpolation state
  const targetCamPos = useRef(new THREE.Vector3(...currentZone.camera.position));
  const targetCamLook = useRef(new THREE.Vector3(...currentZone.camera.target));
  const currentCamLook = useRef(new THREE.Vector3(...currentZone.camera.target));

  // Mouse parallax
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Update target coordinates when currentZone changes
  useEffect(() => {
    targetCamPos.current.set(...currentZone.camera.position);
    targetCamLook.current.set(...currentZone.camera.target);
  }, [currentZone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Detect mobile device
    const isMobile = window.innerWidth < 768;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070709);
    // Physically plausible atmospheric fog
    scene.fog = new THREE.FogExp2(0x070709, isMobile ? 0.045 : 0.05);
    sceneRef.current = scene;

    // 2. CAMERA SETUP
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(currentZone.camera.fov || 48, width / height, 0.1, 100);
    camera.position.set(...currentZone.camera.position);
    camera.lookAt(...currentZone.camera.target);
    cameraRef.current = camera;

    // 3. RENDERER SETUP
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile && window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
      });
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isReducedMotion;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. GENERATE PHYSICAL MATERIALS
    const materials = createStudioMaterials();

    // 5. LIGHTING HIERARCHY (Base, Key, Practicals, Accents)
    // Deep graphite ambient fill
    const ambientLight = new THREE.AmbientLight(0x16151c, 0.95);
    scene.add(ambientLight);

    // Warm key light casting soft studio shadows from 3.4m ceiling height
    const mainKeyLight = new THREE.SpotLight(0xffecd0, 3.4);
    mainKeyLight.position.set(0, 3.4, 2.0);
    mainKeyLight.target.position.set(0, 0.6, 0.4);
    mainKeyLight.angle = Math.PI / 3.4;
    mainKeyLight.penumbra = 0.8;
    mainKeyLight.decay = 1.3;
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    mainKeyLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    mainKeyLight.shadow.bias = -0.0001;
    scene.add(mainKeyLight);
    scene.add(mainKeyLight.target);

    // Volumetric light beam cone from main ceiling spotlight
    if (!isMobile) {
      const volBeam = createVolumetricLightBeam(3.4, 0.2, 2.4, 0xffe8ba, 0.07);
      volBeam.position.set(0, 3.4, 2.0);
      volBeam.rotation.x = 0.12;
      scene.add(volBeam);
    }

    // Surgical daylight spotlight over the tattoo station (Zone 05)
    const surgicalLight = new THREE.SpotLight(0xf2f7ff, 3.8);
    surgicalLight.position.set(2.2, 3.35, -4.6);
    surgicalLight.target.position.set(2.2, 0.65, -5.5);
    surgicalLight.angle = Math.PI / 4.5;
    surgicalLight.penumbra = 0.6;
    surgicalLight.decay = 1.2;
    scene.add(surgicalLight);
    scene.add(surgicalLight.target);

    // 6. ARCHITECTURAL PERIMETER & SHELL (Realistic 3.5m ceiling height boutique studio)
    const STUDIO_WIDTH = 12.5;
    const STUDIO_DEPTH = 16.2;
    const CEILING_HEIGHT = 3.5;

    // High-fidelity Polished Terrazzo Floor
    const floorGeo = new THREE.PlaneGeometry(STUDIO_WIDTH, STUDIO_DEPTH);
    const floor = new THREE.Mesh(floorGeo, materials.terrazzoFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -0.2);
    floor.receiveShadow = true;
    scene.add(floor);

    // Studio Back Wall with vertical acoustic slat relief (z = -8.2m)
    const backWallGroup = new THREE.Group();
    backWallGroup.position.set(0, CEILING_HEIGHT / 2, -8.2);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(STUDIO_WIDTH, CEILING_HEIGHT, 0.2), materials.darkMatteWall);
    backWall.receiveShadow = true;
    backWallGroup.add(backWall);

    // Vertical charred wood architectural acoustic slats
    for (let x = -5.8; x <= 5.8; x += 0.45) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, CEILING_HEIGHT, 0.06), materials.charredWood);
      slat.position.set(x, 0, 0.12);
      backWallGroup.add(slat);
    }
    scene.add(backWallGroup);

    // Left Gallery Wall (x = -6.25m)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, CEILING_HEIGHT, STUDIO_DEPTH), materials.darkMatteWall);
    leftWall.position.set(-STUDIO_WIDTH / 2, CEILING_HEIGHT / 2, -0.2);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Consultation Wall (x = +6.25m)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, CEILING_HEIGHT, STUDIO_DEPTH), materials.darkMatteWall);
    rightWall.position.set(STUDIO_WIDTH / 2, CEILING_HEIGHT / 2, -0.2);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Continuous Architectural Skirting / Baseboards (12cm charred wood + brass reveal)
    const skirtingMat = materials.charredWood;
    const brassMat = materials.goldTrim;

    // Back skirting
    const backSkirting = new THREE.Mesh(new THREE.BoxGeometry(STUDIO_WIDTH - 0.1, 0.12, 0.04), skirtingMat);
    backSkirting.position.set(0, 0.06, -8.08);
    const backBrass = new THREE.Mesh(new THREE.BoxGeometry(STUDIO_WIDTH - 0.1, 0.012, 0.045), brassMat);
    backBrass.position.set(0, 0.126, -8.08);
    scene.add(backSkirting);
    scene.add(backBrass);

    // Left skirting
    const leftSkirting = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, STUDIO_DEPTH - 0.1), skirtingMat);
    leftSkirting.position.set(-STUDIO_WIDTH / 2 + 0.12, 0.06, -0.2);
    const leftBrass = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, STUDIO_DEPTH - 0.1), brassMat);
    leftBrass.position.set(-STUDIO_WIDTH / 2 + 0.12, 0.126, -0.2);
    scene.add(leftSkirting);
    scene.add(leftBrass);

    // Right skirting
    const rightSkirting = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, STUDIO_DEPTH - 0.1), skirtingMat);
    rightSkirting.position.set(STUDIO_WIDTH / 2 - 0.12, 0.06, -0.2);
    const rightBrass = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, STUDIO_DEPTH - 0.1), brassMat);
    rightBrass.position.set(STUDIO_WIDTH / 2 - 0.12, 0.126, -0.2);
    scene.add(rightSkirting);
    scene.add(rightBrass);

    // 4 Structural Load-Bearing Columns (Defining functional bays)
    const columnPositions: [number, number][] = [
      [-2.8, 0.4],  // Col A: Left Reception/Aisle
      [2.8, 0.4],   // Col B: Right Reception/Lounge
      [-2.8, -4.5], // Col C: Left Atelier/Tattoo Bay
      [2.8, -4.5],  // Col D: Right Design/Tattoo Bay
    ];

    columnPositions.forEach(([colX, colZ]) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(colX, 0, colZ);

      // Main column shaft
      const colShaft = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, CEILING_HEIGHT, 0.42),
        materials.darkMatteWall
      );
      colShaft.position.y = CEILING_HEIGHT / 2;
      colShaft.castShadow = true;
      colShaft.receiveShadow = true;
      colGroup.add(colShaft);

      // Baseboard skirting around column base
      const colSkirting = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.12, 0.48),
        skirtingMat
      );
      colSkirting.position.y = 0.06;
      colGroup.add(colSkirting);

      // Brass collar ring
      const colBrass = new THREE.Mesh(
        new THREE.BoxGeometry(0.49, 0.012, 0.49),
        brassMat
      );
      colBrass.position.y = 0.126;
      colGroup.add(colBrass);

      scene.add(colGroup);
    });

    // Acoustic Matte Black Ceiling (3.5m height)
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(STUDIO_WIDTH, 0.15, STUDIO_DEPTH), materials.darkMatteWall);
    ceiling.position.set(0, CEILING_HEIGHT + 0.075, -0.2);
    scene.add(ceiling);

    // Transverse Architectural Steel I-Beams
    [-6.0, -2.5, 1.0, 4.5].forEach((zPos) => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(STUDIO_WIDTH - 0.2, 0.18, 0.12), materials.matteSteel);
      beam.position.set(0, CEILING_HEIGHT - 0.09, zPos);
      scene.add(beam);
    });

    // Ceiling Track Lighting System (continuous longitudinal tracks at y = 3.25m)
    [-3.2, 3.2].forEach((trackX) => {
      const trackRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.04, STUDIO_DEPTH - 1.0),
        materials.matteSteel
      );
      trackRail.position.set(trackX, 3.25, -0.2);
      scene.add(trackRail);

      // Cylindrical black track spotlight canisters mounted along each track
      [-5.6, -3.2, 0.4, 3.4].forEach((spotZ) => {
        const canister = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, 0.12, 16),
          materials.matteSteel
        );
        canister.position.set(trackX, 3.19, spotZ);
        canister.rotation.x = Math.PI / 2 + 0.3;
        scene.add(canister);
      });
    });

    // Matte Black Exposed HVAC Spiral Duct running along ceiling
    const duct = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, STUDIO_DEPTH - 1.2, 20),
      materials.matteSteel
    );
    duct.position.set(0, CEILING_HEIGHT - 0.18, -0.2);
    duct.rotation.x = Math.PI / 2;
    scene.add(duct);

    // 7. ASSEMBLE ZONE RIGS
    // Zone 01 & 09: Entrance Doorway & Exit Threshold
    const entranceRig = createEntranceDoorwayRig(materials);
    scene.add(entranceRig);

    // Zone 02: Reception Desk & Backlit Crest
    const receptionRig = createReceptionRig(materials);
    scene.add(receptionRig);

    // Zone 03: Museum Art Gallery Walls
    const galleryRig = createGalleryWallRig(materials);
    scene.add(galleryRig);

    // Zone 04: Arun's Atelier Drafting Desk
    const artistDeskRig = createArtistDeskRig(materials);
    scene.add(artistDeskRig);

    // Zone 05: Sterile Tattoo Station (Recliner, Bishop machine, Kwadron needle, Mayo stand)
    const tattooStationRig = createTattooStationRig(materials);
    tattooStationRig.position.set(2.2, 0, 0.4);
    scene.add(tattooStationRig);

    // Zone 06: Concept & Stencil Lightbox Table
    const designTableRig = createDesignTableRig(materials);
    designTableRig.position.set(3.6, 0, -1.8);
    scene.add(designTableRig);

    // Zone 07: Booking & Consultation Lounge
    const bookingLoungeRig = createBookingLoungeRig(materials);
    scene.add(bookingLoungeRig);

    // Zone 08: Aftercare & Clinical Preservation Bar
    const aftercareBarRig = createAftercareBarRig(materials);
    scene.add(aftercareBarRig);

    // 8. ATMOSPHERIC DUST MOTES
    const dustSystem = createAtmosphericDustSystem(isMobile ? 90 : 220);
    scene.add(dustSystem.points);

    // 9. MOUSE & TOUCH PARALLAX LISTENER
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 10. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 11. ANIMATION TICK RENDER LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update floating dust motes
      dustSystem.update(elapsedTime);

      // Smooth mouse parallax lerp
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      // CINEMATIC CAMERA CHOREOGRAPHY
      const lerpFactor = isReducedMotion ? 0.2 : 0.045;

      // Natural camera breathing (subtle steadicam float)
      const breathingX = isReducedMotion ? 0 : Math.sin(elapsedTime * 0.8) * 0.025;
      const breathingY = isReducedMotion ? 0 : Math.cos(elapsedTime * 0.6) * 0.035;

      // Dynamic parallax
      const parallaxX = isReducedMotion ? 0 : mouse.current.x * 0.35 + breathingX;
      const parallaxY = isReducedMotion ? 0 : -mouse.current.y * 0.2 + breathingY;

      // Interpolate camera position
      camera.position.x += (targetCamPos.current.x + parallaxX - camera.position.x) * lerpFactor;
      camera.position.y += (targetCamPos.current.y + parallaxY - camera.position.y) * lerpFactor;
      camera.position.z += (targetCamPos.current.z - camera.position.z) * lerpFactor;

      // Interpolate camera look-at target
      currentCamLook.current.x += (targetCamLook.current.x - currentCamLook.current.x) * lerpFactor;
      currentCamLook.current.y += (targetCamLook.current.y - currentCamLook.current.y) * lerpFactor;
      currentCamLook.current.z += (targetCamLook.current.z - currentCamLook.current.z) * lerpFactor;

      camera.lookAt(currentCamLook.current);

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      dustSystem.points.geometry.dispose();
      (dustSystem.points.material as THREE.Material).dispose();
    };
  }, [isReducedMotion]);

  if (!isWebGLSupported) {
    return (
      <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#070709]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1711] via-[#09090c] to-[#070709] opacity-95" />
        <div className="absolute inset-0 cinematic-vignette pointer-events-none" />
        <div className="absolute inset-0 film-grain opacity-25 pointer-events-none" />
        <div className="absolute bottom-6 right-6 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-mono text-zinc-400 shadow-xl">
          <span className="text-[#d4af37] font-semibold">2D Architectural Mode</span> • WebGL Acceleration Inactive
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Cinematic vignette & subtle grain overlays */}
      <div className="absolute inset-0 cinematic-vignette pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-35 pointer-events-none" />

      {/* Subtle floor ambient gradient */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#070709] via-[#070709]/70 to-transparent pointer-events-none" />
    </div>
  );
};
