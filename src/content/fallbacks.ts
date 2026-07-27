// Fallback content shown when Sanity has no data for these sections.
// Icon names must match the dropdown values defined in siteSettings.ts.
// Text is kept here (not derived from i18n) because icon assignments are
// not stored in i18n and the two must stay in sync per item.

export type FallbackItem = { icon: string; title: string; description: string };
export type FallbackServiceItem = FallbackItem & { image: string; imageAccent: string };

export const FALLBACK_WELLNESS: Record<'es' | 'en', FallbackItem[]> = {
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

export const FALLBACK_SERVICES: Record<'es' | 'en', FallbackServiceItem[]> = {
  es: [
    { icon: 'heart',     title: 'Quimioterapia',                             description: 'Protocolos de quimioterapia de última generación, administrados en un entorno cálido y supervisados por oncólogos de alto nivel.', image: '/home/services-vertical/chemotherapy.webp', imageAccent: '/home/services-horizontal/chemotherapy.webp' },
    { icon: 'clipboard', title: 'Cirugía Oncológica',                        description: 'Intervenciones quirúrgicas de precisión realizadas por cirujanos oncológicos especializados con décadas de experiencia.', image: '/home/services-vertical/surgery.webp', imageAccent: '/home/services-horizontal/surgery.webp' },
    { icon: 'sun',       title: 'Cuidados Paliativos',                       description: 'Acompañamiento integral centrado en la calidad de vida, el control del dolor y el bienestar emocional del paciente y su familia.', image: '/home/services-vertical/palliative-care.webp', imageAccent: '/home/services-horizontal/palliative-care.webp' },
    { icon: 'search',    title: 'Detección Temprana',                       description: 'Estudios de diagnóstico avanzado que identifican riesgos antes de que se manifiesten síntomas, maximizando las posibilidades de éxito.', image: '/home/services-vertical/early-detection.webp', imageAccent: '/home/services-horizontal/early-detection.webp' },
    { icon: 'user',      title: 'Atención Médica Especializada',            description: 'Acompañamiento médico personalizado en cada etapa del proceso oncológico, con un equipo multidisciplinario de alto nivel.', image: '/home/services-vertical/specialized-care.webp', imageAccent: '/home/services-horizontal/specialized-care.webp' },
    { icon: 'dna',       title: 'Servicios Complementarios Personalizados', description: 'Nutrición clínica, fisioterapia oncológica, psico-oncología y terapias de bienestar integradas en tu plan de atención.', image: '/home/services-vertical/complementary-services.webp', imageAccent: '/home/services-horizontal/complementary-services.webp' },
    { icon: 'activity',  title: 'Acompañamiento Humano y Profesional',      description: 'Un equipo coordinado que te guía en cada paso del camino, desde el diagnóstico hasta la recuperación, con empatía y calidez.', image: '/home/services-vertical/human-support.webp', imageAccent: '/home/services-horizontal/human-support.webp' },
  ],
  en: [
    { icon: 'heart',     title: 'Chemotherapy',                          description: 'State-of-the-art chemotherapy protocols administered in a warm environment supervised by top-level oncologists.', image: '/home/services-vertical/chemotherapy.webp', imageAccent: '/home/services-horizontal/chemotherapy.webp' },
    { icon: 'clipboard', title: 'Oncological Surgery',                   description: 'Precision surgical interventions performed by specialized oncological surgeons with decades of experience.', image: '/home/services-vertical/surgery.webp', imageAccent: '/home/services-horizontal/surgery.webp' },
    { icon: 'sun',       title: 'Palliative Care',                       description: 'Comprehensive support focused on quality of life, pain control, and the emotional wellbeing of the patient and their family.', image: '/home/services-vertical/palliative-care.webp', imageAccent: '/home/services-horizontal/palliative-care.webp' },
    { icon: 'search',    title: 'Early Detection',                      description: 'Advanced diagnostic studies that identify risks before symptoms appear, maximizing the chances of success.', image: '/home/services-vertical/early-detection.webp', imageAccent: '/home/services-horizontal/early-detection.webp' },
    { icon: 'user',      title: 'Specialized Medical Care',             description: 'Personalized medical support at every stage of the oncological process, with a high-level multidisciplinary team.', image: '/home/services-vertical/specialized-care.webp', imageAccent: '/home/services-horizontal/specialized-care.webp' },
    { icon: 'dna',       title: 'Personalized Complementary Services',  description: 'Clinical nutrition, oncological physiotherapy, psycho-oncology and wellness therapies integrated into your care plan.', image: '/home/services-vertical/complementary-services.webp', imageAccent: '/home/services-horizontal/complementary-services.webp' },
    { icon: 'activity',  title: 'Human and Professional Support',       description: 'A coordinated team that guides you at every step of the way, from diagnosis to recovery, with empathy and warmth.', image: '/home/services-vertical/human-support.webp', imageAccent: '/home/services-horizontal/human-support.webp' },
  ],
};
