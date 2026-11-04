const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
    console.log('🚀 Running Rolls-Royce Nav, Menu & Light Mode Contrast Verification Test...');
    const browser = await chromium.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    
    // Test 1: Desktop Viewport
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:10000/index.html');
    await page.waitForLoadState('networkidle');

    // Skip intro if present
    try {
        await page.click('#skip-intro-btn', { timeout: 1500 });
    } catch (e) {}

    await page.waitForTimeout(1000);

    // 1. Verify Rolls-Royce Navbar Structure (MENU | LOGO | SEARCH)
    const menuBtn = await page.$('#menu-toggle-btn');
    const menuText = await menuBtn.textContent();
    console.log(`✓ Menu button text: "${menuText.trim()}"`);
    if (!menuText.includes('MENU')) throw new Error('Menu button does not contain MENU');

    const searchBtn = await page.$('#search-trigger-btn');
    const searchText = await searchBtn.textContent();
    console.log(`✓ Search button text: "${searchText.trim()}"`);
    if (!searchText.includes('SEARCH')) throw new Error('Search button does not contain SEARCH');

    // Verify bulky CONNECT WITH US button is removed from header
    const headerConnectBtn = await page.$('#main-header a[href="#contact"]');
    if (headerConnectBtn) {
        throw new Error('Header should not contain bulky CONNECT WITH US button in Rolls-Royce standard');
    }
    console.log('✓ Verified bulky CONNECT WITH US button replaced by sleek Rolls-Royce SEARCH button');

    // 2. Test Site Search Trigger
    await searchBtn.click();
    await page.waitForTimeout(300);
    const searchModal = await page.$('#site-search-modal');
    const isSearchVisible = await searchModal.isVisible();
    console.log(`✓ Site Search Modal opened on SEARCH click: ${isSearchVisible}`);
    if (!isSearchVisible) throw new Error('Site search modal did not open on clicking SEARCH');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 3. Test Rolls-Royce Menu Overlay
    await menuBtn.click();
    await page.waitForTimeout(600);
    const drawer = await page.$('#fullscreen-nav-drawer');
    const isDrawerActive = await drawer.evaluate(el => el.classList.contains('active'));
    console.log(`✓ Rolls-Royce Menu Drawer opened (active: ${isDrawerActive})`);
    if (!isDrawerActive) throw new Error('Fullscreen nav drawer failed to open');

    // Verify Rolls-Royce Close button
    const closeBtn = await page.$('#nav-drawer-close');
    const closeText = await closeBtn.textContent();
    console.log(`✓ Drawer close button text: "${closeText.trim()}"`);
    if (!closeText.includes('CLOSE')) throw new Error('Close button does not contain CLOSE');

    // Verify Pune Headquarters in Drawer footer
    const drawerFooterText = await drawer.evaluate(el => el.textContent);
    if (!drawerFooterText.includes('PUNE, MAHARASHTRA, INDIA')) {
        throw new Error('Rolls-Royce Menu Drawer does not display Pune Headquarters');
    }
    console.log('✓ Verified Menu Drawer displays "ORIGIN: PUNE, MAHARASHTRA, INDIA // GLOBAL HQ"');

    // Capture screenshot of Rolls-Royce Menu in dark mode
    const artifactDir = 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0';
    await page.screenshot({ path: path.join(artifactDir, 'evidence-rolls-royce-menu-dark.png') });
    console.log('✓ Saved dark mode Rolls-Royce menu screenshot');

    // Close menu
    await closeBtn.click();
    await page.waitForTimeout(500);

    // 4. Test Light Mode Toggle & Text Contrast
    console.log('Testing Light Mode Toggle & Contrast...');
    const themeBtn = await page.$('#theme-toggle-btn');
    await themeBtn.click();
    await page.waitForTimeout(600);

    const isLightMode = await page.evaluate(() => document.documentElement.classList.contains('light'));
    console.log(`✓ Light mode active: ${isLightMode}`);
    if (!isLightMode) throw new Error('html.light was not applied after theme toggle');

    // Check Hero word color in light mode (Must NOT be white)
    const heroWordColor = await page.evaluate(() => {
        const word = document.querySelector('.hero-word-char');
        return window.getComputedStyle(word).color;
    });
    console.log(`✓ Hero word computed color in light mode: ${heroWordColor}`);
    // rgb(15, 23, 42) is #0f172a
    if (heroWordColor.includes('255, 255, 255')) {
        throw new Error(`CRITICAL: Hero text is still pure white in light mode: ${heroWordColor}`);
    }

    // Check Outline Button (.chamfer-btn-outline) in light mode
    const outlineBtnStyles = await page.evaluate(() => {
        const btn = document.querySelector('.chamfer-btn-outline');
        if (!btn) return null;
        const cs = window.getComputedStyle(btn);
        return { color: cs.color, border: cs.borderColor, opacity: cs.opacity };
    });
    console.log('✓ Outline button computed styles in light mode:', outlineBtnStyles);
    if (outlineBtnStyles.color.includes('255, 255, 255')) {
        throw new Error(`CRITICAL: Outline button text is pure white in light mode: ${outlineBtnStyles.color}`);
    }

    // Check Architecture Pillar Card text & metric (0.35 MS) in light mode
    await page.evaluate(() => window.scrollTo(0, 2200));
    await page.waitForTimeout(600);

    const pillarCardStyles = await page.evaluate(() => {
        const card = document.querySelector('.arch-pillar-card');
        const title = card.querySelector('h3');
        const metric = card.querySelector('.text-white');
        return {
            cardBg: window.getComputedStyle(card).backgroundColor,
            titleColor: window.getComputedStyle(title).color,
            metricColor: window.getComputedStyle(metric).color
        };
    });
    console.log('✓ Pillar card computed styles in light mode:', pillarCardStyles);
    if (pillarCardStyles.metricColor.includes('255, 255, 255')) {
        throw new Error(`CRITICAL: Metric 0.35 MS is pure white on white card in light mode: ${pillarCardStyles.metricColor}`);
    }

    // Check Headquarters in Footer
    const footerText = await page.evaluate(() => {
        return document.querySelector('#footer, footer').textContent;
    });
    if (!footerText.includes('Pune, Maharashtra, India')) {
        throw new Error('Footer does not display Pune, Maharashtra, India');
    }
    console.log('✓ Verified Footer displays "HEADQUARTERS: Pune, Maharashtra, India // Global HQ"');

    // Take screenshot of Hero in Light Mode
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-light-mode-hero.png') });
    console.log('✓ Saved light mode Hero screenshot');

    // Take screenshot of Pillars in Light Mode
    await page.evaluate(() => window.scrollTo(0, 2200));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-light-mode-pillars.png') });
    console.log('✓ Saved light mode Pillars screenshot');

    // Open Rolls-Royce Menu in Light Mode and screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-rolls-royce-menu-light.png') });
    console.log('✓ Saved light mode Rolls-Royce menu screenshot');
    await closeBtn.click();

    // 5. Test Mobile Viewport (iPhone 14: 390x844)
    console.log('Testing Mobile Viewport (390x844)...');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://127.0.0.1:10000/index.html');
    await mobilePage.waitForLoadState('networkidle');
    try { await mobilePage.click('#skip-intro-btn', { timeout: 1500 }); } catch (e) {}
    await mobilePage.waitForTimeout(800);

    // Verify Mobile Header Fit
    const headerWidth = await mobilePage.evaluate(() => {
        const header = document.querySelector('#main-header > div');
        return { scrollWidth: header.scrollWidth, clientWidth: header.clientWidth };
    });
    console.log('✓ Mobile Header layout fit:', headerWidth);
    if (headerWidth.scrollWidth > headerWidth.clientWidth + 5) {
        throw new Error(`Mobile header content overflows: scrollWidth ${headerWidth.scrollWidth} > clientWidth ${headerWidth.clientWidth}`);
    }

    await mobilePage.screenshot({ path: path.join(artifactDir, 'evidence-mobile-rolls-royce-header.png') });
    console.log('✓ Saved mobile Rolls-Royce header screenshot');

    // Open Mobile Menu
    await mobilePage.click('#menu-toggle-btn');
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(artifactDir, 'evidence-mobile-rolls-royce-menu.png') });
    console.log('✓ Saved mobile Rolls-Royce menu screenshot');

    await browser.close();
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! Rolls-Royce Navbar, Menu & Light Mode Contrast verified.');
}

run().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
