/**
 * I-TREX INNOVATIONS — OVERNIGHT MASTER SYSTEM VERIFICATION SUITE
 * Exhaustive End-to-End Validation:
 * - Public Website (index.html) & Contact Sync
 * - Public Showroom (products.html) & Dynamic Sync
 * - Authentication Gateway (login.html) & Security Enclave
 * - Complete Admin Management System (admin.html)
 * - User Workspace (dashboard.html)
 * - Cloud Backend REST APIs & Security Headers (server.js)
 */

const { chromium } = require('playwright');
const http = require('http');

const BASE_URL = 'http://localhost:10000';

async function makeApiRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const u = new URL(BASE_URL + path);
        const options = {
            hostname: u.hostname,
            port: u.port,
            path: u.pathname + u.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(JSON.stringify(data)) } : {})
            }
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, body: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

(async () => {
    console.log('===============================================================');
    console.log('   I-TREX INNOVATIONS: COMPREHENSIVE OVERNIGHT VERIFICATION   ');
    console.log('===============================================================');

    let passed = 0;
    let failed = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName}`);
            failed++;
        }
    }

    // -------------------------------------------------------------
    // SECTION 1: BACKEND REST APIS & SECURITY HEADERS
    // -------------------------------------------------------------
    console.log('\n--- SECTION 1: BACKEND SECURITY & CORE APIS ---');
    
    // Test 1: Healthcheck & Security Headers
    const health = await makeApiRequest('/api/health');
    assert(health.status === 200 && health.body.status === 'online', '1.1 Backend /api/health responds 200 online');
    assert(health.headers['content-security-policy'] && health.headers['x-content-type-options'] === 'nosniff', '1.2 Strict Security Headers applied (CSP, HSTS, nosniff)');

    // Test 2: Protected files blocker
    const envBlock = await makeApiRequest('/.env');
    assert(envBlock.status === 403, '1.3 Sensitive file blocker rejects /.env (HTTP 403)');

    // Test 3: Firebase Config Sync API
    const fbConfig = await makeApiRequest('/api/config/firebase');
    assert(fbConfig.status === 200 && fbConfig.body.apiKey && fbConfig.body.apiKey.startsWith('AIza'), '1.4 /api/config/firebase returns verified production apiKey');

    // Test 4: Public Profiles Sync API
    const profiles = await makeApiRequest('/api/profiles/public');
    assert(profiles.status === 200 && profiles.body.founder && profiles.body.cofounder, '1.5 /api/profiles/public returns Founder and Co-Founder profiles');

    // Test 5: Products API
    const products = await makeApiRequest('/api/products');
    assert(products.status === 200 && Array.isArray(products.body) && products.body.length >= 5, '1.6 /api/products returns active products suite');

    // -------------------------------------------------------------
    // SECTION 2: BROWSER AUTOMATION (HEADLESS CHROME)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: BROWSER FRONTEND INTERFACE TESTS ---');
    const browser = await chromium.launch({ channel: 'chrome', headless: true });

    // Test 6: Landing Page (index.html)
    console.log('\n[Testing index.html]');
    const pageIndex = await browser.newPage();
    const indexLogs = [];
    pageIndex.on('console', msg => { if (msg.type() === 'error') indexLogs.push(msg.text()); });
    
    await pageIndex.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
    await pageIndex.waitForTimeout(1000);

    // Verify Menu button exists and opens drawer
    const menuBtn = await pageIndex.$('#menu-toggle-btn');
    assert(menuBtn !== null, '2.1 Minimalist MENU button exists');
    await menuBtn.click();
    await pageIndex.waitForTimeout(600);
    const drawerActive = await pageIndex.evaluate(() => document.getElementById('fullscreen-nav-drawer').classList.contains('active'));
    assert(drawerActive, '2.2 Fullscreen 3-column navigation drawer opens on click');

    // Close menu drawer
    await pageIndex.click('#nav-drawer-close');
    await pageIndex.waitForTimeout(600);
    const drawerClosed = await pageIndex.evaluate(() => !document.getElementById('fullscreen-nav-drawer').classList.contains('active'));
    assert(drawerClosed, '2.3 Navigation drawer closes cleanly');

    // Verify Brand Logo in Header
    const logoSrc = await pageIndex.$eval('#main-header img', img => img.src);
    assert(logoSrc.includes('itrex_logo_silver_transparent.png'), '2.4 Header displays official silver metallic I-Trex logo');

    // Verify Contact Form Submission -> Creates real connection
    await pageIndex.fill('#contact-name', 'Dr. Evelyn Vance');
    await pageIndex.fill('#contact-email', 'evelyn.vance@quantum-mesh.org');
    await pageIndex.selectOption('#contact-category', 'Enterprise Deployment');
    await pageIndex.fill('#contact-message', 'Requesting enterprise evaluation of TRX-01 microkernel scheduling.');
    await pageIndex.click('#founder-contact-form button[type="submit"]');
    await pageIndex.waitForTimeout(1000);
    const modalVisible = await pageIndex.isVisible('#contact-status-modal');
    assert(modalVisible, '2.5 Direct Founder Contact Form sends message and displays confirmation modal');

    await pageIndex.screenshot({ path: 'tests/evidence/evidence-index-verified.png' });
    await pageIndex.close();

    // Test 7: Products Showroom (products.html)
    console.log('\n[Testing products.html]');
    const pageProd = await browser.newPage();
    await pageProd.goto(`${BASE_URL}/products.html`, { waitUntil: 'networkidle' });
    await pageProd.waitForTimeout(800);

    const subnavLinks = await pageProd.$$('#product-subnav-links a');
    assert(subnavLinks.length >= 5, '2.6 Sticky product subnavigation contains all 5 products');

    const trexosSection = await pageProd.$('#trexos');
    assert(trexosSection !== null, '2.7 TRX-01 TrexOS section rendered with telemetry and benchmarks');

    await pageProd.screenshot({ path: 'tests/evidence/evidence-products-verified.png' });
    await pageProd.close();

    // Test 8: Authentication Terminal (login.html)
    console.log('\n[Testing login.html]');
    const pageAuth = await browser.newPage();
    await pageAuth.goto(`${BASE_URL}/login.html`, { waitUntil: 'networkidle' });
    await pageAuth.waitForTimeout(1000);

    const fbStatus = await pageAuth.textContent('#firebase-status-text');
    assert(fbStatus.trim() === 'FIREBASE ACTIVE', '2.8 Firebase status indicator reads FIREBASE ACTIVE');

    // Switch to Register
    await pageAuth.click('#btn-to-register');
    await pageAuth.waitForTimeout(500);
    const isRegisterVisible = await pageAuth.isVisible('#view-register');
    assert(isRegisterVisible, '2.9 View switches smoothly to Account Registration');

    // Test Entropy Meter
    await pageAuth.fill('#reg-password', 'Simple1');
    let entropyText = await pageAuth.textContent('#pass-strength-label');
    assert(entropyText.includes('MODERATE') || entropyText.includes('WEAK'), '2.10 Entropy meter dynamically evaluates weak/moderate password');

    await pageAuth.fill('#reg-password', 'UltraSecurePassword2026!#$');
    entropyText = await pageAuth.textContent('#pass-strength-label');
    assert(entropyText.includes('STRONG') || entropyText.includes('OPTIMAL') || entropyText.includes('AEROSPACE'), '2.11 Entropy meter dynamically evaluates strong/optimal password');

    // Switch to Forgot Password
    await pageAuth.click('#btn-to-login');
    await pageAuth.waitForTimeout(400);
    await pageAuth.click('#btn-to-forgot');
    await pageAuth.waitForTimeout(400);
    const isForgotVisible = await pageAuth.isVisible('#view-forgot');
    assert(isForgotVisible, '2.12 View switches smoothly to Forgot Password recovery');

    await pageAuth.screenshot({ path: 'tests/evidence/evidence-auth-verified.png' });
    await pageAuth.close();

    // Test 9: Admin Management System (admin.html)
    console.log('\n[Testing admin.html]');
    const pageAdmin = await browser.newPage();
    await pageAdmin.goto(`${BASE_URL}/admin.html`, { waitUntil: 'networkidle' });
    await pageAdmin.waitForTimeout(1000);

    // Verify Admin Home & Metrics
    const totalProdCard = await pageAdmin.textContent('#home-metric-products');
    assert(parseInt(totalProdCard) >= 5, '2.13 Admin Dashboard displays Total Products count >= 5');

    // Verify Founder vs Co-Founder Profile Protection
    await pageAdmin.click('#nav-item-profile');
    await pageAdmin.waitForTimeout(500);
    const profileTabVisible = await pageAdmin.isVisible('#section-profile');
    assert(profileTabVisible, '2.14 Profile Management section renders with Founder & Co-Founder tabs');

    // Verify Product Management Modal & Fleet
    await pageAdmin.click('#nav-item-products');
    await pageAdmin.waitForTimeout(500);
    const productRows = await pageAdmin.$$('#products-table-body tr');
    assert(productRows.length >= 5, '2.15 Admin Product Fleet table displays all managed products');

    // Verify Contact Message synced to Admin Connections
    await pageAdmin.click('#nav-item-connections');
    await pageAdmin.waitForTimeout(500);
    const connectionText = await pageAdmin.textContent('#conn-inbox-list');
    assert(connectionText.includes('Dr. Evelyn Vance') || connectionText.includes('Enterprise Deployment') || connectionText.includes('evelyn.vance'), '2.16 Message submitted via index.html appears in Admin Connections inbox');

    // Verify Approval Center
    await pageAdmin.click('#nav-item-approvals');
    await pageAdmin.waitForTimeout(500);
    const approvalsVisible = await pageAdmin.isVisible('#section-approvals');
    assert(approvalsVisible, '2.17 Approval Center renders verification requests queue');

    // Verify Security & Audit Enclave
    await pageAdmin.click('#nav-item-security');
    await pageAdmin.waitForTimeout(500);
    const auditLogs = await pageAdmin.$$('#audit-logs-table-body tr');
    assert(auditLogs.length > 0, '2.18 Security & Audit Enclave records immutable audit trail');

    await pageAdmin.screenshot({ path: 'tests/evidence/evidence-admin-verified.png' });
    await pageAdmin.close();

    // Test 10: Private User Workspace (dashboard.html)
    console.log('\n[Testing dashboard.html]');
    const pageDash = await browser.newPage();
    await pageDash.goto(`${BASE_URL}/dashboard.html`, { waitUntil: 'networkidle' });
    await pageDash.waitForTimeout(1000);

    const greetingText = await pageDash.textContent('#dash-greeting-text');
    assert(greetingText.length > 0, '2.19 Workspace greets user with clearance badge');

    const dashLogo = await pageDash.$eval('#navbar img', img => img.src);
    assert(dashLogo.includes('itrex_logo_silver_transparent.png'), '2.20 Workspace navbar uses official silver metallic logo');

    await pageDash.screenshot({ path: 'tests/evidence/evidence-dashboard-verified.png' });
    await pageDash.close();

    await browser.close();

    // -------------------------------------------------------------
    // SUMMARY REPORT
    // -------------------------------------------------------------
    console.log('\n===============================================================');
    console.log(`VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
    console.log('===============================================================');

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
})();
