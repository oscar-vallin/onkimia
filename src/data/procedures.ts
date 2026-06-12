import { Activity, Microscope, Wind, TestTube, Radar } from 'lucide-react';

/** @deprecated Procedures are now fetched from Sanity via PROCEDURES_QUERY. */
export const PROCEDURE_KEYS = [
  { key: 'endoscopy',       icon: Activity,   submark: 'Endos'   },
  { key: 'colonoscopy',     icon: Microscope, submark: 'Endos'   },
  { key: 'bronchoscopy',    icon: Wind,       submark: 'Endos'   },
  { key: 'biopsy',          icon: TestTube,   submark: 'Endos'   },
  { key: 'ultrasoundGuided',icon: Radar,      submark: 'Endos'   },
] as const satisfies ReadonlyArray<{
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  submark: 'Endos' | 'Cuidare';
}>;

export type ProcedureKey = typeof PROCEDURE_KEYS[number]['key'];
