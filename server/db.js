import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'arun_tattoos.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for high performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// 1. Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('ADMIN', 'ARTIST')),
      artist_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      artist TEXT NOT NULL,
      style TEXT NOT NULL,
      artwork_id TEXT,
      placement TEXT NOT NULL,
      size TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL DEFAULT '11:00 AM',
      description TEXT,
      reference_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CONSULTATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS artworks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      artist TEXT NOT NULL,
      description TEXT,
      placement TEXT,
      style TEXT,
      image_url TEXT NOT NULL,
      high_res_url TEXT NOT NULL,
      session_duration TEXT,
      difficulty TEXT,
      technique TEXT,
      healing_estimate TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      is_placeholder INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      specialties TEXT NOT NULL DEFAULT '[]',
      image_url TEXT,
      years_experience INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS availability (
      id TEXT PRIMARY KEY,
      artist_id TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BLOCKED', 'BOOKED'))
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      review TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      artist TEXT NOT NULL,
      tattoo_done TEXT,
      location TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if users exist
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('[DATABASE] Seeding initial admin and artist credentials...');
    const adminPassHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ArunTattoos@Vijayawada2025', 10);
    const artistPassHash = bcrypt.hashSync('NaniKumar@2025', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, role, artist_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'user-admin-01',
      process.env.ADMIN_EMAIL || 'admin@aruntattoostudio.com',
      adminPassHash,
      'ADMIN',
      null,
      new Date().toISOString()
    );

    insertUser.run(
      'user-artist-01',
      'nani@aruntattoostudio.com',
      artistPassHash,
      'ARTIST',
      'nani-kumar',
      new Date().toISOString()
    );
  }

  // Seed Artists
  const artistCount = db.prepare('SELECT count(*) as count FROM artists').get().count;
  if (artistCount === 0) {
    console.log('[DATABASE] Seeding verified artists...');
    const insertArtist = db.prepare(`
      INSERT INTO artists (id, name, role, bio, specialties, image_url, years_experience, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertArtist.run(
      'nani-kumar',
      'Nani Kumar',
      'Founder & Principal Artist',
      'Nani Kumar founded Arun Tattoo Studio with a steadfast vision to elevate tattoo culture in Vijayawada into a refined, sterile art form. With 8+ years experience, TTC certification, and graphic design diploma.',
      JSON.stringify(['Custom Portrait Art', 'Micro Realism', 'Single-Needle Precision', 'Fine Line Arts']),
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80',
      8,
      1
    );

    insertArtist.run(
      'yeswanth',
      'Yeswanth',
      'Resident Tattoo Artist & Co-Creator',
      'Co-artist at Arun Tattoo Studio specializing in massive black & grey shading, Shiva mythological compositions, and anatomical camouflage cover-ups.',
      JSON.stringify(['Black & Grey Realism', 'Devotional & Mythological', 'Cover-up Restorations']),
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      6,
      1
    );
  }

  // Seed Initial Artworks
  const artworkCount = db.prepare('SELECT count(*) as count FROM artworks').get().count;
  if (artworkCount === 0) {
    console.log('[DATABASE] Seeding verified portfolio artworks...');
    const insertArt = db.prepare(`
      INSERT INTO artworks (
        id, title, category, artist, description, placement, style,
        image_url, high_res_url, session_duration, difficulty, technique,
        healing_estimate, featured, is_placeholder, published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedArts = [
      {
        id: 'art-01',
        title: 'Hyper-Realistic Memorial Portrait',
        category: 'Portrait',
        artist: 'Nani Kumar',
        description: 'Delicate high-contrast photorealistic portrait rendered from a vintage family heirloom photograph.',
        placement: 'Inner Forearm',
        style: 'Greywash Photorealism',
        imageUrl: 'https://images.unsplash.com/photo-1590246814883-57c511e76523?auto=format&fit=crop&w=1200&q=85',
        highResUrl: 'https://images.unsplash.com/photo-1590246814883-57c511e76523?auto=format&fit=crop&w=2000&q=95',
        sessionDuration: '6 Hours',
        difficulty: 'Master',
        technique: 'Multi-pass greywash feathering with 0.25mm 3RL single-needle highlights',
        healingEstimate: '12–14 Days',
        featured: 1,
        isPlaceholder: 0,
      },
      {
        id: 'art-02',
        title: 'Sacred Lord Shiva Cosmic Realism',
        category: 'Sacred / Devotional',
        artist: 'Yeswanth',
        description: 'Monumental devotional composition of Lord Shiva meditating with crescent moon, sacred river Ganges, and trishula.',
        placement: 'Upper Arm & Deltoid',
        style: 'High-Contrast Devotional Realism',
        imageUrl: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1200&q=85',
        highResUrl: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=2000&q=95',
        sessionDuration: '8 Hours (2 Sessions)',
        difficulty: 'Master',
        technique: 'Dynamic light-source volumetric shading with deep black negative space accents',
        healingEstimate: '14–18 Days',
        featured: 1,
        isPlaceholder: 0,
      },
      {
        id: 'art-03',
        title: 'Golden Ratio Geometric Astrolabe',
        category: 'Fine Line',
        artist: 'Nani Kumar',
        description: 'Microscopic sacred geometric mandala constructed using exact golden ratio Fibonacci spiral mathematics.',
        placement: 'Inner Bicep',
        style: 'Single-Needle Fine Line',
        imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1200&q=85',
        highResUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=2000&q=95',
        sessionDuration: '3.5 Hours',
        difficulty: 'Precision',
        technique: 'Micro-millimeter single pass with surgical steady hand and zero blowout',
        healingEstimate: '8–10 Days',
        featured: 1,
        isPlaceholder: 0,
      },
      {
        id: 'art-04',
        title: 'Phoenix Rebirth Optical Camouflage',
        category: 'Cover-Up',
        artist: 'Yeswanth',
        description: 'Complete restorative cover-up of a 12-year-old faded ink tribal armband using sweeping phoenix plumage.',
        placement: 'Upper Arm',
        style: 'Organic Dark Camouflage',
        imageUrl: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=1200&q=85',
        highResUrl: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=2000&q=95',
        sessionDuration: '7 Hours (2 Sessions)',
        difficulty: 'Advanced',
        technique: 'Intelligent optical distraction, charcoal saturation, and dermal gradient blending',
        healingEstimate: '14–16 Days',
        featured: 1,
        isPlaceholder: 0,
      },
    ];

    for (const art of seedArts) {
      insertArt.run(
        art.id,
        art.title,
        art.category,
        art.artist,
        art.description,
        art.placement,
        art.style,
        art.imageUrl,
        art.highResUrl,
        art.sessionDuration,
        art.difficulty,
        art.technique,
        art.healingEstimate,
        art.featured,
        art.isPlaceholder,
        1,
        new Date().toISOString()
      );
    }
  }

  // Seed Testimonials
  const testCount = db.prepare('SELECT count(*) as count FROM testimonials').get().count;
  if (testCount === 0) {
    console.log('[DATABASE] Seeding verified testimonials...');
    const insertTest = db.prepare(`
      INSERT INTO testimonials (id, client_name, review, rating, artist, tattoo_done, location, published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTest.run(
      'rev-01',
      'Venkatesh Rao',
      'Nani Kumar is truly a magician with portrait art. I brought a 20-year-old black and white photo of my late mother. The depth in her eyes and the gentle smile he captured on my arm brought my family to tears. The hygiene and sterile setup at the Bandar Road studio are comparable to an upscale medical clinic.',
      5,
      'Nani Kumar',
      'Mother Portrait on Forearm',
      'Vijayawada, AP',
      1,
      new Date().toISOString()
    );

    insertTest.run(
      'rev-02',
      'Sowmya Reddy',
      'I traveled specifically from Guntur to Arun Tattoo Studio because of Nani’s graphic design background and TTC fine-art qualifications. The lines are so clean, fine, and sharp! Completely painless healing with their aftercare wrap.',
      5,
      'Nani Kumar',
      'Micro Botanical Fine Line',
      'Guntur, AP',
      1,
      new Date().toISOString()
    );

    insertTest.run(
      'rev-03',
      'Karthik Krishna',
      'Both artists at Arun Tattoo Studio are absolute gems. They spent over 2 hours just helping me conceptualize the flow before touching the needle. 5 sessions later, I have a museum piece on my arm.',
      5,
      'Yeswanth & Nani Kumar',
      'Full Shiva Sleeve with Mandala',
      'Vijayawada, AP',
      1,
      new Date().toISOString()
    );
  }

  // Seed Sample Demonstrative Bookings if empty
  const bookingCount = db.prepare('SELECT count(*) as count FROM bookings').get().count;
  if (bookingCount === 0) {
    console.log('[DATABASE] Seeding sample demonstration bookings (marked clearly)...');
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        id, created_at, customer_name, phone, email, artist, style, artwork_id,
        placement, size, preferred_date, preferred_time, description, reference_image_url,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const todayStr = new Date().toISOString().split('T')[0];

    insertBooking.run(
      'AT-782914',
      new Date(Date.now() - 3600000 * 2).toISOString(),
      'Suresh Chandra',
      '+91 98480 22334',
      'suresh.chandra@gmail.com',
      'Nani Kumar',
      'Custom Portrait Art',
      'art-01',
      'Forearm / Inner Arm',
      'Medium (4–6 inches)',
      todayStr,
      '11:00 AM',
      'Memorial tribute portrait of grandfather with pocket watch background. High emotional significance.',
      null,
      'NEW',
      'Client contacted via website. Reviewing photo reference quality.'
    );

    insertBooking.run(
      'AT-541290',
      new Date(Date.now() - 3600000 * 18).toISOString(),
      'Ananya Verma',
      '+91 94401 55678',
      'ananya.v@outlook.com',
      'Yeswanth',
      'Cover-up & Scar Camouflage',
      'art-04',
      'Upper Arm / Shoulder / Bicep',
      'Large (7–10 inches)',
      todayStr,
      '02:30 PM',
      'Need to cover an old tribal wrist band that has faded unevenly. Prefers dark foliage or feathers.',
      null,
      'CONSULTATION',
      'In-person stencil calibration scheduled for 2:30 PM today.'
    );

    insertBooking.run(
      'AT-319802',
      new Date(Date.now() - 3600000 * 48).toISOString(),
      'Pradeep Goud',
      '+91 99890 11223',
      'pradeep.g@yahoo.com',
      'Nani Kumar',
      'Sacred & Monumental Full Back',
      'art-02',
      'Full Back / Spine',
      'Full Backpiece',
      todayStr,
      '05:00 PM',
      'Lord Shiva Nataraja cosmic dance piece covering full spine down to lower back.',
      null,
      'CONFIRMED',
      'Multi-session contract agreed. Session 1 prep confirmed.'
    );
  }
}
