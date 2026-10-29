// Isolated UI fixtures: no real accounts, API writes, or database access.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:5179';
const output = path.resolve('docs/ui-verification');
fs.mkdirSync(output, { recursive: true });

const owner = { id: 1, name: 'María', surname1: 'Rojas', surname2: '', email: 'owner@example.test', roles: ['OWNER'] };
const tenant = { id: 2, name: 'José', surname1: 'Román', surname2: '', email: 'tenant@example.test', roles: ['CLIENT'] };
const property = {
  id: 10, title: 'Apartamento moderno cerca de la UNA', description: 'Un espacio luminoso y cómodo.\nCerca de servicios y transporte.',
  cost: 350000, typeOfCoin: 'CRC', address: 'Nicoya, Costa Rica', rooms: 2, guest: 3,
  latitude: 10.14, longitude: -85.45, status: 'ACTIVE', reservedTenantId: 2, reserved: true, owner,
  typeOfProperty: { id: 1, name: 'Apartamento' }, services: [{ id: 1, name: 'Internet', icono: 'wifi', description: 'Conexión incluida' }],
  files: [{ id: 1, path: 'fixture.jpg', url: base + '/fixture-room.svg', mimeType: 'image/svg+xml', fileName: 'room' }], iconDescriptions: [],
};
const visit = { id: 9, status: 'CONFIRMED', scheduledAt: '2030-10-30T20:30:00Z', timezone: 'America/Costa_Rica', note: 'Mensaje\n' + 'e'.repeat(490), createdAt: '2030-10-01T12:00:00Z', previousScheduledAt: null, expiresAt: null, property, tenant, owner };
const conversation = { id: 4, createdAt: '2030-10-01T12:00:00Z', participants: [owner, tenant], property, unreadCount: 0 };
const comments = [{ id: 1, rating: 5, content: 'Buen lugar', createdAt: '2026-10-20T12:00:00Z', author: tenant }, { id: 2, rating: 4, content: 'Cómodo', createdAt: '2026-10-21T12:00:00Z', author: tenant }, { id: 3, rating: null, content: 'Comentario antiguo', createdAt: '2026-10-22T12:00:00Z', author: tenant }];

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.UI_BROWSER || 'msedge' });
  const results = [];
  try {
    async function fixture(role, width = 1440) {
      const user = role === 'OWNER' ? owner : role === 'ADMIN' ? { ...owner, roles: ['ADMIN'] } : tenant;
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: 'es-CR' });
      await ctx.addInitScript(({ authenticated }) => { localStorage.setItem('saferent.language', 'es'); if (authenticated) localStorage.setItem('token', 'ui-fixture'); }, { authenticated: Boolean(role) });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      let currency = 'CRC';
      const requests = [];
      await page.route('**/*', async route => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.pathname === '/fixture-room.svg') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#e7dfd2"/><rect x="70" y="55" width="220" height="240" rx="8" fill="#b9d9dd"/><rect x="300" y="260" width="400" height="170" rx="20" fill="#f9f6ef"/><rect x="330" y="275" width="150" height="65" rx="12" fill="#c9bca5"/></svg>' });
        if (!['xhr', 'fetch'].includes(request.resourceType())) return route.continue();
        const p = url.pathname.replace(/^\/api/, '');
        requests.push({ path: p, currency: url.searchParams.get('displayCurrency'), method: request.method() });
        let body;
        if (p === '/auth/me') body = user;
        else if (p === '/auth/profile') body = { ...user, phoneNumber: '88888888', birthdate: '2000-01-01', idCard: '123456789', countryCode: 'CR', preferredCurrency: currency, resolvedCurrency: currency, preferredLanguage: 'es' };
        else if (p === '/auth/profile-options' || p === '/auth/display-currencies') body = { countries: [{ code: 'CR', name: 'Costa Rica', currency: 'CRC' }], currencies: ['CRC', 'USD', 'EUR'].map(code => ({ code, name: code })), defaultCurrency: 'CRC' };
        else if (p === '/auth/currency') { currency = request.postDataJSON().preferredCurrency; body = { preferredCurrency: currency }; }
        else if (p === '/auth/language') body = { preferredLanguage: request.postDataJSON().preferredLanguage };
        else if (p === '/properties/owner/1') body = [property, { ...property, id: 11, title: 'Casa familiar', status: 'PENDING', reservedTenantId: null }];
        else if (p === '/properties/10' || p === '/properties/active/10') body = property;
        else if (p === '/properties/active') body = [property];
        else if (p === '/visits/summary') body = { ownerPending: 0, ownerUpcoming: 1, tenantNeedsAnswer: 0, tenantUpcoming: 1 };
        else if (p === '/visits/received' || p === '/visits/mine') body = [visit];
        else if (p === '/conversations/user/' + user.id) body = [conversation];
        else if (p === '/conversations/4') body = conversation;
        else if (p === '/comments/property/10/me') body = null;
        else if (p === '/comments/property/10') body = request.method() === 'POST' ? {} : comments;
        else if (p === '/services') body = property.services;
        else body = [];
        return route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }, body: JSON.stringify(body) });
      });
      async function go(p, text) { await page.goto(base + p); await page.getByText(text, { exact: false }).filter({ visible: true }).first().waitFor(); }
      async function fits(label) {
        assert.deepEqual(errors, [], label + ': runtime errors');
        const sizes = await page.evaluate(() => ({ body: document.documentElement.scrollWidth, viewport: innerWidth, pageHeight: document.documentElement.scrollHeight, height: innerHeight }));
        assert(sizes.body <= sizes.viewport + 1, label + ': horizontal page overflow ' + JSON.stringify(sizes));
        if (page.url().includes('/dashboard/')) assert(sizes.pageHeight <= sizes.height + 1, label + ': outer page scroll');
        results.push(label);
        console.log('Passed: ' + label);
      }
      return { ctx, page, go, fits, requests };
    }
    for (const width of [1440, 375, 320]) {
      const f = await fixture('OWNER', width);
      await f.go('/dashboard/owner/properties', property.title);
      assert.equal(await f.page.locator('li img').count(), 2);
      await f.fits('owner cards ' + width);
      if (width !== 320) await f.page.screenshot({ path: path.join(output, 'owner-properties-' + width + '.png') });
      await f.go('/dashboard/owner/properties/detail/10', 'Vista previa privada');
      await f.page.getByRole('heading', { name: property.title }).waitFor();
      await f.fits('owner preview ' + width);
      await f.go('/dashboard/owner/visits', 'Mensaje');
      assert(await f.page.locator('article').first().evaluate(el => el.scrollWidth <= el.clientWidth));
      await f.fits('long appointment note ' + width);
      await f.go('/dashboard/owner/settings', 'Seguridad');
      await f.page.getByRole('button', { name: 'Editar perfil', exact: true }).click();
      await f.page.getByLabel('Nombre', { exact: true }).waitFor();
      await f.fits('settings editor scroll ' + width);
      await f.ctx.close();
    }
    const admin = await fixture('ADMIN', 1024);
    await admin.go('/admin/services', 'Crear un servicio');
    assert(admin.page.url().includes('/dashboard/admin/services'));
    await admin.fits('admin services legacy redirect');
    await admin.page.setViewportSize({ width: 375, height: 900 });
    await admin.fits('admin services mobile');
    await admin.ctx.close();
    const client = await fixture('CLIENT', 375);
    await client.go('/dashboard/messages/4', 'Mis citas');
    await client.fits('conversation visit card mobile');
    await client.go('/property_detail/10', '4,5 / 5');
    await client.page.getByRole('radio', { name: '4 de 5 estrellas', exact: true }).check();
    await client.fits('rating average and accessible input');
    await client.page.getByRole('combobox', { name: 'Moneda del perfil', exact: true }).click();
    await client.page.getByRole('option', { name: 'USD', exact: true }).click();
    await client.page.waitForFunction(() => [...document.querySelectorAll('button[role="combobox"]')].some(button => button.textContent.includes('USD')));
    assert(client.requests.some(request => request.currency === 'USD'));
    await client.fits('account currency refresh');
    await client.ctx.close();
    const guest = await fixture(null, 375);
    await guest.go('/property_detail/10', property.title);
    await guest.page.getByRole('combobox', { name: 'Moneda del perfil', exact: true }).click();
    await guest.page.getByRole('option', { name: 'EUR', exact: true }).click();
    assert.equal(await guest.page.evaluate(() => localStorage.getItem('saferent.displayCurrency')), 'EUR');
    await guest.page.reload();
    await guest.page.getByRole('combobox', { name: 'Moneda del perfil', exact: true }).filter({ hasText: 'EUR' }).waitFor();
    await guest.fits('guest currency persistence');
    await guest.ctx.close();
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ fixtures: true, checks: results }, null, 2));
    console.log('UI fixture checks passed: ' + results.join(', '));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
