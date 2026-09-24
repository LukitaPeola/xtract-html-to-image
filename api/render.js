import fs from 'fs';
import path from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

let fontRegular = null;
let fontBold = null;

function loadFonts() {
  if (!fontRegular || !fontBold) {
    const regularPath = path.join(process.cwd(), 'fonts', 'font.ttf');
    const boldPath = path.join(process.cwd(), 'fonts', 'font-bold.ttf');
    fontRegular = fs.readFileSync(regularPath);
    fontBold = fs.readFileSync(boldPath);
  }
  return { fontRegular, fontBold };
}

function fixMojibake(str) {
  if (typeof str !== 'string') return str;
  try {
    if (/[\u00C0-\u00DF][\u0080-\u00BF]/.test(str)) {
      return Buffer.from(str, 'latin1').toString('utf8');
    }
  } catch (e) {}
  return str;
}

// Tokenize text into words with highlight flag so words NEVER glue together
function tokenizeText(text, defaultColor = '#FFFFFF', highlightColor = '#4E89FF') {
  if (!text) return [];
  const tokens = [];
  
  // Normalize whitespace and split by asterisks for highlights
  const parts = String(text).split('*');
  parts.forEach((part, idx) => {
    if (!part) return;
    const isHighlighted = idx % 2 === 1;
    const color = isHighlighted ? highlightColor : defaultColor;
    
    // Split into individual words
    const words = part.trim().split(/\s+/).filter(Boolean);
    words.forEach((word) => {
      tokens.push({
        word,
        color,
        isHighlighted,
      });
    });
  });
  
  return tokens;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let bodyData = {};
    if (req.method === 'POST') {
      if (Buffer.isBuffer(req.body)) {
        bodyData = JSON.parse(req.body.toString('utf-8'));
      } else if (typeof req.body === 'string') {
        bodyData = JSON.parse(req.body);
      } else if (typeof req.body === 'object' && req.body !== null) {
        bodyData = req.body;
      }
    } else {
      bodyData = req.query || {};
    }

    let {
      badge = 'Cuentas por Pagar',
      headline = 'Menos trabajo manual. *Más control en las operaciones.*',
      body = 'El 80% del tiempo de un equipo contable se pierde en tareas manuales: tipear comprobantes, revisar retenciones y pelear contra el ERP.',
      footer_hint = 'Deslizá >',
      slide_number = 1,
      total_slides = 5,
      layout_style = '', // 'hero', 'glass-card', 'accent-bar', 'cta', 'minimal'
    } = bodyData;

    badge = fixMojibake(badge);
    headline = fixMojibake(headline);
    body = fixMojibake(body);
    footer_hint = fixMojibake(footer_hint);

    const slideNum = parseInt(slide_number, 10) || 1;
    const totalNum = parseInt(total_slides, 10) || 5;
    const isFirst = slideNum === 1;
    const isLast = slideNum === totalNum;

    // Automatic layout selection to guarantee visual rhythm across the carousel
    let activeLayout = layout_style;
    if (!activeLayout) {
      if (isFirst) {
        activeLayout = 'hero'; // Clean editorial typography with left accent bar
      } else if (isLast) {
        activeLayout = 'cta'; // Highlighted action card
      } else if (slideNum % 2 === 0) {
        activeLayout = 'glass-card'; // Classic frosted container
      } else {
        activeLayout = 'accent-bar'; // Left glowing neon border card
      }
    }

    const { fontRegular: regular, fontBold: bold } = loadFonts();

    // Word tokens for headline (guaranteed space between words)
    const headlineTokens = tokenizeText(headline, '#FFFFFF', '#4E89FF');
    // Word tokens for body (supports *highlighted* words inside body text)
    const bodyTokens = tokenizeText(body, '#CBD5E1', '#93C5FD');

    // Clean badge label (strip any numeric counters or company mentions)
    const cleanBadge = String(badge || 'Cuentas por Pagar')
      .replace(/^\d+\s*\/\s*\d+$/i, 'Cuentas por Pagar')
      .replace(/^0?\d+\s*·\s*/i, '')
      .trim();

    // Clean footer hint
    const cleanFooter = String(footer_hint || (isLast ? 'Guardá este post' : 'Deslizá >'))
      .replace(/[›→\u203A\u2192]/g, '>')
      .replace(/->/g, '>')
      .replace(/[\uFFFD?]+/g, '');

    // Render Body Section based on active layout to avoid repetitive boxes
    function renderBodySection() {
      if (!bodyTokens.length) return null;

      const bodyContentSpans = bodyTokens.map((t, idx) => ({
        type: 'span',
        props: {
          style: {
            color: t.color,
            fontWeight: t.isHighlighted ? 700 : 400,
            marginRight: 10,
          },
          children: t.word,
        },
      }));

      if (activeLayout === 'hero') {
        // Hero Portada: Minimalist with a luminous left accent line
        return {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              borderLeft: '5px solid #4E89FF',
              paddingLeft: 28,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: 32,
              lineHeight: 1.55,
            },
            children: bodyContentSpans,
          },
        };
      }

      if (activeLayout === 'accent-bar') {
        // Accent Bar: Dark floating panel with glowing left edge
        return {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              backgroundColor: 'rgba(38, 61, 137, 0.22)',
              borderLeft: '6px solid #4E89FF',
              borderTop: '1px solid rgba(78, 137, 255, 0.15)',
              borderRight: '1px solid rgba(78, 137, 255, 0.15)',
              borderBottom: '1px solid rgba(78, 137, 255, 0.15)',
              borderRadius: '0 24px 24px 0',
              padding: '38px 42px',
              fontSize: 31,
              lineHeight: 1.55,
            },
            children: bodyContentSpans,
          },
        };
      }

      if (activeLayout === 'cta') {
        // CTA Card: Action container with highlighted border
        return {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              backgroundColor: 'rgba(38, 61, 137, 0.35)',
              border: '1.5px solid rgba(78, 137, 255, 0.45)',
              borderRadius: 24,
              padding: '40px 44px',
              fontSize: 32,
              lineHeight: 1.55,
            },
            children: bodyContentSpans,
          },
        };
      }

      // Default: Clean Frosted Glass Card
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: 'rgba(28, 26, 62, 0.75)',
            border: '1.5px solid rgba(78, 137, 255, 0.22)',
            borderRadius: 24,
            padding: '40px 44px',
            fontSize: 31,
            lineHeight: 1.55,
          },
          children: bodyContentSpans,
        },
      };
    }

    // Exact Figma Layout & True Vector Radial Gradients (zero blur boxes / zero square artifacts)
    const element = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#1C1A3E',
          padding: '85px 80px',
          fontFamily: 'Plus Jakarta Sans',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Native SVG Background with Pure Radial Gradients (Exact Figma #1C1A3E & #263D89)
          {
            type: 'svg',
            props: {
              width: 1080,
              height: 1350,
              viewBox: '0 0 1080 1350',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1080,
                height: 1350,
              },
              children: [
                {
                  type: 'rect',
                  props: { width: 1080, height: 1350, fill: '#1C1A3E' },
                },
                {
                  type: 'defs',
                  props: {
                    children: [
                      {
                        type: 'radialGradient',
                        props: {
                          id: 'figmaGlowTop',
                          cx: '85%',
                          cy: '15%',
                          r: '65%',
                          children: [
                            { type: 'stop', props: { offset: '0%', stopColor: '#263D89', stopOpacity: '0.85' } },
                            { type: 'stop', props: { offset: '55%', stopColor: '#263D89', stopOpacity: '0.35' } },
                            { type: 'stop', props: { offset: '100%', stopColor: '#1C1A3E', stopOpacity: '0' } },
                          ],
                        },
                      },
                      {
                        type: 'radialGradient',
                        props: {
                          id: 'figmaGlowBottom',
                          cx: '15%',
                          cy: '85%',
                          r: '55%',
                          children: [
                            { type: 'stop', props: { offset: '0%', stopColor: '#263D89', stopOpacity: '0.6' } },
                            { type: 'stop', props: { offset: '50%', stopColor: '#263D89', stopOpacity: '0.2' } },
                            { type: 'stop', props: { offset: '100%', stopColor: '#1C1A3E', stopOpacity: '0' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'rect',
                  props: { width: 1080, height: 1350, fill: 'url(#figmaGlowTop)' },
                },
                {
                  type: 'rect',
                  props: { width: 1080, height: 1350, fill: 'url(#figmaGlowBottom)' },
                },
              ],
            },
          },

          // Header (Clean category badge only, ZERO logos)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
                position: 'relative',
                zIndex: 2,
              },
              children: [
                cleanBadge
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'rgba(38, 61, 137, 0.35)',
                          border: '1.5px solid rgba(78, 137, 255, 0.35)',
                          borderRadius: 30,
                          padding: '12px 24px',
                          gap: 12,
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: '#4E89FF',
                              },
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                color: '#93C5FD',
                                fontSize: 22,
                                fontWeight: 700,
                                letterSpacing: 1.2,
                              },
                              children: cleanBadge,
                            },
                          },
                        ],
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },

          // Center Content (Headline + Dynamic Layout Body)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: isFirst ? 48 : 42,
                margin: 'auto 0',
                position: 'relative',
                zIndex: 2,
              },
              children: [
                // Headline with word-level flex spacing (guarantees NO glued words)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      fontSize: isFirst ? 64 : 58,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: -1,
                    },
                    children: headlineTokens.map((token) => ({
                      type: 'span',
                      props: {
                        style: {
                          color: token.color,
                          marginRight: 16, // Explicit margin to separate words perfectly
                        },
                        children: token.word,
                      },
                    })),
                  },
                },
                // Dynamic body variant based on slide role
                renderBodySection(),
              ].filter(Boolean),
            },
          },

          // Footer (Clean swipe / save hint only, ZERO logos)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 28,
                position: 'relative',
                zIndex: 2,
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      color: '#93C5FD',
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    },
                    children: cleanFooter,
                  },
                },
              ],
            },
          },
        ],
      },
    };

    const svg = await satori(element, {
      width: 1080,
      height: 1350,
      fonts: [
        {
          name: 'Plus Jakarta Sans',
          data: regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Plus Jakarta Sans',
          data: bold,
          weight: 700,
          style: 'normal',
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1080,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(pngBuffer);
  } catch (error) {
    console.error('Render error:', error);
    return res.status(500).json({ error: error.message || 'Error rendering slide image' });
  }
}
