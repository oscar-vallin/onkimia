import { groq } from 'next-sanity';

const HERO_IMAGE_FRAGMENT = groq`{ ..., asset->{ ..., metadata { lqip } } }`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    _id,
    _type,
    // Studies gallery
    studiesGallery[] { _key, image ${HERO_IMAGE_FRAGMENT}, alt },
    // How it works
    howItWorksSteps[] { _key, image ${HERO_IMAGE_FRAGMENT} },
    // Section images
    cuidareRadiologyImage ${HERO_IMAGE_FRAGMENT},
    appointmentCtaBgImage ${HERO_IMAGE_FRAGMENT}
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
    clinics,
    credentials,
    order,
    isActive
  }
`;


export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial" && isActive == true] | order(order asc, _createdAt desc) {
    _id,
    name,
    photo { ..., asset->{ ..., metadata { lqip } } },
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
    aboutTestimonials[] {
      _key,
      photo { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
      name,
      role,
      testimonial
    },
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

/** Singleton página Endos — imágenes de sección + FAQ inline. */
export const ENDOS_PAGE_QUERY = groq`
  *[_type == "endosPage" && _id == "endosPage"][0] {
    _id,
    safetyImage { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    faqItems[] { _key, question, answer }
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
