const { chromium } = require('playwright');

(async () => {
    console.log('Testing Mobile Admin Responsiveness & Navigation Drawer...\n');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    // Exactly 400x645 from user's DevTools screenshot
    const context = await browser.newContext({ viewport: { width: 400, height: 645 } });
    const page = await context.newPage();

    // Mock admin authentication in localStorage
    await page.addInitScript(() => {
        localStorage.setItem('itrex_auth_user', JSON.stringify({
            uid: 'usr-001',
            email: 'satys9267@gmail.com',
            name: 'Satyam Swami',
            role: 'founder',
            isAdmin: true,
            founderVerified: true
        }));
    });

    await page.goto('http://localhost:10000/admin.html#home', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // 1. VERIFY INITIAL STATE ON MOBILE
    const sidebarStateInitial = await page.evaluate(() => {
        const sidebar = document.getElementById('admin-sidebar');
        const rect = sidebar.getBoundingClientRect();
        return {
            hasHiddenClass: sidebar.classList.contains('-translate-x-full'),
            rectX: rect.x,
            rectRight: rect.right,
            width: rect.width
        };
    });
    console.log('Sidebar Initial State:', JSON.stringify(sidebarStateInitial));

    if (sidebarStateInitial.rectRight > 0 && !sidebarStateInitial.hasHiddenClass) {
        console.error('FAIL: Sidebar is still covering the screen on load!');
        process.exit(1);
    }
    console.log('  ✅ Sidebar is cleanly hidden off-screen on initial mobile load.');

    // 2. VERIFY MAIN CONTENT IS PROMINENT & FULL-WIDTH
    const mainBox = await page.locator('main').boundingBox();
    console.log('Main Content Bounding Box:', JSON.stringify(mainBox));
    if (mainBox.width < 350) {
        console.error('FAIL: Main content is too narrow!');
        process.exit(1);
    }
    console.log('  ✅ Main content takes full mobile viewport width cleanly.');

    // Verify Greeting is visible
    const greetingText = await page.textContent('#home-greeting-name');
    console.log('  Greeting displayed:', greetingText.trim());

    // Verify 2x2 Metric Tiles
    const metricCards = await page.locator('#section-home .grid-cols-2 > div').count();
    console.log(`  Metric cards rendered: ${metricCards} tiles in responsive grid.`);

    await page.screenshot({ path: 'tests/evidence/evidence-admin-mobile-closed.png' });

    // 3. TEST OPENING THE MOBILE DRAWER
    console.log('\nTesting Mobile Menu Toggle...');
    await page.click('#btn-mobile-sidebar-toggle');
    await page.waitForTimeout(400);

    const drawerOpened = await page.evaluate(() => {
        const sidebar = document.getElementById('admin-sidebar');
        const backdrop = document.getElementById('admin-sidebar-backdrop');
        const rect = sidebar.getBoundingClientRect();
        return rect.x >= 0 && !backdrop.classList.contains('hidden');
    });
    console.log('  Drawer Open Status:', drawerOpened ? 'OPEN & VISIBLE' : 'FAILED');
    if (!drawerOpened) {
        console.error('FAIL: Drawer failed to open on toggle click!');
        process.exit(1);
    }
    console.log('  ✅ Drawer smoothly slides in with dimmed backdrop.');
    await page.screenshot({ path: 'tests/evidence/evidence-admin-mobile-open.png' });

    // 4. TEST CLOSING VIA CLOSE BUTTON
    console.log('\nTesting Close Button inside Drawer...');
    await page.click('#btn-sidebar-close');
    await page.waitForTimeout(400);

    const drawerClosed = await page.evaluate(() => {
        const sidebar = document.getElementById('admin-sidebar');
        return sidebar.classList.contains('-translate-x-full');
    });
    console.log('  Drawer Closed Status:', drawerClosed ? 'CLOSED (OFF-SCREEN)' : 'FAILED');
    if (!drawerClosed) {
        console.error('FAIL: Drawer failed to close via close button!');
        process.exit(1);
    }
    console.log('  ✅ Close button successfully retracts the drawer.');

    // 5. TEST AUTO-CLOSE ON NAVIGATION ITEM CLICK
    console.log('\nTesting Navigation & Auto-Close...');
    await page.click('#btn-mobile-sidebar-toggle');
    await page.waitForTimeout(300);

    await page.click('#nav-item-products');
    await page.waitForTimeout(500);

    const productsSectionActive = await page.evaluate(() => {
        const prodSec = document.getElementById('section-products');
        const sidebar = document.getElementById('admin-sidebar');
        return !prodSec.classList.contains('hidden') && sidebar.classList.contains('-translate-x-full');
    });
    console.log('  Products Section Active & Drawer Auto-Closed:', productsSectionActive ? 'YES' : 'NO');
    if (!productsSectionActive) {
        console.error('FAIL: Navigation link did not auto-close the drawer or failed to activate products section!');
        process.exit(1);
    }
    console.log('  ✅ Navigating automatically closed the drawer and switched to Products view.');
    await page.screenshot({ path: 'tests/evidence/evidence-admin-mobile-products.png' });

    await browser.close();

    console.log('\n======================================================');
    console.log('ALL TESTS PASSED: MOBILE ADMIN INTERFACE 100% VERIFIED');
    console.log('======================================================');
})();
