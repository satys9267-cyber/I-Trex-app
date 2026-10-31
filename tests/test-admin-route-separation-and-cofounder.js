/**
 * Test Co-Founder Login, Admin Route Isolation, and Redirection
 */

const { chromium } = require('playwright');

(async () => {
    console.log('Testing Admin Route Isolation & Co-Founder Credentials...');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    
    // -----------------------------------------------------------------
    // TEST 1: Unauthenticated User visiting admin.html -> Bounced to Login
    // -----------------------------------------------------------------
    console.log('\n[Test 1] Direct access to admin.html without session...');
    const page1 = await browser.newPage();
    try {
        await page1.goto('http://localhost:10000/admin.html', { waitUntil: 'commit', timeout: 8000 });
    } catch (e) {
        // Redirection might occur during navigation
    }
    await page1.waitForURL(/login\.html/, { timeout: 8000 }).catch(() => {});
    await page1.waitForLoadState('domcontentloaded').catch(() => {});
    await page1.waitForTimeout(1000);

    const url1 = page1.url();
    console.log('Page redirected to:', url1);
    if (!url1.includes('login.html?denied=admin_enclave_restricted')) {
        console.error('FAIL: Unauthenticated visitor was NOT bounced to login!');
        process.exit(1);
    }
    const bannerText = await page1.textContent('#auth-feedback-text');
    console.log('Banner on login screen:', bannerText.replace(/\s+/g, ' ').trim());
    await page1.screenshot({ path: 'tests/evidence/evidence-admin-bounced-verified.png' });
    await page1.close();

    // -----------------------------------------------------------------
    // TEST 2: Co-Founder Login with Fixed Credentials (ishwarip267@gmail.com / Ishwari@27)
    // -----------------------------------------------------------------
    console.log('\n[Test 2] Co-Founder logging in on login.html...');
    const page2 = await browser.newPage();
    await page2.goto('http://localhost:10000/login.html', { waitUntil: 'domcontentloaded' });
    await page2.waitForTimeout(1000);

    await page2.fill('#login-identifier', 'ishwarip267@gmail.com');
    await page2.fill('#login-password', 'Ishwari@27');
    await page2.click('#btn-submit-login');
    
    // Wait for authentication and redirect
    await page2.waitForTimeout(3000);

    const url2 = page2.url();
    console.log('Co-Founder routed to:', url2);
    if (!url2.includes('admin.html')) {
        console.error('FAIL: Co-Founder was not routed to admin.html! Landed on:', url2);
        process.exit(1);
    }

    // Verify Co-Founder details inside admin enclave
    const roleText = await page2.textContent('#sidebar-user-role');
    const nameText = await page2.textContent('#sidebar-user-name');
    console.log('Admin Enclave Identity:', { nameText, roleText });

    if (!roleText.includes('CO-FOUNDER') && !roleText.includes('ADMIN')) {
        console.error('FAIL: Role does not indicate Co-Founder/Admin!');
        process.exit(1);
    }

    await page2.screenshot({ path: 'tests/evidence/evidence-cofounder-admin-verified.png' });
    await page2.close();

    // -----------------------------------------------------------------
    // TEST 3: Standard User Login -> Routed to dashboard.html (NOT admin.html)
    // -----------------------------------------------------------------
    console.log('\n[Test 3] Standard User logging in...');
    const page3 = await browser.newPage();
    await page3.goto('http://localhost:10000/login.html', { waitUntil: 'domcontentloaded' });
    await page3.waitForTimeout(800);

    // Register a standard user
    await page3.click('#btn-to-register');
    await page3.waitForTimeout(500);
    const uniqueUser = 'agent_' + Date.now().toString(36);
    const uniqueEmail = `agent_${Date.now()}@mesh-network.io`;
    await page3.fill('#reg-name', 'Standard Agent');
    await page3.fill('#reg-username', uniqueUser);
    await page3.fill('#reg-email', uniqueEmail);
    await page3.fill('#reg-password', 'StandardUserPass2026!#');
    await page3.fill('#reg-confirm', 'StandardUserPass2026!#');
    await page3.check('#reg-terms');
    await page3.click('#btn-submit-register');
    await page3.waitForTimeout(2000);

    // Now log in as that standard user via local backend
    await page3.click('#btn-to-login');
    await page3.waitForTimeout(400);
    await page3.fill('#login-identifier', uniqueEmail);
    await page3.fill('#login-password', 'StandardUserPass2026!#');
    await page3.click('#btn-submit-login');
    await page3.waitForTimeout(2500);

    const url3 = page3.url();
    console.log('Standard user routed to:', url3);
    if (url3.includes('admin.html')) {
        console.error('FAIL: Standard user was routed to admin.html! Security breach!');
        process.exit(1);
    }
    console.log('SUCCESS: Standard user cleanly routed away from admin enclave!');

    await browser.close();

    console.log('\n===============================================================');
    console.log('ALL TESTS PASSED: CO-FOUNDER & ADMIN ROUTE ISOLATION VERIFIED!');
    console.log('===============================================================');
})();
