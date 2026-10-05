import type { 
  BookingSubmission, 
  BookingRecord, 
  BookingStatus, 
  AdminUser, 
  AdminOverviewMetrics, 
  AvailabilitySlot,
  GalleryArtwork,
  Artist,
  Testimonial
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'arun_tattoos_admin_token';
const USER_KEY = 'arun_tattoos_admin_user';

// Auth State Helpers
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  customerName: string;
  artist: string;
  style: string;
  placement: string;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
  message: string;
}

export const api = {
  // 1. PUBLIC: Submit Booking Request
  async submitBooking(data: BookingSubmission): Promise<BookingResponse> {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    formData.append('preferredArtist', data.preferredArtist);
    formData.append('style', data.style);
    if (data.artworkId) formData.append('artworkId', data.artworkId);
    formData.append('placement', data.placement);
    formData.append('size', data.size);
    formData.append('preferredDate', data.preferredDate);
    if (data.preferredTime) formData.append('preferredTime', data.preferredTime);
    if (data.description) formData.append('description', data.description);
    if (data.honeypot) formData.append('honeypot', data.honeypot);
    if (data.referenceImage) {
      formData.append('referenceImage', data.referenceImage);
    }

    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to submit consultation request');
    }
    return json;
  },

  // 2. PUBLIC: Get Availability Slots
  async getAvailability(artist?: string, date?: string): Promise<{ slots: AvailabilitySlot[] }> {
    const params = new URLSearchParams();
    if (artist) params.set('artist', artist);
    if (date) params.set('date', date);

    const res = await fetch(`${BASE_URL}/availability?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch availability slots');
    }
    return res.json();
  },

  // 3. PUBLIC: Get Artworks
  async getArtworks(): Promise<GalleryArtwork[]> {
    const res = await fetch(`${BASE_URL}/artworks`);
    if (!res.ok) throw new Error('Failed to load artworks');
    const json = await res.json();
    return json.artworks;
  },

  // 4. PUBLIC: Get Artists
  async getArtists(): Promise<Artist[]> {
    const res = await fetch(`${BASE_URL}/artists`);
    if (!res.ok) throw new Error('Failed to load artists');
    const json = await res.json();
    return json.artists;
  },

  // 5. PUBLIC: Get Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${BASE_URL}/testimonials`);
    if (!res.ok) throw new Error('Failed to load testimonials');
    const json = await res.json();
    return json.testimonials;
  },

  // 6. AUTH: Login
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Invalid credentials');
    }

    setStoredAuth(json.token, json.user);
    return json;
  },

  // 7. AUTH: Get Current User Profile
  async getProfile(): Promise<AdminUser> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Session expired');
    const json = await res.json();
    return json.user;
  },

  // 8. ADMIN: Overview Metrics
  async getOverview(): Promise<AdminOverviewMetrics> {
    const res = await fetch(`${BASE_URL}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin overview metrics');
    return res.json();
  },

  // 9. ADMIN: Bookings List
  async getBookings(filters?: { status?: string; artist?: string; search?: string }): Promise<BookingRecord[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.artist) params.set('artist', filters.artist);
    if (filters?.search) params.set('search', filters.search);

    const res = await fetch(`${BASE_URL}/admin/bookings?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to retrieve bookings list');
    const json = await res.json();
    return json.bookings;
  },

  // 10. ADMIN: Single Booking Detail
  async getBooking(id: string): Promise<BookingRecord> {
    const res = await fetch(`${BASE_URL}/admin/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to retrieve booking');
    const json = await res.json();
    return json.booking;
  },

  // 11. ADMIN: Update Status (With Double Booking Protection)
  async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<{ success: boolean; status: BookingStatus }> {
    const res = await fetch(`${BASE_URL}/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status, notes }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to update status');
    }
    return json;
  },

  // 12. ADMIN: Modify Booking Record
  async updateBooking(id: string, payload: Partial<BookingRecord>): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to modify booking details');
    }
  },

  // 13. ADMIN: Calendar Events
  async getCalendar(startDate?: string, endDate?: string, artist?: string): Promise<{ events: BookingRecord[] }> {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (artist) params.set('artist', artist);

    const res = await fetch(`${BASE_URL}/admin/calendar?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load calendar events');
    return res.json();
  },

  // 14. ADMIN: Availability
  async getAvailabilitySchedule(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/admin/availability`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load availability');
    const json = await res.json();
    return json.availability;
  },

  async createAvailabilitySlot(slot: { artistId: string; date: string; startTime: string; endTime: string; status?: string }): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(slot),
    });
    if (!res.ok) throw new Error('Failed to block schedule slot');
  },

  async deleteAvailabilitySlot(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/availability/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete availability record');
  },

  // 15. ADMIN: Artwork Management
  async getAdminArtworks(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/admin/artworks`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      // Fallback to public artworks if needed
      return this.getArtworks();
    }
    const json = await res.json();
    return json.artworks;
  },

  async createArtwork(data: Record<string, any>, imageFile?: File): Promise<string> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    if (imageFile) {
      formData.append('artworkImage', imageFile);
    }

    const res = await fetch(`${BASE_URL}/admin/artworks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create artwork');
    return json.artworkId;
  },

  async updateArtwork(id: string, data: Record<string, any>): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/artworks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update artwork');
  },

  async deleteArtwork(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/artworks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete artwork');
  },

  // 16. ADMIN: Testimonials Management
  async createTestimonial(data: Record<string, any>): Promise<string> {
    const res = await fetch(`${BASE_URL}/admin/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error('Failed to create testimonial');
    return json.id;
  },

  async updateTestimonial(id: string, data: Record<string, any>): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update testimonial');
  },

  async deleteTestimonial(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete testimonial');
  },
};
