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
  aboutHeroImage?: Image;
  doctorsHeroImage?: Image;
  cuidareHeroImage?: Image;
  endosHeroImage?: Image;
  endosSafetyImage?: Image;
  homeHeroImage?: SanityImageWithLQIP;
  homeHeroDescription: LocalizedString;
  processImage?: SanityImageWithLQIP;
  proceduresBgImage?: SanityImageWithLQIP;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  jobBoardEmail?: string;
  whatsappCommercial?: string;
  appDownloadUrl?: string;
}


export interface Procedure {
  _id: string;
  order: number;
  name: string;
  duration: string;
  shortDescription: string;
  submark: 'Endos' | 'Cuidare';
  image: SanityImageWithLQIP;
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
  photo: Image;
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
  heroImage?: Image;
  clinicsSectionImage?: Image;
  availableAt?: Array<{ _id: string; slug: string }>;
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
// ABOUT PAGE
// ============================================

export interface DifferentialService {
  title?: LocalizedString;
  link?: string;
  linkText?: LocalizedString;
}

export interface AboutPage {
  _id: string;
  heroTitle?: LocalizedString;
  heroDescription?: LocalizedString;
  moreTitleLine1?: LocalizedString;
  moreTitleUnderlined?: LocalizedString;
  moreTitleSuffix?: LocalizedString;
  moreDescription?: LocalizedString;
  differentialServices?: DifferentialService[];
  bodyMindTitlePrefix?: LocalizedString;
  bodyMindTitleUnderlined?: LocalizedString;
  bodyMindTitleSuffix?: LocalizedString;
  bodyMindDescription?: LocalizedString;
  supportGroupTitle?: LocalizedString;
  supportGroupDescription?: LocalizedString;
  awareTitle?: LocalizedString;
  awareDescription?: LocalizedString;
  testimonialsTitle?: LocalizedString;
  testimonialsSubtitle?: LocalizedString;
  doubtsTitleUnderlined?: LocalizedString;
  doubtsTitleSuffix?: LocalizedString;
  doubtsDescription?: LocalizedString;
  faqTitleUnderlined?: LocalizedString;
  faqTitleSuffix?: LocalizedString;
}
