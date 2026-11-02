/**
 * I-TREX INNOVATIONS — MASTER ADMIN CONTROL CENTER (admin.js)
 * 
 * Implements:
 * 1. Admin Authentication Enclave & RBAC Security Guard
 * 2. Real-time Multi-Engine State Synchronization
 * 3. Product Catalog Management & Live Public Showroom Sync
 * 4. Profile Management with Strict Founder & Co-Founder Isolation
 * 5. Employee Directory, Progress Tracking & Work Monitoring
 * 6. Approval Center with Strict Founder / Co-Founder Authorization
 * 7. Enterprise Connections Inbox & Outbound Email Reply Transmission
 * 8. 20 Mandatory Security Protections & Audit Logging Enclave
 */

const API_BASE = (window.location.protocol === 'file:') ? 'http://localhost:10000' : (window.ITREX_API_BASE || '');

let currentUser = null;
let currentActiveSection = 'home';
let currentProducts = [];
let currentEmployees = [];
let currentApprovals = [];
let currentConnections = [];
let selectedInquiry = null;
let activeProfileTargetId = 'usr-001'; // Default to Founder
let dashboardTimeFilter = 'weekly';

// ==========================================================================
// IMMEDIATE AIR-GAPPED ACCESS GUARD
// Executes synchronously before DOM parsing to prevent any unauthorized UI exposure
// ==========================================================================
(function immediateGuard() {
    try {
        const stored = localStorage.getItem('itrex_auth_user');
        if (!stored) {
            window.location.replace('login.html?denied=admin_enclave_restricted');
            return;
        }
        const user = JSON.parse(stored);
        const role = (user.role || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const isAuthorized = role === 'founder' || role === 'co-founder' || role === 'admin' ||
                             email === 'satys9267@gmail.com' || email === 'ishwarip267@gmail.com';
        if (!isAuthorized) {
            window.location.replace('dashboard.html');
        }
    } catch (e) {
        window.location.replace('login.html?denied=admin_enclave_restricted');
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify Authentication & RBAC Access (Bounces unauthorized visitors immediately)
    const hasAccess = verifyAdminAccess();
    if (!hasAccess) return;

    // 2. Initialize UI Components & Icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

    // 3. Initialize Topbar Live Clock
    initLiveClock();

    // 4. Initialize Mobile Sidebar & Collapse Controls
    initSidebarControls();

    // 5. Load Initial Data Sets
    await loadInitialAdminData();

    // 6. Check for URL Hash to activate section
    const hash = window.location.hash.replace('#', '');
    if (['home', 'dashboard', 'products', 'profile', 'employees', 'approvals', 'connections', 'security'].includes(hash)) {
        showAdminSection(hash);
    } else {
        showAdminSection('home');
    }
});

/* ==========================================================================
   1. AUTHENTICATION & RBAC SECURITY GUARD
   ========================================================================== */
function verifyAdminAccess() {
    try {
        const stored = localStorage.getItem('itrex_auth_user');
        if (!stored) {
            // STRICT AIR-GAPPED SECURITY: No unauthenticated visitors in Admin Enclave
            window.location.replace('login.html?denied=admin_enclave_restricted');
            return false;
        }

        currentUser = JSON.parse(stored);

        // Check clearance: Only founder, co-founder, or designated admin accounts can enter
        const role = (currentUser.role || '').toLowerCase();
        const email = (currentUser.email || '').toLowerCase();
        const isAuthorized = role === 'founder' || role === 'co-founder' || role === 'admin' ||
                             email === 'satys9267@gmail.com' || email === 'ishwarip267@gmail.com';

        if (!isAuthorized) {
            alert('Security Warning: Administrative clearance required. Redirecting to employee portal.');
            window.location.replace('dashboard.html');
            return false;
        }

        // Set active profile tab based on executive identity
        if (email === 'ishwarip267@gmail.com') {
            activeProfileTargetId = 'usr-002';
        } else {
            activeProfileTargetId = 'usr-001';
        }

        // Update UI with authenticated identity
        const nameEl = document.getElementById('sidebar-user-name');
        const roleEl = document.getElementById('sidebar-user-role');
        const greetingEl = document.getElementById('home-greeting-name');

        const displayName = currentUser.name || (email === 'ishwarip267@gmail.com' ? 'Ishwari Patil' : 'Satyam Swami');
        const displayRole = (currentUser.role || (email === 'ishwarip267@gmail.com' ? 'CO-FOUNDER' : 'FOUNDER')).toUpperCase();

        if (nameEl) nameEl.textContent = displayName;
        if (roleEl) roleEl.textContent = displayRole;
        if (greetingEl) greetingEl.textContent = displayName.split(' ')[0];

        return true;

    } catch (e) {
        console.warn('[I-Trex Admin] Auth verification error:', e.message);
        window.location.replace('login.html?denied=admin_enclave_restricted');
        return false;
    }
}

function handleAdminSignOut() {
    if (confirm('Are you sure you want to exit the I-Trex Admin Enclave?')) {
        localStorage.removeItem('itrex_auth_user');
        window.location.href = 'login.html';
    }
}

/* ==========================================================================
   2. SIDEBAR & NAVIGATION STATE ENGINE
   ========================================================================== */
function initSidebarControls() {
    const sidebar = document.getElementById('admin-sidebar');
    const backdrop = document.getElementById('admin-sidebar-backdrop');
    const collapseBtn = document.getElementById('btn-sidebar-collapse');
    const collapseIcon = document.getElementById('sidebar-collapse-icon');
    const mobileToggle = document.getElementById('btn-mobile-sidebar-toggle');
    const mobileClose = document.getElementById('btn-sidebar-close');

    function openMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        if (backdrop) {
            backdrop.classList.remove('hidden');
            backdrop.classList.add('block');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');
        if (backdrop) {
            backdrop.classList.remove('block');
            backdrop.classList.add('hidden');
        }
        document.body.style.overflow = '';
    }

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                collapseIcon.setAttribute('data-lucide', 'chevron-right');
            } else {
                collapseIcon.setAttribute('data-lucide', 'chevron-left');
            }
            if (window.lucide) window.lucide.createIcons();
        });
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar.classList.contains('translate-x-0')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileSidebar);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeMobileSidebar);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileSidebar();
    });

    window.closeMobileSidebar = closeMobileSidebar;
    window.openMobileSidebar = openMobileSidebar;
}

function showAdminSection(sectionName) {
    currentActiveSection = sectionName;
    window.location.hash = sectionName;

    // 1. Update navigation items active state
    document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
    const activeItem = document.getElementById(`nav-item-${sectionName}`);
    if (activeItem) activeItem.classList.add('active');

    // 2. Hide all sections and show active section
    document.querySelectorAll('.admin-content-section').forEach(sec => sec.classList.add('hidden'));
    const targetSec = document.getElementById(`section-${sectionName}`);
    if (targetSec) {
        targetSec.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(targetSec, 
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
        }
    }

    // 3. Update topbar breadcrumb
    const breadcrumb = document.getElementById('topbar-current-route');
    if (breadcrumb) {
        breadcrumb.textContent = sectionName.toUpperCase();
    }

    // 4. Auto-close mobile navigation drawer on selection
    if (window.innerWidth < 1024 && typeof window.closeMobileSidebar === 'function') {
        window.closeMobileSidebar();
    }

    // 4. Refresh section data
    if (sectionName === 'home') renderAdminHome();
    if (sectionName === 'dashboard') renderAdminDashboard();
    if (sectionName === 'products') renderProductsTable();
    if (sectionName === 'profile') loadProfileData(activeProfileTargetId);
    if (sectionName === 'employees') renderEmployeesTable();
    if (sectionName === 'approvals') renderApprovalsList();
    if (sectionName === 'connections') renderConnectionsInbox();
    if (sectionName === 'security') renderSecurityEnclave();

    if (window.lucide) window.lucide.createIcons();
}

function initLiveClock() {
    function update() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

        const clockEl = document.getElementById('topbar-clock');
        const homeDateEl = document.getElementById('home-live-datetime');

        if (clockEl) clockEl.textContent = timeStr;
        if (homeDateEl) homeDateEl.textContent = `${dateStr} · ${timeStr}`;
    }
    update();
    setInterval(update, 1000);
}

/* ==========================================================================
   3. DATA FETCHING & SYNCHRONIZATION ENGINE
   ========================================================================= */
async function loadInitialAdminData() {
    try {
        const [overviewRes, productsRes, employeesRes, approvalsRes, connectionsRes, auditRes] = await Promise.all([
            fetch(API_BASE + '/api/admin/overview'),
            fetch(API_BASE + '/api/products'),
            fetch(API_BASE + '/api/employees'),
            fetch(API_BASE + '/api/approvals'),
            fetch(API_BASE + '/api/connections'),
            fetch(API_BASE + '/api/admin/audit-logs')
        ]);

        if (overviewRes.ok) {
            const overview = await overviewRes.json();
            updateOverviewCounters(overview.summary);
        }

        if (productsRes.ok) {
            currentProducts = await productsRes.json();
            const badge = document.getElementById('badge-products-count');
            if (badge) badge.textContent = currentProducts.length;
        }

        if (employeesRes.ok) {
            currentEmployees = await employeesRes.json();
            const badge = document.getElementById('badge-employees-count');
            if (badge) badge.textContent = currentEmployees.filter(e => e.status === 'active').length;
        }

        if (approvalsRes.ok) {
            currentApprovals = await approvalsRes.json();
            const pendingCount = currentApprovals.filter(a => a.status === 'pending').length;
            const badge = document.getElementById('badge-approvals-count');
            const qaBadge = document.getElementById('qa-approvals-count');
            if (badge) badge.textContent = `${pendingCount} NEW`;
            if (qaBadge) qaBadge.textContent = pendingCount;
        }

        if (connectionsRes.ok) {
            currentConnections = await connectionsRes.json();
            const unreadCount = currentConnections.filter(c => c.status === 'unread').length;
            const badge = document.getElementById('badge-connections-unread');
            const qaBadge = document.getElementById('qa-connections-count');
            if (badge) badge.textContent = unreadCount;
            if (qaBadge) qaBadge.textContent = unreadCount;
        }

    } catch (e) {
        console.warn('[I-Trex Admin] Error loading initial admin data:', e.message);
    }
}

function updateOverviewCounters(summary) {
    if (!summary) return;
    const hp = document.getElementById('home-metric-products');
    const he = document.getElementById('home-metric-employees');
    const ha = document.getElementById('home-metric-approvals');
    const hc = document.getElementById('home-metric-connections');
    const hu = document.getElementById('home-metric-unread');

    if (hp) hp.textContent = summary.totalProducts || 5;
    if (he) he.textContent = summary.totalEmployees || 3;
    if (ha) ha.textContent = summary.pendingApprovals || 0;
    if (hc) hc.textContent = summary.totalConnections || 0;
    if (hu) hu.textContent = `${summary.unreadConnections || 0} Unread`;
}

/* ==========================================================================
   4. MODULE 1: ADMIN HOMEPAGE
   ========================================================================== */
async function renderAdminHome() {
    try {
        const response = await fetch(API_BASE + '/api/admin/overview');
        if (!response.ok) return;
        const data = await response.json();

        updateOverviewCounters(data.summary);

        // Render Recent Activities Stream
        const activityContainer = document.getElementById('home-activities-stream');
        if (activityContainer && Array.isArray(data.recentActivities)) {
            if (data.recentActivities.length === 0) {
                activityContainer.innerHTML = '<div class="text-neutral-500 py-4">No recent activity logged.</div>';
            } else {
                activityContainer.innerHTML = data.recentActivities.slice(0, 6).map(act => {
                    const time = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return `
                        <div class="p-3 bg-black/60 border border-white/5 flex items-start justify-between gap-4">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                    <strong class="text-white text-xs uppercase">${act.action.replace(/_/g, ' ')}</strong>
                                </div>
                                <p class="text-neutral-400 text-[11px] font-sans">${act.details || ''}</p>
                            </div>
                            <span class="text-neutral-500 text-[10px] shrink-0 font-mono">${time}</span>
                        </div>
                    `;
                }).join('');
            }
        }

        // Render Unread Inquiries Stream
        const inquiryContainer = document.getElementById('home-inquiries-stream');
        if (inquiryContainer && Array.isArray(data.unreadInquiries)) {
            if (data.unreadInquiries.length === 0) {
                inquiryContainer.innerHTML = '<div class="text-neutral-500 py-4">All inbound transmissions processed. Zero unread.</div>';
            } else {
                inquiryContainer.innerHTML = data.unreadInquiries.slice(0, 4).map(inq => `
                    <div class="p-3 bg-black/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors cursor-pointer" onclick="openInquiryDetail('${inq.id}')">
                        <div class="flex items-center justify-between">
                            <span class="text-cyan-400 font-bold text-xs">${inq.name}</span>
                            <span class="text-neutral-500 text-[10px]">${new Date(inq.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div class="text-white font-sans text-xs truncate mt-1">${inq.subject || inq.category}</div>
                        <p class="text-neutral-400 text-[11px] font-sans line-clamp-1 mt-0.5">${inq.message}</p>
                    </div>
                `).join('');
            }
        }

        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering home:', e.message);
    }
}

/* ==========================================================================
   5. MODULE 2: ADVANCED ANALYTICS DASHBOARD
   ========================================================================== */
function setDashboardTimeFilter(filter) {
    dashboardTimeFilter = filter;
    ['weekly', 'monthly', 'yearly'].forEach(f => {
        const btn = document.getElementById(`filter-btn-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = 'px-3 py-1 bg-white text-black font-bold';
            } else {
                btn.className = 'px-3 py-1 text-neutral-400 hover:text-white';
            }
        }
    });
    renderAdminDashboard();
}

async function renderAdminDashboard() {
    try {
        const response = await fetch(API_BASE + '/api/admin/overview');
        if (!response.ok) return;
        const data = await response.json();

        const publishedEl = document.getElementById('dash-published-count');
        const activeEmpEl = document.getElementById('dash-active-emp-count');

        if (publishedEl) publishedEl.textContent = data.summary.publishedProducts || 5;
        if (activeEmpEl) activeEmpEl.textContent = data.summary.totalEmployees || 3;

        // Render Bar Chart 1: Sprint Velocity
        const sprintContainer = document.getElementById('chart-sprint-container');
        if (sprintContainer) {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const values = [40, 65, 80, 50, 95, 30, 85];

            sprintContainer.innerHTML = days.map((day, i) => {
                const heightPct = values[i];
                return `
                    <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span class="font-mono text-[9px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">${heightPct}%</span>
                        <div class="w-full bg-cyan-950/40 border border-cyan-500/30 group-hover:bg-cyan-400 group-hover:border-cyan-300 transition-all duration-300" style="height: ${heightPct}%;"></div>
                        <span class="font-mono text-[10px] text-neutral-400 uppercase">${day}</span>
                    </div>
                `;
            }).join('');
        }

        // Render Bar Chart 2: Enterprise Inquiries Growth
        const connContainer = document.getElementById('chart-connections-container');
        if (connContainer) {
            const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
            const values = [25, 45, 60, 75, 90, 100];

            connContainer.innerHTML = months.map((m, i) => {
                const heightPct = values[i];
                return `
                    <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span class="font-mono text-[9px] text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">${heightPct}</span>
                        <div class="w-full bg-orange-950/40 border border-orange-500/30 group-hover:bg-orange-500 group-hover:border-orange-400 transition-all duration-300" style="height: ${heightPct}%;"></div>
                        <span class="font-mono text-[10px] text-neutral-400 uppercase">${m}</span>
                    </div>
                `;
            }).join('');
        }

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering dashboard:', e.message);
    }
}

/* ==========================================================================
   6. MODULE 3: PRODUCT MANAGEMENT SYSTEM
   ========================================================================== */
async function renderProductsTable() {
    try {
        const response = await fetch(API_BASE + '/api/products');
        if (!response.ok) return;
        currentProducts = await response.json();

        const tbody = document.getElementById('products-table-body');
        const searchVal = (document.getElementById('products-search-input')?.value || '').toLowerCase();
        const categoryVal = document.getElementById('products-category-filter')?.value || 'all';

        let filtered = currentProducts;
        if (categoryVal !== 'all') {
            filtered = filtered.filter(p => p.category === categoryVal);
        }
        if (searchVal) {
            filtered = filtered.filter(p => 
                (p.name && p.name.toLowerCase().includes(searchVal)) ||
                (p.code && p.code.toLowerCase().includes(searchVal)) ||
                (p.tagline && p.tagline.toLowerCase().includes(searchVal))
            );
        }

        if (!tbody) return;

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-neutral-500 font-mono">No products match the selected criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(p => {
            const statusClass = p.status === 'published' ? 'badge-active' : (p.status === 'draft' ? 'badge-pending' : 'badge-archived');
            return `
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-white text-sm font-sans">${p.name}</span>
                            <span class="font-mono text-[10px] px-1.5 py-0.5 bg-white/10 text-cyan-400">${p.code || 'TRX'}</span>
                        </div>
                        <span class="font-sans text-[11px] text-neutral-400 block line-clamp-1">${p.tagline || ''}</span>
                    </td>
                    <td class="py-4 px-6 text-neutral-300">${p.category || 'Autonomous Systems'}</td>
                    <td class="py-4 px-6 text-neutral-400">${p.stage || 'Production'}</td>
                    <td class="py-4 px-6">
                        <span class="${statusClass} px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded">
                            ${p.status || 'PUBLISHED'}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-neutral-300">${p.leadArchitect || 'Satyam Swami'}</td>
                    <td class="py-4 px-6 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button onclick="openEditProductModal('${p.id}')" class="px-2.5 py-1 text-[11px] bg-white/5 hover:bg-white/15 border border-white/10 text-white" title="Edit Product">
                                EDIT
                            </button>
                            <button onclick="toggleProductStatus('${p.id}', '${p.status}')" class="px-2.5 py-1 text-[11px] bg-white/5 hover:bg-white/15 border border-white/10 ${p.status === 'published' ? 'text-amber-400' : 'text-emerald-400'}" title="Toggle Published State">
                                ${p.status === 'published' ? 'UNPUBLISH' : 'PUBLISH'}
                            </button>
                            <button onclick="handleDeleteProduct('${p.id}', '${p.name}')" class="px-2 py-1 text-[11px] bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-400" title="Archive / Delete">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering products table:', e.message);
    }
}

// Add / Edit Product Modals
function openAddProductModal() {
    document.getElementById('modal-product-title').textContent = 'ADD NEW PRODUCT';
    document.getElementById('form-product').reset();
    document.getElementById('prod-edit-id').value = '';
    const modal = document.getElementById('modal-product');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function openEditProductModal(id) {
    const prod = currentProducts.find(p => p.id === id || p.slug === id);
    if (!prod) return;

    document.getElementById('modal-product-title').textContent = `EDIT PRODUCT: ${prod.name}`;
    document.getElementById('prod-edit-id').value = prod.id;
    document.getElementById('prod-name').value = prod.name || '';
    document.getElementById('prod-code').value = prod.code || '';
    document.getElementById('prod-slug').value = prod.slug || '';
    document.getElementById('prod-tagline').value = prod.tagline || '';
    document.getElementById('prod-category').value = prod.category || 'Operating Systems & Kernel';
    document.getElementById('prod-status').value = prod.status || 'published';
    document.getElementById('prod-stage').value = prod.stage || 'Production v2.4';
    document.getElementById('prod-pricing').value = prod.pricing || '';
    document.getElementById('prod-short-desc').value = prod.shortDescription || '';
    document.getElementById('prod-detailed-desc').value = prod.detailedDescription || '';
    document.getElementById('prod-tech').value = (prod.technologies || []).join(', ');
    document.getElementById('prod-architect').value = prod.leadArchitect || 'Satyam Swami';
    document.getElementById('prod-demo-link').value = prod.demoLink || '';
    document.getElementById('prod-github-link').value = prod.githubLink || '';
    document.getElementById('prod-doc-link').value = prod.docLink || '';

    const modal = document.getElementById('modal-product');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeProductModal() {
    const modal = document.getElementById('modal-product');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('prod-edit-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const code = document.getElementById('prod-code').value.trim();
    const slug = document.getElementById('prod-slug').value.trim();
    const tagline = document.getElementById('prod-tagline').value.trim();
    const category = document.getElementById('prod-category').value;
    const status = document.getElementById('prod-status').value;
    const stage = document.getElementById('prod-stage').value.trim();
    const pricing = document.getElementById('prod-pricing').value.trim();
    const shortDescription = document.getElementById('prod-short-desc').value.trim();
    const detailedDescription = document.getElementById('prod-detailed-desc').value.trim();
    const techRaw = document.getElementById('prod-tech').value;
    const leadArchitect = document.getElementById('prod-architect').value.trim();
    const demoLink = document.getElementById('prod-demo-link').value.trim();
    const githubLink = document.getElementById('prod-github-link').value.trim();
    const docLink = document.getElementById('prod-doc-link').value.trim();

    const technologies = techRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
        name,
        code,
        slug,
        tagline,
        category,
        status,
        stage,
        pricing,
        shortDescription,
        detailedDescription,
        technologies,
        leadArchitect,
        demoLink,
        githubLink,
        docLink
    };

    try {
        const url = editId ? `${API_BASE}/api/products/${editId}` : `${API_BASE}/api/products`;
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify(currentUser)
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to save product.');
        }

        closeProductModal();
        showToast(editId ? `Product ${name} updated and synchronized!` : `Product ${name} created and published!`);
        await loadInitialAdminData();
        renderProductsTable();

    } catch (err) {
        alert(err.message);
    }
}

async function toggleProductStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
        const res = await fetch(`${API_BASE}/api/products/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify(currentUser)
            },
            body: JSON.stringify({ status: nextStatus })
        });
        if (!res.ok) throw new Error('Status update failed');
        showToast(`Product status toggled to ${nextStatus.toUpperCase()}`);
        await loadInitialAdminData();
        renderProductsTable();
    } catch (e) {
        alert(e.message);
    }
}

async function handleDeleteProduct(id, name) {
    if (!confirm(`Are you sure you want to archive product "${name}"? It will be removed from the public showroom.`)) return;
    try {
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'x-itrex-user': JSON.stringify(currentUser) }
        });
        if (!res.ok) throw new Error('Delete failed');
        showToast(`Product "${name}" archived successfully.`);
        await loadInitialAdminData();
        renderProductsTable();
    } catch (e) {
        alert(e.message);
    }
}

/* ==========================================================================
   7. MODULE 4: PROFILE MANAGEMENT (STRICT FOUNDER & CO-FOUNDER ISOLATION)
   ========================================================================== */
function switchProfileTab(userId) {
    activeProfileTargetId = userId;
    const tabF = document.getElementById('tab-profile-founder');
    const tabC = document.getElementById('tab-profile-cofounder');

    if (userId === 'usr-001') {
        if (tabF) tabF.className = 'py-3 px-6 border-b-2 border-cyan-400 text-white font-bold';
        if (tabC) tabC.className = 'py-3 px-6 border-b-2 border-transparent text-neutral-400 hover:text-white';
    } else {
        if (tabF) tabF.className = 'py-3 px-6 border-b-2 border-transparent text-neutral-400 hover:text-white';
        if (tabC) tabC.className = 'py-3 px-6 border-b-2 border-cyan-400 text-white font-bold';
    }

    loadProfileData(userId);
}

async function loadProfileData(userId) {
    try {
        const res = await fetch(`${API_BASE}/api/profiles/${userId}`);
        if (!res.ok) return;
        const profile = await res.json();

        document.getElementById('prof-name').value = profile.name || '';
        document.getElementById('prof-title').value = profile.title || '';
        document.getElementById('prof-department').value = profile.department || '';
        document.getElementById('prof-phone').value = profile.phone || '';
        document.getElementById('prof-bio').value = profile.bio || '';
        document.getElementById('prof-skills').value = (profile.skills || []).join(', ');

        const social = profile.social || {};
        document.getElementById('prof-linkedin').value = social.linkedin || '';
        document.getElementById('prof-github').value = social.github || '';
        document.getElementById('prof-twitter').value = social.twitter || '';

        // STRICT RBAC CHECK:
        // 1. Founder can ONLY edit Founder profile
        // 2. Co-Founder can ONLY edit Co-Founder profile
        const isTargetFounder = userId === 'usr-001';
        const isCallerFounder = currentUser.id === 'usr-001' || (currentUser.email && currentUser.email.toLowerCase() === 'satys9267@gmail.com');
        const isCallerCoFounder = currentUser.id === 'usr-002' || (currentUser.email && currentUser.email.toLowerCase().includes('ishwari'));

        const saveBtn = document.getElementById('btn-save-profile');
        const rbacNotice = document.getElementById('profile-rbac-notice');
        const noteEl = document.getElementById('prof-status-note');

        let canEdit = false;
        if (isTargetFounder && isCallerFounder) canEdit = true;
        if (!isTargetFounder && isCallerCoFounder) canEdit = true;

        const inputs = document.querySelectorAll('#form-edit-profile input, #form-edit-profile textarea');
        inputs.forEach(inp => { inp.disabled = !canEdit; });

        if (saveBtn) {
            saveBtn.disabled = !canEdit;
            if (canEdit) {
                saveBtn.classList.remove('opacity-40', 'cursor-not-allowed');
                if (noteEl) noteEl.innerHTML = '<span class="text-emerald-400">✓ You have authorization to edit this profile.</span>';
            } else {
                saveBtn.classList.add('opacity-40', 'cursor-not-allowed');
                if (noteEl) noteEl.innerHTML = `<span class="text-amber-400 font-bold">🔒 READ-ONLY: Per strict RBAC, only the account owner (${isTargetFounder ? 'Founder Satyam Swami' : 'Co-Founder Ishwari Patil'}) can edit this profile.</span>`;
            }
        }

    } catch (e) {
        console.warn('[I-Trex Admin] Error loading profile:', e.message);
    }
}

async function handleSaveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('prof-name').value.trim();
    const title = document.getElementById('prof-title').value.trim();
    const department = document.getElementById('prof-department').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const bio = document.getElementById('prof-bio').value.trim();
    const skills = document.getElementById('prof-skills').value.split(',').map(s => s.trim()).filter(Boolean);

    const social = {
        linkedin: document.getElementById('prof-linkedin').value.trim(),
        github: document.getElementById('prof-github').value.trim(),
        twitter: document.getElementById('prof-twitter').value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/api/profiles/${activeProfileTargetId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify(currentUser)
            },
            body: JSON.stringify({ name, title, department, phone, bio, skills, social })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update profile.');
        }

        showToast('Profile updated! Public "People Behind the Platform" synchronized.');

    } catch (err) {
        alert(err.message);
    }
}

/* ==========================================================================
   8. MODULE 5: EMPLOYEE MANAGEMENT & WORK MONITORING
   ========================================================================== */
async function renderEmployeesTable() {
    try {
        const res = await fetch(API_BASE + '/api/employees');
        if (!res.ok) return;
        currentEmployees = await res.json();

        const tbody = document.getElementById('employees-table-body');
        if (!tbody) return;

        const searchVal = (document.getElementById('employee-search-input')?.value || '').toLowerCase();
        let filtered = currentEmployees;
        if (searchVal) {
            filtered = filtered.filter(e => 
                (e.name && e.name.toLowerCase().includes(searchVal)) ||
                (e.title && e.title.toLowerCase().includes(searchVal)) ||
                (e.department && e.department.toLowerCase().includes(searchVal))
            );
        }

        tbody.innerHTML = filtered.map(emp => {
            const statusBadge = emp.status === 'active' ? 'badge-active' : 'badge-pending';
            return `
                <tr class="hover:bg-white/5 transition-colors">
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-none border border-white/20 bg-white/5 flex items-center justify-center font-bold text-white text-xs">
                                ${emp.avatar || emp.name.substr(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <strong class="text-white font-sans text-sm block">${emp.name}</strong>
                                <span class="text-neutral-400 font-mono text-[10px]">${emp.email}</span>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6 text-neutral-300 font-mono">${emp.title || 'Engineer'}</td>
                    <td class="py-4 px-6 text-neutral-400 font-mono">${emp.department || 'Engineering'}</td>
                    <td class="py-4 px-6 text-neutral-500 font-mono">${emp.joiningDate || '2026-01-15'}</td>
                    <td class="py-4 px-6">
                        <span class="${statusBadge} px-2.5 py-1 text-[10px] uppercase font-bold rounded">
                            ${emp.status || 'ACTIVE'}
                        </span>
                    </td>
                    <td class="py-4 px-6 text-right">
                        <button onclick="openEmployeeDetailModal('${emp.id}')" class="px-3 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-cyan-400 text-[11px] font-mono">
                            INSPECT WORK ↗
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering employees:', e.message);
    }
}

async function openEmployeeDetailModal(id) {
    try {
        const res = await fetch(`${API_BASE}/api/employees/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        const p = data.profile;

        alert(`[EMPLOYEE DOSSIER]\nName: ${p.name}\nDesignation: ${p.title}\nDepartment: ${p.department}\nAssigned Tasks: ${data.tasks.length}\nRecent Work Submissions: ${data.submissions.length}\nStatus: ${p.status}`);
    } catch (e) {
        alert('Could not retrieve employee work details.');
    }
}

/* ==========================================================================
   9. MODULE 6: APPROVAL CENTER (FOUNDER & CO-FOUNDER CLEARANCE)
   ========================================================================== */
async function renderApprovalsList() {
    try {
        const res = await fetch(API_BASE + '/api/approvals');
        if (!res.ok) return;
        currentApprovals = await res.json();

        const container = document.getElementById('approvals-cards-container');
        if (!container) return;

        if (currentApprovals.length === 0) {
            container.innerHTML = '<div class="text-center py-12 text-neutral-500 font-mono text-xs">No pending employee account activation requests.</div>';
            return;
        }

        const isAuthorizedApprover = currentUser.role === 'founder' || currentUser.role === 'co-founder';

        container.innerHTML = currentApprovals.map(appr => {
            const isPending = appr.status === 'pending';
            const statusClass = isPending ? 'badge-pending' : (appr.status === 'approved' ? 'badge-active' : 'badge-archived');

            return `
                <div class="admin-card p-6 corner-brackets space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div class="space-y-1">
                            <div class="flex items-center gap-3">
                                <h3 class="font-display font-bold text-lg text-white">${appr.applicantName}</h3>
                                <span class="${statusClass} px-2.5 py-0.5 text-[10px] uppercase font-bold rounded">
                                    ${appr.status.toUpperCase()}
                                </span>
                                ${appr.emailVerified ? '<span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">EMAIL VERIFIED</span>' : ''}
                            </div>
                            <span class="font-mono text-xs text-neutral-400">${appr.applicantEmail} · ${appr.department}</span>
                        </div>
                        <span class="font-mono text-xs text-neutral-500">Submitted: ${new Date(appr.submittedAt).toLocaleDateString()}</span>
                    </div>

                    <div class="space-y-2">
                        <span class="font-mono text-[10px] uppercase text-neutral-400">REQUESTED DESIGNATION & PROFILE BIO</span>
                        <p class="font-sans text-sm text-neutral-300 font-light leading-relaxed">${appr.bio || 'Applicant profile details submitted for clearance.'}</p>
                    </div>

                    ${appr.decision ? `
                        <div class="p-3 bg-white/5 border border-white/10 font-mono text-xs space-y-1">
                            <div class="text-neutral-400">Decided by: <strong class="text-white">${appr.decision.approverName} (${appr.decision.approverRole.toUpperCase()})</strong> on ${new Date(appr.decision.decidedAt).toLocaleString()}</div>
                            <div class="text-neutral-300">Reason: ${appr.decision.reason}</div>
                        </div>
                    ` : ''}

                    ${isPending ? `
                        <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                            <span class="font-mono text-[11px] text-neutral-400">
                                ${isAuthorizedApprover ? 'You are authorized to execute approval decisions.' : '<strong class="text-amber-400">Restricted: Only Founder & Co-Founder can approve.</strong>'}
                            </span>
                            <div class="flex items-center gap-3">
                                <button onclick="submitApprovalDecision('${appr.id}', 'rejected')" ${!isAuthorizedApprover ? 'disabled' : ''} class="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-950/40 font-mono text-xs ${!isAuthorizedApprover ? 'opacity-40 cursor-not-allowed' : ''}">
                                    REJECT APPLICATION
                                </button>
                                <button onclick="submitApprovalDecision('${appr.id}', 'approved')" ${!isAuthorizedApprover ? 'disabled' : ''} class="chamfer-btn-primary !py-2 !px-6 text-xs ${!isAuthorizedApprover ? 'opacity-40 cursor-not-allowed' : ''}">
                                    <span>APPROVE & ACTIVATE</span>
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering approvals:', e.message);
    }
}

async function submitApprovalDecision(id, decision) {
    const isAuthorized = currentUser.role === 'founder' || currentUser.role === 'co-founder';
    if (!isAuthorized) {
        alert('Permission Denied: Only the Founder and Co-Founder can approve or reject employee activation requests.');
        return;
    }

    const reason = prompt(`Please enter an administrative reason for ${decision.toUpperCase()} this request:`, decision === 'approved' ? 'Verified technical background and security clearance.' : 'Incomplete credentials.');
    if (reason === null) return; // User cancelled

    try {
        const res = await fetch(`${API_BASE}/api/approvals/${id}/decision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify(currentUser)
            },
            body: JSON.stringify({ decision, reason })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Decision processing failed.');
        }

        showToast(`Account activation request was successfully ${decision.toUpperCase()}!`);
        await loadInitialAdminData();
        renderApprovalsList();

    } catch (err) {
        alert(err.message);
    }
}

/* ==========================================================================
   10. MODULE 7: CONNECTIONS (INBOX & EMAIL REPLY SYSTEM)
   ========================================================================== */
let connFilter = 'all';

function setConnFilter(filter) {
    connFilter = filter;
    document.querySelectorAll('.conn-filter-btn').forEach(b => {
        if (b.dataset.filter === filter) {
            b.className = 'px-2.5 py-1 text-[10px] bg-white text-black font-bold conn-filter-btn';
        } else {
            b.className = 'px-2.5 py-1 text-[10px] text-neutral-400 hover:text-white conn-filter-btn';
        }
    });
    renderConnectionsInbox();
}

function filterConnections() {
    renderConnectionsInbox();
}

async function renderConnectionsInbox() {
    try {
        const res = await fetch(API_BASE + '/api/connections');
        if (!res.ok) return;
        currentConnections = await res.json();

        const listContainer = document.getElementById('conn-inbox-list');
        const searchVal = (document.getElementById('conn-search-input')?.value || '').toLowerCase();

        let filtered = currentConnections;
        if (connFilter !== 'all') {
            filtered = filtered.filter(c => c.status === connFilter);
        }
        if (searchVal) {
            filtered = filtered.filter(c => 
                (c.name && c.name.toLowerCase().includes(searchVal)) ||
                (c.email && c.email.toLowerCase().includes(searchVal)) ||
                (c.subject && c.subject.toLowerCase().includes(searchVal)) ||
                (c.message && c.message.toLowerCase().includes(searchVal))
            );
        }

        if (!listContainer) return;

        if (filtered.length === 0) {
            listContainer.innerHTML = '<div class="text-center py-10 text-neutral-500 font-mono text-xs">No messages found.</div>';
            return;
        }

        listContainer.innerHTML = filtered.map(inq => {
            const isUnread = inq.status === 'unread';
            const isSelected = selectedInquiry && selectedInquiry.id === inq.id;
            return `
                <div onclick="selectInquiry('${inq.id}')" class="p-4 hover:bg-white/5 transition-colors cursor-pointer ${isSelected ? 'bg-white/10 border-l-2 border-cyan-400' : ''}">
                    <div class="flex items-center justify-between pb-1">
                        <span class="font-sans font-bold text-xs ${isUnread ? 'text-white' : 'text-neutral-300'}">${inq.name}</span>
                        <span class="text-[10px] text-neutral-500">${new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="text-xs text-neutral-200 font-sans truncate">${inq.subject || inq.category}</div>
                    <p class="text-[11px] text-neutral-400 font-sans line-clamp-1 mt-1">${inq.message}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-1.5 py-0.5 text-[9px] uppercase ${isUnread ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-neutral-400'}">${inq.status}</span>
                        <span class="text-[10px] text-neutral-500">${inq.category}</span>
                    </div>
                </div>
            `;
        }).join('');

        // If no message is selected, select first
        if (!selectedInquiry && filtered.length > 0) {
            selectInquiry(filtered[0].id);
        }

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering inbox:', e.message);
    }
}

function selectInquiry(id) {
    selectedInquiry = currentConnections.find(c => c.id === id);
    if (!selectedInquiry) return;

    const panel = document.getElementById('conn-detail-panel');
    if (!panel) return;

    const repliesHtml = (selectedInquiry.replies || []).map(r => `
        <div class="p-4 bg-white/5 border border-cyan-500/20 space-y-1">
            <div class="flex items-center justify-between font-mono text-[10px]">
                <strong class="text-cyan-400">${r.sender}</strong>
                <span class="text-neutral-500">${new Date(r.sentAt).toLocaleString()}</span>
            </div>
            <p class="font-sans text-xs text-neutral-300 leading-relaxed">${r.text}</p>
            <div class="text-[9px] text-emerald-400 font-mono">✓ Delivered to ${selectedInquiry.email}</div>
        </div>
    `).join('');

    panel.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div class="space-y-1">
                    <h3 class="font-display font-bold text-xl text-white">${selectedInquiry.subject || selectedInquiry.category}</h3>
                    <div class="font-mono text-xs text-neutral-400">
                        From: <strong class="text-cyan-400">${selectedInquiry.name}</strong> &lt;${selectedInquiry.email}&gt;
                    </div>
                    <div class="font-mono text-[10px] text-neutral-500">Category: ${selectedInquiry.category} · Received: ${new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="toggleInquiryStatus('${selectedInquiry.id}', 'unread')" class="px-2.5 py-1 text-[11px] border border-white/20 text-neutral-300 hover:text-white font-mono">
                        MARK UNREAD
                    </button>
                    <button onclick="toggleInquiryStatus('${selectedInquiry.id}', 'archived')" class="px-2.5 py-1 text-[11px] border border-white/20 text-neutral-300 hover:text-white font-mono">
                        ARCHIVE
                    </button>
                </div>
            </div>

            <!-- Original Message Body -->
            <div class="p-5 bg-black/60 border border-white/10 space-y-2">
                <span class="font-mono text-[10px] uppercase text-neutral-400">INBOUND TRANSMISSION:</span>
                <p class="font-sans text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap font-light">${selectedInquiry.message}</p>
            </div>

            <!-- Conversation History Thread -->
            ${selectedInquiry.replies && selectedInquiry.replies.length > 0 ? `
                <div class="space-y-3">
                    <span class="font-mono text-[10px] uppercase text-neutral-400">CONVERSATION THREAD:</span>
                    ${repliesHtml}
                </div>
            ` : ''}

            <!-- Reply Interface -->
            <form id="form-conn-reply" onsubmit="handleSendReply(event, '${selectedInquiry.id}')" class="space-y-4 pt-4 border-t border-white/10">
                <span class="font-mono text-[10px] uppercase text-cyan-400 block font-bold">REPLY FROM OFFICIAL I-TREX COMMUNICATIONS ENCLAVE</span>
                <textarea id="conn-reply-text" rows="4" placeholder="Draft professional response to ${selectedInquiry.name} (${selectedInquiry.email})..." class="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-cyan-400 font-sans text-xs leading-relaxed" required></textarea>
                <div class="flex items-center justify-between">
                    <span class="font-mono text-[10px] text-neutral-400">Sender: <strong>${currentUser.name} (${currentUser.email})</strong></span>
                    <button type="submit" class="chamfer-btn-primary !py-2.5 !px-6 text-xs">
                        <span>TRANSMIT OFFICIAL EMAIL REPLY</span>
                    </button>
                </div>
            </form>
        </div>
    `;

    // If marked unread, automatically mark as read on view
    if (selectedInquiry.status === 'unread') {
        toggleInquiryStatus(selectedInquiry.id, 'read', true);
    }

    if (window.lucide) window.lucide.createIcons();
}

async function toggleInquiryStatus(id, newStatus, silent = false) {
    try {
        const res = await fetch(`${API_BASE}/api/connections/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify(currentUser)
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) throw new Error('Status update failed');
        if (!silent) showToast(`Message marked as ${newStatus}`);
        await loadInitialAdminData();
        renderConnectionsInbox();
    } catch (e) {
        if (!silent) alert(e.message);
    }
}

async function handleSendReply(e, id) {
    e.preventDefault();
    const replyText = document.getElementById('conn-reply-text').value.trim();
    if (!replyText) return;

    try {
        const res = await fetch(`${API_BASE}/api/connections/${id}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-itrex-user': JSON.stringify(currentUser)
            },
            body: JSON.stringify({ replyText })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to dispatch email reply.');
        }

        const data = await res.json();
        showToast(`Reply delivered to ${data.inquiry.email}!`);
        await loadInitialAdminData();
        selectInquiry(id);

    } catch (err) {
        alert(err.message);
    }
}

/* ==========================================================================
   11. MODULE 8: SECURITY ENCLAVE & IMMUTABLE AUDIT LOGS
   ========================================================================== */
async function renderSecurityEnclave() {
    try {
        const res = await fetch(API_BASE + '/api/admin/audit-logs');
        if (!res.ok) return;
        const logs = await res.json();

        const countEl = document.getElementById('sec-audit-count');
        if (countEl) countEl.textContent = logs.length;

        const tbody = document.getElementById('audit-logs-table-body');
        if (!tbody) return;

        tbody.innerHTML = logs.map(l => `
            <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 px-6 text-neutral-400">${new Date(l.timestamp).toLocaleString()}</td>
                <td class="py-3 px-6 font-bold text-cyan-400">${l.action}</td>
                <td class="py-3 px-6 text-white">${l.actorName}</td>
                <td class="py-3 px-6 uppercase text-neutral-400 text-[10px]">${l.actorRole}</td>
                <td class="py-3 px-6 text-neutral-300 font-sans">${l.targetType}: ${l.targetId}</td>
                <td class="py-3 px-6 text-neutral-400 truncate max-w-xs font-sans">${l.details}</td>
            </tr>
        `).join('');

    } catch (e) {
        console.warn('[I-Trex Admin] Error rendering audit logs:', e.message);
    }
}

/* ==========================================================================
   12. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
    const toast = document.getElementById('admin-toast');
    const toastText = document.getElementById('admin-toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3500);
}
