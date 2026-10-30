const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('=== Starting I-Trex Cinematic Verification Suite ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // 1. Test Homepage
    console.log('Navigating to http://localhost:10000/index.html...');
    const response = await page.goto('http://localhost:10000/index.html', { waitUntil: 'domcontentloaded' });
    console.log('Page response status:', response.status());

    // Check title
    const title = await page.title();
    console.log('Page title:', title);

    // Wait for preloader skip or dismiss
    const skipBtn = await page.$('#skip-intro-btn');
    if (skipBtn) {
        console.log('Clicking SKIP INTRO button...');
        await skipBtn.click();
    }
    // Allow headline animation to complete cleanly
    await page.waitForTimeout(2200);

    // Check hero headline
    const heroH1 = await page.textContent('h1');
    console.log('Hero Headline Text:', heroH1.replace(/\s+/g, ' ').trim());

    // Screenshot Desktop Hero
    await page.screenshot({ path: 'tests/evidence-cinematic-desktop-hero.png' });
    console.log('Saved tests/evidence-cinematic-desktop-hero.png');

    // Test Product Showcase Switcher (Switching through all 5 products)
    console.log('Testing Product Showcase tabs...');
    const tabs = await page.$$('.product-tab-btn');
    console.log('Found product tabs count:', tabs.length);

    for (let i = 0; i < tabs.length; i++) {
        await tabs[i].click();
        await page.waitForTimeout(300);
        const stageTitle = await page.textContent('#product-stage-content h3');
        console.log(`Tab ${i} activated: ${stageTitle?.trim()}`);
    }

    // Scroll to Video Theater
    console.log('Testing Video Theater section...');
    await page.locator('#vision').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/evidence-cinematic-video-theater.png' });
    console.log('Saved tests/evidence-cinematic-video-theater.png');

    // Scroll to Product Ecosystem
    await page.locator('#ecosystem').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/evidence-cinematic-ecosystem.png' });
    console.log('Saved tests/evidence-cinematic-ecosystem.png');

    // Test 4 Architecture Pillars Interactive Hover
    console.log('Testing 4 Architectural Pillars...');
    await page.locator('#technology').scrollIntoViewIfNeeded();
    const pillarCards = await page.$$('.arch-pillar-card');
    console.log('Found architecture pillar cards:', pillarCards.length);
    if (pillarCards.length >= 4) {
        await pillarCards[1].hover();
        await page.waitForTimeout(300);
        const diagText = await page.textContent('#arch-diag-title');
        console.log('Hovered pillar 2 diagnostic:', diagText?.trim());
    }
    await page.screenshot({ path: 'tests/evidence-cinematic-architecture.png' });
    console.log('Saved tests/evidence-cinematic-architecture.png');

    // Test Fullscreen Navigation Drawer
    console.log('Testing Fullscreen Navigation Menu...');
    await page.click('#menu-toggle-btn');
    await page.waitForTimeout(500);
    const isDrawerActive = await page.$eval('#fullscreen-nav-drawer', el => el.classList.contains('active'));
    console.log('Navigation drawer is active:', isDrawerActive);
    await page.screenshot({ path: 'tests/evidence-cinematic-nav-drawer.png' });
    console.log('Saved tests/evidence-cinematic-nav-drawer.png');

    // Close Navigation Drawer
    await page.click('#nav-drawer-close');
    await page.waitForTimeout(400);

    // Scroll to Contact Section and Test Submission
    console.log('Testing Direct Founder Transmission Terminal...');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.fill('#contact-name', 'Verification Lead');
    await page.fill('#contact-email', 'satys9267@gmail.com');
    await page.fill('#contact-message', 'Automated architectural verification of I-Trex cinematic website rebuild.');
    await page.click('#founder-contact-form button[type="submit"]');
    await page.waitForTimeout(1200);

    const isModalVisible = await page.$eval('#contact-status-modal', el => !el.classList.contains('hidden'));
    console.log('Transmission Confirmation Modal Visible:', isModalVisible);
    await page.screenshot({ path: 'tests/evidence-cinematic-contact-modal.png' });

    await page.click('button:has-text("CLOSE CONSOLE")');
    await page.waitForTimeout(400);

    // Scroll to Footer
    await page.locator('#footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'tests/evidence-cinematic-footer.png' });
    console.log('Saved tests/evidence-cinematic-footer.png');

    // 2. Test Mobile Viewport (375x812 iPhone / Mobile)
    console.log('Testing Mobile Viewport (375x812)...');
    const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 812 }
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:10000/index.html', { waitUntil: 'domcontentloaded' });
    try {
        const mobileSkip = await mobilePage.waitForSelector('#skip-intro-btn', { timeout: 2000 });
        if (mobileSkip) await mobileSkip.click();
    } catch (e) {
        // Preloader already dismissed or skipped
    }
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: 'tests/evidence-cinematic-mobile-hero.png' });
    console.log('Saved tests/evidence-cinematic-mobile-hero.png');
    await mobileContext.close();

    // 3. Test Products Page (products.html)
    console.log('Testing products.html...');
    await page.setViewportSize({ width: 1440, height: 900 });
    const prodRes = await page.goto('http://localhost:10000/products.html', { waitUntil: 'domcontentloaded' });
    console.log('products.html status:', prodRes.status());
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'tests/evidence-cinematic-products-page.png' });
    console.log('Saved tests/evidence-cinematic-products-page.png');

    // Check all 5 products exist in products.html
    const prodIds = ['trexos', 'trexcore', 'trexvision', 'trexshield', 'trexconnect'];
    for (const id of prodIds) {
        const el = await page.$(`#${id}`);
        console.log(`Product #${id} exists in products.html:`, !!el);
    }

    console.log('=== Console Errors Summary ===');
    console.log(consoleErrors.length === 0 ? 'Zero console errors!' : consoleErrors);

    await browser.close();
    console.log('=== Verification Completed Successfully ===');
})();
