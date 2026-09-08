// Home-page content for the Wellness and Services sections. There is no
// corresponding Sanity schema field for either list — this is the actual
// content source, not a fallback for missing CMS data (it was misnamed
// `fallbacks.ts` from an earlier design where these came from Sanity).
// Icon names must match the dropdown values defined in siteSettings.ts.
// Text is kept here (not derived from i18n) because icon assignments are
// not stored in i18n and the two must stay in sync per item.

export type HomeContentItem = { icon: string; title: string; description: string };
export type HomeServiceItem = HomeContentItem & { image: string; imageAccent: string };

export const HOME_WELLNESS_ITEMS: Record<'es' | 'en', HomeContentItem[]> = {
  es: [
    { icon: 'sparkles',     title: 'Técnica de Relajación',    description: 'Terapia energética que reduce el estrés y promueve el equilibrio emocional durante el tratamiento.' },
    { icon: 'zap',          title: 'Fisioterapia',             description: 'Mejora la movilidad y fortalece el cuerpo antes, durante y después del tratamiento oncológico.' },
    { icon: 'heart',        title: 'Terapia Psicológica',      description: 'Acompañamiento emocional especializado para enfrentar el proceso oncológico con apoyo profesional.' },
    { icon: 'shopping-bag', title: 'Boutique Oncológica',      description: 'Productos seleccionados para tu cuidado y bienestar durante cada etapa del tratamiento.' },
    { icon: 'bar-chart',    title: 'Nutrición Clínica',        description: 'Planes alimenticios personalizados y suplementos para fortalecer tu cuerpo y recuperación.' },
    { icon: 'lightbulb',    title: 'Pruebas Genómicas',                          description: 'Contamos con paneles genéticos que nos permiten prevenir, detectar distintos tipos de cáncer.' },
  ],
  en: [
    { icon: 'sparkles',     title: 'Relaxation Technique',                       description: 'Energy therapy that reduces stress and promotes emotional balance during treatment.' },
    { icon: 'zap',          title: 'Physiotherapy',                              description: 'Improves mobility and strengthens the body before, during, and after oncological treatment.' },
    { icon: 'heart',        title: 'Psychological Therapy',                      description: 'Specialized emotional support to face the oncological process with professional guidance.' },
    { icon: 'shopping-bag', title: 'Oncology Boutique',                          description: 'Curated products for your care and wellbeing at every stage of treatment.' },
    { icon: 'bar-chart',    title: 'Clinical Nutrition',                         description: 'Personalized nutrition plans and supplements to strengthen your body and recovery.' },
    { icon: 'lightbulb',    title: 'Genomic Testing',                            description: 'We offer genetic panels that allow us to prevent and detect different types of cancer.' },
  ],
};

export const HOME_SERVICES_ITEMS: Record<'es' | 'en', HomeServiceItem[]> = {
  es: [
    { icon: 'heart',     title: 'Quimioterapia',                             description: 'Tratamientos personalizados que utilizan medicamentos especializados para combatir las células cancerosas, con seguimiento médico continuo y atención enfocada en tu bienestar durante cada etapa.', image: '/home/services-vertical/chemotherapy.webp', imageAccent: '/home/services-horizontal/chemotherapy.webp' },
    { icon: 'clipboard', title: 'Cirugía Oncológica',                        description: 'Procedimientos quirúrgicos especializados para diagnosticar, tratar o retirar tumores, realizados por médicos expertos y coordinados con el resto de tu plan de atención oncológica.', image: '/home/services-vertical/surgery.webp', imageAccent: '/home/services-horizontal/surgery.webp' },
    { icon: 'sun',       title: 'Cuidados Paliativos',                       description: 'Atención especializada para aliviar síntomas, controlar molestias y mejorar la calidad de vida del paciente, brindando apoyo integral durante las diferentes etapas de su tratamiento.', image: '/home/services-vertical/palliative-care.webp', imageAccent: '/home/services-horizontal/palliative-care.webp' },
    { icon: 'search',    title: 'Detección Temprana',                       description: 'Evaluaciones y estudios enfocados en identificar oportunamente alteraciones o señales de cáncer, facilitando un diagnóstico temprano y mayores posibilidades de iniciar un tratamiento adecuado.', image: '/home/services-vertical/early-detection.webp', imageAccent: '/home/services-horizontal/early-detection.webp' },
    { icon: 'user',      title: 'Unidades médicas de alta especialidad',            description: 'Espacios dedicados a la atención de padecimientos complejos que requieren conocimiento especializado, tecnología avanzada y la participación coordinada de diferentes profesionales de la salud.', image: '/home/services-vertical/specialized-care.webp', imageAccent: '/home/services-horizontal/specialized-care.webp' },
    { icon: 'dna',       title: 'Servicios Complementarios Personalizados', description: 'Servicios diseñados de acuerdo con las necesidades de cada paciente para complementar su tratamiento, favorecer su bienestar y brindar una atención más integral durante su proceso.', image: '/home/services-vertical/complementary-services.webp', imageAccent: '/home/services-horizontal/complementary-services.webp' },
    { icon: 'activity',  title: 'Acompañamiento Humano y Profesional',      description: 'Un equipo cercano que te orienta, escucha y acompaña durante todo el proceso, integrando atención médica especializada con apoyo humano para ti y tu familia.', image: '/home/services-vertical/human-support.webp', imageAccent: '/home/services-horizontal/human-support.webp' },
  ],
  en: [
    { icon: 'heart',     title: 'Chemotherapy',                          description: 'Personalized treatments using specialized medications to fight cancer cells, with continuous medical monitoring and care focused on your well-being at every stage.', image: '/home/services-vertical/chemotherapy.webp', imageAccent: '/home/services-horizontal/chemotherapy.webp' },
    { icon: 'clipboard', title: 'Oncological Surgery',                   description: 'Specialized surgical procedures to diagnose, treat, or remove tumors, performed by expert physicians and coordinated with the rest of your cancer care plan.', image: '/home/services-vertical/surgery.webp', imageAccent: '/home/services-horizontal/surgery.webp' },
    { icon: 'sun',       title: 'Palliative Care',                       description: "Specialized care to relieve symptoms, control discomfort, and improve the patient's quality of life, providing comprehensive support throughout the different stages of treatment.", image: '/home/services-vertical/palliative-care.webp', imageAccent: '/home/services-horizontal/palliative-care.webp' },
    { icon: 'search',    title: 'Early Detection',                      description: 'Evaluations and studies focused on the timely identification of abnormalities or signs of cancer, facilitating early diagnosis and a greater chance of starting appropriate treatment.', image: '/home/services-vertical/early-detection.webp', imageAccent: '/home/services-horizontal/early-detection.webp' },
    { icon: 'user',      title: 'High-specialty medical units',             description: 'Spaces dedicated to the care of complex conditions requiring specialized knowledge, advanced technology, and the coordinated participation of various healthcare professionals.', image: '/home/services-vertical/specialized-care.webp', imageAccent: '/home/services-horizontal/specialized-care.webp' },
    { icon: 'dna',       title: 'Personalized Complementary Services',  description: "Services designed according to each patient's needs to complement their treatment, promote well-being, and provide more comprehensive care throughout their journey.", image: '/home/services-vertical/complementary-services.webp', imageAccent: '/home/services-horizontal/complementary-services.webp' },
    { icon: 'activity',  title: 'Human and Professional Support',       description: 'A dedicated team that guides, listens to, and supports you throughout the entire process, integrating specialized medical care with compassionate support for you and your family.', image: '/home/services-vertical/human-support.webp', imageAccent: '/home/services-horizontal/human-support.webp' },
  ],
};
