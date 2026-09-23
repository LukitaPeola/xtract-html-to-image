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
      highlight_text = '',
      body = 'El 80% del tiempo de un equipo contable se pierde en tareas manuales: tipear comprobantes, revisar retenciones y pelear contra el ERP.',
      footer_hint = 'Deslizá →',
    } = bodyData;

    badge = fixMojibake(badge);
    headline = fixMojibake(headline);
    body = fixMojibake(body);
    footer_hint = fixMojibake(footer_hint);

    const { fontRegular: regular, fontBold: bold } = loadFonts();

    // Helper: Parse headline to highlight *words* or highlight_text in electric blue (#4E89FF)
    function renderHeadlineNodes(text, highlightPhrase) {
      if (!text) return [''];

      if (text.includes('*')) {
        const parts = text.split('*');
        return parts.map((part, i) => {
          const isHighlighted = i % 2 === 1;
          return {
            type: 'span',
            props: {
              style: {
                color: isHighlighted ? '#4E89FF' : '#FFFFFF',
              },
              children: part,
            },
          };
        });
      }

      if (highlightPhrase && text.includes(highlightPhrase)) {
        const parts = text.split(highlightPhrase);
        const nodes = [];
        parts.forEach((p, idx) => {
          if (p) {
            nodes.push({
              type: 'span',
              props: { style: { color: '#FFFFFF' }, children: p },
            });
          }
          if (idx < parts.length - 1) {
            nodes.push({
              type: 'span',
              props: { style: { color: '#4E89FF' }, children: highlightPhrase },
            });
          }
        });
        return nodes;
      }

      return [
        {
          type: 'span',
          props: { style: { color: '#FFFFFF' }, children: text },
        },
      ];
    }

    const headlineChildren = renderHeadlineNodes(headline, highlight_text);

    // Clean badge label (strip any numeric counters or company mentions)
    const cleanBadge = String(badge || 'Cuentas por Pagar')
      .replace(/^\d+\s*\/\s*\d+$/i, 'Cuentas por Pagar')
      .replace(/^0?\d+\s*·\s*/i, '')
      .trim();

    // Clean footer hint
    const cleanFooter = String(footer_hint || 'Deslizá →')
      .replace(/->/g, '→');

    // Exact Figma colors: Base #1C1A3E with #263D89 Radial Gradient Glow
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
          // Ambient Radial Glow (Figma #263D89) - Top Right
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: -120,
                right: -120,
                width: 850,
                height: 850,
                borderRadius: '50%',
                backgroundColor: '#263D89',
                opacity: 0.65,
                filter: 'blur(160px)',
              },
            },
          },

          // Ambient Radial Glow (Figma #263D89) - Bottom Left
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: -150,
                left: -150,
                width: 750,
                height: 750,
                borderRadius: '50%',
                backgroundColor: '#263D89',
                opacity: 0.45,
                filter: 'blur(160px)',
              },
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

          // Center Content (Headline + Glass Card Body)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 44,
                margin: 'auto 0',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      fontSize: 60,
                      fontWeight: 700,
                      lineHeight: 1.22,
                      letterSpacing: -1,
                    },
                    children: headlineChildren,
                  },
                },
                body
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          backgroundColor: 'rgba(28, 26, 62, 0.75)',
                          border: '1.5px solid rgba(78, 137, 255, 0.22)',
                          borderRadius: 24,
                          padding: '40px 44px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                color: '#E2E8F0',
                                fontSize: 32,
                                fontWeight: 400,
                                lineHeight: 1.55,
                              },
                              children: body,
                            },
                          },
                        ],
                      },
                    }
                  : null,
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
