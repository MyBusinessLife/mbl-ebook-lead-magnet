const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.MBL_TEST_URL || 'http://127.0.0.1:4176';
const output = '/tmp/mbl-public-interactions';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => localStorage.setItem('mbl_cookie_consent_v3', JSON.stringify({ version: 3, essential: true, analytics: false, marketing: false })));
  await context.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const open = async (file) => {
    await page.goto(`${base}/${file}`, { waitUntil: 'load' });
    await page.locator('.mbl-page-loader').waitFor({ state: 'detached' });
  };
  await open('index.html');
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.getByRole('button', { name: 'Professionnels', exact: true }).click();
  assert(await page.locator('.nav-dropdown a[href="developpement-web.html"]').isVisible());
  await page.screenshot({ path: path.join(output, 'mobile-navigation.png') });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  console.log('PASS: mobile menu, submenu and Escape');

  await open('espace-client.html');
  await page.waitForSelector('#loginPanel:not([hidden])');
  assert(!(await page.locator('#accountPanel').isVisible()));
  await page.getByRole('tab', { name: 'Inscription' }).click();
  assert(await page.locator('#signupForm').isVisible());
  assert(!(await page.locator('#loginForm').isVisible()));
  await page.getByRole('tab', { name: 'Connexion', exact: true }).click();
  assert(await page.locator('#loginForm').isVisible());
  assert(await page.locator('[data-google-auth]').isVisible());
  console.log('PASS: login/signup tabs, Google button and account visibility');

  await open('contact.html');
  await page.evaluate(() => {
    window.testContactCalls = [];
    window.MBLData.submitContact = async (payload) => { window.testContactCalls.push(payload); return { ok: true }; };
  });
  const form = page.locator('[data-intake-form]');
  await form.locator('input[name="nom"]').fill('Test design local');
  await form.locator('input[name="email"]').fill('design-test@example.invalid');
  await form.locator('select[name="profil"]').selectOption({ label: 'Entreprise' });
  await form.locator('select[name="besoin"]').selectOption({ label: 'Site web' });
  await form.locator('textarea[name="message"]').fill('Test local sans envoi au serveur.');
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes('Demande reçue'));
  assert.equal(await page.evaluate(() => window.testContactCalls.length), 1);
  console.log('PASS: contact form validation and simulated submission');

  await open('diagnostic.html');
  await page.evaluate(() => {
    window.testDiagnosticCalls = [];
    window.MBLData.submitDiagnostic = async (payload) => { window.testDiagnosticCalls.push(payload); return { ok: true }; };
  });
  for (let step = 0; step < 20; step++) {
    if (await page.locator('[data-diag-contact]').isVisible()) break;
    const title = await page.locator('[data-diag-title]').textContent();
    const options = page.locator('[data-diag-options] button');
    if (await options.count()) await options.first().click();
    if (await page.locator('[data-diag-title]').textContent() !== title) continue;
    await page.locator('[data-diag-next]').click();
    await page.waitForTimeout(150);
  }
  assert(await page.locator('[data-diag-contact]').isVisible(), 'Diagnostic must reach the contact step');
  const diagnostic = page.locator('[data-diag-contact]');
  await diagnostic.locator('[name="nom"]').fill('Test diagnostic local');
  await diagnostic.locator('[name="email"]').fill('diagnostic-test@example.invalid');
  await page.locator('[data-diag-next]').click();
  await page.waitForFunction(() => window.testDiagnosticCalls.length === 1);
  console.log('PASS: complete diagnostic journey and simulated submission');

  await open('index.html');
  await page.waitForSelector('[data-laptop-stage][data-ready]');
  await page.locator('[data-motion-toggle]').click();
  const paused = await page.locator('[data-laptop-stage]').getAttribute('data-progress');
  await page.evaluate(() => scrollTo({ top: 350, behavior: 'instant' }));
  await page.waitForTimeout(250);
  assert.equal(await page.locator('[data-laptop-stage]').getAttribute('data-progress'), paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(200);
  assert(!(await page.locator('[data-motion-toggle]').isVisible()));
  const reduced = await page.locator('[data-laptop-stage]').getAttribute('data-progress');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-laptop-stage]').getAttribute('data-progress'), reduced);
  console.log('PASS: animation pause and reduced-motion preference');

  await page.route('**/three-0.160.0.module.min.js', (route) => route.abort());
  await open('index.html');
  await page.waitForTimeout(250);
  assert(await page.locator('.studio-stage-fallback').isVisible());
  assert(await page.getByRole('link', { name: 'Parlons de votre projet' }).isVisible());
  console.log('PASS: graphics unavailable fallback');

  await context.close();
  const cookieContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await cookieContext.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  const cookiePage = await cookieContext.newPage();
  await cookiePage.goto(`${base}/services.html`);
  await cookiePage.getByRole('button', { name: 'Gérer mes choix' }).click();
  await cookiePage.getByRole('button', { name: 'Tout refuser' }).click();
  assert.equal(await cookiePage.evaluate(() => window.mblConsent.analytics), false);
  assert.equal(await cookiePage.locator('[data-mbl-privacy-panel]').count(), 0);
  console.log('PASS: cookie preferences and refusal');
  await browser.close();
  assert.deepEqual(errors, []);
})().catch((error) => { console.error(error); process.exit(1); });
