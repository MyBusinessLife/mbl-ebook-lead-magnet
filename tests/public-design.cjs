const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.MBL_TEST_URL || 'http://127.0.0.1:4176';
const output = process.env.MBL_TEST_OUTPUT || '/tmp/mbl-public-design';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => localStorage.setItem('mbl_cookie_consent_v3', JSON.stringify({ version: 3, essential: true, analytics: false, marketing: false })));
  // Never create production leads or analytics while testing presentation changes.
  await context.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const report = [];
  const canvasShot = async (canvas, filename) => {
    const clean = await page.addStyleTag({ content: '.studio-hero > :not(.studio-stage) { visibility: hidden !important; } .studio-hero::after { display: none !important; }' });
    await canvas.screenshot({ path: path.join(output, filename) });
    await clean.evaluate(el => el.remove());
  };
  const pages = process.env.MBL_TEST_PAGES?.split(',') || ['index.html', 'services.html', 'developpement-web.html', 'contact.html', 'diagnostic.html', 'espace-client.html'];
  const sizes = process.env.MBL_TEST_WIDTHS?.split(',').map(Number) || [1440, 390];
  for (const width of sizes) {
    await page.setViewportSize({ width, height: width > 800 ? 950 : 844 });
    for (const file of pages) {
      await page.goto(`${base}/${file}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1100);
      await page.locator('.mbl-page-loader').waitFor({ state: 'detached', timeout: 6000 });
      if (file === 'index.html') await page.waitForSelector('[data-laptop-stage][data-ready]', { timeout: 15000 });
      await page.screenshot({ path: path.join(output, `${file.replaceAll('/', '-').replace('.html', '')}-${width}.png`) });
      const before = errors.length;
      const layout = await page.evaluate(() => {
        const overflow = Array.from(document.querySelectorAll('main :is(h1,h2,h3,p,button,a,label,input,select),.site-header,.footer-shell')).filter((el) => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return r.width && r.height && style.visibility !== 'hidden' && (r.right > innerWidth + 2 || r.left < -2 || (el.scrollWidth > el.clientWidth + 3 && style.overflowX === 'visible' && style.display !== 'inline'));
        }).slice(0, 20).map((el) => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0, 70) }));
        return { pageWidth: document.documentElement.scrollWidth, viewport: innerWidth, overflow, headings: document.querySelectorAll('h1').length };
      });
      report.push({ file, width, ...layout });
      assert.deepEqual(layout.overflow, [], `Horizontal overflow on ${file} at ${width}px`);
      if (file === 'index.html') {
        const initial = Number(await page.locator('[data-laptop-stage]').getAttribute('data-progress'));
        const canvas = page.locator('[data-laptop-stage] canvas');
        await canvasShot(canvas, `canvas-initial-${width}.png`);
        const initialTop = (await canvas.boundingBox()).y;
        await page.evaluate(() => window.scrollTo({ top: 370, behavior: 'instant' }));
        await page.waitForTimeout(800);
        const next = Number(await page.locator('[data-laptop-stage]').getAttribute('data-progress'));
        assert(next > initial + 0.25, 'Laptop lid must react to scrolling');
        assert(Math.abs((await canvas.boundingBox()).y - initialTop) < 3, 'Laptop must stay pinned while opening');
        const distance = await page.locator('[data-laptop-sequence]').evaluate(el => parseFloat(el.style.getPropertyValue('--scroll-distance')));
        await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), distance * 0.95);
        await page.waitForTimeout(800);
        assert(Number(await page.locator('[data-laptop-stage]').getAttribute('data-progress')) > 0.98, 'Lid must finish opening before the sequence releases');
        assert(Math.abs((await canvas.boundingBox()).y - initialTop) < 3, 'Open laptop must remain visible');
        await canvasShot(canvas, `canvas-open-${width}.png`);
        await page.screenshot({ path: path.join(output, `home-open-${width}.png`) });
        for (let y = 750; y < await page.evaluate(() => document.body.scrollHeight); y += 700) {
          await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
          await page.waitForTimeout(90);
        }
        await page.screenshot({ path: path.join(output, `home-full-${width}.png`), fullPage: true });
      }
      console.log(JSON.stringify({ file, width, overflow: layout.overflow, errors: errors.slice(before) }));
    }
  }
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ report, errors }, null, 2));
  await browser.close();
  if (errors.length) { console.error(errors); process.exitCode = 1; }
})().catch((error) => { console.error(error); process.exit(1); });
