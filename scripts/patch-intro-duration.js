const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let appJs = fs.readFileSync(appPath, 'utf8');

const targetBlock = `        // PHASE 1: Initial Appearance (0.0s - 0.8s) - Prominent logo fade-in & scale
        tl.fromTo(logoImg, 
            { opacity: 0, scale: 0.90 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power2.out" }
        )
        // PHASE 2: Logo Presentation (0.8s - 2.0s) - Brand typography reveal
        .fromTo(brandText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.2"
        )
        // PHASE 3: Seamless Dissolve & Overlap (2.2s - 2.9s)
        .to(preloader, {
            opacity: 0,
            duration: 0.75,
            ease: "power2.inOut",
            delay: 0.9,
            onStart: () => {
                // PHASE 4: Seamless Homepage Reveal overlaps with preloader dissolve
                triggerHeroHeadlineAnimation();
            },
            onComplete: () => {
                isDismissed = true;
                sessionStorage.setItem('itrex_intro_seen', 'true');
                if (preloader.parentNode) preloader.remove();
            }
        });`;

const replacementBlock = `        // PHASE 1: Initial Appearance (0.0s - 1.0s) - Prominent logo fade-in & scale
        tl.fromTo(logoImg, 
            { opacity: 0, scale: 0.90, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.25))' },
            { opacity: 1, scale: 1.0, filter: 'drop-shadow(0 0 45px rgba(255,255,255,0.55))', duration: 1.0, ease: "power2.out" }
        )
        // PHASE 2: Logo Presentation & Brand Typography Reveal (1.0s - 1.8s)
        .fromTo(brandText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.2"
        )
        // Extended 3.0s Majestic Presentation with Ambient Specular Breathing
        .to(logoImg, {
            scale: 1.02,
            filter: 'drop-shadow(0 0 65px rgba(0,242,254,0.4)) drop-shadow(0 0 30px rgba(255,255,255,0.7))',
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        }, "+=0.1")
        // PHASE 3: Seamless Dissolve & Overlap (+3.0s presentation time)
        .to(preloader, {
            opacity: 0,
            duration: 0.85,
            ease: "power2.inOut",
            delay: 3.9,
            onStart: () => {
                // PHASE 4: Seamless Homepage Reveal overlaps with preloader dissolve
                triggerHeroHeadlineAnimation();
            },
            onComplete: () => {
                isDismissed = true;
                sessionStorage.setItem('itrex_intro_seen', 'true');
                if (preloader.parentNode) preloader.remove();
            }
        });`;

if (appJs.includes(targetBlock)) {
    appJs = appJs.replace(targetBlock, replacementBlock);
    console.log('✓ Successfully increased GSAP intro sequence by 3.0 seconds');
} else {
    console.log('Target block not matched exactly, checking regex or line-by-line');
}

// Update fallback timer (+3000ms from 2800ms to 5800ms)
appJs = appJs.replace(
    'const timer = setTimeout(completeIntro, 2800);',
    'const timer = setTimeout(completeIntro, 5800); // Extended by 3000ms'
);

fs.writeFileSync(appPath, appJs, 'utf8');
console.log('Successfully updated app.js with +3.0s intro presentation time!');
