const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runE2ETest() {
    console.log('--- Starting E2E Direct Transmission & Inbox Verification ---');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    const evidenceDir = path.join(__dirname, 'evidence');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

    try {
        // STEP 1: Visit Public Platform and Submit Transmission
        console.log('[Step 1] Navigating to index.html#contact...');
        await page.goto('http://localhost:10000/index.html#contact', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Fill out direct transmission terminal form
        console.log('[Step 1] Submitting Direct Transmission Terminal...');
        await page.fill('#contact-name', 'Alexander Vance');
        await page.fill('#contact-email', 'alexander.vance@vance-aerospace.com');
        await page.selectOption('#contact-category', 'Enterprise Deployment');
        await page.fill('#contact-message', 'Requesting direct technical consultation on high-speed low-latency eBPF deployment for aerospace edge nodes.');

        await page.screenshot({ path: path.join(evidenceDir, '01-contact-form-filled.png') });

        // Submit form
        await page.click('#founder-contact-form button[type="submit"]');
        await page.waitForTimeout(2000);

        // Check if confirmation modal or status appears
        const modalVisible = await page.isVisible('#contact-status-modal');
        console.log('[Step 1] Confirmation modal visible:', modalVisible);
        await page.screenshot({ path: path.join(evidenceDir, '02-contact-submitted.png') });

        // STEP 2: Authenticate as Founder and Check Admin Enclave
        console.log('[Step 2] Setting up Founder Auth and navigating to admin.html#home...');
        await page.evaluate(() => {
            const founderUser = {
                id: 'usr-001',
                name: 'Satyam Swami',
                email: 'satys9267@gmail.com',
                role: 'founder',
                title: 'Founder & Chief Architect',
                token: 'fips_enclave_token_satyam',
                verified: true
            };
            localStorage.setItem('itrex_auth_user', JSON.stringify(founderUser));
        });

        await page.goto('http://localhost:10000/admin.html#home', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        // Assert unread count badge
        const badgeCount = await page.textContent('#badge-connections-unread');
        console.log('[Step 2] Connections Unread Badge in Sidebar:', badgeCount.trim());
        if (parseInt(badgeCount) < 1) {
            throw new Error('Expected badge-connections-unread to be >= 1, but got ' + badgeCount);
        }

        // Assert inquiry appears in home-inquiries-stream
        const streamText = await page.textContent('#home-inquiries-stream');
        console.log('[Step 2] Home inquiries stream preview:', streamText.substring(0, 120).replace(/\s+/g, ' '));
        if (!streamText.includes('Alexander Vance')) {
            throw new Error('Alexander Vance transmission not found in home-inquiries-stream');
        }

        await page.screenshot({ path: path.join(evidenceDir, '03-admin-home-verified.png') });

        // STEP 3: Navigate to Admin Connections Enclave
        console.log('[Step 3] Navigating to admin.html#connections...');
        await page.click('#nav-item-connections');
        await page.waitForTimeout(1500);

        // Assert inbox list contains the message
        const inboxListText = await page.textContent('#conn-inbox-list');
        if (!inboxListText.includes('Alexander Vance')) {
            throw new Error('Alexander Vance transmission not found in #conn-inbox-list');
        }
        console.log('[Step 3] Transmission found in #conn-inbox-list.');

        // Select the message
        const inquiryItem = page.locator('#conn-inbox-list >> text=Alexander Vance').first();
        await inquiryItem.click();
        await page.waitForTimeout(1000);

        // Assert details panel loaded
        const detailText = await page.textContent('#conn-detail-panel');
        if (!detailText.includes('Requesting direct technical consultation')) {
            throw new Error('Transmission message body not displayed in #conn-detail-panel');
        }
        console.log('[Step 3] Transmission details correctly rendered in detail panel.');
        await page.screenshot({ path: path.join(evidenceDir, '04-admin-inbox-detail.png') });

        // STEP 4: Send Reply
        console.log('[Step 4] Sending official email reply...');
        await page.fill('#conn-reply-text', 'Thank you Alexander. The I-Trex engineering team has allocated bandwidth for your deployment review.');
        await page.click('#form-conn-reply button[type="submit"]');
        await page.waitForTimeout(2000);

        const updatedDetailText = await page.textContent('#conn-detail-panel');
        if (!updatedDetailText.includes('allocated bandwidth')) {
            throw new Error('Reply not found in conversation thread');
        }
        console.log('[Step 4] Reply successfully dispatched and rendered in conversation thread.');
        await page.screenshot({ path: path.join(evidenceDir, '05-admin-reply-sent.png') });

        // STEP 5: Verify Dashboard Workspace & Notifications
        console.log('[Step 5] Navigating to dashboard.html...');
        await page.goto('http://localhost:10000/dashboard.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        // Check if Transmissions link exists in topbar
        const transmissionsLink = await page.isVisible('#btn-admin-transmissions-link');
        console.log('[Step 5] Dashboard Transmissions Link Visible:', transmissionsLink);
        if (!transmissionsLink) {
            throw new Error('#btn-admin-transmissions-link not found on dashboard.html');
        }

        // Open live notifications dropdown
        await page.click('#notif-bell-btn');
        await page.waitForTimeout(500);

        const notifDropdownText = await page.textContent('#notif-list');
        console.log('[Step 5] Notifications Dropdown text:', notifDropdownText.substring(0, 150).replace(/\s+/g, ' '));
        await page.screenshot({ path: path.join(evidenceDir, '06-dashboard-notifications.png') });

        console.log('--- ALL E2E VERIFICATION CHECKS PASSED PERFECTLY! ---');

    } catch (err) {
        console.error('TEST FAILED:', err);
        await page.screenshot({ path: path.join(evidenceDir, 'test-failure.png') });
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

runE2ETest();
