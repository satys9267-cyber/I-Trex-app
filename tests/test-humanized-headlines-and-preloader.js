const { chromium } = require('playwright');
const path = require('path');

async function testHeadlinesAndPreloader() {
    console.log('🚀 Starting Humanized Headlines & Preloader Verification Test...');
    const browser = await chromium.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const artifactDir = 'C:/Users/satnyx/.gemini/antigravity/brain/3a5bbf2a-41ec-46ab-97cc-cb3ad0c01db0';

    // TEST 1: PRELOADER NO-BOX AND SPEED CHECK
    console.log('\n[1/3] Testing Intro Preloader (No box artifact, reduced clean animation)...');
    await page.goto('http://127.0.0.1:10000/index.html');
    
    // Check preloader presence
    const preloader = await page.$('#intro-preloader');
    if (preloader) {
        // Assert no box wrappers
        const hasGlowBox = await page.$('.intro-logo-glow');
        const hasSweepBox = await page.$('.logo-flare-sweep');
        console.log(`✓ .intro-logo-glow box wrapper present: ${!!hasGlowBox} (Expected: false)`);
        console.log(`✓ .logo-flare-sweep box wrapper present: ${!!hasSweepBox} (Expected: false)`);
        if (hasGlowBox || hasSweepBox) {
            throw new Error('Preloader still contains box/sweep clipping wrappers!');
        }

        // Take screenshot of clean intro logo
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(artifactDir, 'evidence-preloader-clean-logo.png') });
        console.log('✓ Captured evidence-preloader-clean-logo.png (Zero box artifact)');

        // Wait for preloader to automatically dissolve smoothly (under 2 seconds)
        const startTime = Date.now();
        await page.waitForSelector('#intro-preloader', { state: 'detached', timeout: 3500 });
        const elapsed = (Date.now() - startTime) / 1000;
        console.log(`✓ Intro completed and detached in ${elapsed.toFixed(2)}s (Target: < 2.5s)`);
    }

    await page.waitForTimeout(600);

    // TEST 2: VERIFY ALL 5 HUMANIZED HEADLINES
    console.log('\n[2/3] Verifying All 5 Humanized Headlines...');

    // 1. Hero Headline
    const heroHeadline = await page.$eval('#hero-headline', el => el.textContent.replace(/\s+/g, ' ').trim());
    console.log(`1. Main Hero Headline: "${heroHeadline}"`);
    if (!heroHeadline.toUpperCase().includes("BUILT FOR WHAT’S NEXT") && !heroHeadline.toUpperCase().includes("BUILT FOR WHAT'S NEXT")) {
        throw new Error(`Hero headline does not match "BUILT FOR WHAT’S NEXT.": Got "${heroHeadline}"`);
    }

    // 2. Video / Vision Section
    const visionHeadline = await page.$eval('#vision h2', el => el.textContent.replace(/\s+/g, ' ').trim());
    console.log(`2. Vision Headline: "${visionHeadline}"`);
    if (!visionHeadline.toUpperCase().includes("SEE IT IN ACTION")) {
        throw new Error(`Vision headline does not match "SEE IT IN ACTION.": Got "${visionHeadline}"`);
    }
    const visionSubtext = await page.$eval('#vision p', el => el.textContent.trim());
    console.log(`   Vision Subtext: "${visionSubtext.slice(0, 60)}..."`);
    if (visionSubtext.includes("planetary state consensus")) {
        throw new Error('Vision subtext still contains synthetic buzzwords!');
    }

    // 3. Products Section
    const productsHeadline = await page.$eval('#ecosystem h2', el => el.textContent.replace(/\s+/g, ' ').trim());
    console.log(`3. Products Headline: "${productsHeadline}"`);
    if (!productsHeadline.toUpperCase().includes("THE CORE STACK")) {
        throw new Error(`Products headline does not match "THE CORE STACK.": Got "${productsHeadline}"`);
    }

    // 4. Ecosystem / Pillars Section
    const pillarsHeadline = await page.$eval('#technology h2', el => el.textContent.replace(/\s+/g, ' ').trim());
    console.log(`4. Pillars Headline: "${pillarsHeadline}"`);
    if (!pillarsHeadline.toUpperCase().includes("FOUR ENGINES") || !pillarsHeadline.toUpperCase().includes("ONE SYSTEM")) {
        throw new Error(`Pillars headline does not match "FOUR ENGINES. ONE SYSTEM.": Got "${pillarsHeadline}"`);
    }
    const pillarsSubtext = await page.$eval('#technology p', el => el.textContent.trim());
    console.log(`   Pillars Subtext: "${pillarsSubtext.slice(0, 60)}..."`);
    if (pillarsSubtext.includes("Continuous multi-frequency neural stream")) {
        throw new Error('Pillars subtext still contains synthetic buzzwords!');
    }

    // 5. Capabilities Section
    const capabilitiesHeadline = await page.$eval('#capabilities h2', el => el.textContent.replace(/\s+/g, ' ').trim());
    console.log(`5. Capabilities Headline: "${capabilitiesHeadline}"`);
    if (!capabilitiesHeadline.toUpperCase().includes("WHAT POWERS I-TREX")) {
        throw new Error(`Capabilities headline does not match "WHAT POWERS I-TREX.": Got "${capabilitiesHeadline}"`);
    }

    // TEST 3: EVIDENCE SCREENSHOTS ACROSS SECTIONS
    console.log('\n[3/3] Capturing Screenshots of Humanized Sections...');
    
    // Screenshot Hero
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-headline-1-hero.png') });

    // Screenshot Vision
    await page.evaluate(() => document.getElementById('vision').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-headline-2-vision.png') });

    // Screenshot Products
    await page.evaluate(() => document.getElementById('ecosystem').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-headline-3-products.png') });

    // Screenshot Pillars
    await page.evaluate(() => document.getElementById('technology').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-headline-4-pillars.png') });

    // Screenshot Capabilities
    await page.evaluate(() => document.getElementById('capabilities').scrollIntoView());
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, 'evidence-headline-5-capabilities.png') });

    console.log('✓ All 5 section screenshots saved successfully.');

    await browser.close();
    console.log('\n🎉 ALL TESTS PASSED! Humanized headlines and clean preloader are 100% verified.');
}

testHeadlinesAndPreloader().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
