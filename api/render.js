import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  // Allow CORS for n8n or any browser testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Send a POST request with { html, width, height }.' });
  }

  const { html, width = 1080, height = 1350, deviceScaleFactor = 2 } = req.body || {};

  if (!html) {
    return res.status(400).json({ error: 'Missing required field: html.' });
  }

  let browser = null;
  try {
    // Optimized Chromium configuration for Vercel Serverless
    chromium.setGraphicsMode = false;

    const executablePath = await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
    );

    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: {
        width: parseInt(width, 10) || 1080,
        height: parseInt(height, 10) || 1350,
        deviceScaleFactor: parseFloat(deviceScaleFactor) || 2
      },
      executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    
    // Set HTML content and wait for network assets/fonts
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
      timeout: 25000
    });

    // Wait until Google fonts are rendered
    await page.evaluateHandle('document.fonts.ready');

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      omitBackground: false
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(screenshotBuffer);
  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
    console.error('Render error:', error);
    return res.status(500).json({ error: error.message || 'Error rendering image' });
  }
}
