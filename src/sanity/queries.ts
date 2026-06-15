import { groq } from 'next-sanity';

const HERO_IMAGE_FRAGMENT = groq`{ ..., asset->{ ..., metadata { lqip } } }`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    _id,
    _type,
    title,
    tagline,
    logo,
    logoDark,
    // Hero images — one per page
    homeHeroImage ${HERO_IMAGE_FRAGMENT},
    homeHeroDescription,
    aboutHeroImage ${HERO_IMAGE_FRAGMENT},
    serviciosHeroImage ${HERO_IMAGE_FRAGMENT},
    endosHeroImage ${HERO_IMAGE_FRAGMENT},
    cuidareHeroImage ${HERO_IMAGE_FRAGMENT},
    doctorsHeroImage ${HERO_IMAGE_FRAGMENT},
    contactHeroImage ${HERO_IMAGE_FRAGMENT},
    // Section images
    processImage ${HERO_IMAGE_FRAGMENT},
    proceduresBgImage ${HERO_IMAGE_FRAGMENT},
    cuidareRadiologyImage ${HERO_IMAGE_FRAGMENT},
    socialMedia,
    whatsappCommercial,
    jobBoardEmail
  }
`;

export const CLINICS_QUERY = groq`
  *[_type == "clinic"] | order(isPrimary desc, name.es asc) {
    _id,
    _type,
    slug,
    name,
    shortDescription,
    address,
    geo,
    phone,
    whatsapp,
    whatsappEndos,
    whatsappCuidare,
    email,
    hours,
    heroImage,
    isPrimary
  }
`;

/**
 * Sede primaria (isPrimary: true) con todos los datos necesarios para contacto.
 * Usado en /contacto.
 */
export const PRIMARY_CLINIC_QUERY = groq`
  *[_type == "clinic" && isPrimary == true][0] {
    _id,
    _type,
    slug,
    name,
    address,
    geo,
    phone,
    whatsapp,
    email,
    hours,
    isPrimary
  }
`;

export const CLINIC_BY_SLUG_QUERY = groq`
  *[_type == "clinic" && slug == $slug][0] {
    _id,
    _type,
    slug,
    name,
    shortDescription,
    description,
    address,
    geo,
    phone,
    whatsapp,
    whatsappEndos,
    whatsappCuidare,
    email,
    hours,
    heroImage,
    isPrimary
  }
`;

/**
 * Servicios disponibles en una sede.
 * Si availableAt está vacío o no definido, el servicio está en todas las sedes.
 */
export const SERVICES_BY_CLINIC_QUERY = groq`
  *[
    _type == "service"
    && isActive == true
    && (!defined(availableAt) || count(availableAt) == 0 || references($clinicId))
  ] | order(order asc, name.es asc) {
    _id,
    _type,
    name,
    description,
    icon,
    category,
    order,
    isActive,
    heroImage,
    clinicsSectionImage,
    "availableAt": availableAt[]->{
      _id,
      "slug": slug.current
    }
  }
`;

export const DOCTORS_QUERY = groq`
  *[_type == "doctor"] | order(order asc, fullName asc) {
    _id,
    _type,
    fullName,
    slug,
    photo {
      ...,
      asset-> {
        ...,
        metadata {
          lqip
        }
      }
    },
    specialty,
    medicalSpecialties,
    bio,
    "clinics": clinics[]-> {
      _id,
      slug,
      name
    },
    credentials,
    order,
    isActive
  }
`;

export const DOCTORS_BY_CLINIC_QUERY = groq`
  *[_type == "doctor" && isActive == true && $clinicSlug in clinics[]->slug] 
    | order(order asc, fullName asc) {
    _id,
    _type,
    fullName,
    slug,
    photo,
    specialty,
    medicalSpecialties,
    bio,
    "clinics": clinics[]-> {
      _id,
      slug,
      name
    },
    credentials,
    order,
    isActive
  }
`;

export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial" && isActive == true] | order(order asc, _createdAt desc) {
    _id,
    name,
    photo,
    testimonial,
    role,
    order,
    isActive
  }
`;

export const FAQS_BY_PAGE_QUERY = groq`
  *[_type == "faq" && isActive == true && (page == $page || page == "all")] | order(order asc, _createdAt desc) [0...6] {
    _id,
    question,
    answer,
    doctor-> {
      _id,
      fullName,
      photo,
      specialty
    },
    category,
    page,
    order,
    isActive
  }
`;

// ============================================
// SERVICES
// ============================================

/** Singleton página Servicios — solo imágenes de sección. */
export const SERVICIOS_PAGE_QUERY = groq`
  *[_type == "serviciosPage" && _id == "serviciosPage"][0] {
    _id,
    enfoqueImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    clinicsSectionImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    partnersImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop }
  }
`;

/** Servicios complementarios activos. Usado en Home sección "Bienestar integral". */
export const WELLNESS_SERVICES_QUERY = groq`
  *[_type == "service" && category == "wellness" && isActive == true]
    | order(order asc) {
    _id,
    _type,
    name,
    description,
    icon,
    category,
    order,
    isActive
  }
`;

// ============================================
// INSURANCES
// ============================================

// ============================================
// JOB POSTINGS
// ============================================

/**
 * Vacantes activas, sin fecha de cierre o con fecha futura.
 * Usado en /bolsa-de-trabajo.
 */
export const ACTIVE_JOB_POSTINGS_QUERY = groq`
  *[
    _type == "jobPosting"
    && isActive == true
    && (
      !defined(closingDate)
      || closingDate > now()
    )
  ] | order(publishedAt desc) {
    _id,
    _type,
    title,
    description,
    city,
    area,
    isActive,
    publishedAt,
    closingDate
  }
`;

/** Aseguradoras activas. Usado en Home sección "Convenios". */
export const INSURANCES_QUERY = groq`
  *[_type == "insurance" && isActive == true]
    | order(order asc, name asc) {
    _id,
    _type,
    name,
    logo,
    website,
    order,
    isActive
  }
`;
/** Singleton página Nosotros. */
export const ABOUT_PAGE_QUERY = groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0] {
    _id,
    enfoque360Image { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    supportGroupImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    awareImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    testimonialsTitle,
    testimonialsSubtitle,
    reikyImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    "faqItems": faqItems[]{
      _key,
      "question": question[$locale],
      "answer": answer[$locale],
      "doctor": doctor->{
        _id,
        fullName,
        "specialty": specialty[$locale],
        photo {
          asset->{ _id, url, metadata { lqip, dimensions } },
          hotspot, crop
        }
      }
    }
  }
`;

/** Procedimientos de la unidad Cuidare (submark == "Cuidare"), con imagen LQIP. */
export const CUIDARE_PROCEDURES_QUERY = groq`
  *[_type == "procedure" && submark == "Cuidare"] | order(order asc) {
    _id,
    order,
    "name": name[$locale],
    "shortDescription": shortDescription[$locale],
    submark,
    image {
      asset-> {
        _id,
        url,
        metadata { lqip, dimensions }
      },
      hotspot,
      crop
    }
  }
`;

/** Singleton página Endos — solo imágenes de sección. */
export const ENDOS_PAGE_QUERY = groq`
  *[_type == "endosPage" && _id == "endosPage"][0] {
    _id,
    safetyImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop }
  }
`;

/** Procedimientos de la unidad Endos (submark == "Endos"), con imagen LQIP. */
export const ENDOS_PROCEDURES_QUERY = groq`
  *[_type == "procedure" && submark == "Endos"] | order(order asc) {
    _id,
    order,
    "name": name[$locale],
    "shortDescription": shortDescription[$locale],
    "highlights": highlights[]{
      _key,
      "text": text[$locale]
    },
    submark,
    image {
      asset-> {
        _id,
        url,
        metadata { lqip, dimensions }
      },
      hotspot,
      crop
    },
    "duration": duration[$locale]
  }
`;

/** @deprecated Use allProceduresQuery */
export const PROCEDURES_QUERY = groq`*[_type == "procedure"] | order(order asc) { _id }`;

export const allProceduresQuery = groq`
  *[_type == "procedure"] | order(order asc) {
    _id,
    order,
    "name": name[$locale],
    "shortDescription": shortDescription[$locale],
    "highlights": highlights[]{
      _key,
      "text": text[$locale]
    },
    submark,
    image {
      asset-> {
        _id,
        url,
        metadata { lqip, dimensions }
      },
      hotspot,
      crop
    },
    "duration": duration[$locale]
  }
`;

/** Singleton Onkimia Doctors — branding + imágenes de sección. */
export const ONKIMIA_DOCS_SETTINGS_QUERY = groq`
  *[_type == "onkimiaDocsSettings"][0] {
    logo { asset->{ _id, url, metadata { dimensions } } },
    symbol { asset->{ _id, url, metadata { dimensions } } },
    heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    whatIsImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    improvementsImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    benefitsImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    whatsappEndos,
    whatsappCuidare
  }
`;

/** Singleton aviso de privacidad. */
export const PRIVACY_POLICY_QUERY = groq`
  *[_type == "privacyPolicy" && _id == "privacyPolicy"][0] {
    _id,
    title,
    lastUpdated,
    introduction,
    content[] {
      heading,
      bodyEs,
      bodyEn,
    }
  }
`;
