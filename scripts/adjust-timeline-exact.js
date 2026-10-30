const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

const targetRegex = /if \(typeof gsap !== 'undefined'\) \{[\s\S]*?if \(skipBtn\) skipBtn\.addEventListener\('click'/;

const newGsapBlock = `if (typeof gsap !== 'undefined') {
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

        if (skipBtn) skipBtn.addEventListener('click'`;

appJs = appJs.replace(targetRegex, newGsapBlock);

// Also set fallback timer to 5.8s
appJs = appJs.replace(
    /const timer = setTimeout\(completeIntro, \d+\);/,
    'const timer = setTimeout(completeIntro, 5600);'
);

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Successfully adjusted exact timeline to +3.0 seconds!');
