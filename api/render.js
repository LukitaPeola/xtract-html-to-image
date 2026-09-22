import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

let fontBase64 = '';
let fontBoldBase64 = '';

try {
  fontBase64 = fs.readFileSync(path.join(process.cwd(), 'fonts', 'font.ttf')).toString('base64');
  fontBoldBase64 = fs.readFileSync(path.join(process.cwd(), 'fonts', 'font-bold.ttf')).toString('base64');
} catch (e) {
  console.warn('Could not read font files:', e.message);
}

function wrapText(text, maxCharsPerLine) {
  if (!text) return [];
  const words = String(text).split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSlideSvg({
  badge = '01 / 05',
  headline = 'Título Principal del Slide',
  body = 'Descripción concisa del caso de éxito o transformación.',
  footer_hint = 'Deslizá →',
  theme = 'dark-navy',
  total_slides = 5,
  slide_number = 1,
}) {
  const themes = {
    'dark-navy': {
      bgStart: '#0B0F19',
      bgEnd: '#111827',
      accent: '#55E57E',
      accentGlow: '#55E57E',
      textMain: '#FFFFFF',
      textMuted: '#94A3B8',
      cardBg: '#1A2234',
      border: '#2E3A52',
    },
    'dark-purple': {
      bgStart: '#0F0A1E',
      bgEnd: '#191233',
      accent: '#A855F7',
      accentGlow: '#A855F7',
      textMain: '#FFFFFF',
      textMuted: '#CBD5E1',
      cardBg: '#231846',
      border: '#3F2C74',
    },
    'dark-slate': {
      bgStart: '#090D16',
      bgEnd: '#0F172A',
      accent: '#38BDF8',
      accentGlow: '#38BDF8',
      textMain: '#FFFFFF',
      textMuted: '#94A3B8',
      cardBg: '#1E293B',
      border: '#334155',
    },
  };

  const t = themes[theme] || themes['dark-navy'];
  const headlineLines = wrapText(headline, 26);
  const bodyLines = wrapText(body, 44);

  const headlineStartY = 420;
  const headlineLineHeight = 74;
  const headlineEndY = headlineStartY + headlineLines.length * headlineLineHeight;

  const cardY = headlineEndY + 40;
  const cardHeight = Math.max(160, bodyLines.length * 50 + 80);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350">
  <defs>
    <style>
      ${
        fontBase64
          ? `@font-face {
        font-family: 'CustomFont';
        src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
        font-weight: 400;
      }`
          : ''
      }
      ${
        fontBoldBase64
          ? `@font-face {
        font-family: 'CustomFontBold';
        src: url('data:font/ttf;base64,${fontBoldBase64}') format('truetype');
        font-weight: 700;
      }`
          : ''
      }
      text {
        font-family: 'CustomFont', 'CustomFontBold', -apple-system, sans-serif;
      }
      .bold-text {
        font-family: 'CustomFontBold', 'CustomFont', -apple-system, sans-serif;
        font-weight: 700;
      }
    </style>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bgStart}" />
      <stop offset="100%" stop-color="${t.bgEnd}" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="120" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1350" fill="url(#bg)" />

  <!-- Ambient Glow -->
  <circle cx="950" cy="350" r="300" fill="${t.accentGlow}" opacity="0.18" filter="url(#glow)" />

  <!-- Header: Badge -->
  <g transform="translate(90, 100)">
    <rect width="150" height="52" rx="26" fill="${t.cardBg}" stroke="${t.border}" stroke-width="1.5" />
    <circle cx="28" cy="26" r="5" fill="${t.accent}" />
    <text x="46" y="34" class="bold-text" fill="${t.accent}" font-size="20" letter-spacing="1">${escapeXml(badge)}</text>
  </g>

  <!-- Headline -->
  <g transform="translate(90, 0)">
    ${headlineLines
      .map(
        (line, idx) =>
          `<text x="0" y="${headlineStartY + idx * headlineLineHeight}" class="bold-text" fill="${t.textMain}" font-size="58" letter-spacing="-1">${escapeXml(line)}</text>`
      )
      .join('\n    ')}
  </g>

  <!-- Body Card -->
  ${
    bodyLines.length > 0
      ? `<g transform="translate(90, ${cardY})">
    <rect width="900" height="${cardHeight}" rx="28" fill="${t.cardBg}" stroke="${t.border}" stroke-width="1.5" opacity="0.95" />
    ${bodyLines
      .map(
        (line, idx) =>
          `<text x="44" y="${64 + idx * 50}" fill="${t.textMuted}" font-size="30" line-height="1.5">${escapeXml(line)}</text>`
      )
      .join('\n    ')}
  </g>`
      : ''
  }

  <!-- Footer -->
  <g transform="translate(90, 1220)">
    <line x1="0" y1="0" x2="900" y2="0" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    <!-- Hint -->
    <text x="900" y="52" class="bold-text" text-anchor="end" fill="${t.accent}" font-size="24">${escapeXml(footer_hint)}</text>
  </g>
</svg>`;
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
      bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    } else {
      bodyData = req.query || {};
    }

    const svgContent = bodyData.svg || buildSlideSvg(bodyData);

    const fontBuffers = [];
    try {
      const fb = fs.readFileSync(path.join(process.cwd(), 'fonts', 'font.ttf'));
      fontBuffers.push(fb);
    } catch (e) {}

    const resvg = new Resvg(svgContent, {
      fitTo: {
        mode: 'width',
        value: parseInt(bodyData.width, 10) || 1080,
      },
      font: {
        fontBuffers,
        defaultFontFamily: 'CustomFont',
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(pngBuffer);
  } catch (error) {
    console.error('Render error:', error);
    return res.status(500).json({ error: error.message || 'Error rendering SVG to PNG' });
  }
}
