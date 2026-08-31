/**
 * Feature bundle diferido para framer-motion (patrón LazyMotion).
 *
 * Los componentes animados deben importar { LazyMotion, m } y envolver su
 * árbol en <LazyMotion features={loadMotionFeatures} strict> en lugar de
 * importar { motion } — `motion` trae el renderer completo al bundle
 * inicial; `m` + domAnimation lo difieren a un chunk que se carga on-demand.
 */
export const loadMotionFeatures = () =>
  import('framer-motion').then((mod) => mod.domAnimation);
