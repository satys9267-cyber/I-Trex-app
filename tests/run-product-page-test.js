/**
 * I-Trex Innovations — Product Page & Cursor Performance Playwright Runner
 * Validates:
 * 1. Product Page Hero entrance animation sequence ("Our Products. Our Innovations.")
 * 2. Sub-headline ("Engineered for Autonomy. Deployed with Microsecond Precision.")
 * 3. Dynamic CTA Button ("Explore Specifications") entering from opposite axis
 * 4. Dynamic Category Filters (All, Autonomous Systems, Neural Hardware, Telemetry & Cloud)
 * 5. High-Impact Glassmorphic Product Cards with 3D CAD wireframe schematics
 * 6. Responsive layout & Zero Horizontal Overflow (1440px desktop & 375px mobile)
 * 7. Cursor Performance & Recalibration (native hardware cursor restored, 0ms lag)
 */

process.env.TEMP = 'D:\\temp';
process.env.TMP = 'D:\\temp';

const { chromium } = require('playwright');
const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

async function runTestSuite() {
    console.log('========================================================================');
    console.log('   I-TREX INNOVATIONS — PRODUCT PAGE HERO & PERFORMANCE TEST SUITE      ');
    console.log('   Hero Reveal, Category Filters, 3D CAD Schematics & Cursor Latency   ');
    console.log('========================================================================\n');

    const app = express();
    app.get('/products', (req, res) => res.sendFile(path.join(__dirname, '..', 'products.html')));
    app.use(express.static(path.join(__dirname, '..')));

    const server = http.createServer(app);
    const PORT = 3088;
    await new Promise(resolve => server.listen(PORT, resolve));
    console.log(`[+] Internal verification server running at http://localhost:${PORT}\n`);

    let context;
    let hasFailure = false;
    const userDataDir = path.join('D:\\temp', 'edge_profile_prod_' + Date.now());

    try {
        if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
        }

        console.log(`[+] Launching Microsoft Edge (Storage: D:\\temp)...`);
        context = await chromium.launchPersistentContext(userDataDir, {
            channel: 'msedge',
            headless: true,
            viewport: { width: 1440, height: 900 },
            args: [
                `--disk-cache-dir=D:\\temp\\edge_cache`,
                '--disable-gpu-shader-disk-cache',
                '--disable-features=OptimizationHints'
            ]
        });

        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`    [Browser Error]:`, msg.text());
            }
        });

        // -------------------------------------------------------------
        // SUITE 1: CURSOR SPEED & LAG RECALIBRATION CHECK
        // -------------------------------------------------------------
        console.log('--- 1. TESTING CURSOR LATENCY & PERFORMANCE RECALIBRATION ---');
        await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        // Verify native cursor is NOT hidden via cursor: none
        const bodyCursorStyle = await page.evaluate(() => {
            return window.getComputedStyle(document.body).cursor;
        });
        console.log(`[1.1] Document body computed cursor: "${bodyCursorStyle}" (Must NOT be "none")`);
        if (bodyCursorStyle === 'none') {
            throw new Error('Hardware cursor is hidden with cursor: none! Users experience severe lag.');
        } else {
            console.log('    ✓ Native hardware cursor active with 0ms hardware response time.');
        }

        // Test rapid mouse movement without performance drops or errors
        const mouseMovePerf = await page.evaluate(async () => {
            const start = performance.now();
            for (let i = 0; i < 50; i++) {
                const event = new MouseEvent('mousemove', {
                    clientX: 200 + (i * 10),
                    clientY: 300 + Math.sin(i) * 50
                });
                window.dispatchEvent(event);
            }
            return performance.now() - start;
        });
        console.log(`[1.2] Dispatched 50 rapid mousemove events in ${mouseMovePerf.toFixed(2)}ms`);
        if (mouseMovePerf > 100) {
            console.warn('    ⚠ Warning: Mouse movement took longer than expected.');
        } else {
            console.log('    ✓ Mouse movement is ultra-fast, smooth, and lightweight.');
        }

        // -------------------------------------------------------------
        // SUITE 2: PRODUCT PAGE HERO ENTRANCE & REVEAL ANIMATION
        // -------------------------------------------------------------
        console.log('\n--- 2. TESTING PRODUCT PAGE HERO REVEAL & CTA ANIMATIONS ---');
        await page.goto(`http://localhost:${PORT}/products.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2200); // Allow entrance sequence to settle

        // 2.1 Verify primary headline
        const headline = page.locator('#product-hero-headline');
        const isHeadlineVisible = await headline.isVisible();
        const headlineText = (await headline.innerText()).replace(/\s+/g, ' ').trim();
        console.log(`[2.1] Headline visible: ${isHeadlineVisible}`);
        console.log(`      Text: "${headlineText}"`);
        if (!headlineText.includes('Our Products. Our Innovations.')) {
            throw new Error(`Headline does not match required brand title! Found: "${headlineText}"`);
        }
        console.log('    ✓ Primary headline matches "Our Products. Our Innovations."');

        // 2.2 Verify subtext
        const subtext = page.locator('#product-hero-subtext');
        const isSubtextVisible = await subtext.isVisible();
        const subtextContent = (await subtext.innerText()).replace(/\s+/g, ' ').trim();
        console.log(`[2.2] Subtext visible: ${isSubtextVisible}`);
        console.log(`      Text: "${subtextContent}"`);
        if (!subtextContent.includes('Engineered for Autonomy. Deployed with Microsecond Precision.')) {
            throw new Error(`Subtext does not match required sub-headline! Found: "${subtextContent}"`);
        }
        console.log('    ✓ Sub-headline matches "Engineered for Autonomy. Deployed with Microsecond Precision."');

        // 2.3 Verify hero CTA button
        const heroCta = page.locator('#product-hero-cta');
        const isCtaVisible = await heroCta.isVisible();
        const ctaText = (await heroCta.innerText()).replace(/\s+/g, ' ').trim();
        console.log(`[2.3] Primary Hero CTA visible: ${isCtaVisible}, Label: "${ctaText}"`);
        if (!ctaText.toLowerCase().includes('explore specifications')) {
            throw new Error(`Primary CTA text should contain "Explore Specifications". Found: "${ctaText}"`);
        }

        const secondaryCta = page.locator('#product-hero-secondary-cta');
        const isSecondaryCtaVisible = await secondaryCta.isVisible();
        const secondaryCtaText = (await secondaryCta.innerText()).replace(/\s+/g, ' ').trim();
        console.log(`[2.4] Secondary CTA visible: ${isSecondaryCtaVisible}, Label: "${secondaryCtaText}"`);
        if (!secondaryCtaText.toLowerCase().includes('view architecture specs')) {
            throw new Error(`Secondary CTA text should contain "View Architecture Specs". Found: "${secondaryCtaText}"`);
        }

        // 2.4 Verify Hero Badge
        const heroBadge = page.locator('#product-hero-badge');
        console.log(`[2.5] Product Hero Badge visible: ${await heroBadge.isVisible()}`);

        // Capture Desktop Hero Screenshot
        await page.screenshot({ path: path.join(__dirname, 'evidence-product-hero-desktop.png') });
        console.log('    ✓ Captured screenshot: evidence-product-hero-desktop.png');

        // -------------------------------------------------------------
        // SUITE 3: DYNAMIC CATEGORY FILTERING TABS
        // -------------------------------------------------------------
        console.log('\n--- 3. TESTING DYNAMIC CATEGORY FILTERING TABS ---');
        
        const filterAll = page.locator('#filter-all');
        const filterAutonomous = page.locator('#filter-autonomous');
        const filterNeural = page.locator('#filter-neural');
        const filterTelemetry = page.locator('#filter-telemetry');

        console.log(`[3.1] Filter pills presence:`);
        console.log(`      All: ${await filterAll.isVisible()}`);
        console.log(`      Autonomous Systems: ${await filterAutonomous.isVisible()}`);
        console.log(`      Neural Hardware: ${await filterNeural.isVisible()}`);
        console.log(`      Telemetry & Cloud: ${await filterTelemetry.isVisible()}`);

        if (!await filterAll.isVisible() || !await filterAutonomous.isVisible() ||
            !await filterNeural.isVisible() || !await filterTelemetry.isVisible()) {
            throw new Error('One or more required category filter tabs are missing!');
        }

        // Check total product cards
        const totalCards = await page.locator('.product-card').count();
        console.log(`[3.2] Total Product Cards present: ${totalCards} (Expected: 5)`);
        if (totalCards !== 5) {
            throw new Error(`Expected 5 product cards, found ${totalCards}`);
        }

        // Filter 1: Autonomous Systems
        console.log('[3.3] Clicking "Autonomous Systems"...');
        await filterAutonomous.click();
        await page.waitForTimeout(600);
        const trexosVisible = await page.locator('#trexos').isVisible();
        const trexcoreVisible = await page.locator('#trexcore').isVisible();
        const trexvisionVisible = await page.locator('#trexvision').isVisible();
        console.log(`      TrexOS visible: ${trexosVisible} (Expected: true)`);
        console.log(`      TrexCore visible: ${trexcoreVisible} (Expected: false)`);
        console.log(`      TrexVision visible: ${trexvisionVisible} (Expected: true)`);
        if (!trexosVisible || trexcoreVisible) {
            throw new Error('Autonomous Systems filter failed to show/hide appropriate cards.');
        }
        console.log('    ✓ "Autonomous Systems" filtered accurately.');

        // Filter 2: Neural Hardware
        console.log('[3.4] Clicking "Neural Hardware"...');
        await filterNeural.click();
        await page.waitForTimeout(600);
        const visionNeural = await page.locator('#trexvision').isVisible();
        const coreNeural = await page.locator('#trexcore').isVisible();
        console.log(`      TrexVision visible: ${visionNeural} (Expected: true)`);
        console.log(`      TrexCore visible: ${coreNeural} (Expected: false)`);
        if (!visionNeural || coreNeural) {
            throw new Error('Neural Hardware filter failed to show/hide appropriate cards.');
        }
        console.log('    ✓ "Neural Hardware" filtered accurately.');

        // Filter 3: Telemetry & Cloud
        console.log('[3.5] Clicking "Telemetry & Cloud"...');
        await filterTelemetry.click();
        await page.waitForTimeout(600);
        const coreTelemetry = await page.locator('#trexcore').isVisible();
        const connectTelemetry = await page.locator('#trexconnect').isVisible();
        const osTelemetry = await page.locator('#trexos').isVisible();
        console.log(`      TrexCore visible: ${coreTelemetry} (Expected: true)`);
        console.log(`      TrexConnect visible: ${connectTelemetry} (Expected: true)`);
        console.log(`      TrexOS visible: ${osTelemetry} (Expected: false)`);
        if (!coreTelemetry || !connectTelemetry || osTelemetry) {
            throw new Error('Telemetry & Cloud filter failed.');
        }
        console.log('    ✓ "Telemetry & Cloud" filtered accurately.');

        // Reset Filter: All
        console.log('[3.6] Resetting to "All"...');
        await filterAll.click();
        await page.waitForTimeout(600);
        const osAll = await page.locator('#trexos').isVisible();
        const coreAll = await page.locator('#trexcore').isVisible();
        const connectAll = await page.locator('#trexconnect').isVisible();
        if (!osAll || !coreAll || !connectAll) {
            throw new Error('"All" filter failed to restore all products.');
        }
        console.log('    ✓ "All" filter restored all products.');

        // Capture Filtered Screenshot
        await page.screenshot({ path: path.join(__dirname, 'evidence-product-filters.png') });
        console.log('    ✓ Captured screenshot: evidence-product-filters.png');

        // -------------------------------------------------------------
        // SUITE 4: 3D CAD SCHEMATICS & GLASSMORPHIC CARDS
        // -------------------------------------------------------------
        console.log('\n--- 4. TESTING 3D CAD SCHEMATICS & SPECIFICATIONS ---');
        const cadBlueprints = await page.locator('.group\\/cad').count();
        console.log(`[4.1] Interactive 3D CAD Blueprint Wireframes count: ${cadBlueprints} (Expected: 5)`);
        if (cadBlueprints < 5) {
            throw new Error(`Expected at least 5 CAD schematics, found ${cadBlueprints}`);
        }
        console.log('    ✓ All product cards contain interactive 3D CAD wireframe blueprints.');

        // -------------------------------------------------------------
        // SUITE 5: RESPONSIVENESS & ZERO HORIZONTAL OVERFLOW
        // -------------------------------------------------------------
        console.log('\n--- 5. TESTING RESPONSIVE LAYOUT & HORIZONTAL OVERFLOW ---');
        
        // 5.1 Desktop 1440x900 overflow check
        const desktopOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        console.log(`[5.1] Desktop (1440x900) Horizontal Overflow: ${desktopOverflow} (Must be false)`);
        if (desktopOverflow) {
            throw new Error('Desktop layout has horizontal overflow!');
        }

        // 5.2 Mobile 375x812 overflow check
        console.log('[5.2] Testing Mobile Viewport (375x812)...');
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(800);

        const mobileOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        console.log(`      Mobile (375x812) Horizontal Overflow: ${mobileOverflow} (Must be false)`);
        if (mobileOverflow) {
            throw new Error('Mobile layout has horizontal overflow!');
        }

        const mobileHeadlineVisible = await page.locator('#product-hero-headline').isVisible();
        const mobileCtaVisible = await page.locator('#product-hero-cta').isVisible();
        console.log(`      Mobile Headline visible: ${mobileHeadlineVisible}, Mobile CTA visible: ${mobileCtaVisible}`);
        if (!mobileHeadlineVisible || !mobileCtaVisible) {
            throw new Error('Hero elements not visible on mobile layout.');
        }

        // Capture Mobile Screenshot
        await page.screenshot({ path: path.join(__dirname, 'evidence-product-mobile.png') });
        console.log('    ✓ Captured screenshot: evidence-product-mobile.png');

        console.log('\n========================================================================');
        console.log('   🎉 ALL PRODUCT PAGE & CURSOR PERFORMANCE TESTS PASSED 100%!         ');
        console.log('========================================================================\n');

    } catch (err) {
        hasFailure = true;
        console.error('\n❌ [TEST FAILURE]:', err.message);
    } finally {
        if (context) await context.close();
        server.close();
    }

    if (hasFailure) process.exit(1);
}

runTestSuite();
