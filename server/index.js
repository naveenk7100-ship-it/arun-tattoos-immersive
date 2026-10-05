import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, initDatabase } from './db.js';
import { notificationService } from './notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & seed data
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'arun_tattoos_master_jwt_secret_dev_key_2026_super_secure';

// Uploads directories setup
const uploadsDir = path.join(__dirname, '..', 'uploads');
const refUploadsDir = path.join(uploadsDir, 'reference');
const artUploadsDir = path.join(uploadsDir, 'artwork');

[uploadsDir, refUploadsDir, artUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'artworkImage') {
      cb(null, artUploadsDir);
    } else {
      cb(null, refUploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  },
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
    service: 'Arun Tattoos Production Engine'
  });
});

// ==============================================================================
// RATE LIMITING & ANTI-SPAM
// ==============================================================================
const ipSubmissionTracker = new Map();

function rateLimitBookings(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxSubmissions = 10;

  const timestamps = ipSubmissionTracker.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxSubmissions) {
    return res.status(429).json({
      error: 'Too many booking requests from this network. Please call us directly at +91 95057 60918.',
    });
  }

  validTimestamps.push(now);
  ipSubmissionTracker.set(ip, validTimestamps);
  next();
}

// Indian Phone Validation: optional +91 or 0, followed by 10 digits starting with 6,7,8,9
function isValidIndianPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication session' });
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || (req.user.role !== role && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Insufficient permissions for this resource' });
    }
    next();
  };
}

// Helper: Booking ID Generator (e.g. AT-481923)
function generateBookingId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'AT-';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ==============================================================================
// PUBLIC ENDPOINTS
// ==============================================================================

// 1. Submit New Booking (Public with Anti-Spam & Image Upload)
app.post('/api/bookings', rateLimitBookings, (req, res, next) => {
  if (req.is('multipart/form-data')) {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } else {
    next();
  }
}, async (req, res) => {
  try {
    const fullName = req.body.fullName || req.body.customer_name;
    const phone = req.body.phone;
    const email = req.body.email;
    const preferredArtist = req.body.preferredArtist || req.body.artist;
    const style = req.body.style;
    const artworkId = req.body.artworkId || req.body.artwork_id;
    const placement = req.body.placement;
    const size = req.body.size;
    const preferredDate = req.body.preferredDate || req.body.preferred_date;
    const preferredTime = req.body.preferredTime || req.body.preferred_time || '11:00 AM';
    const description = req.body.description;
    const honeypot = req.body.honeypot; // Anti-spam hidden field

    // Anti-spam check
    if (honeypot && honeypot.trim().length > 0) {
      console.warn(`[ANTI-SPAM] Blocked automated submission from IP ${req.ip}`);
      return res.status(400).json({ error: 'Automated submission rejected' });
    }

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid full name (minimum 2 characters).' });
    }
    if (fullName.trim().length > 70) {
      return res.status(400).json({ error: 'Name exceeds maximum length (70 characters).' });
    }
    if (!phone || !isValidIndianPhone(phone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number (+91).' });
    }
    if (!preferredDate) {
      return res.status(400).json({ error: 'Please select a preferred consultation date.' });
    }

    // Future date check
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.status(400).json({ error: 'Preferred date must be today or a future date.' });
    }

    // Double-booking protection: check if slot is already reserved for this date and time
    const targetArtist = preferredArtist || 'Nani Kumar';
    const existingConflict = db.prepare(`
      SELECT id, status FROM bookings 
      WHERE preferred_date = ? 
      AND preferred_time = ? 
      AND (artist = ? OR ? = 'Any Available Artist')
      AND status NOT IN ('CANCELLED')
    `).get(preferredDate, preferredTime, targetArtist, targetArtist);

    if (existingConflict) {
      return res.status(409).json({
        error: `The ${preferredTime} slot on ${preferredDate} is already reserved for ${targetArtist}. Please select an alternate time slot.`,
        conflict: true
      });
    }

    const bookingId = generateBookingId();
    const createdAt = new Date().toISOString();
    
    // Find reference image from uploaded files if any
    const uploadedFile = req.file || (req.files && req.files.find(f => f.fieldname === 'referenceImage' || f.fieldname === 'reference_image'));
    const referenceImageUrl = uploadedFile ? `/uploads/reference/${uploadedFile.filename}` : null;

    const stmt = db.prepare(`
      INSERT INTO bookings (
        id, created_at, customer_name, phone, email, artist, style, artwork_id,
        placement, size, preferred_date, preferred_time, description, reference_image_url,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      bookingId,
      createdAt,
      fullName.trim(),
      phone.trim(),
      email ? email.trim() : null,
      preferredArtist || 'Nani Kumar',
      style || 'Custom Portrait Art',
      artworkId || null,
      placement || 'Forearm / Inner Arm',
      size || 'Medium (4–6 inches)',
      preferredDate,
      preferredTime,
      description ? description.trim() : '',
      referenceImageUrl,
      'NEW',
      'Submitted via virtual studio booking experience.'
    );

    const bookingRecord = {
      id: bookingId,
      customer_name: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      artist: preferredArtist || 'Nani Kumar',
      style: style || 'Custom Portrait Art',
      preferred_date: preferredDate,
      preferred_time: preferredTime,
    };

    // Trigger internal notification service
    notificationService.sendAdminNotification(bookingRecord).catch(console.error);
    notificationService.sendCustomerConfirmation(bookingRecord).catch(console.error);

    // Return safe public confirmation payload (no private notes)
    return res.status(201).json({
      success: true,
      bookingId,
      customerName: fullName.trim(),
      artist: preferredArtist || 'Nani Kumar',
      style: style || 'Custom Portrait Art',
      placement: placement || 'Forearm / Inner Arm',
      preferredDate,
      preferredTime,
      status: 'NEW',
      message: 'Consultation request received successfully.',
    });
  } catch (err) {
    console.error('Booking submission error:', err);
    return res.status(500).json({ error: 'Unable to process consultation request. Please try again or call the studio directly.' });
  }
});

// 2. Query Public Availability
app.get('/api/availability', (req, res) => {
  const { artist, date } = req.query;
  const standardSlots = [
    '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'
  ];

  if (!date) {
    return res.json({ slots: standardSlots.map((time) => ({ time, available: true })) });
  }

  try {
    // Check confirmed bookings for this artist and date
    const bookedRows = db.prepare(`
      SELECT preferred_time FROM bookings
      WHERE status IN ('CONFIRMED', 'CONSULTATION')
      AND preferred_date = ?
      ${artist ? 'AND artist = ?' : ''}
    `).all(...(artist ? [date, artist] : [date]));

    const bookedTimes = new Set(bookedRows.map((r) => r.preferred_time));

    // Check custom blocked slots from availability table
    const blockedRows = db.prepare(`
      SELECT start_time FROM availability
      WHERE status IN ('BLOCKED', 'BOOKED')
      AND date = ?
    `).all(date);

    blockedRows.forEach((r) => bookedTimes.add(r.start_time));

    const slots = standardSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }));

    return res.json({ artist, date, slots });
  } catch (err) {
    console.error('Error fetching availability:', err);
    return res.status(500).json({ error: 'Failed to fetch slot availability' });
  }
});

// 3. Public Artworks
app.get('/api/artworks', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM artworks
      WHERE published = 1
      ORDER BY featured DESC, created_at DESC
    `).all();

    const artworks = rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      artist: r.artist,
      description: r.description,
      placement: r.placement,
      style: r.style,
      imageUrl: r.image_url,
      highResUrl: r.high_res_url,
      sessionDuration: r.session_duration,
      difficulty: r.difficulty,
      technique: r.technique,
      healingEstimate: r.healing_estimate,
      featured: Boolean(r.featured),
      isPlaceholder: Boolean(r.is_placeholder),
      tags: [r.category, r.style].filter(Boolean),
    }));

    return res.json({ artworks });
  } catch (err) {
    console.error('Error fetching artworks:', err);
    return res.status(500).json({ error: 'Failed to load artworks' });
  }
});

// 4. Public Artists
app.get('/api/artists', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM artists WHERE active = 1').all();
    const artists = rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      bio: r.bio,
      specialties: JSON.parse(r.specialties || '[]'),
      imageUrl: r.image_url,
      yearsExperience: r.years_experience,
    }));
    return res.json({ artists });
  } catch (err) {
    console.error('Error fetching artists:', err);
    return res.status(500).json({ error: 'Failed to load artists' });
  }
});

// 5. Public Testimonials
app.get('/api/testimonials', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM testimonials
      WHERE published = 1
      ORDER BY rating DESC, created_at DESC
    `).all();

    const testimonials = rows.map((r) => ({
      id: r.id,
      clientName: r.client_name,
      review: r.review,
      rating: r.rating,
      artist: r.artist,
      tattooDone: r.tattoo_done,
      location: r.location,
    }));

    return res.json({ testimonials });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    return res.status(500).json({ error: 'Failed to load testimonials' });
  }
});

// ==============================================================================
// AUTHENTICATION ENDPOINTS
// ==============================================================================

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        artistId: user.artist_id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        artistId: user.artist_id,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal login verification failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, role, artist_id, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Profile verification failed' });
  }
});

// ==============================================================================
// PROTECTED ADMIN ENDPOINTS
// ==============================================================================

// 1. Dashboard Overview Metrics
app.get('/api/admin/overview', authenticateToken, (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Today metrics
    const todayNew = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'NEW' AND preferred_date = ?`).get(todayStr).c;
    const todayConsultations = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'CONSULTATION' AND preferred_date = ?`).get(todayStr).c;
    const todayConfirmed = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'CONFIRMED' AND preferred_date = ?`).get(todayStr).c;

    // Total counts
    const totalBookings = db.prepare('SELECT count(*) as c FROM bookings').get().c;
    const totalNew = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'NEW'`).get().c;
    const totalConfirmed = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'CONFIRMED'`).get().c;
    const totalCompleted = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'COMPLETED'`).get().c;
    const totalCancelled = db.prepare(`SELECT count(*) as c FROM bookings WHERE status = 'CANCELLED'`).get().c;

    // Artwork counts
    const publishedArtworks = db.prepare(`SELECT count(*) as c FROM artworks WHERE published = 1`).get().c;
    const draftArtworks = db.prepare(`SELECT count(*) as c FROM artworks WHERE published = 0`).get().c;

    return res.json({
      today: {
        new: todayNew,
        consultations: todayConsultations,
        confirmed: todayConfirmed,
      },
      totals: {
        all: totalBookings,
        new: totalNew,
        confirmed: totalConfirmed,
        completed: totalCompleted,
        cancelled: totalCancelled,
      },
      artwork: {
        published: publishedArtworks,
        drafts: draftArtworks,
      },
    });
  } catch (err) {
    console.error('Error fetching admin overview:', err);
    return res.status(500).json({ error: 'Failed to compute dashboard metrics' });
  }
});

// 2. Bookings Management (List, Filter, Search)
app.get('/api/admin/bookings', authenticateToken, (req, res) => {
  try {
    const { status, artist, search, limit = 50 } = req.query;
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    // Role filtering: ARTIST role only sees assigned bookings
    if (req.user.role === 'ARTIST' && req.user.artistId) {
      query += ' AND (artist LIKE ? OR artist = ?)';
      params.push(`%${req.user.artistId}%`, req.user.artistId);
    } else if (artist && artist !== 'ALL') {
      query += ' AND artist = ?';
      params.push(artist);
    }

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      query += ' AND (customer_name LIKE ? OR phone LIKE ? OR id LIKE ? OR style LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));

    const bookings = db.prepare(query).all(...params);
    return res.json({ bookings });
  } catch (err) {
    console.error('Error fetching admin bookings:', err);
    return res.status(500).json({ error: 'Failed to retrieve bookings list' });
  }
});

// 3. Single Booking Detail
app.get('/api/admin/bookings/:id', authenticateToken, (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found' });
    }
    return res.json({ booking });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve booking' });
  }
});

// 4. Update Booking Status (With Double-Booking Protection on CONFIRMED)
app.patch('/api/admin/bookings/:id/status', authenticateToken, (req, res) => {
  const { status, notes } = req.body;
  const validStatuses = ['NEW', 'CONTACTED', 'CONSULTATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid booking status supplied' });
  }

  try {
    const current = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Double-booking check when confirming
    if (status === 'CONFIRMED') {
      const conflict = db.prepare(`
        SELECT id, customer_name FROM bookings
        WHERE status = 'CONFIRMED'
        AND artist = ?
        AND preferred_date = ?
        AND preferred_time = ?
        AND id != ?
      `).get(current.artist, current.preferred_date, current.preferred_time, current.id);

      if (conflict) {
        return res.status(409).json({
          error: `Double-booking conflict: ${current.artist} is already confirmed with ${conflict.customer_name} at ${current.preferred_time} on ${current.preferred_date}. Please calibrate an alternative time slot before confirming.`,
        });
      }
    }

    const updatedNotes = notes !== undefined ? notes : current.notes;
    db.prepare('UPDATE bookings SET status = ?, notes = ? WHERE id = ?').run(status, updatedNotes, req.params.id);

    return res.json({
      success: true,
      bookingId: req.params.id,
      status,
      notes: updatedNotes,
    });
  } catch (err) {
    console.error('Error updating booking status:', err);
    return res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// 5. Update Full Booking (Modify time, artist, notes)
app.patch('/api/admin/bookings/:id', authenticateToken, (req, res) => {
  const { artist, preferredDate, preferredTime, notes, placement, size } = req.body;

  try {
    const current = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const newArtist = artist || current.artist;
    const newDate = preferredDate || current.preferred_date;
    const newTime = preferredTime || current.preferred_time;

    // Check double-booking if current is confirmed
    if (current.status === 'CONFIRMED') {
      const conflict = db.prepare(`
        SELECT id, customer_name FROM bookings
        WHERE status = 'CONFIRMED'
        AND artist = ?
        AND preferred_date = ?
        AND preferred_time = ?
        AND id != ?
      `).get(newArtist, newDate, newTime, current.id);

      if (conflict) {
        return res.status(409).json({
          error: `Slot unavailable: ${newArtist} already has a confirmed session with ${conflict.customer_name} on ${newDate} at ${newTime}.`,
        });
      }
    }

    db.prepare(`
      UPDATE bookings SET
        artist = ?,
        preferred_date = ?,
        preferred_time = ?,
        notes = ?,
        placement = ?,
        size = ?
      WHERE id = ?
    `).run(
      newArtist,
      newDate,
      newTime,
      notes !== undefined ? notes : current.notes,
      placement || current.placement,
      size || current.size,
      req.params.id
    );

    return res.json({ success: true, message: 'Booking details updated successfully.' });
  } catch (err) {
    console.error('Error updating booking:', err);
    return res.status(500).json({ error: 'Failed to modify booking record' });
  }
});

// 5b. Update Booking Notes Directly
app.patch('/api/admin/bookings/:id/notes', authenticateToken, (req, res) => {
  const { notes } = req.body;
  try {
    const current = db.prepare('SELECT id FROM bookings WHERE id = ?').get(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    db.prepare('UPDATE bookings SET notes = ? WHERE id = ?').run(notes || '', req.params.id);
    return res.json({ success: true, bookingId: req.params.id, notes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notes' });
  }
});

// 6. Admin Calendar View Data
app.get('/api/admin/calendar', authenticateToken, (req, res) => {
  const { startDate, endDate, artist } = req.query;

  try {
    let query = `
      SELECT id, customer_name, phone, artist, style, placement, preferred_date, preferred_time, status
      FROM bookings
      WHERE status IN ('NEW', 'CONSULTATION', 'CONFIRMED')
    `;
    const params = [];

    if (startDate && endDate) {
      query += ' AND preferred_date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (artist && artist !== 'ALL') {
      query += ' AND artist = ?';
      params.push(artist);
    }

    query += ' ORDER BY preferred_date ASC, preferred_time ASC';

    const events = db.prepare(query).all(...params);
    return res.json({ events });
  } catch (err) {
    console.error('Calendar error:', err);
    return res.status(500).json({ error: 'Failed to load calendar events' });
  }
});

// 7. Availability Schedule Management
app.get('/api/admin/availability', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM availability ORDER BY date ASC, start_time ASC').all();
    return res.json({ availability: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load availability' });
  }
});

app.post('/api/admin/availability', authenticateToken, (req, res) => {
  const { artistId, date, startTime, endTime, status = 'BLOCKED' } = req.body;
  if (!artistId || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Artist, date, startTime, and endTime are required' });
  }

  try {
    const id = `avail-${Date.now()}`;
    db.prepare(`
      INSERT INTO availability (id, artist_id, date, start_time, end_time, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, artistId, date, startTime, endTime, status);

    return res.status(201).json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create availability rule' });
  }
});

app.delete('/api/admin/availability/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM availability WHERE id = ?').run(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete availability record' });
  }
});

// 8. Artwork CRUD (Admin with Image Upload)
app.post('/api/admin/artworks', authenticateToken, upload.single('artworkImage'), (req, res) => {
  try {
    const {
      title,
      category,
      artist,
      description,
      placement,
      style,
      sessionDuration,
      difficulty,
      technique,
      healingEstimate,
      featured = 0,
      isPlaceholder = 0,
      published = 1,
      imageUrl,
      highResUrl,
    } = req.body;

    if (!title || !category || !artist) {
      return res.status(400).json({ error: 'Title, category, and artist are required' });
    }

    const uploadedUrl = req.file ? `/uploads/artwork/${req.file.filename}` : null;
    const finalImageUrl = uploadedUrl || imageUrl || 'https://images.unsplash.com/photo-1590246814883-57c511e76523?auto=format&fit=crop&w=1200&q=85';
    const finalHighResUrl = highResUrl || finalImageUrl;

    const id = `art-${Date.now().toString(36)}`;
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO artworks (
        id, title, category, artist, description, placement, style,
        image_url, high_res_url, session_duration, difficulty, technique,
        healing_estimate, featured, is_placeholder, published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      category.trim(),
      artist.trim(),
      description || '',
      placement || '',
      style || '',
      finalImageUrl,
      finalHighResUrl,
      sessionDuration || '3-5 Hours',
      difficulty || 'Advanced',
      technique || 'Micro-fine line and greywash',
      healingEstimate || '10-14 Days',
      Number(featured) ? 1 : 0,
      Number(isPlaceholder) ? 1 : 0,
      Number(published) ? 1 : 0,
      createdAt
    );

    return res.status(201).json({ success: true, artworkId: id });
  } catch (err) {
    console.error('Create artwork error:', err);
    return res.status(500).json({ error: 'Failed to save artwork' });
  }
});

app.put('/api/admin/artworks/:id', authenticateToken, (req, res) => {
  try {
    const {
      title,
      category,
      artist,
      description,
      placement,
      style,
      sessionDuration,
      difficulty,
      technique,
      healingEstimate,
      featured,
      isPlaceholder,
      published,
    } = req.body;

    db.prepare(`
      UPDATE artworks SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        artist = COALESCE(?, artist),
        description = COALESCE(?, description),
        placement = COALESCE(?, placement),
        style = COALESCE(?, style),
        session_duration = COALESCE(?, session_duration),
        difficulty = COALESCE(?, difficulty),
        technique = COALESCE(?, technique),
        healing_estimate = COALESCE(?, healing_estimate),
        featured = COALESCE(?, featured),
        is_placeholder = COALESCE(?, is_placeholder),
        published = COALESCE(?, published)
      WHERE id = ?
    `).run(
      title,
      category,
      artist,
      description,
      placement,
      style,
      sessionDuration,
      difficulty,
      technique,
      healingEstimate,
      featured !== undefined ? Number(featured) : null,
      isPlaceholder !== undefined ? Number(isPlaceholder) : null,
      published !== undefined ? Number(published) : null,
      req.params.id
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Update artwork error:', err);
    return res.status(500).json({ error: 'Failed to update artwork' });
  }
});

app.delete('/api/admin/artworks/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM artworks WHERE id = ?').run(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

// 9. Testimonial CRUD
app.post('/api/admin/testimonials', authenticateToken, (req, res) => {
  const { clientName, review, rating = 5, artist, tattooDone, location, published = 1 } = req.body;
  if (!clientName || !review || !artist) {
    return res.status(400).json({ error: 'Client name, review, and artist are required' });
  }

  try {
    const id = `rev-${Date.now()}`;
    db.prepare(`
      INSERT INTO testimonials (id, client_name, review, rating, artist, tattoo_done, location, published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, clientName, review, rating, artist, tattooDone || '', location || 'Vijayawada', Number(published) ? 1 : 0, new Date().toISOString());

    return res.status(201).json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/admin/testimonials/:id', authenticateToken, (req, res) => {
  const { published, review, rating } = req.body;
  try {
    db.prepare(`
      UPDATE testimonials SET
        published = COALESCE(?, published),
        review = COALESCE(?, review),
        rating = COALESCE(?, rating)
      WHERE id = ?
    `).run(published !== undefined ? Number(published) : null, review, rating, req.params.id);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/admin/testimonials/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[ARUN TATTOOS API] Persistent backend listening on http://localhost:${PORT}`);
  console.log(`[STORAGE] Uploads directory: ${uploadsDir}`);
});
