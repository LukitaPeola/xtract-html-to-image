import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { renderSlideHTML, STYLES } from '../lib/xtract-carousel-templates.js';

const XTRACT_LOGO = `<svg width="44" height="40" viewBox="0 0 66 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.51438 58.9809H0.473414C0.0959864 58.9809 -0.127325 58.5611 0.0802602 58.2481L19.2898 29.3953C19.3951 29.2381 19.3951 29.0321 19.2898 28.8748L0.767493 0.731266C0.561481 0.418316 0.786365 0 1.16222 0H10.2063C10.3652 0 10.513 0.0802034 10.6011 0.212303L29.4662 28.8748C29.5699 29.0336 29.5699 29.2381 29.4662 29.3953L9.90596 58.7702C9.8179 58.9023 9.67164 58.9809 9.51281 58.9809H9.51438Z" fill="#FFFFFF"/>
  <path d="M56.3185 58.9809C56.1581 58.9809 56.0087 58.8992 55.9222 58.7639L40.9226 35.3949H40.8377L25.7752 58.7639C25.6887 58.8992 25.5393 58.9794 25.3789 58.9794H16.8836C16.5062 58.9794 16.2829 58.5595 16.4904 58.2465L35.6999 29.3938C35.8053 29.2365 35.8053 29.0305 35.6999 28.8732L17.1777 0.731266C16.9717 0.418316 17.1966 0 17.5724 0H26.6134C26.7738 0 26.9232 0.081776 27.0097 0.217021L41.1915 22.3044H41.2764L54.0178 2.97067C55.2397 1.11656 57.3124 0 59.5329 0H64.5983C64.9773 0 65.2022 0.424606 64.9883 0.737557L46.2491 28.1089C46.1405 28.2678 46.139 28.4754 46.2443 28.6358L65.7605 58.2497C65.9665 58.5626 65.7416 58.9809 65.3673 58.9809H56.3185Z" fill="#FFFFFF"/>
</svg>`;

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

  let browser = null;
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

    if (bodyData.badge) bodyData.badge = fixMojibake(bodyData.badge);
    if (bodyData.headline) bodyData.headline = fixMojibake(bodyData.headline);
    if (bodyData.body) bodyData.body = fixMojibake(bodyData.body);
    if (bodyData.footer_hint) bodyData.footer_hint = fixMojibake(bodyData.footer_hint);
    if (bodyData.cta_label) bodyData.cta_label = fixMojibake(bodyData.cta_label);
    if (bodyData.cta_secondary) bodyData.cta_secondary = fixMojibake(bodyData.cta_secondary);

    const style = STYLES.includes(bodyData.style) ? bodyData.style : 'clasico';
    const html = renderSlideHTML({ ...bodyData, style }, { logo: XTRACT_LOGO });

    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION);
    const executablePath = isServerless ? await chromium.executablePath() : undefined;

    browser = await puppeteer.launch({
      args: isServerless ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1080, height: 1350, deviceScaleFactor: 1 },
      executablePath: executablePath || process.env.CHROME_PATH,
      headless: isServerless ? chromium.headless : true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    const pngBuffer = await page.screenshot({ type: 'png', omitBackground: false });
    await browser.close();
    browser = null;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(pngBuffer);
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    console.error('Render error:', error);
    return res.status(500).json({ error: error.message || 'Error rendering slide image' });
  }
}
