'use client';

import dynamic from 'next/dynamic';

const Studio = dynamic(() => import('@/components/studio/Studio'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#666',
      }}
    >
      Cargando Sanity Studio…
    </div>
  ),
});

export default function StudioPage() {
  return <Studio />;
}
