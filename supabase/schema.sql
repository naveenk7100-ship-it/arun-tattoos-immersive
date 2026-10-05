-- ==============================================================================
-- ARUN TATTOOS — PRODUCTION DATABASE SCHEMA & POLICIES (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'ARTIST')),
  artist_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, -- e.g. AT-492810
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  artist TEXT NOT NULL,
  style TEXT NOT NULL,
  artwork_id TEXT,
  placement TEXT NOT NULL,
  size TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL DEFAULT '11:00 AM',
  description TEXT,
  reference_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CONSULTATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  notes TEXT
);

-- 3. ARTWORKS TABLE
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
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_placeholder BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ARTISTS TABLE
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  specialties JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  years_experience INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS availability (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BLOCKED', 'BOOKED'))
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  artist TEXT NOT NULL,
  tattoo_done TEXT,
  location TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_availability_artist_date ON availability(artist_id, date);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can insert new bookings
CREATE POLICY "Public can submit bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Public can read published artworks
CREATE POLICY "Public can view published artworks" ON artworks
  FOR SELECT USING (published = true);

-- Public can view active artists
CREATE POLICY "Public can view active artists" ON artists
  FOR SELECT USING (active = true);

-- Public can view published testimonials
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (published = true);

-- Public can view availability slots (date/time/status only)
CREATE POLICY "Public can view availability slots" ON availability
  FOR SELECT USING (true);
