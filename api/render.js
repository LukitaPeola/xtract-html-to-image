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
      badge = '01 / 05',
      headline = 'Título Principal del Slide',
      body = 'Descripción concisa del caso de éxito o transformación.',
      footer_hint = 'Deslizá →',
      theme = 'dark-navy',
    } = bodyData;

    const themes = {
      'dark-navy': {
        bg: '#0B0F19',
        accent: '#55E57E',
        textMain: '#FFFFFF',
        textMuted: '#94A3B8',
        cardBg: '#161F33',
        cardBorder: '#27354F',
      },
      'dark-purple': {
        bg: '#0D071B',
        accent: '#A855F7',
        textMain: '#FFFFFF',
        textMuted: '#CBD5E1',
        cardBg: '#20153D',
        cardBorder: '#3E2A74',
      },
      'dark-slate': {
        bg: '#0B1120',
        accent: '#38BDF8',
        textMain: '#FFFFFF',
        textMuted: '#94A3B8',
        cardBg: '#1E293B',
        cardBorder: '#334155',
      },
    };

    const t = themes[theme] || themes['dark-navy'];
    const { fontRegular: regular, fontBold: bold } = loadFonts();

    const element = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: t.bg,
          padding: '80px 75px',
          fontFamily: 'Plus Jakarta Sans',
          position: 'relative',
        },
        children: [
          // Ambient Glow
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 100,
                right: -100,
                width: 600,
                height: 600,
                borderRadius: '50%',
                backgroundColor: t.accent,
                opacity: 0.12,
                filter: 'blur(120px)',
              },
            },
          },

          // Header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: t.cardBg,
                      border: `1.5px solid ${t.cardBorder}`,
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
                            backgroundColor: t.accent,
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: t.accent,
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: 1.5,
                          },
                          children: badge,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // Center Content (Headline + Body Card)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 40,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: t.textMain,
                      fontSize: 60,
                      fontWeight: 700,
                      lineHeight: 1.22,
                      letterSpacing: -1,
                    },
                    children: headline,
                  },
                },
                body
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          backgroundColor: t.cardBg,
                          border: `1.5px solid ${t.cardBorder}`,
                          borderRadius: 24,
                          padding: '36px 40px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                color: t.textMuted,
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
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: 30,
              },
              children: [
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
                            color: '#FFFFFF',
                            fontSize: 26,
                            fontWeight: 700,
                            letterSpacing: 2,
                          },
                          children: 'XTRACT',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      color: t.accent,
                      fontSize: 26,
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


