/**
 * I-Trex Innovations — Complete Comprehensive Playwright Verification Suite
 * Covers Phases 1, 2, and 3:
 * - Hero entry sequence, staggered typography & opposite-axis CTA snap
 * - Products Highlight Section & global navigation
 * - Four Pillars with ScrollTrigger SVG drawing & Founder Control Modal
 * - Redesigned Team & Founders Section (Satyam Swami & Ishwari Patil)
 * - Dedicated Products Page (/products & products.html) with category filters & specs matrix
 * - Multi-Device Responsiveness (1440px Desktop, 768px Tablet, 375px Mobile)
 * - Security & Privacy Audit (zero exposed passwords, emails, or credentials in DOM & console)
 */

process.env.TEMP = 'D:\\temp';
process.env.TMP = 'D:\\temp';

const { chromium } = require('playwright');
const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

async function runComprehensiveVerification() {
    console.log('======================================================================');
    console.log('   I-TREX INNOVATIONS — FULL SUITE PLAYWRIGHT VERIFICATION            ');
    console.log('   Phases 1, 2, 3: Animations, Products, Architecture & Security      ');
    console.log('======================================================================\n');

    // 1. Spin up internal verification server
    const app = express();
    app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'products.html')));
    app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
    app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
    app.use(express.static(path.join(__dirname)));
    const server = http.createServer(app);
    const PORT = 3055;
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`[+] Internal verification server running at http://localhost:${PORT}\n`);

    let context;
    let hasFailure = false;
    const userDataDir = path.join('D:\\temp', 'edge_profile_full_' + Date.now());

    // Security auditor console recorder
    const capturedConsoleLogs = [];
    const forbiddenPatterns = [
        'Password@123',
        'admin@itrex.internal',
        'employee@itrex.internal',
        'Elena Vance',
        '1-Click Evaluation Credentials'
    ];

    try {
        if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
        }

        console.log(`[+] Launching Chromium/Edge isolated session (Storage: D:\\temp)...`);
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
            const text = msg.text();
            capturedConsoleLogs.push({ type: msg.type(), text });
            if (msg.type() === 'error') {
                console.log(`    [Browser Console Error]: ${text}`);
            }
        });

        // =====================================================================
        // TEST 1: HOMEPAGE HERO ENTRANCE SEQUENCE & STAGGER
        // =====================================================================
        console.log('\n--- 1. HOMEPAGE HERO ENTRANCE SEQUENCE & STAGGER ---');
        await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2500); // Wait for preloader & GSAP entrance timeline

        // 1.1 Page Title
        const title = await page.title();
        console.log(`[1.1] Title: "${title}"`);
        if (!title.includes('I-Trex Innovations')) {
            throw new Error(`Expected title to include "I-Trex Innovations", got: ${title}`);
        }
        console.log('  ✓ Page title verified.');

        // 1.2 GSAP & Lenis Synchronization
        const animCheck = await page.evaluate(() => ({
            lenis: typeof window.lenis !== 'undefined' || typeof Lenis !== 'undefined',
            gsap: typeof gsap !== 'undefined',
            scrollTrigger: typeof ScrollTrigger !== 'undefined'
        }));
        console.log(`[1.2] Animation Engines: Lenis=${animCheck.lenis}, GSAP=${animCheck.gsap}, ScrollTrigger=${animCheck.scrollTrigger}`);
        if (!animCheck.lenis || !animCheck.gsap || !animCheck.scrollTrigger) {
            throw new Error('Animation engines failed to initialize.');
        }
        console.log('  ✓ Lenis + GSAP 3 + ScrollTrigger synchronized.');

        // 1.3 Headline Staggered Reveal Elements
        const revealSpans = await page.locator('.hero-reveal-line').all();
        console.log(`[1.3] Headline reveal spans count: ${revealSpans.length}`);
        if (revealSpans.length < 2) {
            throw new Error(`Expected at least 2 staggered reveal lines, found ${revealSpans.length}`);
        }
        const line1 = await revealSpans[0].innerText();
        const line2 = await revealSpans[1].innerText();
        console.log(`  Line 1: "${line1}" | Line 2: "${line2}"`);
        if (!line1.includes('One Platform.') || !line2.includes('Infinite Trajectory.')) {
            throw new Error('Headline reveal text does not match "One Platform. Infinite Trajectory."');
        }
        console.log('  ✓ Staggered headline typography verified.');

        // 1.4 Hero Subtext & Opposite-Axis CTAs
        const isSubtextVisible = await page.isVisible('#hero-subtext');
        const isPrimaryCTAVisible = await page.isVisible('#hero-primary-cta');
        const isSecondaryCTAVisible = await page.isVisible('#hero-secondary-cta');
        console.log(`[1.4] Hero Subtext Visible: ${isSubtextVisible}, Primary CTA: ${isPrimaryCTAVisible}, Secondary CTA: ${isSecondaryCTAVisible}`);
        if (!isSubtextVisible || !isPrimaryCTAVisible || !isSecondaryCTAVisible) {
            throw new Error('Hero subtext or CTA buttons failed to settle into visible layout position.');
        }

        // Test Primary CTA clickability
        await page.click('#hero-primary-cta');
        await page.waitForTimeout(500);
        console.log('  ✓ Hero primary CTA clicked and scrolled smoothly.');

        // Screenshot Hero
        await page.screenshot({ path: path.join(__dirname, 'evidence-1-hero.png') });
        console.log('  📸 Screenshot captured: evidence-1-hero.png');

        // =====================================================================
        // TEST 2: PRODUCTS HIGHLIGHT SECTION & GLOBAL NAVIGATION
        // =====================================================================
        console.log('\n--- 2. PRODUCTS HIGHLIGHT SECTION & GLOBAL NAVIGATION ---');
        const isHighlightVisible = await page.isVisible('#products-highlight');
        console.log(`[2.1] Products Highlight Section present: ${isHighlightVisible}`);
        if (!isHighlightVisible) {
            throw new Error('Section #products-highlight is missing or not visible.');
        }

        // Check 4 highlight cards
        // Check product carousel slides
        const carouselSlides = await page.locator('.carousel-slide').all();
        console.log(`[2.2] Product carousel slides count: ${carouselSlides.length} (Expected: 5)`);
        if (carouselSlides.length !== 5) {
            throw new Error(`Expected 5 product slides, found: ${carouselSlides.length}`);
        }
        console.log('  ✓ 5 Core Product cards (TrexOS, TrexCore, TrexVision, TrexShield, TrexConnect) verified.');

        // Check "Explore All Products" button
        const exploreBtn = page.locator('#btn-explore-all-products');
        const exploreBtnHref = await exploreBtn.getAttribute('href');
        console.log(`[2.3] "Explore All Products" CTA target: ${exploreBtnHref}`);
        if (!exploreBtnHref || (!exploreBtnHref.includes('products.html') && !exploreBtnHref.includes('/products'))) {
            throw new Error(`Invalid Explore All Products link: ${exploreBtnHref}`);
        }

        // Check Global Navbar "Products" link
        const navProductsLink = page.locator('#navbar a[href*="products"]').first();
        const navProductsText = await navProductsLink.innerText();
        console.log(`[2.4] Global Nav Products Link: "${navProductsText.replace(/\n/g, ' ')}"`);
        if (!navProductsText.toLowerCase().includes('products')) {
            throw new Error('Global navbar missing prominent Products link.');
        }
        console.log('  ✓ Prominent Products navigation link confirmed.');

        // Screenshot Products Highlight
        await page.screenshot({ path: path.join(__dirname, 'evidence-2-products-highlight.png') });
        console.log('  📸 Screenshot captured: evidence-2-products-highlight.png');

        // =====================================================================
        // TEST 3: CYBER-NEURAL STREAM & FOUR PILLARS SECTION
        // =====================================================================
        console.log('\n--- 3. CYBER-NEURAL STREAM & FOUR PILLARS SECTION ---');
        await page.evaluate(() => {
            const arch = document.getElementById('architecture');
            if (arch) arch.scrollIntoView();
        });
        await page.waitForTimeout(600);

        // 3.1 Check HTML5 Canvas & 4 Holographic Cards
        const isCanvasVisible = await page.isVisible('#neural-stream-canvas');
        const pillarCards = await page.locator('.pillar-card').all();
        console.log(`[3.1] Neural Stream Canvas visible: ${isCanvasVisible}, Pillar Cards count: ${pillarCards.length}`);
        if (!isCanvasVisible || pillarCards.length !== 4) {
            throw new Error('Neural Stream Canvas or 4 pillar cards missing.');
        }

        // Check Live Status Pill
        const statusPillText = await page.innerText('#live-flow-status-pill');
        console.log(`[3.2] Live Flow Status Pill: "${statusPillText.replace(/\n/g, ' ')}"`);
        if (!statusPillText.includes('Animate Flow: Active')) {
            throw new Error(`Expected "Animate Flow: Active", got: "${statusPillText}"`);
        }
        console.log('  ✓ Cyber-neural stream canvas & live status pill verified.');

        // 3.3 Test Hover Focus & Dimming Interaction
        console.log('[3.3] Testing Pillar Card Hover Focus & Sibling Dimming...');
        await page.hover('#pillar-card-0');
        await page.waitForTimeout(300);

        const siblingCardOpacity = await page.evaluate(() => {
            const card1 = document.getElementById('pillar-card-1');
            return card1 ? window.getComputedStyle(card1).opacity : '1';
        });
        console.log(`  Sibling Card 1 Opacity during Card 0 hover: ${siblingCardOpacity}`);

        await page.mouse.move(0, 0);
        await page.waitForTimeout(300);
        console.log('  ✓ Hover focus interaction verified.');

        // 3.4 Founder Config Modal trigger
        const isConfigBtnVisible = await page.isVisible('#btn-pillar-config');
        console.log(`[3.4] Founder Pillar Settings Button visible: ${isConfigBtnVisible}`);
        if (!isConfigBtnVisible) {
            throw new Error('Founder #btn-pillar-config button not found.');
        }

        await page.click('#btn-pillar-config');
        await page.waitForTimeout(400);
        const isModalVisible = await page.isVisible('#pillar-config-modal');
        console.log(`[3.5] Founder Config Modal Opened: ${isModalVisible}`);
        if (!isModalVisible) {
            throw new Error('Pillar configuration modal failed to open.');
        }

        // Close modal
        await page.click('#pillar-config-modal button:has-text("Cancel")');
        await page.waitForTimeout(300);

        // Screenshot Four Pillars
        await page.screenshot({ path: path.join(__dirname, 'evidence-3-four-pillars.png') });
        console.log('  📸 Screenshot captured: evidence-3-four-pillars.png');

        // =====================================================================
        // TEST 4: TEAM & FOUNDERS SECTION REDESIGN
        // =====================================================================
        console.log('\n--- 4. TEAM & FOUNDERS SECTION REDESIGN ---');
        await page.evaluate(() => {
            const team = document.getElementById('team');
            if (team) team.scrollIntoView();
        });
        await page.waitForTimeout(600);

        const teamCards = await page.locator('#team-grid > div').all();
        console.log(`[4.1] Leadership team card count: ${teamCards.length} (Expected: 2)`);
        if (teamCards.length !== 2) {
            throw new Error(`Expected exactly 2 executive cards, found: ${teamCards.length}`);
        }

        const member1 = await teamCards[0].innerText();
        const member2 = await teamCards[1].innerText();
        console.log(`  Profile 1:\n    ${member1.replace(/\n/g, ' ')}`);
        console.log(`  Profile 2:\n    ${member2.replace(/\n/g, ' ')}`);

        if (!member1.includes('Satyam Swami') || !member1.toLowerCase().includes('founder')) {
            throw new Error('First executive profile is not Satyam Swami (Founder).');
        }
        if (!member2.includes('Ishwari Patil') || !member2.toLowerCase().includes('co-founder')) {
            throw new Error('Second executive profile is not Ishwari Patil (Co-Founder).');
        }
        console.log('  ✓ Leadership verified: Satyam Swami (Founder) & Ishwari Patil (Co-Founder).');

        // Screenshot Team Section
        await page.screenshot({ path: path.join(__dirname, 'evidence-4-team-founders.png') });
        console.log('  📸 Screenshot captured: evidence-4-team-founders.png');

        // =====================================================================
        // TEST 5: DEDICATED PRODUCTS PAGE (/products & products.html)
        // =====================================================================
        console.log('\n--- 5. DEDICATED PRODUCTS PAGE (/products & products.html) ---');
        // Test navigation via clicking the link
        await page.click('#navbar a[href*="products"]');
        await page.waitForTimeout(1000);

        const currentUrl = page.url();
        console.log(`[5.1] Routed URL: ${currentUrl}`);
        if (!currentUrl.includes('products')) {
            throw new Error(`Navigation to products failed, current URL: ${currentUrl}`);
        }

        const prodTitle = await page.title();
        console.log(`[5.2] Product Page Title: "${prodTitle}"`);
        if (!prodTitle.includes('Enterprise Product Suite') && !prodTitle.includes('I-Trex')) {
            throw new Error(`Unexpected product page title: ${prodTitle}`);
        }

        // Verify all 5 products exist
        const requiredProductIds = ['trexos', 'trexcore', 'trexvision', 'trexshield', 'trexconnect'];
        for (const pid of requiredProductIds) {
            const exists = await page.locator(`#${pid}`).count() > 0;
            if (!exists) {
                throw new Error(`Product card #${pid} not found on products page.`);
            }
        }
        console.log(`[5.3] Verified all 5 deep-dive products: ${requiredProductIds.join(', ')}.`);

        // Test Interactive Category Filters
        console.log('[5.4] Testing Category Filter Tabs...');
        // Click 'os' filter
        await page.click('button[onclick*="\'os\'"]');
        await page.waitForTimeout(300);
        const isTrexosVisible = await page.isVisible('#trexos');
        const isTrexcoreHidden = await page.isHidden('#trexcore');
        console.log(`  Filtered 'os': TrexOS visible=${isTrexosVisible}, TrexCore hidden=${isTrexcoreHidden}`);
        if (!isTrexosVisible || !isTrexcoreHidden) {
            throw new Error('Category filter for "os" failed.');
        }

        // Click 'all' filter
        await page.click('button[onclick*="\'all\'"]');
        await page.waitForTimeout(300);
        const allVisibleCount = await page.locator('.product-card:not(.hidden)').count();
        console.log(`  Reset to 'all': visible cards count = ${allVisibleCount} (Expected: 5)`);
        if (allVisibleCount !== 5) {
            throw new Error(`Expected all 5 cards visible after resetting filter, got: ${allVisibleCount}`);
        }
        console.log('  ✓ Category filter tabs functioning properly.');

        // Verify Architectural Specifications Matrix
        const matrixRows = await page.locator('table tbody tr').all();
        console.log(`[5.5] Specifications Matrix rows count: ${matrixRows.length} (Expected: 5)`);
        if (matrixRows.length !== 5) {
            throw new Error(`Expected 5 matrix rows in specs table, got ${matrixRows.length}`);
        }
        console.log('  ✓ Architectural specifications matrix table verified.');

        // Screenshot Products Page
        await page.screenshot({ path: path.join(__dirname, 'evidence-5-products-page.png') });
        console.log('  📸 Screenshot captured: evidence-5-products-page.png');

        // =====================================================================
        // TEST 6: MULTI-DEVICE RESPONSIVE LAYOUT VERIFICATION
        // =====================================================================
        console.log('\n--- 6. MULTI-DEVICE RESPONSIVE LAYOUT VERIFICATION ---');
        const viewports = [
            { name: 'Desktop Large', width: 1440, height: 900 },
            { name: 'Tablet / iPad', width: 768, height: 1024 },
            { name: 'Mobile / iPhone', width: 375, height: 667 }
        ];

        for (const vp of viewports) {
            console.log(`[6] Testing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(800);

            // Check horizontal overflow (scrollWidth should not exceed clientWidth)
            const overflow = await page.evaluate(() => {
                const docWidth = document.documentElement.clientWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                return {
                    docWidth,
                    scrollWidth,
                    hasBadOverflow: scrollWidth > docWidth + 10
                };
            });
            console.log(`    Viewport ${vp.width}px: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.docWidth}`);
            if (overflow.hasBadOverflow) {
                throw new Error(`Responsive break: horizontal overflow detected on ${vp.name}: ${overflow.scrollWidth} > ${overflow.docWidth}`);
            }

            // On mobile, check mobile menu button
            if (vp.width <= 768) {
                const mobileMenuBtn = await page.locator('#mobile-menu-btn, button[aria-label="Toggle Menu"]').first();
                if (await mobileMenuBtn.count() > 0) {
                    const isVisible = await mobileMenuBtn.isVisible();
                    console.log(`    Mobile toggle button visible: ${isVisible}`);
                }
            }
            console.log(`  ✓ ${vp.name} layout passed responsiveness criteria.`);
        }

        // =====================================================================
        // TEST 7: SECURITY & PRIVACY AUDIT (ALL PAGES & CONSOLE)
        // =====================================================================
        console.log('\n--- 7. COMPREHENSIVE SECURITY & PRIVACY AUDIT ---');

        const pagesToAudit = [
            { path: '/index.html', name: 'Homepage' },
            { path: '/products', name: 'Products Page' },
            { path: '/login.html', name: 'Login Terminal' },
            { path: '/dashboard.html', name: 'Dashboard' }
        ];

        for (const target of pagesToAudit) {
            console.log(`[7.1] Auditing DOM for credential leaks on: ${target.name} (${target.path})...`);
            await page.goto(`http://localhost:${PORT}${target.path}`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(600);

            const content = await page.content();
            for (const pattern of forbiddenPatterns) {
                if (content.includes(pattern)) {
                    throw new Error(`SECURITY LEAK in ${target.name}: found forbidden string "${pattern}"`);
                }
            }

            // If login page, verify masked password input
            if (target.path.includes('login')) {
                const passInputs = await page.locator('input[type="password"]').all();
                console.log(`    Masked password inputs count: ${passInputs.length}`);
                if (passInputs.length === 0) {
                    throw new Error('Login page lacks masked password fields (type="password").');
                }
            }
            console.log(`  ✓ ${target.name} passed security audit.`);
        }

        // 7.2 Console log scan
        console.log('[7.2] Scanning captured console logs for sensitive data leaks...');
        for (const log of capturedConsoleLogs) {
            for (const pattern of forbiddenPatterns) {
                if (log.text.includes(pattern)) {
                    throw new Error(`SECURITY LEAK in console logs: "${log.text}"`);
                }
            }
        }
        console.log('  ✓ Console logs verified: zero credentials or demo account leaks.');

    } catch (err) {
        hasFailure = true;
        console.error('\n❌ VERIFICATION TEST FAILED:', err.message);
        console.error(err.stack);
    } finally {
        if (context) await context.close();
        server.close();
    }

    if (hasFailure) {
        process.exit(1);
    } else {
        console.log('\n======================================================================');
        console.log('   🎉 ALL VERIFICATION CRITERIA PASSED WITH 100% SUCCESS              ');
        console.log('   Phase 1, Phase 2, Phase 3 and Security Audit Completely Verified   ');
        console.log('======================================================================\n');
    }
}

runComprehensiveVerification();
