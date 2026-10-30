const { chromium } = require('playwright');

(async () => {
    console.log('=== Verifying Updated Lamborghini-Inspired Experience ===');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    
    // Fresh context without stored session to test intro animation
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });

    console.log('Navigating to http://localhost:10000/index.html...');
    await page.goto('http://localhost:10000/index.html', { waitUntil: 'domcontentloaded' });

    // 1. Capture Preloader in action (full to fit silver logo, ambient glow, flare)
    await page.waitForTimeout(1600);
    await page.screenshot({ path: 'tests/evidence-updated-intro-preloader.png' });
    console.log('Saved tests/evidence-updated-intro-preloader.png');

    // 2. Wait for intro to finish or click skip to inspect word reveal
    const skipBtn = await page.$('#skip-intro-btn');
    if (skipBtn) {
        await skipBtn.click();
    }
    await page.waitForTimeout(900);

    // 3. Check hero headline word animation
    const wordChars = await page.$$('.hero-word-char');
    console.log('Found hero word elements:', wordChars.length);
    for (let i = 0; i < wordChars.length; i++) {
        const text = await wordChars[i].textContent();
        const transform = await wordChars[i].evaluate(el => window.getComputedStyle(el).transform);
        const opacity = await wordChars[i].evaluate(el => window.getComputedStyle(el).opacity);
        console.log(`Word [${text.trim()}]: opacity=${opacity}, transform=${transform}`);
    }

    // Capture Hero with words animated and clean navbar
    await page.screenshot({ path: 'tests/evidence-updated-hero-navbar.png' });
    console.log('Saved tests/evidence-updated-hero-navbar.png');

    // 4. Verify Navbar items: exactly MENU | LOGO | CONNECT WITH US
    const navButtons = await page.$$eval('#main-header button, #main-header a', els => els.map(e => e.innerText.trim()).filter(Boolean));
    console.log('Navbar elements text:', navButtons);

    // 5. Click MENU and capture 3-column Lamborghini-style overlay
    console.log('Opening Lamborghini-style menu drawer...');
    await page.click('#menu-toggle-btn');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'tests/evidence-updated-menu-drawer.png' });
    console.log('Saved tests/evidence-updated-menu-drawer.png');

    // 6. Click a menu link and verify smooth close
    console.log('Clicking ECOSYSTEM menu link...');
    await page.click('.lamborghini-menu-row:has-text("ECOSYSTEM")');
    await page.waitForTimeout(800);
    const isDrawerOpen = await page.$eval('#fullscreen-nav-drawer', el => el.classList.contains('active'));
    console.log('Drawer is closed after link click:', !isDrawerOpen);

    console.log('=== Console Errors ===');
    console.log(errors.length === 0 ? 'Zero errors!' : errors);

    await browser.close();
    console.log('=== Verification Complete ===');
})();
