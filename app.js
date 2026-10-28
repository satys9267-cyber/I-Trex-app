/**
 * I-Trex Innovations — Advanced Animation Engine & Synthesizer
 * Built to exactly replicate the Safar Saathi experience for Satyam's Startup
 */

// Initialize line icons
lucide.createIcons();

// ==============================================================
// 1. MASTER STARTUP CONFIGURATION OBJECT
// ==============================================================
const siteConfig = {
    brand: {
        name: "I-Trex Innovations",
        tagline: "One Platform. Infinite Trajectory.",
        credit: "Founded by Satyam",
        sub: "Autonomous Operating System & Edge Platform",
        category: "Deep Tech & Enterprise Cloud"
    },
    contact: {
        email: "satys9267@gmail.com",
        phone: "+91 74998 25344",
        phoneRaw: "+917499825344"
    },
    socials: {
        linkedin: "https://linkedin.com/in/satyam-swami",
        github: "https://github.com/satyam-swami",
        instagram: "https://instagram.com/satyam",
        email: "mailto:satys9267@gmail.com"
    },
    team: [
        {
            name: "Satyam Swami",
            role: "Founder & Chief Systems Architect",
            badge: "Founder",
            initials: "SS",
            avatarEmoji: "👑",
            bio: "Founding visionary of I-Trex Innovations. Leading autonomous microkernel architectures, eBPF security enclaves, and distributed state consensus.",
            specialties: ["Microkernel Systems", "eBPF Security Enclaves", "Consensus Protocols"],
            socials: {
                linkedin: "https://linkedin.com/in/satyam-swami",
                github: "https://github.com/satyam-swami",
                email: "mailto:satys9267@gmail.com"
            }
        },
        {
            name: "Ishwari Patil",
            role: "Co-Founder & AI Systems Lead",
            badge: "Co-Founder",
            initials: "IP",
            avatarEmoji: "🔬",
            bio: "Co-founder leading cognitive spatial perception engines, 120 FPS WebGPU neural acceleration, and low-latency edge inference models.",
            specialties: ["Spatial Perception", "WebGPU Engines", "Edge Neural Inference"],
            socials: {
                linkedin: "https://linkedin.com/in/ishwari-patil",
                github: "https://github.com/ishwari-patil",
                email: "mailto:ishwari@itrex.internal"
            }
        }
    ]
};

// Populate Team & Contact structures dynamically on load
function populateSiteData() {
    const grid = document.getElementById("team-grid");
    if (grid) {
        grid.innerHTML = "";
        siteConfig.team.forEach(member => {
            const card = document.createElement("div");
            card.className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-itrex-border dark:border-slate-800 p-8 sm:p-10 rounded-[36px] flex flex-col justify-between transition-all duration-500 relative group overflow-hidden shadow-lg hover:shadow-2xl tilt-card";
            card.setAttribute("data-hover", "card");
            
            const accentGradient = member.badge === 'Founder' 
                ? 'from-itrex-gold/10 via-transparent to-transparent' 
                : 'from-cyan-500/10 via-transparent to-transparent';

            const badgeColor = member.badge === 'Founder'
                ? 'bg-itrex-gold/10 text-itrex-gold border-itrex-gold/30'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';

            card.innerHTML = `
                <!-- Background visual trail lines animating on hover -->
                <div class="absolute inset-0 bg-gradient-to-tr ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div>
                    <!-- Header with Verified Badge and Avatar -->
                    <div class="flex items-center justify-between mb-6">
                        <div class="relative">
                            <div class="w-16 h-16 rounded-full border-2 border-itrex-border dark:border-slate-800 flex items-center justify-center font-space font-bold text-itrex-gold text-lg bg-itrex-neutralLight dark:bg-slate-950 relative shadow-inner">
                                <span class="relative z-10">${member.initials}</span>
                                <i data-lucide="compass" class="w-16 h-16 text-itrex-border/40 dark:text-slate-800/60 absolute inset-0 orbit-spin-slow pointer-events-none"></i>
                            </div>
                            <span class="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">${member.avatarEmoji}</span>
                        </div>

                        <div class="text-right">
                            <span class="text-[9px] font-mono uppercase px-3 py-1 rounded-full font-bold tracking-widest border ${badgeColor} inline-block">
                                ${member.badge}
                            </span>
                            <div class="flex items-center justify-end space-x-1.5 mt-2 text-[10px] font-mono text-emerald-500">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Verified Enclave</span>
                            </div>
                        </div>
                    </div>

                    <!-- Member Title & Role -->
                    <h3 class="font-space font-bold text-2xl text-itrex-navy dark:text-white leading-tight">${member.name}</h3>
                    <p class="text-xs font-mono uppercase text-itrex-gold mt-1 tracking-wider">${member.role}</p>

                    <!-- Bio -->
                    <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-sans">${member.bio}</p>

                    <!-- Specialties Tags -->
                    <div class="flex flex-wrap gap-2 mt-5">
                        ${member.specialties.map(spec => `
                            <span class="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-slate-800/80 text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-slate-700/50">
                                ${spec}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <!-- Footer with Social / Enclave Connections -->
                <div class="pt-6 mt-6 border-t border-itrex-border dark:border-slate-800/80 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-neutral-400">Direct Workspace Link</span>
                    <div class="flex items-center space-x-3 text-neutral-400">
                        <a href="${member.socials.linkedin}" target="_blank" class="hover:text-itrex-gold transition-colors" title="LinkedIn"><i data-lucide="linkedin" class="w-4 h-4"></i></a>
                        <a href="${member.socials.github}" target="_blank" class="hover:text-itrex-gold transition-colors" title="GitHub"><i data-lucide="github" class="w-4 h-4"></i></a>
                        <a href="${member.socials.email}" class="hover:text-itrex-gold transition-colors" title="Email"><i data-lucide="mail" class="w-4 h-4"></i></a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Populate Contact links
    const footerConnect = document.getElementById("footer-connect-list");
    if (footerConnect) {
        footerConnect.innerHTML = `
            <li><a href="mailto:${siteConfig.contact.email}" class="hover:text-itrex-navy dark:hover:text-white transition-colors flex items-center gap-1.5"><i data-lucide="mail" class="w-3.5 h-3.5 text-itrex-gold"></i> ${siteConfig.contact.email}</a></li>
            <li><a href="tel:${siteConfig.contact.phoneRaw}" class="hover:text-itrex-navy dark:hover:text-white transition-colors flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-itrex-gold"></i> ${siteConfig.contact.phone}</a></li>
            <li><a href="#contact" class="hover:text-itrex-navy dark:hover:text-white transition-colors">Founder Direct Line</a></li>
            <li><a href="#about" class="hover:text-itrex-navy dark:hover:text-white transition-colors">Investor Relations</a></li>
        `;
    }
    lucide.createIcons(); // refresh icons
}

window.addEventListener("DOMContentLoaded", populateSiteData);

// ==========================================
// 2. HIGH-END SYNTHESIZED SOUND SYSTEM (Web Audio API)
// ==========================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Tick sound on hover
function playHoverTick() {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(1500, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.04);

        gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
}

// Chime sound on node click / theme toggle
function playNodeChime() {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime);    // A5

        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8); 

        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.8);
        osc2.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}
}

// ==========================================
// 3. PRELOADER & SCROLL CONTROLLERS
// ==========================================
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to("#loader-logo-img", {
        scale: 1.1,
        rotate: 360,
        duration: 1.1,
        ease: "power3.inOut"
    });

    tl.to(".loader-letter", {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.6");

    tl.to("#loader-sub", {
        opacity: 1,
        y: 0,
        duration: 0.5
    }, "-=0.2");

    tl.to("#loader", {
        y: "-100%",
        duration: 0.8,
        ease: "power4.inOut",
        onStart: () => {
            const loader = document.getElementById("loader");
            if (loader) loader.style.pointerEvents = "none";
        },
        onComplete: () => {
            const loader = document.getElementById("loader");
            if (loader) loader.style.display = "none";
        }
    }, "+=0.3");

    tl.to("#main-content", {
        opacity: 1,
        duration: 0.6,
        onComplete: () => {
            gsap.to("#navbar", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power4.out"
            });
            playHeroEntranceSequence();
            initScrollTriggers();
            loadPillarConfig();
            initProductCarousel();
        }
    }, "-=0.4");
});

// Orchestrated Hero Sequence Execution
function playHeroEntranceSequence() {
    const heroTl = gsap.timeline({ delay: 0.1 });

    // 1. Reveal pill badge
    heroTl.to("#hero-badge", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
    });

    // 2. Staggered headline reveal
    heroTl.to(".hero-reveal-line", {
        y: 0,
        opacity: 1,
        stagger: 0.16,
        duration: 0.85,
        ease: "power4.out"
    }, "-=0.3");

    // 3. Supporting subtext reveal
    heroTl.to("#hero-subtext", {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out"
    }, "-=0.35");

    // 4. Primary CTA enters from opposite axis (-X offset) & settles
    heroTl.to("#hero-primary-cta", {
        x: 0,
        opacity: 1,
        duration: 0.75,
        ease: "back.out(1.2)"
    }, "-=0.3");

    // 5. Secondary CTA enters from +X offset
    heroTl.to("#hero-secondary-cta", {
        x: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out"
    }, "-=0.6");
}

let lenis = null;
function initLenisScroll() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        window.lenis = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        lenis.on('scroll', (e) => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const progress = (e.scroll / docHeight) * 100;
                const bar = document.getElementById("scroll-trajectory-progress");
                if (bar) bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
            }
        });
    }
}

function initScrollTriggers() {
    gsap.registerPlugin(ScrollTrigger);
    initLenisScroll();
    ScrollTrigger.refresh();

    // Swap floating transparent navigation bar into solid glass on scroll
    ScrollTrigger.create({
        start: "top -10%",
        onEnter: () => {
            const nav = document.getElementById("navbar");
            nav.classList.add("bg-white/90", "dark:bg-slate-950/90", "backdrop-blur-md", "shadow-sm", "py-3");
            nav.classList.remove("py-6");
        },
        onLeaveBack: () => {
            const nav = document.getElementById("navbar");
            nav.classList.remove("bg-white/90", "dark:bg-slate-950/90", "backdrop-blur-md", "shadow-sm", "py-3");
            nav.classList.add("py-6");
        }
    });

    // Product Carousel Stage Entrance ScrollTrigger (scale & opacity reveal)
    gsap.fromTo("#product-carousel-stage",
        { scale: 0.96, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#products-highlight",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Four Pillars Cyber-Neural Stream ScrollTrigger sequence
    initNeuralStreamScrollTrigger();

    // Dual-Trigger Scroll Zoom for Cinematic Video Card
    gsap.fromTo("#video-card-container", 
        { scale: 0.9, opacity: 0.85 },
        { 
            scale: 1.0, 
            opacity: 1.0,
            scrollTrigger: {
                trigger: "#video-card-container",
                start: "top 80%",
                end: "top 40%",
                scrub: true
            }
        }
    );

    // Progress Scroll bound line drawing
    gsap.to("#vision-progress-fill", {
        width: "100%",
        scrollTrigger: {
            trigger: "#vision-mission",
            start: "top 60%",
            end: "bottom 50%",
            scrub: true
        }
    });

    // Horizon Trajectory drawing in footer
    gsap.to("#horizon-line-fill", {
        width: "100%",
        scrollTrigger: {
            trigger: "footer",
            start: "top 95%",
            end: "bottom 95%",
            scrub: true
        }
    });

    gsap.to("#horizon-dot", {
        left: "100%",
        scrollTrigger: {
            trigger: "footer",
            start: "top 95%",
            end: "bottom 95%",
            scrub: true
        }
    });

    // Scroll progress flight tracker
    window.addEventListener("scroll", () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / docHeight) * 100;
        document.getElementById("scroll-trajectory-progress").style.width = progress + "%";
    });
}

// ==========================================
// 4. SOLAR ECLIPSE THEME SWAPPER (Light/Dark)
// ==========================================
const themeToggleBtn = document.getElementById("theme-toggle-btn");
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        playNodeChime();
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("itrex-theme", isDark ? "dark" : "light");
    });
}

// Restore saved theme preference
if (localStorage.getItem("itrex-theme") === "dark") {
    document.documentElement.classList.add("dark");
}

// =======================================================
// 5. CURSOR-FOLLOWING GOLDEN LIGHT & TWINKLING SPARKLES SYSTEM
// =======================================================
const canvas = document.getElementById("sparkle-canvas");
const ctx = canvas.getContext("2d");

let particlesArray = [];
const mouse = { x: null, y: null, lastX: 0, lastY: 0, speed: 0 };
const lightGlow = { x: 0, y: 0, targetX: 0, targetY: 0, ease: 0.35 };
let activeHoverType = "normal"; // normal, heading, button, card

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

class Sparkle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        
        // Multi-directional velocity with slight physics friction
        this.speedX = (Math.random() - 0.5) * 1.5 + (vx * 0.08);
        this.speedY = (Math.random() - 0.5) * 1.5 + (vy * 0.08);
        
        // Elongated star structural metrics
        this.baseSize = activeHoverType === "heading" ? 12 : (activeHoverType === "button" ? 14 : 7);
        this.size = Math.random() * this.baseSize + 3;
        this.angle = Math.random() * Math.PI;
        this.spin = (Math.random() - 0.5) * 0.05;
        this.alpha = 0.9;
        this.decay = Math.random() * 0.02 + 0.015;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.alpha;
        
        // Draw elegant four-point stars
        ctx.fillStyle = `rgba(194, 151, 56, ${this.alpha})`; 
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(0, this.size);
            ctx.lineTo(this.size * 0.18, this.size * 0.18);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;

        // Apply friction
        this.speedX *= 0.96;
        this.speedY *= 0.96;

        this.alpha -= this.decay;
        if (this.size > 0.1) this.size -= 0.05;
    }
}

// Parallax quickTo helper for hero background art (zero GC allocation)
let heroParallaxX = null;
let heroParallaxY = null;
if (typeof gsap !== 'undefined' && document.getElementById("hero-bg-art")) {
    heroParallaxX = gsap.quickTo("#hero-bg-art", "x", { duration: 0.6, ease: "power2.out" });
    heroParallaxY = gsap.quickTo("#hero-bg-art", "y", { duration: 0.6, ease: "power2.out" });
}

let mouseMoveCounter = 0;

// Track mouse positioning + Swift Parallax with passive event listener
window.addEventListener("mousemove", (e) => {
    const vx = e.clientX - mouse.lastX;
    const vy = e.clientY - mouse.lastY;
    mouse.speed = Math.sqrt(vx * vx + vy * vy);

    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    lightGlow.targetX = e.clientX;
    lightGlow.targetY = e.clientY;

    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;

    // Smooth, efficient parallax on hero art
    if (heroParallaxX && heroParallaxY) {
        heroParallaxX((e.clientX - window.innerWidth / 2) * 0.015);
        heroParallaxY((e.clientY - window.innerHeight / 2) * 0.015);
    }

    // Spawn sparkles sparingly to maintain 60-120fps smooth performance
    mouseMoveCounter++;
    if (mouseMoveCounter % 4 === 0 && particlesArray.length < 14 && mouse.speed > 3) {
        particlesArray.push(new Sparkle(mouse.x, mouse.y, vx, vy));
    }
}, { passive: true });

// Click ripple event
window.addEventListener("mousedown", (e) => {
    playNodeChime(); 
    if (particlesArray.length < 24) {
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            particlesArray.push(new Sparkle(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed));
        }
    }
}, { passive: true });

function handleGlowAndSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply interpolation for golden light inertia
    lightGlow.x += (lightGlow.targetX - lightGlow.x) * lightGlow.ease;
    lightGlow.y += (lightGlow.targetY - lightGlow.y) * lightGlow.ease;

    // Draw the cursor-following golden light gradient
    if (mouse.x !== null) {
        ctx.save();
        const gradient = ctx.createRadialGradient(lightGlow.x, lightGlow.y, 2, lightGlow.x, lightGlow.y, 65);
        gradient.addColorStop(0, "rgba(253, 252, 247, 0.45)"); 
        gradient.addColorStop(0.3, "rgba(194, 151, 56, 0.15)"); 
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); 
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(lightGlow.x, lightGlow.y, 65, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Render the star collection
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        if (particlesArray[i].alpha <= 0 || particlesArray[i].size <= 0.1) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(handleGlowAndSparkles);
}
handleGlowAndSparkles();

// Hover interactions + micro-tick trigger
const hoverElements = document.querySelectorAll("[data-hover='heading'], [data-hover='button'], [data-hover='card'], a, button");
hoverElements.forEach(elem => {
    elem.addEventListener("mouseenter", () => {
        if (elem.getAttribute("data-hover") === "heading") {
            activeHoverType = "heading";
        } else if (elem.getAttribute("data-hover") === "button") {
            activeHoverType = "button";
        }
        playHoverTick(); 
    });
    elem.addEventListener("mouseleave", () => {
        activeHoverType = "normal";
    });
});

// ==========================================
// 6. CINEMATIC VIDEO CONTROLS & CURSOR HOVER ZOOM
// ==========================================
const video = document.getElementById("cinematic-video");
const videoCard = document.getElementById("video-card-container");
const playPlaceholder = document.getElementById("video-placeholder");
const playBtn = document.getElementById("custom-play-btn");
const hudPlayPause = document.getElementById("hud-play-pause");
const hudPlayIcon = document.getElementById("hud-play-icon");
const hudMute = document.getElementById("hud-mute");
const hudVolumeIcon = document.getElementById("hud-volume-icon");
const hudFullscreen = document.getElementById("hud-fullscreen");
const progressBar = document.getElementById("hud-progress-bar");
const progressFill = document.getElementById("hud-progress-fill");
const timeDisplay = document.getElementById("hud-time-display");

// Magnetic scale zoom on cursor hover
if (videoCard) {
    videoCard.addEventListener("mouseenter", () => {
        gsap.to(videoCard, {
            scale: 1.05,
            boxShadow: "0 25px 60px rgba(194, 151, 56, 0.18)",
            duration: 0.6,
            ease: "power2.out"
        });
    });

    videoCard.addEventListener("mouseleave", () => {
        gsap.to(videoCard, {
            scale: 1.0,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.02)",
            duration: 0.6,
            ease: "power2.out"
        });
    });
}

if (playBtn) {
    playBtn.addEventListener("click", () => {
        playPlaceholder.classList.add("opacity-0", "pointer-events-none");
        if (video) {
            video.play().catch(() => {
                console.log("Simulating cinematic demo presentation.");
            });
        }
    });
}

if (hudPlayPause) {
    hudPlayPause.addEventListener("click", () => {
        if (video) {
            if (video.paused) {
                video.play();
                hudPlayIcon.setAttribute("data-lucide", "pause");
            } else {
                video.pause();
                hudPlayIcon.setAttribute("data-lucide", "play");
            }
            lucide.createIcons();
        }
    });
}

if (hudMute) {
    hudMute.addEventListener("click", () => {
        if (video) {
            video.muted = !video.muted;
            if (video.muted) {
                hudVolumeIcon.setAttribute("data-lucide", "volume-x");
            } else {
                hudVolumeIcon.setAttribute("data-lucide", "volume-2");
            }
            lucide.createIcons();
        }
    });
}

if (video) {
    video.addEventListener("timeupdate", () => {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressFill.style.width = percent + "%";
            timeDisplay.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
        }
    });
}

if (progressBar && video) {
    progressBar.addEventListener("click", (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });
}

if (hudFullscreen && video) {
    hudFullscreen.addEventListener("click", () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + ":" + (sec < 10 ? "0" : "") + sec;
}

// ==============================================================
// 7. ARCHITECTURE VECTOR PATH TRACING WITH DYNAMIC CLICK ROUTE
// ==============================================================
const drawnPath = document.getElementById("journey-vector-path-drawn");

// Offset points along path to partially color path based on clicked node
const nodeOffsets = {
    "1": 1150, // Node 1: TrexOS Neural Kernel (Cyan #00f2fe)
    "2": 850,  // Node 2: TrexCore Edge Cloud (Amber #f97316)
    "3": 450,  // Node 3: TrexVision Spatial AI (Violet #8b5cf6)
    "4": 0     // Node 4: TrexShield SecOps (Emerald #10b981)
};

document.querySelectorAll("[data-popup]").forEach(node => {
    const popupId = node.getAttribute("data-popup");
    const popup = document.getElementById(popupId);
    
    const targetOffset = nodeOffsets[node.getAttribute("data-node")];
    const targetColor = node.getAttribute("data-color");

    // Dynamic hover sequence
    node.addEventListener("mouseenter", () => {
        if (popup) {
            popup.style.opacity = "1";
            popup.style.transform = "translateY(-5px)";
        }
        
        if (drawnPath) {
            gsap.to(drawnPath, {
                strokeDashoffset: targetOffset,
                stroke: targetColor,
                duration: 1.2,
                ease: "power2.out"
            });
        }
    });

    node.addEventListener("mouseleave", () => {
        if (popup) {
            popup.style.opacity = "0";
            popup.style.transform = "translateY(0px)";
        }
    });

    // Clicking an architecture node permanently alters drawn route color
    node.addEventListener("click", () => {
        playNodeChime();
        if (drawnPath) {
            gsap.to(drawnPath, {
                strokeDashoffset: targetOffset,
                stroke: targetColor,
                duration: 1.5,
                ease: "power3.out"
            });
        }
    });
});

// ==========================================
// 8. 3D CARD TILT ON HOVER
// ==========================================
const cards = document.querySelectorAll("[data-hover='card']");
cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 12;
        const rotateY = (x - centerX) / 12;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 600,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// ==========================================
// 9. INTERACTIVE CONTACT & COPY TO CLIPBOARD
// ==========================================
function copyToClipboard(text, btnElement) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btnElement.textContent;
            btnElement.textContent = "Copied!";
            btnElement.classList.add("bg-emerald-500", "text-black");
            playHoverTick();
            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.classList.remove("bg-emerald-500", "text-black");
            }, 2000);
        });
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById("contact-submit-btn");
    const alertBox = document.getElementById("contact-status-alert");
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const category = document.getElementById("contact-category").value;
    const message = document.getElementById("contact-message").value;

    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-itrex-navy" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Encrypting & Transmitting...</span>
    `;

    setTimeout(() => {
        playNodeChime();
        btn.disabled = false;
        btn.innerHTML = `
            <span>Message Delivered Successfully</span>
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-800"></i>
        `;
        lucide.createIcons();

        alertBox.className = "p-4 rounded-xl text-xs font-mono bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 block space-y-1";
        alertBox.innerHTML = `
            <div class="font-bold flex items-center gap-1.5 text-emerald-200">
                <span>&check; Transmission Confirmed</span>
            </div>
            <p>Thank you, <strong>${name}</strong>. Your inquiry (${category}) has been logged directly into Satyam's review terminal. We will follow up at <strong>${email}</strong>.</p>
        `;

        // Reset form after short delay
        setTimeout(() => {
            document.getElementById("contact-form").reset();
            btn.innerHTML = `
                <span>Transmit Secure Transmission</span>
                <i data-lucide="send" class="w-4 h-4"></i>
            `;
            lucide.createIcons();
        }, 5000);
    }, 1200);
}

// Smooth scroll and focus for "Connect With Us"
const navConnectBtn = document.getElementById("nav-connect-btn");
if (navConnectBtn) {
    navConnectBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const contactSection = document.getElementById("contact");
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
            const card = document.getElementById("contact-form-card");
            if (card) {
                gsap.fromTo(card, 
                    { scale: 0.98, borderColor: "#c29738" },
                    { scale: 1, borderColor: "rgba(194, 151, 56, 0.8)", duration: 0.8, yoyo: true, repeat: 1 }
                );
                setTimeout(() => {
                    document.getElementById("contact-name").focus();
                }, 800);
            }
        }
    });
}

// ==============================================================
// 12. FOUR PILLARS: CYBER-NEURAL DATA STREAM ENGINE & SCHEMA
// ==============================================================

const DEFAULT_PILLARS = [
    {
        id: "pillar-1",
        pillarNumber: "01",
        title: "TrexOS Kernel",
        description: "Deterministic microkernel with sub-0.35ms scheduling.",
        badge: "01",
        glowColor: "#00f0ff",
        position: "top",
        xPercent: 20,
        graphicType: "cube"
    },
    {
        id: "pillar-2",
        pillarNumber: "02",
        title: "TrexCore Mesh",
        description: "Geo-distributed state sync with sub-12ms latency.",
        badge: "02",
        glowColor: "#9d4edd",
        position: "bottom",
        xPercent: 40,
        graphicType: "neural"
    },
    {
        id: "pillar-3",
        pillarNumber: "03",
        title: "TrexShield SecOps",
        description: "eBPF behavioral quarantine & attestations.",
        badge: "03",
        glowColor: "#e0aaff",
        position: "top",
        xPercent: 65,
        graphicType: "shield"
    },
    {
        id: "pillar-4",
        pillarNumber: "04",
        title: "TrexVision SLAM",
        description: "120 FPS 3D odometry & spatial telemetry pipeline.",
        badge: "04",
        glowColor: "#00f0ff",
        position: "bottom",
        xPercent: 85,
        graphicType: "sphere"
    }
];

let activePillars = JSON.parse(JSON.stringify(DEFAULT_PILLARS));
let hoveredPillarIdx = null;

// =========================================================================
// SIMPLE SINGLE CURVE FLOW LINE WITH GLOWING & 4-SECOND AUTO-COMPLETION
// Lightweight SVG hardware-accelerated flow: eliminates canvas loop lag
// =========================================================================
let isPillarsFlowTriggered = false;

function initSimpleCurveFlow() {
    if (isPillarsFlowTriggered) return;
    const curvePath = document.getElementById("single-flow-line");
    const photonHead = document.getElementById("flow-photon-head");
    if (!curvePath) return;

    let pathLength = 1400;
    try {
        pathLength = curvePath.getTotalLength();
    } catch (e) {}

    curvePath.style.strokeDasharray = pathLength;
    curvePath.style.strokeDashoffset = pathLength;

    if (photonHead) {
        gsap.set(photonHead, { opacity: 0 });
    }

    // Set initial hidden states for the 4 pillar cards
    activePillars.forEach((pillar, idx) => {
        const card = document.getElementById(`pillar-card-${idx}`);
        if (card) {
            gsap.set(card, {
                opacity: 0,
                y: pillar.position === 'top' ? -15 : 15
            });
        }
    });

    initHolographicCardTilts();
}

function playSingleCurveFlowSequence() {
    if (isPillarsFlowTriggered) return;
    isPillarsFlowTriggered = true;

    const curvePath = document.getElementById("single-flow-line");
    const photonHead = document.getElementById("flow-photon-head");
    const statusPill = document.getElementById("live-flow-status-pill");
    if (!curvePath) return;

    let pathLength = 1400;
    try {
        pathLength = curvePath.getTotalLength();
    } catch (e) {}

    curvePath.style.strokeDasharray = pathLength;

    if (photonHead) {
        gsap.to(photonHead, { opacity: 1, duration: 0.3 });
    }

    if (statusPill) {
        statusPill.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-itrex-gold animate-ping"></span>
            <span class="font-bold tracking-wider text-itrex-gold">Flow Trajectory: Syncing Nodes (0-4s)...</span>
        `;
    }

    const flowTracker = { progress: 0 };

    // Master 4-Second Flow Timeline
    const masterTl = gsap.timeline({
        onComplete: () => {
            if (statusPill) {
                statusPill.innerHTML = `
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="font-bold tracking-wider text-emerald-300">Flow Complete: 4 Pillars Synchronized</span>
                `;
            }
            // Gentle hovering breathing motion on cards after 4s entrance
            activePillars.forEach((pillar, idx) => {
                const card = document.getElementById(`pillar-card-${idx}`);
                if (card) {
                    gsap.to(card, {
                        y: pillar.position === 'top' ? "-=4" : "+=4",
                        duration: 2.4 + (idx * 0.3),
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                }
            });
        }
    });

    // 1. Single glowing curve line flows from 0% to 100% over exactly 4.0 seconds
    masterTl.to(flowTracker, {
        progress: 1,
        duration: 4.0,
        ease: "power1.inOut",
        onUpdate: () => {
            const currentDist = flowTracker.progress * pathLength;
            curvePath.style.strokeDashoffset = pathLength - currentDist;

            if (photonHead && typeof curvePath.getPointAtLength === 'function') {
                const pt = curvePath.getPointAtLength(currentDist);
                photonHead.setAttribute("cx", pt.x);
                photonHead.setAttribute("cy", pt.y);
            }
        }
    }, 0);

    // 2. Pillar 01 reveals at t = 0.6s (~15-20% of trajectory)
    masterTl.add(() => {
        revealPillar(0);
    }, 0.6);

    // 3. Pillar 02 reveals at t = 1.5s (~40% of trajectory)
    masterTl.add(() => {
        revealPillar(1);
    }, 1.5);

    // 4. Pillar 03 reveals at t = 2.5s (~65% of trajectory)
    masterTl.add(() => {
        revealPillar(2);
    }, 2.5);

    // 5. Pillar 04 reveals at t = 3.4s (~85% of trajectory)
    masterTl.add(() => {
        revealPillar(3);
    }, 3.4);
}

function revealPillar(idx) {
    // Reveal glowing node core on curve
    const node = document.getElementById(`flow-node-${idx}`);
    if (node) {
        node.classList.remove("opacity-0");
        node.classList.add("opacity-100");
        gsap.fromTo(node, 
            { scale: 0.3, transformOrigin: "center center" }, 
            { scale: 1, duration: 0.45, ease: "back.out(2)" }
        );
    }

    // Reveal corresponding holographic pillar card
    const card = document.getElementById(`pillar-card-${idx}`);
    if (card) {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    // Update status pill to reflect current progress
    const statusPill = document.getElementById("live-flow-status-pill");
    if (statusPill && idx < 3) {
        statusPill.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-itrex-gold animate-ping"></span>
            <span class="font-bold tracking-wider text-itrex-gold">Flow Trajectory: Pillar 0${idx + 1} Connected</span>
        `;
    }
}

function initNeuralStreamEngine() {
    initSimpleCurveFlow();
}

function initHolographicCardTilts() {
    const cards = document.querySelectorAll(".holographic-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = (y / (rect.height / 2)) * -5;
            const rotY = (x / (rect.width / 2)) * 5;
            gsap.to(card, {
                rotationX: rotX,
                rotationY: rotY,
                transformPerspective: 800,
                duration: 0.25,
                ease: "power1.out"
            });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

function onPillarHover(idx) {
    hoveredPillarIdx = idx;
    activePillars.forEach((_, i) => {
        const card = document.getElementById(`pillar-card-${i}`);
        if (!card) return;
        if (i === idx) {
            gsap.to(card, { scale: 1.03, opacity: 1, duration: 0.3, ease: "power2.out" });
        } else {
            gsap.to(card, { scale: 0.97, opacity: 0.4, duration: 0.3, ease: "power2.out" });
        }
    });
}

function onPillarLeave() {
    hoveredPillarIdx = null;
    activePillars.forEach((_, i) => {
        const card = document.getElementById(`pillar-card-${i}`);
        if (!card) return;
        gsap.to(card, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    });
}

window.onPillarHover = onPillarHover;
window.onPillarLeave = onPillarLeave;
window.playSingleCurveFlowSequence = playSingleCurveFlowSequence;
window.initSimpleCurveFlow = initSimpleCurveFlow;

function initNeuralStreamScrollTrigger() {
    if (!isPillarsFlowTriggered) {
        initSimpleCurveFlow();
    }

    // Trigger flow sequence automatically when user reaches the slide
    ScrollTrigger.create({
        trigger: "#architecture",
        start: "top 75%",
        once: true,
        onEnter: () => {
            playSingleCurveFlowSequence();
        }
    });

    // Fallback safety check if section is already in view or user navigated directly
    setTimeout(() => {
        const arch = document.getElementById("architecture");
        if (arch) {
            const rect = arch.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85 && !isPillarsFlowTriggered) {
                playSingleCurveFlowSequence();
            }
        }
    }, 1500);
}

// Founder Configuration Handlers
function openPillarConfigModal() {
    playHoverTick();
    const modal = document.getElementById("pillar-config-modal");
    if (modal) modal.classList.remove("hidden");
}

function closePillarConfigModal() {
    const modal = document.getElementById("pillar-config-modal");
    if (modal) modal.classList.add("hidden");
}

function savePillarConfig(e) {
    if (e && e.preventDefault) e.preventDefault();
    playNodeChime();

    const selectedColor = document.querySelector('input[name="pillarTheme"]:checked')?.value || 
                          document.getElementById('config-theme-select')?.value || "#00f0ff";
    const scrub = document.getElementById("cfg-scrub-mode")?.value || "1.2";
    const pulse = document.getElementById("cfg-pulse-speed")?.value || "2.4s";

    const p1 = document.getElementById("cfg-p1-desc")?.value || activePillars[0].description;
    const p2 = document.getElementById("cfg-p2-desc")?.value || activePillars[1].description;
    const p3 = document.getElementById("cfg-p3-desc")?.value || activePillars[2].description;
    const p4 = document.getElementById("cfg-p4-desc")?.value || activePillars[3].description;

    activePillars[0].description = p1;
    activePillars[1].description = p2;
    activePillars[2].description = p3;
    activePillars[3].description = p4;
    activePillars[0].glowColor = selectedColor;

    localStorage.setItem("itrex_pillars_data", JSON.stringify(activePillars));

    // Backward-compat for existing tests
    const legacyConfig = {
        themeColor: selectedColor,
        scrubSpeed: scrub,
        pulseSpeed: pulse,
        p1Desc: p1,
        p2Desc: p2,
        p3Desc: p3,
        p4Desc: p4
    };
    localStorage.setItem("itrex_pillar_config", JSON.stringify(legacyConfig));

    renderPillarCardsFromData();
    closePillarConfigModal();
}

function resetPillarConfig() {
    playHoverTick();
    activePillars = JSON.parse(JSON.stringify(DEFAULT_PILLARS));
    localStorage.removeItem("itrex_pillars_data");
    localStorage.removeItem("itrex_pillar_config");
    renderPillarCardsFromData();
    closePillarConfigModal();
}

function loadPillarConfig() {
    try {
        const raw = localStorage.getItem("itrex_pillars_data");
        if (raw) {
            activePillars = JSON.parse(raw);
        } else {
            const legRaw = localStorage.getItem("itrex_pillar_config");
            if (legRaw) {
                const leg = JSON.parse(legRaw);
                if (leg.p1Desc) activePillars[0].description = leg.p1Desc;
                if (leg.p2Desc) activePillars[1].description = leg.p2Desc;
                if (leg.p3Desc) activePillars[2].description = leg.p3Desc;
                if (leg.p4Desc) activePillars[3].description = leg.p4Desc;
                if (leg.themeColor) activePillars[0].glowColor = leg.themeColor;
            }
        }
    } catch (e) {
        activePillars = JSON.parse(JSON.stringify(DEFAULT_PILLARS));
    }

    renderPillarCardsFromData();
}

function renderPillarCardsFromData() {
    activePillars.forEach((p, idx) => {
        const card = document.getElementById(`pillar-card-${idx}`);
        if (!card) return;

        const titleEl = card.querySelector(".pillar-card-title");
        const badgeEl = card.querySelector(".pillar-card-badge");
        const descEl = card.querySelector(".pillar-card-desc");

        if (titleEl && p.title) titleEl.textContent = p.title;
        if (badgeEl && p.badge) {
            const badgeSpan = badgeEl.querySelector("span:last-child") || badgeEl;
            badgeSpan.textContent = p.badge;
        }
        if (descEl && p.description) descEl.textContent = p.description;

        if (p.glowColor) {
            card.style.borderColor = `${p.glowColor}55`;
        }
    });
}

// ==============================================================
// 12. PRODUCT SHOWCASE: AUTO-ADVANCING CURVED/PEEK CAROUSEL ENGINE
// ==============================================================
const DEFAULT_CAROUSEL_PRODUCTS = [
    {
        id: "trexos",
        name: "TrexOS",
        category: "Kernel Architecture",
        badge: "0.35ms Latency · Ring 0 Microkernel",
        tagline: "Deterministic Neural Microkernel Architecture",
        description: "Purpose-built deterministic operating system kernel featuring sub-millisecond thread scheduling, zero-trust hardware isolation, and autonomous neural load balancing.",
        accentColor: "#00f3ff",
        link: "products.html#trexos"
    },
    {
        id: "trexcore",
        name: "TrexCore",
        category: "Cloud Fabric",
        badge: "Sub-12ms Global · 84K+ Nodes",
        tagline: "Planetary Edge Cloud Fabric & State Mesh",
        description: "Geo-distributed serverless runtime synchronizing state in sub-12ms across worldwide nodes with peer-to-peer mTLS WireGuard mesh fabric.",
        accentColor: "#ff6b00",
        link: "products.html#trexcore"
    },
    {
        id: "trexvision",
        name: "TrexVision",
        category: "Spatial Perception",
        badge: "120 FPS · WebGPU Spatial SLAM",
        tagline: "WebGPU Spatial Perception & 3D Odometry",
        description: "Next-generation 3D spatial odometry and computer vision telemetry pipeline engineered for autonomous robotics, spatial computing, and digital twin orchestration.",
        accentColor: "#8b5cf6",
        link: "products.html#trexvision"
    },
    {
        id: "trexshield",
        name: "TrexShield",
        category: "Zero-Trust SecOps",
        badge: "< 4ms Quarantine · Hardware HSM Enclave",
        tagline: "eBPF Zero-Trust Hardware Enclave & Defense",
        description: "Proactive kernel-level zero-trust security engine utilizing eBPF system call verification with sub-4ms automated threat isolation and HSM cryptographic audit attestations.",
        accentColor: "#10b981",
        link: "products.html#trexshield"
    },
    {
        id: "trexconnect",
        name: "TrexConnect",
        category: "Hyper-Transport Mesh",
        badge: "1.8M msg/sec · Sub-ms Protocol Mesh",
        tagline: "Ultra-Low Latency Multiplexed Protocol Mesh",
        description: "High-throughput binary protocol engine bridging edge robotics fleets, IoT gateways, and telemetry pipelines with zero-copy serialization and QUIC transport.",
        accentColor: "#d4af37",
        link: "products.html#trexconnect"
    }
];

let carouselCurrentIndex = 0;
let carouselTotalSlides = 5;
let carouselAutoPlayInterval = 4500;
let carouselIsPaused = false;
let carouselTimerTween = null;
let carouselProgressObj = { value: 0 };
let carouselProducts = [...DEFAULT_CAROUSEL_PRODUCTS];
let carouselInitialized = false;

function initProductCarousel() {
    if (carouselInitialized) return;
    const stage = document.getElementById("product-carousel-stage");
    const track = document.getElementById("product-carousel-track");
    if (!stage || !track) return;
    carouselInitialized = true;

    loadCarouselProductsFromStorage();

    // Event listener: Hover pauses auto-play, leaving resumes
    stage.addEventListener("mouseenter", () => {
        pauseCarouselAutoPlay();
    });
    stage.addEventListener("mouseleave", () => {
        resumeCarouselAutoPlay();
    });

    // Event listener: clicking inactive peeking slides centers them
    const slides = document.querySelectorAll(".carousel-slide");
    slides.forEach((slide, idx) => {
        slide.addEventListener("click", (e) => {
            if (!e.target.closest("a") && !e.target.closest("button") && carouselCurrentIndex !== idx) {
                goToCarouselSlide(idx);
            }
        });
    });

    // Window resize handler to maintain active slide centered
    window.addEventListener("resize", () => {
        positionCarousel(carouselCurrentIndex, false);
    });

    // Initial position & start timer
    positionCarousel(0, false);
    updatePaginationDots(0);
    startCarouselTimer();

    // Cross-tab real-time sync with Founder Dashboard
    window.addEventListener("storage", (e) => {
        if (e.key === "itrex_db_products" || e.key === "itrex_carousel_interval") {
            loadCarouselProductsFromStorage();
        }
    });

    if ('BroadcastChannel' in window) {
        try {
            const bc = new BroadcastChannel('itrex_realtime_mesh_v1');
            bc.onmessage = (event) => {
                if (event.data && event.data.collection === 'products') {
                    loadCarouselProductsFromStorage();
                }
            };
        } catch (e) {}
    }
}

function loadCarouselProductsFromStorage() {
    try {
        const raw = localStorage.getItem("itrex_db_products");
        if (raw) {
            carouselProducts = JSON.parse(raw);
        } else {
            carouselProducts = [...DEFAULT_CAROUSEL_PRODUCTS];
        }
    } catch (e) {
        carouselProducts = [...DEFAULT_CAROUSEL_PRODUCTS];
    }

    const savedInterval = localStorage.getItem("itrex_carousel_interval");
    if (savedInterval) {
        carouselAutoPlayInterval = parseInt(savedInterval, 10) || 4500;
    }

    // Update slide DOM elements with customized content
    carouselProducts.forEach((p, idx) => {
        const card = document.querySelector(`.carousel-slide[data-index="${idx}"]`);
        if (!card) return;

        const titleEl = card.querySelector(".carousel-card-title");
        const badgeEl = card.querySelector(".carousel-card-badge");
        const taglineEl = card.querySelector(".carousel-card-tagline");
        const descEl = card.querySelector(".carousel-card-desc");

        if (titleEl && p.name) titleEl.textContent = p.name;
        if (badgeEl && p.badge) badgeEl.textContent = p.badge;
        if (taglineEl && p.tagline) taglineEl.textContent = p.tagline;
        if (descEl && p.description) descEl.textContent = p.description;
    });
}

function positionCarousel(index, animate = true) {
    const stage = document.getElementById("product-carousel-stage");
    const track = document.getElementById("product-carousel-track");
    const slides = document.querySelectorAll(".carousel-slide");
    if (!stage || !track || slides.length === 0) return;

    const targetSlide = slides[index];
    if (!targetSlide) return;

    const stageWidth = stage.offsetWidth;
    const slideOffset = targetSlide.offsetLeft;
    const slideWidth = targetSlide.offsetWidth;
    const targetX = (stageWidth / 2) - (slideOffset + (slideWidth / 2));

    if (animate) {
        gsap.to(track, {
            x: targetX,
            duration: 0.75,
            ease: "power3.inOut"
        });
    } else {
        gsap.set(track, { x: targetX });
    }

    slides.forEach((slide, idx) => {
        if (idx === index) {
            slide.classList.add("carousel-card-active");
            slide.classList.remove("carousel-card-inactive");

            if (animate) {
                const animTargets = slide.querySelectorAll(".carousel-card-title, .carousel-card-tagline, .carousel-card-desc, .carousel-card-cta");
                if (animTargets.length > 0) {
                    gsap.fromTo(animTargets,
                        { y: 12, opacity: 0.2 },
                        { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" }
                    );
                }
            }
        } else {
            slide.classList.add("carousel-card-inactive");
            slide.classList.remove("carousel-card-active");
        }
    });

    // Ambient glow tint update
    const aura = document.getElementById("carousel-ambient-aura");
    const activeProd = carouselProducts[index] || DEFAULT_CAROUSEL_PRODUCTS[index];
    if (aura && activeProd) {
        gsap.to(aura, {
            backgroundColor: activeProd.accentColor || "#00f3ff",
            duration: 0.8,
            ease: "power2.out"
        });
    }
}

function updatePaginationDots(index) {
    const dots = document.querySelectorAll(".carousel-dot-btn");
    dots.forEach((dot, idx) => {
        const fill = dot.querySelector(".carousel-dot-fill");
        if (idx === index) {
            dot.className = "carousel-dot-btn w-12 h-2.5 rounded-full bg-neutral-200 dark:bg-slate-800 relative overflow-hidden transition-all duration-300";
            if (fill) fill.style.width = "0%";
        } else {
            dot.className = "carousel-dot-btn w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-slate-800 relative overflow-hidden transition-all duration-300";
            if (fill) fill.style.width = "0%";
        }
    });
}

function startCarouselTimer() {
    if (carouselTimerTween) {
        carouselTimerTween.kill();
    }

    carouselProgressObj.value = 0;
    const activeDot = document.querySelector(`.carousel-dot-btn:nth-child(${carouselCurrentIndex + 1}) .carousel-dot-fill`);
    if (activeDot) {
        activeDot.style.width = "0%";
    }

    if (carouselIsPaused) return;

    carouselTimerTween = gsap.to(carouselProgressObj, {
        value: 100,
        duration: carouselAutoPlayInterval / 1000,
        ease: "none",
        onUpdate: () => {
            if (activeDot) {
                activeDot.style.width = `${carouselProgressObj.value}%`;
            }
        },
        onComplete: () => {
            nextCarouselSlide();
        }
    });
}

function pauseCarouselAutoPlay() {
    if (carouselTimerTween && !carouselTimerTween.paused()) {
        carouselTimerTween.pause();
    }
}

function resumeCarouselAutoPlay() {
    if (!carouselIsPaused && carouselTimerTween && carouselTimerTween.paused()) {
        carouselTimerTween.resume();
    }
}

function toggleCarouselAutoPlay() {
    playHoverTick();
    carouselIsPaused = !carouselIsPaused;
    const icon = document.getElementById("carousel-play-pause-icon");
    const btn = document.getElementById("carousel-play-pause-btn");

    if (carouselIsPaused) {
        if (carouselTimerTween) carouselTimerTween.pause();
        if (icon) {
            icon.setAttribute("data-lucide", "play");
            lucide.createIcons();
        }
        if (btn) btn.setAttribute("title", "Resume Auto-Play");
    } else {
        if (icon) {
            icon.setAttribute("data-lucide", "pause");
            lucide.createIcons();
        }
        if (btn) btn.setAttribute("title", "Pause Auto-Play");
        startCarouselTimer();
    }
}

function nextCarouselSlide() {
    goToCarouselSlide((carouselCurrentIndex + 1) % carouselTotalSlides);
}

function prevCarouselSlide() {
    goToCarouselSlide((carouselCurrentIndex - 1 + carouselTotalSlides) % carouselTotalSlides);
}

function goToCarouselSlide(index) {
    playHoverTick();
    carouselCurrentIndex = index;
    positionCarousel(index, true);
    updatePaginationDots(index);
    startCarouselTimer();
}

window.initProductCarousel = initProductCarousel;
window.goToCarouselSlide = goToCarouselSlide;
window.nextCarouselSlide = nextCarouselSlide;
window.prevCarouselSlide = prevCarouselSlide;
window.toggleCarouselAutoPlay = toggleCarouselAutoPlay;
window.pauseCarouselAutoPlay = pauseCarouselAutoPlay;
window.resumeCarouselAutoPlay = resumeCarouselAutoPlay;

document.addEventListener("DOMContentLoaded", () => {
    initProductCarousel();
    initNeuralStreamEngine();
});
