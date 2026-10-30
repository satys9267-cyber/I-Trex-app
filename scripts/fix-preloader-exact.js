const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

const preloaderStartMarker = 'function initPreloader() {';
const preloaderEndMarker = 'async function initLeadershipSync() {';

const startIdx = appJs.indexOf(preloaderStartMarker);
const endIdx = appJs.indexOf(preloaderEndMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found');
    process.exit(1);
}

const cleanPreloaderCode = `function initPreloader() {
    const preloader = document.getElementById('intro-preloader');
    const skipBtn = document.getElementById('skip-intro-btn');
    const brandText = document.getElementById('intro-brand-text');
    const logoImg = document.getElementById('intro-logo-img');

    if (!preloader) {
        triggerHeroHeadlineAnimation();
        return;
    }

    const hasSeenIntro = sessionStorage.getItem('itrex_intro_seen');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenIntro || prefersReducedMotion) {
        preloader.style.display = 'none';
        if (preloader.parentNode) preloader.remove();
        triggerHeroHeadlineAnimation();
        return;
    }

    let isDismissed = false;

    function completeIntro() {
        if (isDismissed) return;
        isDismissed = true;
        sessionStorage.setItem('itrex_intro_seen', 'true');

        if (typeof gsap !== 'undefined') {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.7,
                ease: "power2.inOut",
                onComplete: () => {
                    if (preloader.parentNode) preloader.remove();
                }
            });
            setTimeout(() => {
                triggerHeroHeadlineAnimation();
            }, 200);
        } else {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                if (preloader.parentNode) preloader.remove();
                triggerHeroHeadlineAnimation();
            }, 500);
        }
    }

    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();

        // PHASE 1: Initial Appearance (0.0s - 1.0s) - Prominent logo fade-in & scale
        tl.fromTo(logoImg, 
            { opacity: 0, scale: 0.90, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.25))' },
            { opacity: 1, scale: 1.0, filter: 'drop-shadow(0 0 45px rgba(255,255,255,0.55))', duration: 1.0, ease: "power2.out" },
            0
        )
        // PHASE 2: Brand Typography Reveal (0.8s - 1.6s)
        .fromTo(brandText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            0.8
        )
        // Extended +3.0s Majestic Presentation with Ambient Specular Breathing (1.6s - 4.8s)
        .to(logoImg, {
            scale: 1.025,
            filter: 'drop-shadow(0 0 65px rgba(0,242,254,0.45)) drop-shadow(0 0 30px rgba(255,255,255,0.7))',
            duration: 1.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        }, 1.6)
        // PHASE 3: Seamless Dissolve & Overlap (Starts at 4.8s — exactly +3.0s extended from original 1.8s)
        .to(preloader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onStart: () => {
                // PHASE 4: Seamless Homepage Reveal overlaps with preloader dissolve
                triggerHeroHeadlineAnimation();
            },
            onComplete: () => {
                isDismissed = true;
                sessionStorage.setItem('itrex_intro_seen', 'true');
                if (preloader.parentNode) preloader.remove();
            }
        }, 4.8);

        if (skipBtn) skipBtn.addEventListener('click', () => { tl.kill(); completeIntro(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !isDismissed) {
                tl.kill();
                completeIntro();
            }
        });

    } else {
        if (logoImg) logoImg.classList.add('scale-100');
        if (brandText) brandText.classList.remove('opacity-0');
        const timer = setTimeout(completeIntro, 5600); // Extended by 3000ms
        if (skipBtn) skipBtn.addEventListener('click', () => { clearTimeout(timer); completeIntro(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { clearTimeout(timer); completeIntro(); }
        });
    }
}

`;

appJs = appJs.substring(0, startIdx) + cleanPreloaderCode + appJs.substring(endIdx);
fs.writeFileSync(appPath, appJs, 'utf8');
console.log('✓ Cleanly rewritten initPreloader with exact +3.0s extension!');
