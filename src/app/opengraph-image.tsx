import { ImageResponse } from 'next/og';

// Node runtime (default) — 'edge' only exists on Vercel/Cloudflare and would
// break Onkimia IT's self-hosted deploy. It also lets the OG image get
// prerendered at build time instead of generated per request.
export const alt = 'Onkimia — Evolución Oncológica';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1739 0%, #2D2351 50%, #662483 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Círculos decorativos */}
        <div style={{ position: 'absolute', top: '40px', right: '60px', width: '120px', height: '120px', borderRadius: '50%', background: '#3DB59F', opacity: 0.4, display: 'flex' }} />
        <div style={{ position: 'absolute', top: '180px', right: '180px', width: '60px', height: '60px', borderRadius: '50%', background: '#F39313', opacity: 0.5, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '80px', left: '60px', width: '100px', height: '100px', borderRadius: '50%', background: '#36A9E7', opacity: 0.3, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '180px', left: '180px', width: '70px', height: '70px', borderRadius: '50%', background: '#F39313', opacity: 0.4, display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '96px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em', marginBottom: '16px', fontFamily: 'sans-serif', display: 'flex' }}>
            ONKIMIA
          </div>
          <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.3em', fontFamily: 'sans-serif', display: 'flex' }}>
            EVOLUCIÓN ONCOLÓGICA
          </div>
          <div style={{ marginTop: '60px', padding: '12px 32px', background: '#F39313', borderRadius: '999px', color: '#ffffff', fontSize: '24px', fontWeight: 600, fontFamily: 'sans-serif', display: 'flex' }}>
            Centro Oncológico Integral
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
