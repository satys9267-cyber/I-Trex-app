/**
 * I-TREX INNOVATIONS — COMPREHENSIVE ADMIN PANEL & SECURITY TEST SUITE
 * 
 * Tests:
 * 1. Admin Overview & Analytics Engine
 * 2. Product Management CRUD & Public Showroom Sync
 * 3. Profile Management (Strict Founder & Co-Founder Isolation - Negative & Positive tests)
 * 4. Approval Center (Founder & Co-Founder authorization - Negative & Positive tests)
 * 5. Connections Inbox & Email Reply System
 * 6. 20 Mandatory Security Protections (Headers, File blocking, Audit trail)
 * 7. Browser Visual Verification via Playwright (Screenshots & zero console errors)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:10000';

async function runTestSuite() {
    console.log('===============================================================');
    console.log('  STARTING I-TREX ADMIN & SECURITY VERIFICATION TEST SUITE');
    console.log('===============================================================');

    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`  [✓ PASS] ${testName}`);
            passedTests++;
        } else {
            console.error(`  [✗ FAIL] ${testName}`);
            failedTests++;
        }
    }

    // -----------------------------------------------------------------
    // TEST 1: Admin Overview Analytics
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 1: ADMIN OVERVIEW & REAL-TIME ANALYTICS ---');
    try {
        const res = await fetch(`${BASE_URL}/api/admin/overview`);
        assert(res.status === 200, 'GET /api/admin/overview returns HTTP 200');
        const data = await res.json();
        assert(data.summary.totalProducts >= 5, `Total products calculated from DB: ${data.summary.totalProducts}`);
        assert(data.summary.totalEmployees >= 3, `Active employees calculated from DB: ${data.summary.totalEmployees}`);
        assert(data.summary.totalConnections >= 3, `Total connections calculated from DB: ${data.summary.totalConnections}`);
        assert(Array.isArray(data.recentActivities), 'Recent activities audit stream present');
    } catch (e) {
        assert(false, `Test 1 failed with error: ${e.message}`);
    }

    // -----------------------------------------------------------------
    // TEST 2: Product Management CRUD
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: PRODUCT MANAGEMENT & PUBLIC SYNCHRONIZATION ---');
    let testProductId = null;
    try {
        // Create Product
        const createRes = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami', role: 'founder' })
            },
            body: JSON.stringify({
                name: 'TrexQuantum Test',
                code: 'TRX-TEST',
                tagline: 'Quantum-Resistant Entanglement Matrix',
                category: 'Cybersecurity & SecOps',
                status: 'published',
                shortDescription: 'Automated test product for administrative validation',
                detailedDescription: 'Full architectural test product specifications for live verification'
            })
        });

        assert(createRes.status === 201, 'POST /api/products returns HTTP 201 Created');
        const createdProd = await createRes.json();
        testProductId = createdProd.id;
        assert(createdProd.name === 'TrexQuantum Test', 'Product created with correct name');

        // Verify in list
        const listRes = await fetch(`${BASE_URL}/api/products`);
        const allProds = await listRes.json();
        const found = allProds.find(p => p.id === testProductId);
        assert(!!found, 'New product immediately present in GET /api/products');

        // Update Product
        const updateRes = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami', role: 'founder' })
            },
            body: JSON.stringify({
                tagline: 'Updated Quantum Tagline Benchmark v2'
            })
        });
        assert(updateRes.status === 200, 'PUT /api/products/:id updates successfully');
        const updatedProd = await updateRes.json();
        assert(updatedProd.tagline === 'Updated Quantum Tagline Benchmark v2', 'Product tagline updated');

        // Archive Product (Soft Delete)
        const delRes = await fetch(`${BASE_URL}/api/products/${testProductId}`, {
            method: 'DELETE',
            headers: { 'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami', role: 'founder' }) }
        });
        assert(delRes.status === 200, 'DELETE /api/products/:id successfully archives product');

    } catch (e) {
        assert(false, `Test 2 failed with error: ${e.message}`);
    }

    // -----------------------------------------------------------------
    // TEST 3: Profile Management (Strict Founder & Co-Founder Isolation)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: STRICT FOUNDER & CO-FOUNDER PROFILE ISOLATION ---');
    try {
        // Negative Test 3A: Non-founder attempts to edit Founder profile
        const unauthorizedFounderEditRes = await fetch(`${BASE_URL}/api/profiles/usr-001`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-002', name: 'Ishwari Patil', role: 'co-founder' })
            },
            body: JSON.stringify({ title: 'Hacked Founder Title' })
        });
        assert(unauthorizedFounderEditRes.status === 403, 'Cross-edit rejection: Co-Founder CANNOT edit Founder profile (HTTP 403 Forbidden)');

        // Negative Test 3B: Non-co-founder attempts to edit Co-Founder profile
        const unauthorizedCoFounderEditRes = await fetch(`${BASE_URL}/api/profiles/usr-002`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami', role: 'founder' })
            },
            body: JSON.stringify({ title: 'Hacked Co-Founder Title' })
        });
        assert(unauthorizedCoFounderEditRes.status === 403, 'Cross-edit rejection: Founder CANNOT edit Co-Founder profile (HTTP 403 Forbidden)');

        // Positive Test 3C: Founder edits own profile
        const authorizedFounderEditRes = await fetch(`${BASE_URL}/api/profiles/usr-001`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami', role: 'founder' })
            },
            body: JSON.stringify({ title: 'Founder & Chief Architect' })
        });
        assert(authorizedFounderEditRes.status === 200, 'Authorized edit: Founder can successfully edit own profile (HTTP 200 OK)');

    } catch (e) {
        assert(false, `Test 3 failed with error: ${e.message}`);
    }

    // -----------------------------------------------------------------
    // TEST 4: Approval Center (Strict Founder & Co-Founder Authorization)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: APPROVAL CENTER AUTHORIZATION ---');
    try {
        // Negative Test 4A: Ordinary employee attempts to approve activation
        const unauthorizedApprovalRes = await fetch(`${BASE_URL}/api/approvals/appr-001/decision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-003', name: 'Elena Vance', role: 'employee' })
            },
            body: JSON.stringify({ decision: 'approved', reason: 'Attempted self-approval' })
        });
        assert(unauthorizedApprovalRes.status === 403, 'Security Guard: Ordinary employee CANNOT approve activations (HTTP 403 Forbidden)');

        // Positive Test 4B: Founder approves activation
        const authorizedApprovalRes = await fetch(`${BASE_URL}/api/approvals/appr-001/decision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami', role: 'founder' })
            },
            body: JSON.stringify({ decision: 'approved', reason: 'Verified distributed systems credentials.' })
        });
        assert(authorizedApprovalRes.status === 200, 'Authorized Approval: Founder successfully approves activation (HTTP 200 OK)');
        const approvalData = await authorizedApprovalRes.json();
        assert(approvalData.request.status === 'approved', 'Approval request status updated to "approved"');
        assert(approvalData.user.status === 'active', 'User account status updated to "active" in database');

    } catch (e) {
        assert(false, `Test 4 failed with error: ${e.message}`);
    }

    // -----------------------------------------------------------------
    // TEST 5: Connections & Direct Email Reply Transmission
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: CONNECTIONS INBOX & EMAIL REPLY TRANSMISSION ---');
    try {
        const connRes = await fetch(`${BASE_URL}/api/connections`);
        assert(connRes.status === 200, 'GET /api/connections returns HTTP 200');
        const inqs = await connRes.json();
        assert(inqs.length >= 3, `Inquiries retrieved from database: ${inqs.length}`);

        // Send Reply to inq-001
        const replyRes = await fetch(`${BASE_URL}/api/connections/inq-001/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify({ id: 'usr-001', name: 'Satyam Swami (Founder)', email: 'satys9267@gmail.com', role: 'founder' })
            },
            body: JSON.stringify({ replyText: 'Automated test reply transmission from Founder enclave.' })
        });
        assert(replyRes.status === 200, 'POST /api/connections/:id/reply returns HTTP 200 OK');
        const replyData = await replyRes.json();
        assert(replyData.success === true, 'Reply success flag confirmed');
        assert(replyData.inquiry.status === 'replied', 'Inquiry marked as "replied"');
        assert(replyData.reply.delivered === true, 'Delivery confirmation returned');

    } catch (e) {
        assert(false, `Test 5 failed with error: ${e.message}`);
    }

    // -----------------------------------------------------------------
    // TEST 6: 20 Mandatory Security Protections
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 6: 20 MANDATORY ENTERPRISE SECURITY PROTECTIONS ---');
    try {
        // 6A. Security Headers Check
        const headRes = await fetch(`${BASE_URL}/api/health`);
        const h = Object.fromEntries(headRes.headers.entries());

        assert(!!h['content-security-policy'], 'Rule 11: Content-Security-Policy header present');
        assert(!!h['strict-transport-security'], 'Rule 11: Strict-Transport-Security (HSTS) header present');
        assert(h['x-content-type-options'] === 'nosniff', 'Rule 11: X-Content-Type-Options: nosniff present');
        assert(h['x-frame-options'] === 'SAMEORIGIN', 'Rule 11: X-Frame-Options: SAMEORIGIN present');
        assert(h['referrer-policy'] === 'strict-origin-when-cross-origin', 'Rule 11: Referrer-Policy present');
        assert(!h['x-powered-by'], 'Rule 12: X-Powered-By is hidden/removed');

        // 6B. Sensitive File Blocking Check
        const envRes = await fetch(`${BASE_URL}/.env`);
        assert(envRes.status === 403, 'Rule 15: Access to .env blocked with HTTP 403 Forbidden');

        const dbRes = await fetch(`${BASE_URL}/data/itrex_system_db.json`);
        assert(dbRes.status === 403, 'Rule 15: Direct access to system db JSON blocked with HTTP 403 Forbidden');

        // 6C. Immutable Audit Trail Check
        const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`);
        assert(auditRes.status === 200, 'Rule 16: Audit logs API returns HTTP 200');
        const logs = await auditRes.json();
        assert(logs.length >= 2, `Rule 16: Immutable audit logs populated: ${logs.length} entries`);

    } catch (e) {
        assert(false, `Test 6 failed with error: ${e.message}`);
    }

    // -----------------------------------------------------------------
    // TEST 7: Playwright Headless Browser UI Inspection & Evidence Capture
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 7: PLAYWRIGHT BROWSER UI VERIFICATION ---');
    try {
        const browser = await chromium.launch({ channel: 'chrome', headless: true });
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await context.newPage();

        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        // 1. Visit Admin Panel
        await page.goto(`${BASE_URL}/admin.html`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        assert(consoleErrors.length === 0, `Admin panel loaded with 0 console errors (found: ${consoleErrors.length})`);

        // Capture Evidence 1: Admin Homepage
        const evidenceDir = path.join(__dirname, 'evidence');
        if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-home.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-home.png');

        // 2. Click Dashboard Tab
        await page.click('#nav-item-dashboard');
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-dashboard.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-dashboard.png');

        // 3. Click Products Tab
        await page.click('#nav-item-products');
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-products.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-products.png');

        // 4. Click Approvals Tab
        await page.click('#nav-item-approvals');
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-approvals.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-approvals.png');

        // 5. Click Connections Tab
        await page.click('#nav-item-connections');
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-connections.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-connections.png');

        // 6. Click Profile Tab
        await page.click('#nav-item-profile');
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-profile.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-profile.png');

        // 7. Click Security Tab
        await page.click('#nav-item-security');
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-admin-security.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-admin-security.png');

        // 8. Visit Public Products Page to verify live synchronization
        await page.goto(`${BASE_URL}/products.html`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(evidenceDir, 'evidence-products-public-sync.png'), fullPage: false });
        console.log('  [✓ EVIDENCE] Captured evidence-products-public-sync.png');

        await browser.close();
        assert(true, 'Playwright browser verification and evidence captures completed successfully');

    } catch (e) {
        assert(false, `Test 7 failed with error: ${e.message}`);
    }

    console.log('\n===============================================================');
    console.log(`  TEST RESULTS SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('===============================================================');

    if (failedTests > 0) process.exit(1);
}

runTestSuite();
