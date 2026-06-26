import type { Image } from 'sanity';
import type { LocalizedString, LocalizedText } from './lib/localization';

export interface SanityImageWithLQIP extends Image {
  asset?: Image['asset'] & {
    metadata?: {
      lqip?: string;
    };
  };
}


export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  title: string;
  tagline: LocalizedString;
  logo?: Image;
  logoDark?: Image;
  // Hero images — one per page
  homeHeroDescription: LocalizedString;
  aboutHeroImage?: SanityImageWithLQIP;
  serviciosHeroImage?: SanityImageWithLQIP;
  endosHeroImage?: SanityImageWithLQIP;
  cuidareHeroImage?: SanityImageWithLQIP;
  doctorsHeroImage?: SanityImageWithLQIP;
  contactHeroImage?: SanityImageWithLQIP;
  // Wellbeing list
  wellbeingList?: Array<{
    _key: string;
    icon: string;
    title: LocalizedString;
    description: LocalizedString;
  }>;
  // Studies gallery
  studiesGallery?: Array<{ _key: string; image: SanityImageWithLQIP; alt?: string }>;
  // Services list
  servicesList?: Array<{
    _key: string;
    icon: string;
    title: LocalizedString;
    description: LocalizedString;
  }>;
  // How it works steps
  howItWorksSteps?: Array<{ _key: string; image: SanityImageWithLQIP }>;
  // Section images
  wellnessImage?: SanityImageWithLQIP;
  processImage?: SanityImageWithLQIP;
  proceduresBgImage?: SanityImageWithLQIP;
  cuidareRadiologyImage?: SanityImageWithLQIP;
  appointmentCtaBgImage?: SanityImageWithLQIP;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  jobBoardEmail?: string;
  whatsappCommercial?: string;
  appDownloadUrl?: string;
}


export interface ProcedureHighlight {
  _key: string;
  text: string;
}

export interface Procedure {
  _id: string;
  order: number;
  name: string;
  shortDescription: string;
  highlights?: ProcedureHighlight[];
  submark: 'Endos' | 'Cuidare';
  image: SanityImageWithLQIP;
  duration?: string;
}

export interface ClinicAddress {
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
}

export interface ClinicHours {
  days: string;
  opens: string;
  closes: string;
}

export interface ClinicGeo {
  lat: number;
  lng: number;
}

export interface Clinic {
  _id: string;
  _type: 'clinic';
  slug: string;
  name: LocalizedString;
  shortDescription?: LocalizedString;
  address: ClinicAddress;
  geo?: ClinicGeo;
  phone?: string;
  whatsapp?: string;
  whatsappEndos?: string;
  whatsappCuidare?: string;
  email?: string;
  hours?: ClinicHours[];
  description?: { es: string; en: string };
  heroImage?: Image;
  isPrimary?: boolean;
}

export interface DoctorSlug {
  _type: 'slug';
  current: string;
}

export interface Doctor {
  _id: string;
  _type: 'doctor';
  fullName: string;
  slug: DoctorSlug;
  photo: SanityImageWithLQIP;
  specialty: LocalizedString;
  medicalSpecialties?: string[];
  bio?: LocalizedString;
  clinics: Array<{
    _id: string;
    slug: string;
    name: LocalizedString;
  }>;
  credentials?: string[];
  order?: number;
  isActive: boolean;
}

export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  name: string;
  photo: SanityImageWithLQIP;
  testimonial: LocalizedString;
  role?: LocalizedString;
  order?: number;
  isActive: boolean;
}

export type ServiceCategory = 'main' | 'wellness';

export interface Service {
  _id: string;
  _type: 'service';
  name: LocalizedString;
  description?: LocalizedText;
  icon: string;
  category: ServiceCategory;
  order?: number;
  isActive: boolean;
  availableAt?: Array<{ _id: string; slug: string }>;
}

export interface ServiciosPage {
  _id: string;
  enfoqueImage?: SanityImageWithLQIP;
  clinicsSectionImage?: SanityImageWithLQIP;
  partnersImage?: SanityImageWithLQIP;
}

export interface EndosPage {
  _id: string;
  safetyImage?: SanityImageWithLQIP;
  faqItems?: Array<{
    _key: string;
    question: LocalizedString;
    answer: LocalizedString;
  }>;
}


export interface Insurance {
  _id: string;
  _type: 'insurance';
  name: string;
  logo: Image;
  website?: string;
  order?: number;
  isActive: boolean;
}

export interface FAQ {
  _id: string;
  _type: 'faq';
  question: LocalizedString;
  answer: LocalizedString;
  doctor?: {
    _id: string;
    fullName: string;
    photo: Image;
    specialty: LocalizedString;
  };
  category: 'general' | 'treatment' | 'prevention' | 'services' | 'insurance';
  page: 'about' | 'services' | 'endos' | 'cuidare' | 'all';
  order?: number;
  isActive: boolean;
}

// ============================================
// JOB POSTING
// ============================================

export type CitySlug = 'guadalajara' | 'colima';

export type AreaSlug =
  | 'cuentas-por-pagar'
  | 'facturacion'
  | 'tesoreria'
  | 'boutique'
  | 'cobranza'
  | 'cotizaciones'
  | 'desarrollo-organizacional'
  | 'servicios-generales'
  | 'mercadotecnia'
  | 'tecnologias-de-la-informacion'
  | 'enlace-con-aseguradoras'
  | 'direccion-operativa'
  | 'atencion-al-paciente'
  | 'atencion-medica'
  | 'enfermeria'
  | 'administracion'
  | 'sanidad-y-regulacion';

export interface JobPosting {
  _id: string;
  _type: 'jobPosting';
  title: LocalizedString;
  description?: LocalizedText;
  city: CitySlug;
  area: AreaSlug;
  isActive: boolean;
  publishedAt: string;
  closingDate?: string;
  odooRef?: string;
}
export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: string;
  children: Array<{ _type: 'span'; _key: string; text: string; marks?: string[] }>;
  markDefs?: Array<{ _type: string; _key: string; href?: string }>;
  listItem?: string;
  level?: number;
}

export interface PrivacyPolicySection {
  heading: { es: string; en: string };
  bodyEs: PortableTextBlock[];
  bodyEn: PortableTextBlock[];
}

export interface PrivacyPolicy {
  _id: string;
  title: { es: string; en: string };
  lastUpdated: string;
  introduction?: { es: string; en: string };
  content: PrivacyPolicySection[];
}


// ============================================
// ONKIMIA DOCTORS SETTINGS
// ============================================

export interface OnkimiaDocsSettings {
  logo?: SanityImageWithLQIP;
  symbol?: SanityImageWithLQIP;
  whatIsImage?: SanityImageWithLQIP;
  improvementsImage?: SanityImageWithLQIP;
  benefitsImage?: SanityImageWithLQIP;
  whatsappEndos?: string;
  whatsappCuidare?: string;
}

// ============================================
// ABOUT PAGE
// ============================================

export interface FAQItem {
  _key: string;
  question: string;
  answer: string;
  doctor: {
    _id: string;
    fullName: string;
    specialty: string;
    photo: SanityImageWithLQIP;
  };
}

export interface AboutPage {
  _id: string;
  enfoque360Image?: SanityImageWithLQIP;
  supportGroupImage?: SanityImageWithLQIP;
  awareImage?: SanityImageWithLQIP;
  testimonialsTitle?: LocalizedString;
  testimonialsSubtitle?: LocalizedString;
  reikyImage?: SanityImageWithLQIP;
  aboutTestimonials?: Array<{
    _key: string;
    photo: SanityImageWithLQIP;
    name: string;
    role?: LocalizedString;
    testimonial: LocalizedString;
  }>;
  faqItems?: FAQItem[];
}
