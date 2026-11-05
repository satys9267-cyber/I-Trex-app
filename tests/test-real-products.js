const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTest() {
    console.log('--- TESTING REAL PRODUCTS OVERHAUL ---');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
        consoleErrors.push(err.message);
    });

    const artifactDir = path.resolve('C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0');

    // 1. Test index.html
    console.log('[1/4] Loading http://localhost:10000 ...');
    await page.goto('http://localhost:10000', { waitUntil: 'networkidle' });

    // Verify Core Stack tabs
    const tabTexts = await page.$$eval('.product-tab-btn', els => els.map(e => e.textContent.trim()));
    console.log('Core Stack Tabs:', tabTexts);
    if (tabTexts.length !== 4) {
        throw new Error(`Expected 4 product tabs, found ${tabTexts.length}: ${JSON.stringify(tabTexts)}`);
    }

    // Verify TrexOS Tab (0)
    const stageTitle0 = await page.$eval('#product-stage-content h3', el => el.textContent.trim());
    console.log('Tab 0 Title:', stageTitle0);
    if (!stageTitle0.toUpperCase().includes('TREXOS')) throw new Error(`Tab 0 expected TrexOS, got ${stageTitle0}`);

    // Click Tab 1: AeroHydra X-1
    await page.click('.product-tab-btn[data-index="1"]');
    await page.waitForTimeout(600);
    const stageTitle1 = await page.$eval('#product-stage-content h3', el => el.textContent.trim());
    console.log('Tab 1 Title:', stageTitle1);
    if (!stageTitle1.toUpperCase().includes('AEROHYDRA')) throw new Error(`Tab 1 expected AeroHydra, got ${stageTitle1}`);

    // Click Tab 3: Synap-X
    await page.click('.product-tab-btn[data-index="3"]');
    await page.waitForTimeout(600);
    const stageTitle3 = await page.$eval('#product-stage-content h3', el => el.textContent.trim());
    console.log('Tab 3 Title:', stageTitle3);
    if (!stageTitle3.toUpperCase().includes('SYNAP-X')) throw new Error(`Tab 3 expected Synap-X, got ${stageTitle3}`);

    // Scroll to Core Stack and capture screenshot
    await page.locator('#ecosystem').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-real-core-stack.png') });
    console.log('✓ Captured evidence-real-core-stack.png');

    // Verify Section 05: Four Engines
    await page.locator('#technology').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const pillarTitles = await page.$$eval('.arch-pillar-card h3', els => els.map(e => e.textContent.trim()));
    console.log('Section 05 Pillars:', pillarTitles);
    if (pillarTitles.length !== 4) throw new Error(`Expected 4 architecture pillars, found ${pillarTitles.length}`);

    await page.screenshot({ path: path.join(artifactDir, 'evidence-real-four-engines.png') });
    console.log('✓ Captured evidence-real-four-engines.png');

    // 2. Test products.html
    console.log('[2/4] Loading http://localhost:10000/products.html ...');
    await page.goto('http://localhost:10000/products.html', { waitUntil: 'networkidle' });

    // Verify 4 sections present
    const sections = await page.$$eval('#products-dynamic-container section', els => els.map(e => e.id));
    console.log('Products.html section IDs:', sections);
    if (!sections.includes('trexos') || !sections.includes('aerohydra') || !sections.includes('trexvision') || !sections.includes('synapx')) {
        throw new Error(`Missing expected real product sections in products.html: ${JSON.stringify(sections)}`);
    }

    // Scroll to Synap-X and capture
    await page.locator('#synapx').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-real-synapx-specs.png') });
    console.log('✓ Captured evidence-real-synapx-specs.png');

    // Scroll to TrexOS Hardware Specs
    await page.locator('#trexos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-real-trexos-specs.png') });
    console.log('✓ Captured evidence-real-trexos-specs.png');

    // 3. Test Mobile Viewport
    console.log('[3/4] Testing mobile layout on 390x844 ...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:10000', { waitUntil: 'networkidle' });
    await page.locator('#ecosystem').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-real-mobile-stack.png') });
    console.log('✓ Captured evidence-real-mobile-stack.png');

    console.log('Console errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
        console.warn('Errors encountered:', consoleErrors);
    }

    await browser.close();
    console.log('--- ALL REAL PRODUCTS VERIFICATION PASSED ---');
}

runTest().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
