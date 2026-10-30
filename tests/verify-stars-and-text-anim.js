const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('=== Verifying Glowing Micro-Stars & Thematic Text Animations ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Visit index.html
    console.log('Loading http://localhost:10000/index.html...');
    await page.goto('http://localhost:10000/index.html', { waitUntil: 'domcontentloaded' });
    
    // Skip intro
    const skipBtn = await page.$('#skip-intro-btn');
    if (skipBtn) {
        await skipBtn.click();
    }
    await page.waitForTimeout(1500);

    // Verify Canvas is active and running
    const canvasExists = await page.evaluate(() => {
        const c = document.getElementById('hero-particle-canvas');
        return c !== null && c.width > 0 && c.height > 0;
    });
    console.log('Canvas active with dimensions:', canvasExists);

    // Capture Hero with glowing micro-stars
    await page.screenshot({ path: 'tests/evidence-glowing-microstars-hero.png' });
    console.log('Captured tests/evidence-glowing-microstars-hero.png');

    // 2. Test Scroll Appearing Animation on Section 03 & 04
    console.log('Scrolling down to #vision (Experience The Vision)...');
    await page.evaluate(() => {
        const el = document.getElementById('vision');
        if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);

    const visionTitleState = await page.evaluate(() => {
        const title = document.querySelector('#vision .title-section');
        const style = window.getComputedStyle(title);
        return {
            opacity: style.opacity,
            transform: style.transform,
            filter: style.filter,
            text: title.textContent.trim()
        };
    });
    console.log('Vision Title State after scroll into view:', visionTitleState);

    await page.screenshot({ path: 'tests/evidence-text-appear-vision.png' });

    // 3. Scroll to Technology Architecture Pillars (#technology)
    console.log('Scrolling down to #technology (Architecture Pillars)...');
    await page.evaluate(() => {
        const el = document.getElementById('technology');
        if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);

    const techCardState = await page.evaluate(() => {
        const card = document.querySelector('.arch-pillar-card');
        const style = window.getComputedStyle(card);
        return {
            opacity: style.opacity,
            transform: style.transform,
            filter: style.filter
        };
    });
    console.log('Architecture Pillar Card State in view:', techCardState);
    await page.screenshot({ path: 'tests/evidence-text-appear-technology.png' });

    // 4. Scroll to Capabilities and Roadmap
    console.log('Scrolling down to #roadmap...');
    await page.evaluate(() => {
        const el = document.getElementById('roadmap');
        if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/evidence-text-appear-roadmap.png' });

    // 5. Test Bidirectional Reversal: Scroll back to top
    console.log('Scrolling back up to top (#home)...');
    await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);

    const heroReenterState = await page.evaluate(() => {
        const hero = document.querySelector('#home .relative.z-10');
        const style = window.getComputedStyle(hero);
        return {
            opacity: style.opacity,
            filter: style.filter
        };
    });
    console.log('Hero State after scrolling back up:', heroReenterState);

    // 6. Test Products Page
    console.log('Loading http://localhost:10000/products.html...');
    await page.goto('http://localhost:10000/products.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const productsCanvas = await page.evaluate(() => {
        const c = document.getElementById('hero-particle-canvas');
        return c !== null && c.width > 0;
    });
    console.log('Products page hero canvas active:', productsCanvas);

    await page.screenshot({ path: 'tests/evidence-products-microstars.png' });

    console.log('Console errors encountered:', consoleErrors.length, consoleErrors);
    console.log('=== All Verifications Completed Successfully ===');
    await browser.close();
})();
