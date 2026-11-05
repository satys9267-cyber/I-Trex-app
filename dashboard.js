/**
 * I-Trex Innovations — Workspace Dashboard & Real-Time Controller
 * Powers Kanban execution, shift timer, user profile mutations, and live cross-tab sync
 */

// Initialize Lucide icons
lucide.createIcons();

// ==========================================
// 1. WEBAUDIO SYNTHESIZER
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

function playTaskSuccess() {
    try {
        initAudio();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99]; // C Major
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "triangle";
            const start = audioCtx.currentTime + (idx * 0.07);
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.03, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
            osc.start(start);
            osc.stop(start + 0.4);
        });
    } catch (e) {}
}

// ==========================================
// 2. AUTHENTICATION GUARD & USER BINDING
// ==========================================
let currentUser = null;

function checkAuthAndInitUser() {
    const raw = localStorage.getItem("itrex_active_user");
    if (!raw) {
        // Default to Founder session if opened directly for preview
        const defaultUser = {
            id: 'usr-001',
            name: 'Satyam Swami',
            email: 'satys9267@gmail.com',
            role: 'admin',
            title: 'Founder & Chief Architect',
            department: 'Executive Systems & Kernel',
            avatar: '👑',
            phone: '+91 74998 25344',
            bio: 'Founding visionary of I-Trex Innovations. Leading autonomous neural kernels, distributed edge architecture, and enterprise zero-trust systems.',
            provider: 'Google OAuth (Verified)',
            verified: true,
            totalShiftHours: '142.5'
        };
        localStorage.setItem("itrex_active_user", JSON.stringify(defaultUser));
        currentUser = defaultUser;
    } else {
        try {
            currentUser = JSON.parse(raw);
        } catch (e) {
            currentUser = { id: 'usr-001', name: 'Satyam Swami', role: 'admin' };
        }
    }

    // Bind User Info across the dashboard
    const navUsername = document.getElementById("nav-username");
    const navUserrole = document.getElementById("nav-userrole");
    const navAvatar = document.getElementById("nav-avatar");
    const dashGreeting = document.getElementById("dash-greeting-text");
    const dashRoleBadge = document.getElementById("dash-role-badge");
    const dashUserHeadline = document.getElementById("dash-user-headline");
    const dashTotalHours = document.getElementById("dash-total-hours");

    if (navUsername) navUsername.textContent = currentUser.name;
    if (navUserrole) navUserrole.textContent = (currentUser.role || "EMPLOYEE").toUpperCase();
    if (navAvatar) navAvatar.textContent = currentUser.avatar || "👤";

    // Time-aware greeting
    const hour = new Date().getHours();
    let timeGreeting = "Good Evening";
    if (hour < 12) timeGreeting = "Good Morning";
    else if (hour < 17) timeGreeting = "Good Afternoon";

    if (dashGreeting) dashGreeting.textContent = `${timeGreeting}, ${currentUser.name}!`;
    if (dashRoleBadge) {
        dashRoleBadge.textContent = (currentUser.role || "EMPLOYEE").toUpperCase();
        dashRoleBadge.className = currentUser.role === 'admin' 
            ? "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-itrex-gold/10 text-itrex-gold border border-itrex-gold/30"
            : "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30";
    }

    if (dashUserHeadline) {
        dashUserHeadline.textContent = `${currentUser.title || 'Systems Engineer'} · ${currentUser.department || 'Autonomous Platforms'}`;
    }

    if (dashTotalHours) {
        dashTotalHours.textContent = `${currentUser.totalShiftHours || '0.0'} h`;
    }

    // Prepopulate Profile Editor fields
    document.getElementById("edit-user-name").value = currentUser.name || "";
    document.getElementById("edit-user-email").value = currentUser.email || "";
    document.getElementById("edit-user-title").value = currentUser.title || "";
    document.getElementById("edit-user-dept").value = currentUser.department || "";
    document.getElementById("edit-user-phone").value = currentUser.phone || "";
    document.getElementById("edit-user-provider").value = currentUser.provider || "Enterprise Security Token";
    document.getElementById("edit-user-bio").value = currentUser.bio || "";
}

// ==========================================
// 3. THEME CONTROLLER & PRELOADER
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
    checkAuthAndInitUser();

    const tl = gsap.timeline();
    tl.to("#loader-logo-img", {
        scale: 1.1,
        rotate: 360,
        duration: 0.8,
        ease: "power3.inOut"
    });
    tl.to(".loader-letter", {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.4,
        ease: "power2.out"
    }, "-=0.4");
    tl.to("#loader", {
        y: "-100%",
        duration: 0.6,
        ease: "power4.inOut"
    }, "+=0.2");

    initDashLenis();
    checkDatabaseStatus();
    setInterval(checkDatabaseStatus, 25000);
    refreshTransmissionsAndNotifications();
    setInterval(refreshTransmissionsAndNotifications, 15000);
});

// Lenis Smooth Scroll Engine
let dashLenis = null;
function initDashLenis() {
    if (typeof Lenis !== 'undefined') {
        dashLenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time) {
            dashLenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        dashLenis.on('scroll', (e) => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const progress = (e.scroll / docHeight) * 100;
                const bar = document.getElementById("scroll-trajectory-progress");
                if (bar) bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
            }
        });
    }
}

// Scroll progress bar
window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / (docHeight || 1)) * 100;
    const bar = document.getElementById("scroll-trajectory-progress");
    if (bar) bar.style.width = progress + "%";
});

// Digital Clock
setInterval(() => {
    const clockEl = document.getElementById("dash-clock");
    if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}, 1000);

// ==========================================
// 4. GOLDEN LIGHT & SPARKLE CANVAS
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
            this.size = Math.random() * 11 + 3;
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

        const count = Math.min(Math.floor(mouse.speed * 0.25) + 1, 4);
        for (let i = 0; i < count; i++) {
            particlesArray.push(new Sparkle(mouse.x, mouse.y, vx, vy));
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
// 5. REAL-TIME KANBAN EXECUTION BOARD
// ==========================================
const priorityStyles = {
    'Critical': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'High': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    'Medium': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'Low': 'bg-neutral-100 dark:bg-slate-800 text-neutral-400 border-neutral-300 dark:border-slate-700'
};

function renderKanban(tasks) {
    const statuses = ['todo', 'in_progress', 'review', 'completed'];

    statuses.forEach(status => {
        const container = document.getElementById(`kanban-col-${status}`);
        const countBadge = document.getElementById(`count-${status}`);
        if (!container) return;

        const filtered = tasks.filter(t => t.status === status);
        if (countBadge) countBadge.textContent = filtered.length;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="h-full min-h-[120px] rounded-2xl border border-dashed border-itrex-border dark:border-slate-800 flex items-center justify-center text-[11px] font-mono text-neutral-400">
                    No active deliverables
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(task => {
            const priorityClass = priorityStyles[task.priority] || priorityStyles['Medium'];
            return `
                <div class="bg-itrex-neutralLight dark:bg-slate-950 border border-itrex-border dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-itrex-gold transition-all duration-300 space-y-3 group" data-task-id="${task.id}">
                    <div class="flex items-center justify-between text-[10px] font-mono">
                        <span class="px-2 py-0.5 rounded-full border ${priorityClass} font-bold uppercase">
                            ${task.priority}
                        </span>
                        <span class="text-neutral-400">${task.category || 'Core'}</span>
                    </div>

                    <div>
                        <h4 class="font-space font-bold text-sm text-itrex-navy dark:text-white leading-snug group-hover:text-itrex-gold transition-colors">
                            ${task.title}
                        </h4>
                        ${task.description ? `<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">${task.description}</p>` : ''}
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-itrex-border dark:border-slate-800/80 text-[11px]">
                        <div class="flex items-center space-x-1.5 text-neutral-400 font-mono text-[10px]">
                            <i data-lucide="clock" class="w-3 h-3"></i>
                            <span>Due ${task.dueDate || 'Soon'}</span>
                        </div>

                        <div class="flex items-center space-x-1.5">
                            <button onclick="cycleTaskStatus('${task.id}', '${task.status}')" class="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-itrex-border dark:border-slate-800 text-[10px] font-mono text-itrex-gold hover:bg-itrex-gold hover:text-black transition-colors" title="Advance to next sprint stage">
                                Cycle →
                            </button>
                            <button onclick="deleteTaskRecord('${task.id}')" class="p-1 text-neutral-400 hover:text-rose-500 transition-colors" title="Archive task">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    });

    lucide.createIcons();
}

// Subscribe to real-time database tasks
window.itrexDB.subscribe('tasks', renderKanban);

function cycleTaskStatus(taskId, currentStatus) {
    playHoverTick();
    const sequence = ['todo', 'in_progress', 'review', 'completed'];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];

    window.itrexDB.updateTask(taskId, { status: nextStatus });
    if (nextStatus === 'completed') {
        playTaskSuccess();
    }
}

function deleteTaskRecord(taskId) {
    if (confirm("Are you sure you want to archive this task deliverable?")) {
        playHoverTick();
        window.itrexDB.deleteTask(taskId);
        showDashboardToast("Task Archived", "The task has been removed from active sprint pipeline.", "info");
    }
}

// Modal handling
function openNewTaskModal() {
    playHoverTick();
    document.getElementById("modal-new-task").classList.remove("hidden");
    document.getElementById("task-title").focus();
}

function closeNewTaskModal() {
    document.getElementById("modal-new-task").classList.add("hidden");
}

function handleCreateTask(e) {
    e.preventDefault();
    const title = document.getElementById("task-title").value.trim();
    const priority = document.getElementById("task-priority").value;
    const category = document.getElementById("task-category").value;
    const dueDate = document.getElementById("task-due-date").value;
    const description = document.getElementById("task-desc").value.trim();

    if (!title) return;

    window.itrexDB.addTask({
        title,
        priority,
        category,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        description,
        assignedTo: currentUser.id,
        assigneeName: currentUser.name,
        status: 'todo'
    });

    playNodeChime();
    closeNewTaskModal();
    document.getElementById("form-add-task").reset();
    showDashboardToast("Sprint Task Committed", `"${title}" has been saved and broadcasted.`, "success");
}

// ==========================================
// 6. INTERACTIVE SHIFT / PRODUCTIVITY STOPWATCH
// ==========================================
let stopwatchInterval = null;
let stopwatchSeconds = 0;
let isStopwatchRunning = false;

function toggleShiftStopwatch() {
    playHoverTick();
    const btn = document.getElementById("btn-toggle-shift");
    const statusTag = document.getElementById("shift-status-tag");
    const btnText = document.getElementById("shift-btn-text");

    if (isStopwatchRunning) {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        btnText.textContent = "Resume Session";
        statusTag.textContent = "Paused";
        statusTag.className = "text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30";
    } else {
        isStopwatchRunning = true;
        btnText.textContent = "Pause Session";
        statusTag.textContent = "Tracking (Live)";
        statusTag.className = "text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold";

        stopwatchInterval = setInterval(() => {
            stopwatchSeconds++;
            renderStopwatchDisplay();
        }, 1000);
    }
}

function resetShiftStopwatch() {
    playHoverTick();
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
    stopwatchSeconds = 0;
    renderStopwatchDisplay();
    document.getElementById("shift-btn-text").textContent = "Start Working Session";
    const statusTag = document.getElementById("shift-status-tag");
    statusTag.textContent = "Standby";
    statusTag.className = "text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-neutral-400";
}

function renderStopwatchDisplay() {
    const hrs = String(Math.floor(stopwatchSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((stopwatchSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(stopwatchSeconds % 60).padStart(2, '0');
    document.getElementById("stopwatch-display").textContent = `${hrs}:${mins}:${secs}`;
}

function saveAndLogShift() {
    if (stopwatchSeconds < 5) {
        showDashboardToast("Minimum Time Needed", "Active session must be at least 5 seconds before committing.", "error");
        return;
    }

    const hrs = Math.floor(stopwatchSeconds / 3600);
    const mins = Math.floor((stopwatchSeconds % 3600) / 60);
    const formatted = `${hrs}h ${mins}m`;

    window.itrexDB.logShift({
        userId: currentUser.id,
        userName: currentUser.name,
        durationSeconds: stopwatchSeconds,
        durationFormatted: formatted
    });

    // Update user's aggregate total hours
    const currentTotal = parseFloat(currentUser.totalShiftHours || 0);
    const addedHours = (stopwatchSeconds / 3600);
    currentUser.totalShiftHours = (currentTotal + addedHours).toFixed(1);
    window.itrexDB.saveUser(currentUser);
    localStorage.setItem("itrex_active_user", JSON.stringify(currentUser));
    document.getElementById("dash-total-hours").textContent = `${currentUser.totalShiftHours} h`;

    playTaskSuccess();
    resetShiftStopwatch();
    showDashboardToast("Shift Committed", `Logged ${formatted} to your user database record.`, "success");
}

function renderShifts(shifts) {
    const container = document.getElementById("shift-logs-container");
    if (!container) return;

    if (shifts.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-xs font-mono text-neutral-400 italic">No shift sessions logged yet today.</div>`;
        return;
    }

    container.innerHTML = shifts.slice(0, 5).map(s => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-itrex-neutralLight dark:bg-slate-950 border border-itrex-border dark:border-slate-800 text-xs">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold">
                    ⏱
                </div>
                <div>
                    <span class="font-bold text-itrex-navy dark:text-white block">${s.userName}</span>
                    <span class="text-[10px] font-mono text-neutral-400">${s.date}</span>
                </div>
            </div>
            <span class="font-mono font-bold text-itrex-gold bg-itrex-gold/10 px-2 py-1 rounded">
                ${s.durationFormatted}
            </span>
        </div>
    `).join('');
}
window.itrexDB.subscribe('shifts', renderShifts);

// ==========================================
// 7. REAL-TIME COLLABORATIVE SCRATCHPAD
// ==========================================
function renderNotes(notes) {
    const container = document.getElementById("scratchpad-list");
    if (!container) return;

    if (notes.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-xs font-mono text-neutral-400 italic">No scratchpad entries yet. Post your first technical update above!</div>`;
        return;
    }

    container.innerHTML = notes.map(n => `
        <div class="p-3.5 rounded-2xl bg-itrex-neutralLight dark:bg-slate-950 border border-itrex-border dark:border-slate-800 space-y-1.5 transition-all">
            <div class="flex items-center justify-between text-[10px] font-mono">
                <div class="flex items-center space-x-2">
                    <span>${n.authorAvatar || '👤'}</span>
                    <span class="font-bold text-itrex-navy dark:text-white">${n.author}</span>
                    <span class="text-itrex-gold px-1.5 py-0.2 rounded bg-itrex-gold/10">${n.category}</span>
                </div>
                <span class="text-neutral-400">${n.timestamp}</span>
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">${n.text}</p>
        </div>
    `).join('');
}
window.itrexDB.subscribe('notes', renderNotes);

function handlePostNote(e) {
    e.preventDefault();
    const textInput = document.getElementById("scratchpad-text");
    const catInput = document.getElementById("scratchpad-cat");
    const text = textInput.value.trim();
    if (!text) return;

    window.itrexDB.addNote({
        author: currentUser.name,
        authorAvatar: currentUser.avatar || '👤',
        text,
        category: catInput.value
    });

    playHoverTick();
    textInput.value = "";
    showDashboardToast("Broadcast Transmitted", "Note broadcasted in real-time to active terminals.", "info");
}

function focusScratchpad() {
    playHoverTick();
    const input = document.getElementById("scratchpad-text");
    if (input) {
        input.scrollIntoView({ behavior: 'smooth' });
        input.focus();
    }
}

// ==========================================
// 8. LIVE AUDIT ACTIVITY FEED
// ==========================================
function renderActivityLogs(logs) {
    const container = document.getElementById("activity-feed-list");
    if (!container) return;

    const levelClasses = {
        'SUCCESS': 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
        'WARNING': 'bg-amber-950/60 border-amber-500/40 text-amber-300',
        'INFO': 'bg-slate-950/80 border-slate-800 text-neutral-300'
    };

    container.innerHTML = logs.slice(0, 10).map(l => `
        <div class="p-3 rounded-xl border text-xs font-mono space-y-1 ${levelClasses[l.level] || levelClasses.INFO}">
            <div class="flex items-center justify-between">
                <span class="font-bold text-[10px] uppercase text-itrex-gold">${l.action}</span>
                <span class="text-[9px] text-neutral-400">${l.time}</span>
            </div>
            <p class="text-[11px] leading-snug">${l.details}</p>
            <span class="text-[9px] text-neutral-400 block">Operator: ${l.user}</span>
        </div>
    `).join('');
}
window.itrexDB.subscribe('activity_logs', renderActivityLogs);

// ==========================================
// 8.1 NOTIFICATION CENTER & LIVE UPDATES
// ==========================================
let isNotifOpen = false;

function toggleNotificationDropdown() {
    playHoverTick();
    const dropdown = document.getElementById("notif-dropdown");
    if (!dropdown) return;
    isNotifOpen = !isNotifOpen;
    if (isNotifOpen) {
        dropdown.classList.remove("hidden");
        const notifs = window.itrexDB ? window.itrexDB.getNotifications() : [];
        renderNotifications(notifs);
    } else {
        dropdown.classList.add("hidden");
    }
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("notif-dropdown");
    const bellBtn = document.getElementById("notif-bell-btn");
    if (dropdown && bellBtn && !dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.classList.add("hidden");
        isNotifOpen = false;
    }
});

function renderNotifications(notifs = []) {
    const list = document.getElementById("notif-list");
    const badge = document.getElementById("notif-badge");
    const pill = document.getElementById("notif-count-pill");
    if (!list) return;

    const unread = notifs.filter(n => !n.is_read);
    const unreadCount = unread.length;

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? "9+" : unreadCount;
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    }

    if (pill) {
        pill.textContent = `${unreadCount} New`;
    }

    if (!notifs || notifs.length === 0) {
        list.innerHTML = `<div class="text-center py-6 text-neutral-400 text-xs font-mono">No notifications logged yet</div>`;
        return;
    }

    list.innerHTML = notifs.slice(0, 15).map(n => {
        const timeAgo = formatTimeAgo(n.created_at || n.time);
        const isUnread = !n.is_read;

        return `
            <div onclick="handleNotificationClick('${n.id}')" class="p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isUnread 
                    ? 'bg-itrex-gold/10 border-itrex-gold/40 text-neutral-900 dark:text-neutral-100' 
                    : 'bg-neutral-50 dark:bg-slate-950/60 border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-neutral-400 opacity-80'
            }">
                <div class="flex items-start justify-between gap-2">
                    <span class="font-bold text-[11px] leading-tight flex items-center gap-1.5">
                        ${isUnread ? '<span class="w-1.5 h-1.5 rounded-full bg-itrex-gold inline-block"></span>' : ''}
                        ${n.title || 'System Update'}
                    </span>
                    <span class="text-[9px] font-mono text-neutral-400 shrink-0">${timeAgo}</span>
                </div>
                <p class="text-[10px] mt-1 line-clamp-2 leading-relaxed">${n.message || ''}</p>
            </div>
        `;
    }).join('');
}

function handleNotificationClick(id) {
    if (window.itrexDB) {
        const notifs = window.itrexDB.getNotifications();
        const clicked = notifs.find(n => n.id === id);
        window.itrexDB.markNotificationAsRead(id);
        const updated = window.itrexDB.getNotifications((typeof currentUser !== 'undefined' && currentUser) ? currentUser.id : 'all');
        renderNotifications(updated);
        if (clicked && clicked.link) {
            window.location.href = clicked.link;
        }
    }
}

// 8.2 LIVE TRANSMISSIONS & CLOUD NOTIFICATIONS REFRESH ENGINE
async function refreshTransmissionsAndNotifications() {
    try {
        const currentUid = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.id : 'all';
        if (window.itrexDB && typeof window.itrexDB.syncCloudNotifications === 'function') {
            const notifs = await window.itrexDB.syncCloudNotifications(currentUid);
            renderNotifications(notifs);
        }

        // Fetch transmission count for topbar badge
        let unreadCount = 0;
        try {
            const localBuffer = JSON.parse(localStorage.getItem('itrex_inquiries_buffer') || '[]');
            unreadCount += localBuffer.filter(i => (i.status || 'unread') === 'unread').length;
        } catch (_) {}

        try {
            const res = await fetch('/api/connections');
            if (res.ok) {
                const conns = await res.json();
                if (Array.isArray(conns)) {
                    const serverUnread = conns.filter(c => (c.status || 'unread') === 'unread').length;
                    unreadCount = Math.max(unreadCount, serverUnread);
                }
            }
        } catch (_) {}

        const badge = document.getElementById('dashboard-transmissions-badge');
        if (badge) {
            badge.textContent = unreadCount;
            if (unreadCount > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    } catch (e) {
        console.warn('[I-Trex Dashboard] Live transmission refresh warning:', e);
    }
}

function handleMarkAllNotificationsRead() {
    playHoverTick();
    if (window.itrexDB) {
        const userId = currentUser ? currentUser.id : null;
        window.itrexDB.markAllNotificationsAsRead(userId);
        const notifs = window.itrexDB.getNotifications();
        renderNotifications(notifs);
        showDashboardToast("Notifications Cleared", "All notifications marked as read.", "info");
    }
}

function formatTimeAgo(timeStr) {
    if (!timeStr) return 'just now';
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return timeStr;
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
}

if (window.itrexDB) {
    window.itrexDB.subscribe('notifications', renderNotifications);
}

// ==========================================
// 8.2 CHANGE LOGS FEED & AUDIT SWITCHER
// ==========================================
let currentAuditTab = 'activity';

function switchAuditTab(tab) {
    playHoverTick();
    currentAuditTab = tab;
    const btnAudit = document.getElementById("btn-feed-audit");
    const btnChangeLogs = document.getElementById("btn-feed-changelogs");
    const actList = document.getElementById("activity-feed-list");
    const clList = document.getElementById("changelog-feed-list");

    if (tab === 'activity') {
        if (btnAudit) {
            btnAudit.className = "px-2.5 py-1 rounded-lg font-bold bg-white dark:bg-slate-900 text-itrex-gold shadow-sm transition-all";
        }
        if (btnChangeLogs) {
            btnChangeLogs.className = "px-2.5 py-1 rounded-lg font-medium text-neutral-400 hover:text-white transition-all";
        }
        if (actList) actList.classList.remove("hidden");
        if (clList) clList.classList.add("hidden");
    } else {
        if (btnChangeLogs) {
            btnChangeLogs.className = "px-2.5 py-1 rounded-lg font-bold bg-white dark:bg-slate-900 text-itrex-gold shadow-sm transition-all";
        }
        if (btnAudit) {
            btnAudit.className = "px-2.5 py-1 rounded-lg font-medium text-neutral-400 hover:text-white transition-all";
        }
        if (actList) actList.classList.add("hidden");
        if (clList) clList.classList.remove("hidden");
        if (window.itrexDB) {
            renderChangeLogs(window.itrexDB.getChangeLogs());
        }
    }
}

function renderChangeLogs(logs = []) {
    const container = document.getElementById("changelog-feed-list");
    if (!container) return;

    if (!logs || logs.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-neutral-400 text-xs font-mono">No change log records captured yet</div>`;
        return;
    }

    const actionColors = {
        'CREATE': 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
        'UPDATE': 'text-amber-400 border-amber-500/40 bg-amber-950/40',
        'DELETE': 'text-rose-400 border-rose-500/40 bg-rose-950/40',
        'STATUS_CHANGE': 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    };

    container.innerHTML = logs.slice(0, 15).map(l => {
        const timeAgo = formatTimeAgo(l.created_at);
        const actionStyle = actionColors[l.action] || 'text-neutral-300 border-slate-800 bg-slate-950/60';
        return `
            <div class="p-3 rounded-xl border text-xs font-mono space-y-1 bg-slate-950/80 border-slate-800 text-neutral-300">
                <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${actionStyle}">
                        ${l.action} · ${l.entity_type}
                    </span>
                    <span class="text-[9px] text-neutral-400">${timeAgo}</span>
                </div>
                <p class="text-[11px] font-sans font-medium text-white">${l.entity_name || 'Record #' + l.entity_id}</p>
                <div class="flex items-center justify-between text-[9px] text-neutral-400 pt-1 border-t border-slate-800/60">
                    <span>By: <strong class="text-itrex-gold font-mono">${l.user_name || 'System Operator'}</strong></span>
                    <span class="font-mono text-neutral-500">${l.entity_id ? 'ID: ' + String(l.entity_id).substring(0, 12) : ''}</span>
                </div>
            </div>
        `;
    }).join('');
}

if (window.itrexDB) {
    window.itrexDB.subscribe('change_logs', (logs) => {
        if (currentAuditTab === 'changelog') renderChangeLogs(logs);
    });
}

// ==========================================
// 8.3 DATABASE ENGINE HEALTH & DIALECT POLLER
// ==========================================
let currentDbDialect = 'local';

async function checkDatabaseStatus(manual = false) {
    const badge = document.getElementById("db-mode-badge");
    const text = document.getElementById("db-mode-text");
    try {
        const res = await fetch('/api/db-status');
        if (res.ok) {
            const data = await res.json();
            currentDbDialect = data.dialect || 'local';
            if (badge && text) {
                if (data.dialect === 'mysql') {
                    text.textContent = `MySQL 8.0: Online (${data.tableCount || 7} tables)`;
                    badge.className = "hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono cursor-pointer hover:bg-emerald-500/20 transition-all duration-300";
                } else if (data.dialect === 'postgresql') {
                    text.textContent = `PostgreSQL: Online`;
                    badge.className = "hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono cursor-pointer hover:bg-indigo-500/20 transition-all duration-300";
                } else {
                    text.textContent = `Storage: Dual-Engine Active`;
                    badge.className = "hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono cursor-pointer hover:bg-cyan-500/20 transition-all duration-300";
                }
            }
            if (manual) {
                playTaskSuccess();
                showDashboardToast(
                    `Database Engine: ${data.dialect.toUpperCase()}`,
                    `Connected successfully. Status: ${data.status}. Production tables: users, tasks, notes, shifts, change_logs, notifications, contact_inquiries.`,
                    "success"
                );
            }
        } else {
            throw new Error("HTTP " + res.status);
        }
    } catch (e) {
        if (badge && text) {
            text.textContent = `Storage: Dual-Engine Active`;
            badge.className = "hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono cursor-pointer hover:bg-cyan-500/20 transition-all duration-300";
        }
        if (manual) {
            showDashboardToast("Storage Status", "Operating via resilient dual-engine persistence with auto-fallback to local storage.", "info");
        }
    }
}

// ==========================================
// 9. PROFILE EDITOR & DATABASE COMMIT
// ==========================================
function saveUserProfile() {
    playHoverTick();
    const name = document.getElementById("edit-user-name").value.trim();
    const title = document.getElementById("edit-user-title").value.trim();
    const dept = document.getElementById("edit-user-dept").value.trim();
    const phone = document.getElementById("edit-user-phone").value.trim();
    const bio = document.getElementById("edit-user-bio").value.trim();

    if (!name) {
        showDashboardToast("Invalid Name", "User display name cannot be blank.", "error");
        return;
    }

    currentUser.name = name;
    currentUser.title = title;
    currentUser.department = dept;
    currentUser.phone = phone;
    currentUser.bio = bio;

    // Save into database collection
    window.itrexDB.saveUser(currentUser);
    localStorage.setItem("itrex_active_user", JSON.stringify(currentUser));

    checkAuthAndInitUser();
    playTaskSuccess();
    showDashboardToast("Profile Committed to Database", "All profile updates are permanently stored and active.", "success");
}

// ==========================================
// 10. DATABASE JSON BACKUP EXPORT
// ==========================================
function exportDatabaseJSON() {
    playNodeChime();
    const dump = window.itrexDB.exportDatabaseDump();
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `itrex_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showDashboardToast("Database Snapshot Exported", "Complete system database downloaded as JSON backup.", "success");
}

// ==========================================
// 11. SIGN OUT
// ==========================================
function handleSignOut() {
    playHoverTick();
    if (confirm("Disconnect and sign out of current workspace terminal?")) {
        localStorage.removeItem("itrex_active_user");
        window.location.href = "login.html";
    }
}

// ==========================================
// 12. TOAST ENGINE
// ==========================================
function showDashboardToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const colors = {
        success: "border-emerald-500 bg-emerald-950/90 text-emerald-200",
        error: "border-rose-500 bg-rose-950/90 text-rose-200",
        info: "border-itrex-gold bg-slate-900/95 text-amber-200"
    };

    const toast = document.createElement("div");
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
    }, 4500);
}

// ==========================================
// 13. FOUNDER PRODUCT SHOWCASE MANAGER
// ==========================================
const DEFAULT_SYSTEM_PRODUCTS = [
    {
        id: "trexos",
        name: "TrexOS",
        category: "Hybrid Agentic OS Console",
        badge: "20×20×8 cm · Win + Linux Dual Boot",
        tagline: "Compact. Powerful. Intelligent. Hybrid Agentic OS Console",
        description: "Precision 20 cm × 20 cm × 8 cm hardware console with Windows + Linux dual boot, TPM 2.0 hardware security, intelligent cooling, and 2.5GbE LAN.",
        accentColor: "#00f3ff",
        link: "products.html#trexos"
    },
    {
        id: "aerohydra",
        name: "I-Trax AeroHydra X-1",
        category: "Autonomous Drone",
        badge: "Level 4+ Autonomy · Sub-5ms Telemetry",
        tagline: "Specially Designed Autonomous Aerial Drone",
        description: "Specially designed autonomous drone engineered for extreme mission reliability, tactical aerial robotics, and low-latency encrypted telemetry.",
        accentColor: "#ff6b00",
        link: "products.html#aerohydra"
    },
    {
        id: "trexvision",
        name: "TrexVision",
        category: "Autonomy Servers & AI",
        badge: "Dedicated Autonomy Servers · Real-Time Orchestration",
        tagline: "Autonomous AI Assistant & System Servers",
        description: "The AI assistant of the Trex system integrated with dedicated autonomy servers for real-time task orchestration, spatial intelligence, and fleet coordination.",
        accentColor: "#38bdf8",
        link: "products.html#trexvision"
    },
    {
        id: "synapx",
        name: "Synap-X",
        category: "Autonomous Desktop Robot",
        badge: "0ms Local Daemon · Physical Attention Tilt/Pan",
        tagline: "Next-Gen Autonomous Desktop Robot & Physical AI Assistant",
        description: "Desktop robot solving the frustrating flaws of Alexa, Siri, and DIY assistants: zero-latency local execution, directional beamforming, mechanical attention tilt/pan, and physical kill switch.",
        accentColor: "#10b981",
        link: "products.html#synapx"
    }
];

let selectedEditingProductId = "trexos";

function initProductManager() {
    const raw = localStorage.getItem("itrex_db_products");
    if (raw) {
        try {
            activeEditingProducts = JSON.parse(raw);
        } catch (e) {
            activeEditingProducts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_PRODUCTS));
        }
    } else {
        activeEditingProducts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_PRODUCTS));
    }

    const savedInterval = localStorage.getItem("itrex_carousel_interval") || "4500";
    const intervalSelect = document.getElementById("prod-mgr-interval");
    if (intervalSelect) intervalSelect.value = savedInterval;

    renderProductManagerList();
    selectProductToEdit("trexos");
}

function renderProductManagerList() {
    const list = document.getElementById("product-mgr-selector-list");
    if (!list) return;

    list.innerHTML = activeEditingProducts.map(p => `
        <button type="button" onclick="selectProductToEdit('${p.id}')" class="w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${p.id === selectedEditingProductId ? 'border-itrex-gold bg-itrex-gold/10 text-itrex-navy dark:text-white font-bold' : 'border-itrex-border dark:border-slate-800 bg-white dark:bg-slate-900 text-neutral-500 hover:border-neutral-400 dark:hover:border-slate-700'}">
            <div class="flex items-center space-x-2.5">
                <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${p.accentColor || '#00f3ff'}"></span>
                <span class="font-space text-xs">${p.name}</span>
            </div>
            <span class="text-[9px] font-mono text-neutral-400 uppercase">${p.category || 'Platform'}</span>
        </button>
    `).join('');
}

function selectProductToEdit(productId) {
    selectedEditingProductId = productId;
    const prod = activeEditingProducts.find(p => p.id === productId);
    if (!prod) return;

    renderProductManagerList();

    const idInput = document.getElementById("prod-mgr-id");
    const nameInput = document.getElementById("prod-mgr-name");
    const badgeInput = document.getElementById("prod-mgr-badge");
    const taglineInput = document.getElementById("prod-mgr-tagline");
    const descInput = document.getElementById("prod-mgr-desc");
    const colorInput = document.getElementById("prod-mgr-color");
    const colorLabel = document.getElementById("prod-mgr-color-label");

    if (idInput) idInput.value = prod.id;
    if (nameInput) nameInput.value = prod.name;
    if (badgeInput) badgeInput.value = prod.badge;
    if (taglineInput) taglineInput.value = prod.tagline;
    if (descInput) descInput.value = prod.description;
    if (colorInput) colorInput.value = prod.accentColor || '#00f3ff';
    if (colorLabel) colorLabel.textContent = (prod.accentColor || '#00f3ff').toUpperCase();
}

function updateProductColorLabel(hex) {
    const label = document.getElementById("prod-mgr-color-label");
    if (label) label.textContent = hex.toUpperCase();
}

function setProductColorPreset(color) {
    const colorInput = document.getElementById("prod-mgr-color");
    if (colorInput) colorInput.value = color;
    updateProductColorLabel(color);
}

function handleProductIntervalChange() {
    const select = document.getElementById("prod-mgr-interval");
    if (select) {
        localStorage.setItem("itrex_carousel_interval", select.value);
    }
}

function saveProductShowcaseConfig() {
    playHoverTick();
    const id = document.getElementById("prod-mgr-id").value;
    const name = document.getElementById("prod-mgr-name").value.trim();
    const badge = document.getElementById("prod-mgr-badge").value.trim();
    const tagline = document.getElementById("prod-mgr-tagline").value.trim();
    const desc = document.getElementById("prod-mgr-desc").value.trim();
    const color = document.getElementById("prod-mgr-color").value;

    const prodIdx = activeEditingProducts.findIndex(p => p.id === id);
    if (prodIdx !== -1) {
        activeEditingProducts[prodIdx].name = name;
        activeEditingProducts[prodIdx].badge = badge;
        activeEditingProducts[prodIdx].tagline = tagline;
        activeEditingProducts[prodIdx].description = desc;
        activeEditingProducts[prodIdx].accentColor = color;
    }

    // Persist products
    localStorage.setItem("itrex_db_products", JSON.stringify(activeEditingProducts));
    
    // Persist interval
    const intervalSelect = document.getElementById("prod-mgr-interval");
    if (intervalSelect) {
        localStorage.setItem("itrex_carousel_interval", intervalSelect.value);
    }

    // Broadcast change across tabs
    if (window.itrexDB) {
        window.itrexDB.broadcastChange('products', activeEditingProducts);
    }

    renderProductManagerList();
    playTaskSuccess();
    showDashboardToast("Product Showcase Updated", `Modifications for ${name} saved and synced to public platform stage.`, "success");
}

function resetDefaultProductConfig() {
    playHoverTick();
    if (confirm("Reset all product showcase parameters to original factory defaults?")) {
        activeEditingProducts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_PRODUCTS));
        localStorage.setItem("itrex_db_products", JSON.stringify(activeEditingProducts));
        localStorage.setItem("itrex_carousel_interval", "4500");
        if (window.itrexDB) {
            window.itrexDB.broadcastChange('products', activeEditingProducts);
        }
        initProductManager();
        showDashboardToast("Showcase Reset", "Restored default product catalog configuration.", "info");
    }
}

// Auto-initialize product manager on window load
document.addEventListener("DOMContentLoaded", () => {
    initProductManager();
});
