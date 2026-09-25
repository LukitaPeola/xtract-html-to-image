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
      // If word is only closing punctuation like '?', '!', '.', ',', append to previous token
      if (/^[?!.,:;]+$/.test(word) && tokens.length > 0) {
        tokens[tokens.length - 1].word += word;
      } else {
        tokens.push({
          word,
          color,
          isHighlighted,
        });
      }
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

    // Ensure consistent styling across all slides of the same post
    let activeLayout = layout_style || 'glass-card';
    if (activeLayout === 'minimal' || activeLayout === 'minimal-clean') {
      activeLayout = isLast ? 'cta-minimal' : 'minimal-clean';
    } else if (activeLayout === 'accent-panel' || activeLayout === 'accent-bar') {
      activeLayout = isLast ? 'cta' : 'accent-panel';
    } else {
      activeLayout = isLast ? 'cta' : 'glass-card';
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

    // Render Body Section: Clean editorial text with sleek vertical electric blue line (zero background card box)
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

          // Header (Category badge on the left, Official white Xtract X on the right, perfectly aligned)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
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
                          borderRadius: 36,
                          padding: '14px 28px',
                          gap: 14,
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: 12,
                                height: 12,
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
                                fontSize: 28,
                                fontWeight: 700,
                                letterSpacing: 0.8,
                              },
                              children: cleanBadge,
                            },
                          },
                        ],
                      },
                    }
                  : { type: 'div', props: {} },

                // Official Xtract "X" Isotipo in Pure White (top right, vertically aligned)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    children: [
                      {
                        type: 'svg',
                        props: {
                          width: 44,
                          height: 40,
                          viewBox: '0 0 66 60',
                          fill: 'none',
                          children: [
                            {
                              type: 'path',
                              props: {
                                d: 'M9.51438 58.9809H0.473414C0.0959864 58.9809 -0.127325 58.5611 0.0802602 58.2481L19.2898 29.3953C19.3951 29.2381 19.3951 29.0321 19.2898 28.8748L0.767493 0.731266C0.561481 0.418316 0.786365 0 1.16222 0H10.2063C10.3652 0 10.513 0.0802034 10.6011 0.212303L29.4662 28.8748C29.5699 29.0336 29.5699 29.2381 29.4662 29.3953L9.90596 58.7702C9.8179 58.9023 9.67164 58.9809 9.51281 58.9809H9.51438Z',
                                fill: '#FFFFFF',
                              },
                            },
                            {
                              type: 'path',
                              props: {
                                d: 'M56.3185 58.9809C56.1581 58.9809 56.0087 58.8992 55.9222 58.7639L40.9226 35.3949H40.8377L25.7752 58.7639C25.6887 58.8992 25.5393 58.9794 25.3789 58.9794H16.8836C16.5062 58.9794 16.2829 58.5595 16.4904 58.2465L35.6999 29.3938C35.8053 29.2365 35.8053 29.0305 35.6999 28.8732L17.1777 0.731266C16.9717 0.418316 17.1966 0 17.5724 0H26.6134C26.7738 0 26.9232 0.081776 27.0097 0.217021L41.1915 22.3044H41.2764L54.0178 2.97067C55.2397 1.11656 57.3124 0 59.5329 0H64.5983C64.9773 0 65.2022 0.424606 64.9883 0.737557L46.2491 28.1089C46.1405 28.2678 46.139 28.4754 46.2443 28.6358L65.7605 58.2497C65.9665 58.5626 65.7416 58.9809 65.3673 58.9809H56.3185Z',
                                fill: '#FFFFFF',
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
                      fontSize: 30,
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
