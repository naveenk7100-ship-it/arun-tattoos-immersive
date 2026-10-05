export type StudioZoneId =
  | 'entrance'
  | 'reception'
  | 'gallery'
  | 'artist-desk'
  | 'tattoo-station'
  | 'design-table'
  | 'booking-area'
  | 'aftercare'
  | 'final-exit';

export interface StudioZone {
  id: StudioZoneId;
  index: number;
  code: string;
  name: string;
  subhead: string;
  shortDesc: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    spotlightColor: string;
    spotlightIntensity: number;
  };
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  yearsExperience: number;
  careerStartAge: number;
  qualifications: string[];
  specialties: string[];
  bio: string;
  quote: string;
  image: string;
  featuredWorks: string[];
  achievements: string[];
}

export type GalleryCategory =
  | 'Portrait'
  | 'Black & Grey'
  | 'Fine Line'
  | 'Micro Realism'
  | 'Sacred / Devotional'
  | 'Cover-Up'
  | 'Minimal'
  | 'Full Back / Large Scale';

export interface CaseStudyStep {
  step: string;
  title: string;
  detail: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  context: string;
  beforeImage?: string;
  afterImage: string;
  steps: CaseStudyStep[];
  outcome: string;
}

export interface GalleryArtwork {
  id: string;
  title: string;
  category: GalleryCategory;
  artist: string;
  placement: string;
  style: string;
  size: string;
  description: string;
  sessionDuration: string;
  difficulty: 'Master' | 'Advanced' | 'Intricate' | 'Precision';
  healingEstimate: string;
  technique: string;
  imageUrl: string;
  highResUrl: string;
  featured: boolean;
  tags: string[];
  isPlaceholder?: boolean;
  beforeImage?: string;
  caseStudy?: CaseStudy;
}

export interface TattooService {
  id: string;
  title: string;
  category: string;
  description: string;
  processPoints: string[];
  idealFor: string;
  prepTime: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  review: string;
  tattooDone: string;
  artist: string;
  date: string;
  verified: boolean;
}

export interface StudioVideo {
  id: string;
  title: string;
  category: string;
  artist: string;
  duration: string;
  youtubeId: string;
  poster: string;
  description: string;
}

export type BookingStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'CONSULTATION'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BookingRecord {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  artist: string;
  style: string;
  artwork_id?: string | null;
  placement: string;
  size: string;
  preferred_date: string;
  preferred_time: string;
  description?: string | null;
  reference_image_url?: string | null;
  status: BookingStatus;
  notes?: string | null;
}

export interface BookingSubmission {
  fullName: string;
  phone: string;
  email: string;
  preferredArtist: string;
  style: string;
  artworkId?: string;
  placement: string;
  size: string;
  description: string;
  preferredDate: string;
  preferredTime?: string;
  agreeToConsultation: boolean;
  referenceImage?: File | null;
  honeypot?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'ARTIST';
  artistId?: string | null;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

export interface AdminOverviewMetrics {
  today: {
    new: number;
    consultations: number;
    confirmed: number;
  };
  totals: {
    all: number;
    new: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  artwork: {
    published: number;
    drafts: number;
  };
}

export interface StudioContact {
  studioName: string;
  tagline: string;
  address: {
    doorNo: string;
    colony: string;
    landmark: string;
    opposite: string;
    road: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    fullString: string;
  };
  phone: string;
  formattedPhone: string;
  email: string;
  workingHours: string;
  socials: {
    instagram: string;
    facebook: string;
    pinterest: string;
    youtube: string;
    whatsapp: string;
  };
}
