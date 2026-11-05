const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
    console.log('--- Starting Playwright Comprehensive Verification ---');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. TEST HOMEPAGE
    console.log('[1/4] Testing Homepage (http://localhost:10000/)...');
    await page.goto('http://localhost:10000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const homeBodyText = await page.innerText('body');

    // Font check
    const h1Font = await page.$eval('h1.title-hero', el => window.getComputedStyle(el).fontFamily);
    console.log('Homepage H1 Font:', h1Font);
    assert(h1Font.toLowerCase().includes('times new roman') || h1Font.toLowerCase().includes('times'), 'H1 should be Times New Roman');

    // Clutter checks
    assert(!homeBodyText.includes('SPECIFICATIONS ENGINE'), 'Must not contain SPECIFICATIONS ENGINE');
    assert(!homeBodyText.includes('STAGE: Production Hardware'), 'Must not contain STAGE: Production Hardware');
    assert(!homeBodyText.includes('SYSTEM DIAGNOSTIC ACTIVE'), 'Must not contain SYSTEM DIAGNOSTIC ACTIVE');
    assert(!homeBodyText.includes('OUR MISSION'), 'Must not contain OUR MISSION');

    // Vision quote check
    assert(homeBodyText.includes('OUR VISION'), 'Must contain OUR VISION');
    assert(homeBodyText.includes('Pioneering the quantum frontier'), 'Must contain the new quantum & innovation vision quote');

    // Product matrix in Core Stack check
    assert(homeBodyText.includes('TrexOS'), 'Must contain TrexOS');
    assert(homeBodyText.includes('AeroHydra X-1') || homeBodyText.includes('I-Trax AeroHydra X-1'), 'Must contain AeroHydra X-1');
    assert(homeBodyText.includes('TrexVision'), 'Must contain TrexVision');
    assert(homeBodyText.includes('Synap-X'), 'Must contain Synap-X');

    // Check that bulky diagnostic HUD in Section 05 is removed
    const archDiag = await page.$('#arch-diag-title');
    assert(archDiag === null, 'Diagnostic stream HUD bar must be removed');

    await page.screenshot({ path: 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0/evidence-home-verified.png', fullPage: false });

    // 2. TEST PRODUCTS PAGE
    console.log('[2/4] Testing Products Page (http://localhost:10000/products.html)...');
    await page.goto('http://localhost:10000/products.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const prodBodyText = await page.innerText('body');

    // Clutter checks
    assert(!prodBodyText.includes('SPECIFICATIONS ENGINE'), 'Products page must not contain SPECIFICATIONS ENGINE');
    assert(!prodBodyText.includes('STAGE:'), 'Products page must not contain STAGE:');
    assert(!prodBodyText.includes('SYSTEM DIAGNOSTIC ACTIVE'), 'Products page must not contain SYSTEM DIAGNOSTIC ACTIVE');
    assert(!prodBodyText.includes('OUR MISSION'), 'Products page must not contain OUR MISSION');

    // Diagnostic code blocks (<pre><code>) check in products
    const productPres = await page.$$('section pre');
    console.log('Pre code blocks found in product sections:', productPres.length);
    assert(productPres.length === 0, 'Diagnostic code blocks in product sections must be completely removed');

    // Verify 4 products
    assert(prodBodyText.includes('TREXOS'), 'Must contain TREXOS');
    assert(prodBodyText.includes('I-TRAX AEROHYDRA X-1'), 'Must contain I-TRAX AEROHYDRA X-1');
    assert(prodBodyText.includes('TREXVISION'), 'Must contain TREXVISION');
    assert(prodBodyText.includes('SYNAP-X'), 'Must contain SYNAP-X');

    // Verify AeroHydra X-1 details
    assert(prodBodyText.includes('Level 4+ Full Trajectory Autonomy'), 'AeroHydra must show Level 4+ Autonomy');
    assert(prodBodyText.includes('Encrypted Frequency Hopping Link') || prodBodyText.includes('telemetry mesh') || prodBodyText.includes('Encrypted Frequency Hopping Mesh'), 'AeroHydra must show encrypted telemetry');
    assert(prodBodyText.includes('Carbon-Composite Aerodynamic Cell'), 'AeroHydra must show Carbon-Composite airframe');
    assert(prodBodyText.includes('Modular Hot-Swappable') && prodBodyText.includes('Thermal') && prodBodyText.includes('LiDAR'), 'AeroHydra must show modular sensors');

    // Verify Synap-X 5 pillars
    assert(prodBodyText.toLowerCase().includes('speed & execution'), 'Synap-X must show Pillar 1');
    assert(prodBodyText.toLowerCase().includes('conversational ux'), 'Synap-X must show Pillar 2');
    assert(prodBodyText.toLowerCase().includes('audio & acoustic'), 'Synap-X must show Pillar 3');
    assert(prodBodyText.toLowerCase().includes('cross-device handoff'), 'Synap-X must show Pillar 4');
    assert(prodBodyText.toLowerCase().includes('kill switch') && prodBodyText.toLowerCase().includes('safety'), 'Synap-X must show Pillar 5');

    // Hardware photo check
    const hardwareImg = await page.$('img[src*="trexos-console-hardware.jpg"]');
    assert(hardwareImg !== null, 'TrexOS real hardware photo must be present');

    await page.screenshot({ path: 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0/evidence-products-verified.png', fullPage: false });

    // 3. MOBILE VIEWPORT TEST
    console.log('[3/4] Testing Mobile Viewport (390x844)...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:10000/products.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0/evidence-mobile-products-verified.png', fullPage: false });

    await browser.close();
    console.log('[4/4] ALL AUTOMATED VERIFICATIONS PASSED SUCCESSFULLY!');
})();
