# ARUN TATTOOS — Virtual 3D Studio Experience
> **"INK YOUR STORY."**  
> Premium Real-World Tattoo Studio Web Platform for **Arun Tattoo Studio (Vijayawada, India)**

---

## 🏛️ Project Overview
This project is a completely redesigned, production-grade web experience for **Arun Tattoos / Arun Tattoo Studio**, Vijayawada's premier tattoo studio led by master artist **Nani Kumar** (8+ years experience, 2-year TTC certified, Graphic Design) and resident artist **Yeswanth**.

Instead of a generic template (Hero → About → Services → Gallery → Contact), this platform re-imagines the digital presence as a **Virtual 3D Studio Walkthrough**:
```
STUDIO ENTRANCE (Threshold)
       ↓
RECEPTION (Concierge & Culture)
       ↓
THE ART GALLERY (Living Canvas Archives)
       ↓
ARTIST ATELIER (Nani Kumar & Yeswanth Desks)
       ↓
TATTOO STATION (Sterile Sanctuary & Equipment Anatomy)
       ↓
DESIGN TABLE (Anatomical Flow & Stencil Calibration)
       ↓
BOOKING AREA (Reservation Lounge & Direct WhatsApp Link)
       ↓
AFTERCARE BAR (4-Phase Healing Regimen)
       ↓
FINAL EXIT (Vijayawada Map Coordinates & Contact)
```

---

## 📋 Verified Reference Data (from aruntattoostudio.com)

* **Official Studio Name**: Arun Tattoo Studio / Arun Tattoos
* **Visual Direction / Slogan**: *"INK YOUR STORY."*
* **Founder & Principal Artist**: Nani Kumar
  - Started career at age 23; 8+ years professional tattooing
  - Two-Year Technical Teachers Certificate (TTC) in Fine Arts
  - Graphic Design certification
  - Renowned across Andhra Pradesh for custom portrait art, single-needle micro art, and out-of-the-box custom touches
* **Resident Partner Artist**: Yeswanth
  - Master in large-scale Black & Grey Realism and transformative Cover-up restorations
* **Physical Address**:
  `#40-5/7-21, K.J. Gupta Municipal Employees Colony, A+ Convention Hall Beside Big C, Opp: BSNL Office, Bandar Road, Vijayawada - 520002, Andhra Pradesh, India`
* **Contact Phone**: `+91-9505760918`
* **Official Email**: `nani@aruntattoostudio.com`
* **Hours**: 10:30 AM – 09:30 PM (Daily)
* **Socials**:
  - Instagram: `https://instagram.com/aruntattoostudio`
  - Facebook: `https://www.facebook.com/aruntattoostudio`
  - Pinterest: `https://in.pinterest.com/aruntattoostudio/`
  - YouTube: `https://www.youtube.com/@aruntattoostudio`

---

## 🛠️ Technology Stack

* **Framework**: React 19 + TypeScript + Vite 8
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Custom Dark Luxury Theme
* **3D Virtual Engine**: Three.js WebGL Engine with:
  - Procedural architectural room geometry (terrazzo floor, back slats, rafter beams)
  - Realistic multi-point lighting (tungsten spot, surgical CRI 98 daylight, gallery accent picture lights)
  - Atmospheric floating dust motes / volumetric lighting
  - Smooth cubic-lerp camera navigation across all 9 zones
  - Interactive mouse parallax & reduced-motion fallback
* **Audio**: Procedural Web Audio API soundscape (warm 55Hz/110Hz analog studio hum + haptic zone transition chime; zero external audio assets required)
* **Icons**: Lucide Icons + custom inline brand SVGs
* **Interaction**: Multi-step booking intent form with instant WhatsApp link generation and confetti celebration (`canvas-confetti`)

---

## 🚀 Getting Started

```bash
# Navigate to the workspace
cd arun-tattoos

# Install dependencies (already installed)
npm install

# Start Vite Development Server
npm run dev

# Build Production Bundle (tested & verified)
npm run build

# Preview Production Build
npm run preview
```

---

## 🗺️ Virtual Studio Zones & Camera Coordinates

| Zone ID | Code | Zone Name | Camera Position `[x, y, z]` | Target `[x, y, z]` | Key Feature |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `entrance` | ZONE 01 | Studio Threshold | `[0, 1.8, 7.5]` | `[0, 1.5, 0]` | Luminous doorway, credentials badge, Enter Studio portal |
| `reception` | ZONE 02 | Concierge & Welcome | `[0, 1.5, 3.2]` | `[0, 1.25, 0.4]` | Charred wood desk, bronze logo plate, hotspot routes |
| `gallery` | ZONE 03 | The Art Gallery | `[-3.8, 1.7, 1.2]` | `[-5.6, 1.7, 1.2]` | Curated living canvas wall, style filters, artwork inspector |
| `artist-desk` | ZONE 04 | Master Artist Atelier | `[-3.2, 1.6, -3.8]` | `[-3.6, 1.1, -5.6]` | Nani Kumar & Yeswanth deep dossiers & TTC credentials |
| `tattoo-station`| ZONE 05 | Sterile Tattoo Station | `[0, 1.65, -3.6]` | `[0, 1.05, -5.8]` | Hydraulic recliner, surgical lamp, Kwadron single-use pledge |
| `design-table` | ZONE 06 | Concept & Stencil Table| `[3.3, 1.55, -3.8]` | `[3.6, 1.1, -5.6]` | Anatomical placement calibrator (pain index, healing time) |
| `booking-area` | ZONE 07 | Booking Lounge | `[3.8, 1.65, 0.4]` | `[5.4, 1.45, 0.4]` | Multi-step booking intent form + WhatsApp prefill |
| `aftercare` | ZONE 08 | Aftercare & Preservation| `[2.6, 1.55, 3.4]` | `[3.8, 1.35, 3.4]` | 4-Phase healing timeline, clinical Dos & Don'ts |
| `final-exit` | ZONE 09 | Final Departure | `[0, 1.85, 5.8]` | `[0, 1.7, 9.2]` | Bandar Road Google Maps embed, phone hotline, socials |

---

## 🧭 Multi-Prompt Architecture Roadmap

* **Prompt 1 (Completed)**:
  - Audit reference website & extract authentic factual details.
  - Scaffold clean React + TypeScript + Vite + Tailwind CSS project at `C:\Users\navee\.gemini\antigravity\scratch\arun-tattoos`.
  - Establish 3D Scene Architecture & 9-zone camera interpolation.
  - Build the complete virtual walkthrough foundation, UI navigation, and interactive zones.
  - Zero build errors (`npm run build` passing cleanly).

* **Prompt 2 (Next)**:
  - Ultra-photorealistic 3D studio environment upgrade: GLTF/GLB models for Bishop rotary machine, hydraulic chair, and framed canvases.
  - GSAP / Framer Motion camera choreography with scroll-driven parallax timeline.
  - Advanced shaders (screen-space reflections on polished terrazzo floor, volumetric light beams).

* **Prompt 3**:
  - Deep content expansion: high-res photo gallery expansion, high-contrast black & grey zoom loupe, client video embeds, and localized Telugu/English toggles.

* **Prompt 4**:
  - Live backend booking engine (Supabase/Firebase/Node API), reference image drag-and-drop upload, SMS/WhatsApp confirmation webhooks, and artist admin dashboard.

* **Prompt 5**:
  - Lighthouse 100/100 performance optimization, WebGL context loss fallbacks, schema.org LocalBusiness structured data, security hardening, and deployment configuration.
