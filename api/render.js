import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  let bodyData = {};
  if (req.method === 'POST') {
    try {
      bodyData = await req.json();
    } catch (e) {
      bodyData = {};
    }
  } else {
    // Support GET query parameters for quick browser testing
    const url = new URL(req.url);
    bodyData = Object.fromEntries(url.searchParams.entries());
  }

  const {
    badge = '01 / 05',
    headline = 'Título Principal del Slide',
    body = 'Descripción del caso de éxito o transformación operativa con Xtract.',
    footer_hint = 'Deslizá →',
    theme = 'dark-navy',
    width = 1080,
    height = 1350,
  } = bodyData;

  const themes = {
    'dark-navy': {
      bg: 'linear-gradient(145deg, #0B0F19 0%, #111827 50%, #0D1322 100%)',
      accent: '#55E57E',
      border: 'rgba(255, 255, 255, 0.08)',
      cardBg: 'rgba(255, 255, 255, 0.03)',
      textMain: '#FFFFFF',
      textMuted: '#94A3B8',
    },
    'dark-purple': {
      bg: 'linear-gradient(145deg, #0F0A1E 0%, #191233 50%, #0F0A1E 100%)',
      accent: '#A855F7',
      border: 'rgba(168, 85, 247, 0.15)',
      cardBg: 'rgba(255, 255, 255, 0.03)',
      textMain: '#FFFFFF',
      textMuted: '#CBD5E1',
    },
    'dark-slate': {
      bg: 'linear-gradient(145deg, #090D16 0%, #0F172A 50%, #090D16 100%)',
      accent: '#38BDF8',
      border: 'rgba(255, 255, 255, 0.08)',
      cardBg: 'rgba(255, 255, 255, 0.03)',
      textMain: '#FFFFFF',
      textMuted: '#94A3B8',
    },
  };

  const currentTheme = themes[theme] || themes['dark-navy'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: currentTheme.bg,
          padding: '100px 90px',
          fontFamily: 'sans-serif',
          color: currentTheme.textMain,
          position: 'relative',
        }}
      >
        {/* Glow Sphere */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: currentTheme.accent,
            opacity: 0.12,
            filter: 'blur(120px)',
            top: '20%',
            right: '-100px',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: '100px',
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.accent,
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: currentTheme.accent,
                marginRight: '12px',
                boxShadow: `0 0 10px ${currentTheme.accent}`,
              }}
            />
            <span>{badge}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', margin: 'auto 0' }}>
          <div
            style={{
              fontSize: '58px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {headline}
          </div>

          {body ? (
            <div
              style={{
                display: 'flex',
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '28px',
                padding: '44px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: currentTheme.textMuted,
                }}
              >
                {body}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 600, color: currentTheme.accent }}>
            {footer_hint}
          </div>
        </div>
      </div>
    ),
    {
      width: parseInt(width, 10) || 1080,
      height: parseInt(height, 10) || 1350,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
