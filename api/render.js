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

    const {
      badge = 'Cuentas por Pagar',
      headline = 'Menos trabajo manual. *Más control para tu empresa.*',
      highlight_text = '',
      body = 'Xtract automatiza tus cuentas por pagar, conectando ERP, facturas, pagos y gastos en un flujo simple y trazable.',
      footer_hint = 'Deslizá →',
    } = bodyData;

    const { fontRegular: regular, fontBold: bold } = loadFonts();

    // Helper: Parse headline to highlight *words* or highlight_text in electric blue
    function renderHeadlineNodes(text, highlightPhrase) {
      if (!text) return [''];

      // If text contains *highlighted text*
      if (text.includes('*')) {
        const parts = text.split('*');
        return parts.map((part, i) => {
          const isHighlighted = i % 2 === 1;
          return {
            type: 'span',
            props: {
              style: {
                color: isHighlighted ? '#38BDF8' : '#FFFFFF',
              },
              children: part,
            },
          };
        });
      }

      // If explicit highlight_text is supplied
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
              props: { style: { color: '#38BDF8' }, children: highlightPhrase },
            });
          }
        });
        return nodes;
      }

      // Default: clean text
      return [
        {
          type: 'span',
          props: { style: { color: '#FFFFFF' }, children: text },
        },
      ];
    }

    const headlineChildren = renderHeadlineNodes(headline, highlight_text);

    // Clean badge label (strip any numeric counters like "01 / 05" if accidentally sent)
    const cleanBadge = String(badge || 'Cuentas por Pagar')
      .replace(/^\d+\s*\/\s*\d+$/i, 'Cuentas por Pagar')
      .replace(/^0?\d+\s*·\s*/i, '')
      .trim();

    const element = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#070C1E',
          padding: '80px 75px',
          fontFamily: 'Plus Jakarta Sans',
          position: 'relative',
        },
        children: [
          // Ambient Radial Glow (Top Right)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: -80,
                right: -80,
                width: 700,
                height: 700,
                borderRadius: '50%',
                backgroundColor: '#1E40AF',
                opacity: 0.3,
                filter: 'blur(140px)',
              },
            },
          },

          // Ambient Radial Glow (Bottom Left)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: -80,
                left: -80,
                width: 600,
                height: 600,
                borderRadius: '50%',
                backgroundColor: '#1E3A8A',
                opacity: 0.22,
                filter: 'blur(140px)',
              },
            },
          },

          // Header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              },
              children: [
                // Category Pill Badge (with glowing cyan/blue dot)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(37, 99, 235, 0.15)',
                      border: '1.5px solid rgba(59, 130, 246, 0.4)',
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
                            backgroundColor: '#38BDF8',
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#60A5FA',
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                          },
                          children: cleanBadge,
                        },
                      },
                    ],
                  },
                },

                // Top Right Brandmark
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#38BDF8',
                            fontSize: 28,
                            fontWeight: 800,
                          },
                          children: '>',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#FFFFFF',
                            fontSize: 26,
                            fontWeight: 800,
                            letterSpacing: -0.5,
                          },
                          children: 'Xtract',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // Center Content (Headline + Dark Glass Body Card)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 42,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      fontSize: 58,
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
                          backgroundColor: 'rgba(13, 22, 53, 0.8)',
                          border: '1.5px solid rgba(59, 130, 246, 0.28)',
                          borderRadius: 24,
                          padding: '38px 42px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                color: '#CBD5E1',
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

          // Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: 30,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  color: '#38BDF8',
                                  fontSize: 24,
                                  fontWeight: 800,
                                },
                                children: '>',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  color: '#FFFFFF',
                                  fontSize: 22,
                                  fontWeight: 800,
                                  letterSpacing: -0.5,
                                },
                                children: 'Xtract',
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#64748B',
                            fontSize: 16,
                            fontWeight: 500,
                            letterSpacing: 0.5,
                          },
                          children: 'AI Accounting Platform',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#38BDF8',
                            fontSize: 24,
                            fontWeight: 700,
                          },
                          children: footer_hint,
                        },
                      },
                    ],
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
