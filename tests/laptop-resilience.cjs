const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MBL_TEST_URL || 'http://127.0.0.1:4176';
const output = '/tmp/mbl-laptop-resilience';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    await context.addInitScript(() => localStorage.setItem('mbl_cookie_consent_v3', JSON.stringify({ version: 3, essential: true, analytics: false, marketing: false })));
    await context.route('**/*.supabase.co/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const open = async () => {
      await page.goto(base, { waitUntil: 'load' });
      await page.locator('.mbl-page-loader').waitFor({ state: 'detached' });
      await page.waitForSelector('[data-laptop-stage][data-ready]');
    };
    for (const size of [{ width: 844, height: 390 }, { width: 320, height: 568 }]) {
      await page.setViewportSize(size);
      await open();
      assert.equal(await page.locator('.is-scroll-ready').count(), 0, 'Short viewports must not be pinned');
      assert.equal(await page.locator('[data-laptop-stage]').getAttribute('data-progress'), '1.000');
      assert(!(await page.locator('[data-motion-toggle]').isVisible()));
      await page.locator('.studio-hero').screenshot({ path: `${output}/short-${size.width}.png` });
    }
    console.log('PASS: short screens use a static, fully open laptop');

    await page.setViewportSize({ width: 1440, height: 900 });
    await open();
    await page.evaluate(() => {
      const canvas = document.querySelector('[data-laptop-stage] canvas');
      window.testContext = canvas.getContext('webgl2') || canvas.getContext('webgl');
      window.testLoss = window.testContext.getExtension('WEBGL_lose_context');
      window.testLoss.loseContext();
    });
    await page.waitForFunction(() => !document.querySelector('[data-laptop-stage]').hasAttribute('data-ready'));
    assert.equal(await page.locator('.is-scroll-ready').count(), 0);
    assert(await page.locator('.studio-stage-fallback').isVisible());
    await page.screenshot({ path: `${output}/context-lost.png` });
    await page.waitForTimeout(300);
    await page.evaluate(() => window.testLoss.restoreContext());
    await page.waitForSelector('[data-laptop-stage][data-ready]');
    assert.equal(await page.locator('.is-scroll-ready').count(), 1);
    console.log('PASS: WebGL context loss and restoration');

    await page.getByRole('link', { name: 'Découvrir nos expertises' }).click();
    await page.waitForTimeout(900);
    const position = await page.locator('#services').boundingBox();
    assert(position.y >= 80 && position.y < 160, 'Expertise link must skip the animation');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open();
    assert.equal(await page.locator('.is-scroll-ready').count(), 0);
    assert.equal(await page.locator('[data-laptop-stage]').getAttribute('data-progress'), '1.000');
    await page.screenshot({ path: `${output}/reduced-motion.png` });
    console.log('PASS: direct section navigation and reduced-motion on load');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
