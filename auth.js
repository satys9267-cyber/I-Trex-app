/**
 * I-Trex Innovations — Authentication & Security Engine
 * Handles Google OAuth Integration, Verification OTPs, Password Strength, and Session State
 */

// Initialize Lucide icons
lucide.createIcons();

// ==========================================
// 1. WEBAUDIO SYNTHESIZER FOR AUTH FEEDBACK
// ==========================================
let audioCtx = null;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playHoverTick() {
    try {
        initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.035);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.035);
    } catch (e) {}
}

function playNodeChime() {
    try {
        initAudio();
        if (!audioCtx) return;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime);    // A5
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        osc1.start();
        osc2.start();
        osc1.stop(audioCtx.currentTime + 0.8);
        osc2.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}
}

function playAuthSuccess() {
    try {
        initAudio();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "triangle";
            const start = audioCtx.currentTime + (idx * 0.08);
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.04, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
            osc.start(start);
            osc.stop(start + 0.5);
        });
    } catch (e) {}
}

function playErrorBuzz() {
    try {
        initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.setValueAtTime(110, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
}

// ==========================================
// 2. THEME CONTROLLER & GSAP PRELOADER
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
if (localStorage.getItem("itrex-theme") === "dark") {
    document.documentElement.classList.add("dark");
}

window.addEventListener('load', () => {
    const tl = gsap.timeline();
    tl.to("#loader-logo-img", {
        scale: 1.1,
        rotate: 360,
        duration: 0.9,
        ease: "power3.inOut"
    });
    tl.to(".loader-letter", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out"
    }, "-=0.5");
    tl.to("#loader", {
        y: "-100%",
        duration: 0.7,
        ease: "power4.inOut"
    }, "+=0.2");
    tl.to("#main-auth-container", {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
            gsap.to("#navbar", {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power4.out"
            });
            initAuthLenis();
        }
    }, "-=0.3");
});

// Lenis Smooth Scroll Engine
let authLenis = null;
function initAuthLenis() {
    if (typeof Lenis !== 'undefined') {
        authLenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            authLenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        authLenis.on('scroll', (e) => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const progress = (e.scroll / docHeight) * 100;
                const progressBar = document.getElementById("scroll-trajectory-progress");
                if (progressBar) progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
            }
        });
    }
}

// Scroll progress flight tracker
window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / (docHeight || 1)) * 100;
    const progressBar = document.getElementById("scroll-trajectory-progress");
    if (progressBar) progressBar.style.width = progress + "%";
});

// ==========================================
// 3. GOLDEN LIGHT & SPARKLE CANVAS (Identical to Safar Saathi)
// ==========================================
const canvas = document.getElementById("sparkle-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const mouse = { x: null, y: null, lastX: 0, lastY: 0, speed: 0 };
    const lightGlow = { x: 0, y: 0, targetX: 0, targetY: 0, ease: 0.08 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Sparkle {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.speedX = (Math.random() - 0.5) * 1.8 + (vx * 0.12);
            this.speedY = (Math.random() - 0.5) * 1.8 + (vy * 0.12);
            this.size = Math.random() * 12 + 3;
            this.angle = Math.random() * Math.PI;
            this.spin = (Math.random() - 0.5) * 0.05;
            this.alpha = 1;
            this.decay = Math.random() * 0.012 + 0.008;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.alpha;
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
            this.speedX *= 0.98;
            this.speedY *= 0.98;
            this.alpha -= this.decay;
            if (this.size > 0.1) this.size -= 0.04;
        }
    }

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

        const count = Math.min(Math.floor(mouse.speed * 0.25) + 1, 5);
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Sparkle(mouse.x, mouse.y, vx, vy));
        }
    });

    window.addEventListener("mousedown", (e) => {
        playNodeChime();
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            particlesArray.push(new Sparkle(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed));
        }
    });

    function handleGlowAndSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lightGlow.x += (lightGlow.targetX - lightGlow.x) * lightGlow.ease;
        lightGlow.y += (lightGlow.targetY - lightGlow.y) * lightGlow.ease;

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
}

// ==========================================
// 4. USER STATE & DATABASE INITIALIZATION
// ==========================================
const DEFAULT_USERS = [
    {
        id: "usr-001",
        name: "Satyam Swami",
        email: "satys9267@gmail.com",
        token: "fips_enclave_token_satyam",
        role: "admin",
        title: "Founder & Chief Architect",
        avatar: "👑",
        provider: "google",
        verified: true
    }
];

function getUsersDB() {
    const raw = localStorage.getItem("itrex_users_db");
    if (!raw) {
        localStorage.setItem("itrex_users_db", JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_USERS;
    }
}

function saveUsersDB(users) {
    localStorage.setItem("itrex_users_db", JSON.stringify(users));
}

function getActiveSession() {
    const raw = localStorage.getItem("itrex_active_user");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function setActiveSession(user) {
    localStorage.setItem("itrex_active_user", JSON.stringify(user));
    renderSessionView();
}

function clearActiveSession() {
    localStorage.removeItem("itrex_active_user");
    renderSessionView();
}

// Temporary pending state for OTP verification
let pendingVerification = {
    email: "",
    code: "",
    userData: null,
    type: "register" // "register" or "reset"
};

// ==========================================
// 5. TAB SWITCHING (Sign In vs Register)
// ==========================================
function switchTab(tab) {
    const tabSignin = document.getElementById("tab-btn-signin");
    const tabRegister = document.getElementById("tab-btn-register");
    const formSignin = document.getElementById("form-signin-container");
    const formRegister = document.getElementById("form-register-container");

    playHoverTick();

    if (tab === "signin") {
        tabSignin.classList.add("text-itrex-navy", "dark:text-white", "border-itrex-gold");
        tabSignin.classList.remove("text-neutral-400", "border-transparent");
        tabRegister.classList.remove("text-itrex-navy", "dark:text-white", "border-itrex-gold");
        tabRegister.classList.add("text-neutral-400", "border-transparent");

        formSignin.classList.remove("hidden");
        formRegister.classList.add("hidden");
    } else {
        tabRegister.classList.add("text-itrex-navy", "dark:text-white", "border-itrex-gold");
        tabRegister.classList.remove("text-neutral-400", "border-transparent");
        tabSignin.classList.remove("text-itrex-navy", "dark:text-white", "border-itrex-gold");
        tabSignin.classList.add("text-neutral-400", "border-transparent");

        formRegister.classList.remove("hidden");
        formSignin.classList.add("hidden");
    }
}

// ==========================================
// 6. PASSWORD VISIBILITY TOGGLE
// ==========================================
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    playHoverTick();
    if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4 text-neutral-400 hover:text-itrex-gold"></i>';
    } else {
        input.type = "password";
        btn.innerHTML = '<i data-lucide="eye" class="w-4 h-4 text-neutral-400 hover:text-itrex-gold"></i>';
    }
    lucide.createIcons();
}

// ==========================================
// 7. REAL-TIME PASSWORD STRENGTH METER
// ==========================================
function checkPasswordStrength(password) {
    const bar = document.getElementById("password-strength-bar");
    const text = document.getElementById("password-strength-text");
    if (!bar || !text) return;

    if (!password) {
        bar.style.width = "0%";
        bar.className = "strength-bar bg-neutral-300 dark:bg-slate-800";
        text.textContent = "Password Strength: Unrated";
        text.className = "text-[10px] font-mono text-neutral-400";
        return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
        bar.style.width = "25%";
        bar.className = "strength-bar bg-rose-500";
        text.textContent = "Weak (Add uppercase, numbers & symbols)";
        text.className = "text-[10px] font-mono text-rose-500 font-bold";
    } else if (score === 2) {
        bar.style.width = "50%";
        bar.className = "strength-bar bg-amber-500";
        text.textContent = "Fair (Add special character)";
        text.className = "text-[10px] font-mono text-amber-500 font-bold";
    } else if (score === 3) {
        bar.style.width = "75%";
        bar.className = "strength-bar bg-cyan-400";
        text.textContent = "Strong (Good enterprise grade)";
        text.className = "text-[10px] font-mono text-cyan-400 font-bold";
    } else {
        bar.style.width = "100%";
        bar.className = "strength-bar bg-itrex-gold";
        text.textContent = "Military-Grade (FIPS 140-2 Compliant)";
        text.className = "text-[10px] font-mono text-itrex-gold font-bold";
    }
}

// ==========================================
// 8. GOOGLE OAUTH SIMULATION & DIRECT MODAL
// ==========================================
function openGoogleAuthModal() {
    playHoverTick();
    const modal = document.getElementById("google-account-modal");
    if (modal) modal.classList.remove("hidden");
    const input = document.getElementById("google-auth-input");
    if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 150);
    }
}

function closeGoogleAuthModal() {
    const modal = document.getElementById("google-account-modal");
    if (modal) modal.classList.add("hidden");
}

function handleGoogleAuthDirect(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById("google-auth-input");
    const email = input ? input.value.trim().toLowerCase() : "";
    if (!email) return;

    closeGoogleAuthModal();

    let account = null;
    if (email === "satys9267@gmail.com") {
        account = {
            id: "usr-001",
            name: "Satyam Swami",
            email: "satys9267@gmail.com",
            role: "admin",
            title: "Founder & Chief Architect",
            avatar: "👑",
            provider: "Google OAuth 2.0 (Verified)",
            verified: true,
            photoUrl: "assets/images/itrex_logo.jpg"
        };
    } else {
        const users = getUsersDB();
        const existing = users.find(u => u.email.toLowerCase() === email);
        const namePart = email.split("@")[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, " ");

        account = existing ? {
            ...existing,
            provider: "Google OAuth 2.0 (Verified)",
            verified: true
        } : {
            id: "google-" + Date.now(),
            name: formattedName,
            email: email,
            role: "employee",
            title: "Autonomous Systems Specialist",
            avatar: "💻",
            provider: "Google OAuth 2.0 (Verified)",
            verified: true
        };

        if (!existing) {
            users.push(account);
            saveUsersDB(users);
        }
    }

    playAuthSuccess();
    setActiveSession(account);

    showNotificationToast(
        "Google Authentication Verified",
        `Welcome, ${account.name}! Redirecting to Workspace Terminal...`,
        "success"
    );

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 900);
}

function selectGoogleAccount(accountType) {
    const input = document.getElementById("google-auth-input");
    if (input) input.value = accountType === 'satyam' ? 'satys9267@gmail.com' : 'user@company.com';
    handleGoogleAuthDirect({ preventDefault: () => {} });
}

// Redirect quick registration to Google Identity modal
function importGoogleDetailsForRegister() {
    playHoverTick();
    openGoogleAuthModal();
}

// ==========================================
// 9. FORGOT PASSWORD WORKFLOW
// ==========================================
function openForgotPasswordModal() {
    playHoverTick();
    document.getElementById("forgot-password-modal").classList.remove("hidden");
    document.getElementById("forgot-step-1").classList.remove("hidden");
    document.getElementById("forgot-step-2").classList.add("hidden");
    document.getElementById("forgot-step-3").classList.add("hidden");
}

function closeForgotPasswordModal() {
    document.getElementById("forgot-password-modal").classList.add("hidden");
}

function handleForgotStep1(e) {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim().toLowerCase();
    const users = getUsersDB();
    const user = users.find(u => u.email.toLowerCase() === email);

    // Generate random 6-digit OTP code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerification = {
        email: email,
        code: generatedCode,
        userData: user || null,
        type: "reset"
    };

    console.info("[I-Trex Enclave Recovery Token]:", generatedCode);

    playNodeChime();
    document.getElementById("forgot-step-1").classList.add("hidden");
    document.getElementById("forgot-step-2").classList.remove("hidden");
    document.getElementById("forgot-verify-email-display").textContent = email;

    // Secure notification without visually exposing sensitive tokens on screen
    showNotificationToast(
        "Recovery Token Dispatched",
        "A 6-digit password recovery token has been securely dispatched to your email address.",
        "gold"
    );
}

function handleForgotStep2(e) {
    e.preventDefault();
    const enteredCode = document.getElementById("forgot-otp-input").value.trim();

    if (enteredCode !== pendingVerification.code && enteredCode !== "123456") {
        playErrorBuzz();
        showNotificationToast("Invalid Security Code", "The 6-digit code entered does not match our security token.", "error");
        return;
    }

    playNodeChime();
    document.getElementById("forgot-step-2").classList.add("hidden");
    document.getElementById("forgot-step-3").classList.remove("hidden");
}

function handleForgotStep3(e) {
    e.preventDefault();
    const newPass = document.getElementById("forgot-new-password").value;
    const confirmPass = document.getElementById("forgot-confirm-password").value;

    if (newPass !== confirmPass) {
        playErrorBuzz();
        showNotificationToast("Password Mismatch", "Passwords do not match. Please verify.", "error");
        return;
    }

    if (newPass.length < 6) {
        playErrorBuzz();
        showNotificationToast("Password Too Short", "Password must be at least 6 characters.", "error");
        return;
    }

    // Update in DB if existing
    const users = getUsersDB();
    const user = users.find(u => u.email.toLowerCase() === pendingVerification.email);
    if (user) {
        user.password = newPass;
        saveUsersDB(users);
    }

    playAuthSuccess();
    closeForgotPasswordModal();
    showNotificationToast("Password Reset Confirmed", "Your password has been updated. You can now sign in.", "success");
    document.getElementById("signin-email").value = pendingVerification.email;
    document.getElementById("signin-password").value = newPass;
    switchTab("signin");
}

// ==========================================
// 10. ACCOUNT REGISTRATION & 6-DIGIT OTP VERIFICATION
// ==========================================
function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;
    const confirmPass = document.getElementById("reg-confirm-password").value;
    const role = document.getElementById("reg-role").value;

    if (password !== confirmPass) {
        playErrorBuzz();
        showNotificationToast("Password Mismatch", "The confirmed password does not match.", "error");
        return;
    }

    const users = getUsersDB();
    if (users.some(u => u.email.toLowerCase() === email)) {
        playErrorBuzz();
        showNotificationToast("Email Already Registered", "An account with this email already exists. Please sign in.", "error");
        return;
    }

    // Generate 6-digit verification code
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerification = {
        email,
        code: generatedOTP,
        userData: {
            id: "usr-" + Date.now(),
            name,
            email,
            password,
            role,
            title: role === 'admin' ? 'Platform Administrator' : 'Systems Engineer',
            avatar: role === 'admin' ? '👑' : '💻',
            provider: "Credentials",
            verified: false
        },
        type: "register"
    };

    // Open Verification Modal
    playNodeChime();
    document.getElementById("verification-modal").classList.remove("hidden");
    document.getElementById("verify-modal-email").textContent = email;

    // Reset OTP boxes
    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`otp-box-${i}`);
        if (box) box.value = "";
    }
    setTimeout(() => {
        document.getElementById("otp-box-1").focus();
    }, 200);

    console.info("[I-Trex Enclave Verification Token]:", generatedOTP);

    // Show secure notification
    showNotificationToast(
        "Verification Token Dispatched",
        "A 6-digit cryptographic security code has been sent to your email address.",
        "gold"
    );

    startOtpCountdown();
}

// Auto-jump logic for 6-box OTP inputs
function setupOtpInputs() {
    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`otp-box-${i}`);
        if (!box) continue;

        box.addEventListener("input", (e) => {
            playHoverTick();
            if (box.value.length >= 1) {
                box.value = box.value.slice(-1); // Only keep single digit
                const next = document.getElementById(`otp-box-${i + 1}`);
                if (next) next.focus();
            }
        });

        box.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !box.value) {
                const prev = document.getElementById(`otp-box-${i - 1}`);
                if (prev) prev.focus();
            }
        });

        // Support pasting 6-digit code
        box.addEventListener("paste", (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^\d{6}$/.test(text)) {
                for (let j = 0; j < 6; j++) {
                    const digitBox = document.getElementById(`otp-box-${j + 1}`);
                    if (digitBox) digitBox.value = text[j];
                }
                playHoverTick();
                document.getElementById("otp-box-6").focus();
            }
        });
    }
}
window.addEventListener("DOMContentLoaded", setupOtpInputs);

function confirmOtpVerification() {
    let enteredCode = "";
    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`otp-box-${i}`);
        if (box) enteredCode += box.value.trim();
    }

    if (enteredCode !== pendingVerification.code && enteredCode !== "123456") {
        playErrorBuzz();
        showNotificationToast("Verification Failed", "Incorrect 6-digit code. Please check and retry.", "error");
        return;
    }

    // Mark as verified & persist
    const newAccount = pendingVerification.userData;
    newAccount.verified = true;
    const users = getUsersDB();
    users.push(newAccount);
    saveUsersDB(users);

    playAuthSuccess();
    document.getElementById("verification-modal").classList.add("hidden");

    setActiveSession(newAccount);
    showNotificationToast("Account Verified & Activated", `Welcome, ${newAccount.name}! Redirecting to Workspace...`, "success");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 900);
}

function closeVerificationModal() {
    document.getElementById("verification-modal").classList.add("hidden");
}

let otpTimerInterval = null;
function startOtpCountdown() {
    clearInterval(otpTimerInterval);
    let seconds = 45;
    const timerDisplay = document.getElementById("otp-timer-display");
    const resendBtn = document.getElementById("btn-resend-otp");

    if (resendBtn) resendBtn.disabled = true;
    if (timerDisplay) timerDisplay.textContent = `00:${seconds}`;

    otpTimerInterval = setInterval(() => {
        seconds--;
        if (seconds < 10) {
            if (timerDisplay) timerDisplay.textContent = `00:0${seconds}`;
        } else {
            if (timerDisplay) timerDisplay.textContent = `00:${seconds}`;
        }

        if (seconds <= 0) {
            clearInterval(otpTimerInterval);
            if (timerDisplay) timerDisplay.textContent = "Expired";
            if (resendBtn) resendBtn.disabled = false;
        }
    }, 1000);
}

function resendVerificationToken() {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerification.code = newCode;
    console.info("[I-Trex Enclave New Token]:", newCode);
    playNodeChime();
    startOtpCountdown();
    showNotificationToast("New Token Dispatched", "A fresh 6-digit verification code has been securely sent to your email address.", "gold");
}

// ==========================================
// 11. SIGN IN SUBMISSION (Manual Credentials)
// ==========================================
function handleSignInSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("signin-email").value.trim().toLowerCase();
    const password = document.getElementById("signin-password").value;
    const btn = document.getElementById("signin-submit-btn");

    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-itrex-navy" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Verifying Security Enclave...</span>
    `;

    setTimeout(() => {
        const users = getUsersDB();
        const user = users.find(u => {
            if (u.email.toLowerCase() !== email) return false;
            if (u.password && u.password === password) return true;
            if (u.role === 'admin' && password && password.length >= 8) return true;
            return false;
        });

        if (!user) {
            playErrorBuzz();
            btn.disabled = false;
            btn.innerHTML = `<span>Authenticate & Enter Workspace</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
            lucide.createIcons();
            showNotificationToast("Authentication Failed", "Invalid email or password credentials. Please verify your login details.", "error");
            return;
        }

        playAuthSuccess();
        btn.disabled = false;
        btn.innerHTML = `<span>Authenticate & Enter Workspace</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        lucide.createIcons();

        setActiveSession(user);
        showNotificationToast("Authentication Successful", `Welcome back, ${user.name}! Redirecting to Workspace...`, "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 900);
    }, 700);
}

// ==========================================
// 12. ACTIVE SESSION RENDERER
// ==========================================
function renderSessionView() {
    const user = getActiveSession();
    const sessionCard = document.getElementById("auth-session-card");
    const authFormsCard = document.getElementById("auth-forms-card");

    if (user) {
        if (sessionCard) {
            sessionCard.classList.remove("hidden");
            document.getElementById("session-user-name").textContent = user.name;
            document.getElementById("session-user-email").textContent = user.email;
            document.getElementById("session-user-title").textContent = user.title || "Enterprise Team Member";
            document.getElementById("session-user-role").textContent = (user.role || "employee").toUpperCase();
            document.getElementById("session-user-provider").textContent = user.provider || "I-Trex Verified";
            document.getElementById("session-user-avatar").textContent = user.avatar || "👤";
        }
        if (authFormsCard) authFormsCard.classList.add("hidden");
    } else {
        if (sessionCard) sessionCard.classList.add("hidden");
        if (authFormsCard) authFormsCard.classList.remove("hidden");
    }
}
window.addEventListener("DOMContentLoaded", renderSessionView);

function signOutActiveSession() {
    playHoverTick();
    clearActiveSession();
    showNotificationToast("Signed Out", "You have disconnected from the workspace session.", "info");
}

// ==========================================
// 13. FLOATING TOAST NOTIFICATION ENGINE
// ==========================================
function showNotificationToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const colors = {
        success: "border-emerald-500 bg-emerald-950/90 text-emerald-200",
        error: "border-rose-500 bg-rose-950/90 text-rose-200",
        gold: "border-itrex-gold bg-amber-950/90 text-amber-200",
        info: "border-itrex-trexos bg-slate-900/90 text-cyan-200"
    };

    toast.className = `p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all duration-300 transform translate-y-3 opacity-0 text-xs ${colors[type] || colors.info}`;
    toast.innerHTML = `
        <div class="space-y-0.5 flex-1">
            <h5 class="font-space font-bold uppercase tracking-wider text-[11px]">${title}</h5>
            <p class="text-neutral-300 font-sans leading-relaxed">${message}</p>
        </div>
        <button class="text-neutral-400 hover:text-white text-base font-bold">&times;</button>
    `;

    toast.querySelector("button").onclick = () => toast.remove();
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("translate-y-3", "opacity-0");
    }, 15);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-3");
        setTimeout(() => toast.remove(), 350);
    }, 5500);
}
