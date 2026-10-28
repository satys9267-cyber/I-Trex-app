/**
 * I-Trex Innovations — Unified Database & Real-Time Sync Engine
 * Dual-Mode Engine:
 * 1. Client-Side: IndexedDB & LocalStorage with multi-tab Real-Time BroadcastChannel
 * 2. Cloud-Side: Auto-connects to Render / Node.js backend (/api) with PostgreSQL when deployed
 */

class ItrexDatabaseEngine {
    constructor() {
        this.channelName = 'itrex_realtime_mesh_v1';
        this.storagePrefix = 'itrex_db_';
        this.broadcastChannel = null;
        this.listeners = new Map();
        this.apiBaseUrl = window.ITREX_BACKEND_URL || 
                          localStorage.getItem('itrex_backend_url') || 
                          (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                              ? window.location.origin
                              : 'https://itrex-platform.onrender.com');
        this.isOnline = navigator.onLine;
        this.backendAvailable = false;

        this.init();
    }

    async init() {
        // Setup multi-tab real-time communication channel
        if ('BroadcastChannel' in window) {
            try {
                this.broadcastChannel = new BroadcastChannel(this.channelName);
                this.broadcastChannel.onmessage = (event) => {
                    this.handleRealtimeBroadcast(event.data);
                };
            } catch (e) {
                console.warn('BroadcastChannel initialization fallback:', e);
            }
        }

        // Window storage event fallback for cross-tab sync
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith(this.storagePrefix)) {
                const collection = e.key.replace(this.storagePrefix, '');
                this.triggerListeners(collection, this.getCollection(collection));
            }
        });

        // Initialize default seed collections if empty
        this.initSeedData();

        // Check if Render / Node.js backend is active
        this.checkBackendHealth();
    }

    async checkBackendHealth() {
        try {
            const res = await fetch(`${this.apiBaseUrl}/api/health`, { method: 'GET', headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                const data = await res.json();
                this.backendAvailable = true;
                this.triggerListeners('system', { status: 'connected', server: data });
                console.log('Connected to I-Trex Cloud Backend (Render/Node.js):', data);
            } else {
                this.backendAvailable = false;
            }
        } catch (e) {
            this.backendAvailable = false;
        }
    }

    initSeedData() {
        // 1. Initial Users
        if (!localStorage.getItem(this.storagePrefix + 'users')) {
            const seedUsers = [
                {
                    id: 'usr-001',
                    name: 'Satyam Swami',
                    email: 'satys9267@gmail.com',
                    token: 'fips_enclave_token_satyam',
                    role: 'admin',
                    title: 'Founder & Chief Architect',
                    department: 'Executive Systems & Kernel',
                    avatar: '👑',
                    phone: '+91 74998 25344',
                    bio: 'Founding visionary of I-Trex Innovations. Leading autonomous neural kernels, distributed edge architecture, and enterprise zero-trust systems.',
                    provider: 'Google OAuth (Verified)',
                    verified: true,
                    joinedAt: '2025-01-15T00:00:00.000Z',
                    totalShiftHours: '142.5'
                },
                {
                    id: 'usr-002',
                    name: 'Ishwari Patil',
                    email: 'ishwari.patil@itrex.internal',
                    password: '',
                    role: 'admin',
                    title: 'Co-Founder & AI Systems Lead',
                    department: 'Neural Systems & Core AI',
                    avatar: '🔬',
                    phone: '+91 98220 00000',
                    bio: 'Co-Founder at I-Trex Innovations. Leading autonomous neural architectures, deep inference models, and real-time distributed learning.',
                    provider: 'Google OAuth (Verified)',
                    verified: true,
                    joinedAt: '2025-02-01T00:00:00.000Z',
                    totalShiftHours: '118.0'
                }
            ];
            this.setCollection('users', seedUsers, false);
        }

        // 2. Initial Tasks
        if (!localStorage.getItem(this.storagePrefix + 'tasks')) {
            const seedTasks = [
                {
                    id: 'tsk-101',
                    title: 'Optimize TrexOS scheduler eBPF context-switch hook',
                    description: 'Achieve sub-0.35ms context switch on heterogeneous multi-core AMD EPYC server nodes.',
                    assignedTo: 'usr-001',
                    assigneeName: 'Satyam Swami',
                    priority: 'Critical',
                    status: 'in_progress', // todo, in_progress, review, completed
                    category: 'Core Kernel',
                    dueDate: '2026-11-04',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tsk-102',
                    title: 'Finalize WebGPU spatial 120 FPS neural inference pipeline',
                    description: 'Complete memory ring buffer and shader compilation benchmarks for TrexVision real-time feeds.',
                    assignedTo: 'usr-002',
                    assigneeName: 'Ishwari Patil',
                    priority: 'High',
                    status: 'todo',
                    category: 'Spatial AI',
                    dueDate: '2026-11-12',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tsk-103',
                    title: 'Deploy Singapore Edge Cluster (SG-EAST-01)',
                    description: 'Provision bare-metal nodes and configure BGP Anycast routing with zero packet loss.',
                    assignedTo: 'usr-002',
                    assigneeName: 'Ishwari Patil',
                    priority: 'High',
                    status: 'completed',
                    category: 'Infrastructure',
                    dueDate: '2026-10-25',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'tsk-104',
                    title: 'Zero-Trust automated honeypot quarantine protocol',
                    description: 'Implement eBPF system call verification with sub-4 millisecond lateral threat isolation.',
                    assignedTo: 'usr-001',
                    assigneeName: 'Satyam Swami',
                    priority: 'Critical',
                    status: 'review',
                    category: 'SecOps',
                    dueDate: '2026-11-01',
                    createdAt: new Date().toISOString()
                }
            ];
            this.setCollection('tasks', seedTasks, false);
        }

        // 3. Initial Team Collaborative Scratchpad / Notes
        if (!localStorage.getItem(this.storagePrefix + 'notes')) {
            const seedNotes = [
                {
                    id: 'note-01',
                    author: 'Satyam Swami',
                    authorAvatar: '👑',
                    text: 'Welcome to the I-Trex unified workspace. All tasks, shift logs, and profile records sync in real-time across terminals.',
                    timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    category: 'System Announcement'
                },
                {
                    id: 'note-02',
                    author: 'Ishwari Patil',
                    authorAvatar: '🔬',
                    text: 'Neural inference engine latency benchmark on SG-EAST-01 edge node verified under 12ms across distributed gateways.',
                    timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    category: 'Neural Systems'
                }
            ];
            this.setCollection('notes', seedNotes, false);
        }

        // 4. Initial Activity Logs
        if (!localStorage.getItem(this.storagePrefix + 'activity_logs')) {
            const seedLogs = [
                {
                    id: 'act-01',
                    user: 'Satyam Swami',
                    action: 'CLUSTER_INIT',
                    details: 'Zero-trust cryptographic enclave verified on node SG-EAST-01.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    level: 'SUCCESS'
                },
                {
                    id: 'act-02',
                    user: 'System Watchdog',
                    action: 'DATABASE_SYNC',
                    details: 'Real-time multi-tab replication channel established.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    level: 'INFO'
                }
            ];
            this.setCollection('activity_logs', seedLogs, false);
        }

        // 5. Initial Shift Logs
        if (!localStorage.getItem(this.storagePrefix + 'shifts')) {
            this.setCollection('shifts', [], false);
        }
    }

    // --- Core Storage Operations ---
    getCollection(name) {
        try {
            const raw = localStorage.getItem(this.storagePrefix + name);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error(`Error reading collection ${name}:`, e);
            return [];
        }
    }

    setCollection(name, data, broadcast = true) {
        try {
            localStorage.setItem(this.storagePrefix + name, JSON.stringify(data));
            if (broadcast) {
                this.broadcastChange(name, data);
            }
            this.triggerListeners(name, data);
            return true;
        } catch (e) {
            console.error(`Error saving collection ${name}:`, e);
            return false;
        }
    }

    broadcastChange(collection, data) {
        if (this.broadcastChannel) {
            try {
                this.broadcastChannel.postMessage({
                    type: 'COLLECTION_MUTATION',
                    collection,
                    data,
                    timestamp: Date.now()
                });
            } catch (e) {
                console.warn('Broadcast error:', e);
            }
        }
    }

    handleRealtimeBroadcast(message) {
        if (!message || message.type !== 'COLLECTION_MUTATION') return;
        this.triggerListeners(message.collection, message.data);
    }

    subscribe(collection, callback) {
        if (!this.listeners.has(collection)) {
            this.listeners.set(collection, new Set());
        }
        this.listeners.get(collection).add(callback);

        // Immediate callback with current state
        callback(this.getCollection(collection));

        return () => {
            const set = this.listeners.get(collection);
            if (set) set.delete(callback);
        };
    }

    triggerListeners(collection, data) {
        const set = this.listeners.get(collection);
        if (set) {
            set.forEach(cb => {
                try { cb(data); } catch (err) { console.error('Listener callback error:', err); }
            });
        }
    }

    // --- Entity Methods: Tasks ---
    getTasks() {
        return this.getCollection('tasks');
    }

    addTask(task) {
        const tasks = this.getTasks();
        const newTask = {
            id: 'tsk-' + Date.now().toString(36),
            title: task.title,
            description: task.description || '',
            assignedTo: task.assignedTo || 'usr-001',
            assigneeName: task.assigneeName || 'Satyam Swami',
            priority: task.priority || 'Medium',
            status: task.status || 'todo',
            category: task.category || 'General',
            dueDate: task.dueDate || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        this.setCollection('tasks', tasks);
        this.logActivity(newTask.assigneeName, 'TASK_CREATE', `Created task: "${newTask.title}" [${newTask.priority}]`, 'SUCCESS');
        this.logChange(newTask.assigneeName, newTask.assignedTo, 'TASK_CREATED', 'tasks', newTask.id, { title: newTask.title, priority: newTask.priority });
        this.addNotification({ userId: newTask.assignedTo, title: `New Task Assigned: ${newTask.title}`, message: `Priority: ${newTask.priority}`, type: 'info', link: 'dashboard.html#tasks' });
        this.syncWithBackend('POST', '/api/tasks', newTask);
        return newTask;
    }

    updateTask(id, updates) {
        const tasks = this.getTasks();
        const idx = tasks.findIndex(t => t.id === id);
        if (idx !== -1) {
            const oldStatus = tasks[idx].status;
            tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
            this.setCollection('tasks', tasks);
            if (updates.status && updates.status !== oldStatus) {
                this.logActivity(tasks[idx].assigneeName, 'TASK_STATUS_CHANGE', `Shifted "${tasks[idx].title}" to ${updates.status.toUpperCase()}`, 'INFO');
                this.logChange(tasks[idx].assigneeName, tasks[idx].assignedTo, 'TASK_STATUS_UPDATED', 'tasks', id, updates);
                if (updates.status === 'completed') {
                    this.addNotification({ userId: 'all', title: `Task Completed: ${tasks[idx].title}`, message: `Verified and marked complete.`, type: 'success', link: 'dashboard.html#tasks' });
                }
            }
            this.syncWithBackend('PUT', `/api/tasks/${id}`, tasks[idx]);
            return tasks[idx];
        }
        return null;
    }

    deleteTask(id) {
        const tasks = this.getTasks();
        const target = tasks.find(t => t.id === id);
        const filtered = tasks.filter(t => t.id !== id);
        this.setCollection('tasks', filtered);
        if (target) {
            this.logActivity('System', 'TASK_DELETE', `Archived task: "${target.title}"`, 'WARNING');
            this.logChange('System', 'usr-active', 'TASK_DELETED', 'tasks', id, { deletedId: id });
            this.syncWithBackend('DELETE', `/api/tasks/${id}`, {});
        }
        return true;
    }

    // --- Entity Methods: Users ---
    getUsers() {
        return this.getCollection('users');
    }

    getUserById(id) {
        return this.getUsers().find(u => u.id === id) || null;
    }

    getUserByEmail(email) {
        if (!email) return null;
        return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
    }

    saveUser(userData) {
        const users = this.getUsers();
        const existingIdx = users.findIndex(u => u.id === userData.id || u.email.toLowerCase() === userData.email.toLowerCase());
        if (existingIdx !== -1) {
            users[existingIdx] = { ...users[existingIdx], ...userData };
            this.setCollection('users', users);
            this.logActivity(userData.name, 'USER_UPDATE', `Profile details saved for ${userData.name}`, 'INFO');
            this.syncWithBackend('PUT', `/api/users/${userData.id}`, users[existingIdx]);
            return users[existingIdx];
        } else {
            const newUser = {
                id: userData.id || 'usr-' + Date.now().toString(36),
                joinedAt: new Date().toISOString(),
                ...userData
            };
            users.push(newUser);
            this.setCollection('users', users);
            this.logActivity(newUser.name, 'USER_REGISTER', `New user account initialized for ${newUser.name}`, 'SUCCESS');
            this.syncWithBackend('POST', '/api/users', newUser);
            return newUser;
        }
    }

    // --- Entity Methods: Notes / Collaborative Scratchpad ---
    getNotes() {
        return this.getCollection('notes');
    }

    addNote(note) {
        const notes = this.getNotes();
        const newNote = {
            id: 'note-' + Date.now().toString(36),
            author: note.author || 'User',
            authorAvatar: note.authorAvatar || '👤',
            text: note.text,
            category: note.category || 'General',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        notes.unshift(newNote);
        // Keep max 50 notes
        if (notes.length > 50) notes.pop();
        this.setCollection('notes', notes);
        this.syncWithBackend('POST', '/api/notes', newNote);
        return newNote;
    }

    // --- Entity Methods: Shift Logs ---
    logShift(shiftData) {
        const shifts = this.getCollection('shifts');
        const newShift = {
            id: 'shf-' + Date.now().toString(36),
            userId: shiftData.userId,
            userName: shiftData.userName,
            durationSeconds: shiftData.durationSeconds,
            durationFormatted: shiftData.durationFormatted,
            loggedAt: new Date().toISOString(),
            date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
        };
        shifts.unshift(newShift);
        this.setCollection('shifts', shifts);
        this.logActivity(shiftData.userName, 'SHIFT_LOG', `Logged active shift session: ${shiftData.durationFormatted}`, 'SUCCESS');
        this.syncWithBackend('POST', '/api/shifts', newShift);
        return newShift;
    }

    // --- Activity Audit Logging ---
    logActivity(user, action, details, level = 'INFO') {
        const logs = this.getCollection('activity_logs');
        const newLog = {
            id: 'act-' + Date.now().toString(36),
            user: user || 'Terminal User',
            action,
            details,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            level
        };
        logs.unshift(newLog);
        if (logs.length > 60) logs.pop();
        this.setCollection('activity_logs', logs);
    }

    // --- Change Logs & Audit Records Stream ---
    getChangeLogs() {
        return this.getCollection('change_logs') || [];
    }

    logChange(userName, userId, actionType, targetEntity, targetId, details, level = 'INFO') {
        const logs = this.getChangeLogs();
        const newLog = {
            id: 'clog-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
            user_id: userId || 'usr-system',
            user_name: userName || 'System',
            action_type: actionType,
            target_entity: targetEntity,
            target_id: targetId || '',
            change_details: typeof details === 'object' ? JSON.stringify(details) : String(details || ''),
            level,
            created_at: new Date().toISOString()
        };
        logs.unshift(newLog);
        if (logs.length > 200) logs.pop();
        this.setCollection('change_logs', logs);
        this.syncWithBackend('POST', '/api/changelogs', newLog);
        return newLog;
    }

    // --- Real-Time Update Notifications ---
    getNotifications(userId = 'all') {
        const notifs = this.getCollection('notifications') || [];
        return notifs.filter(n => n.user_id === userId || n.user_id === 'all');
    }

    addNotification(notif) {
        const notifs = this.getCollection('notifications') || [];
        const newNotif = {
            id: 'notif-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
            user_id: notif.userId || notif.user_id || 'all',
            title: notif.title,
            message: notif.message,
            type: notif.type || 'info',
            is_read: false,
            link: notif.link || 'dashboard.html',
            created_at: new Date().toISOString()
        };
        notifs.unshift(newNotif);
        if (notifs.length > 100) notifs.pop();
        this.setCollection('notifications', notifs);
        this.syncWithBackend('POST', '/api/notifications', newNotif);
        return newNotif;
    }

    markNotificationAsRead(id) {
        const notifs = this.getCollection('notifications') || [];
        const target = notifs.find(n => n.id === id);
        if (target) {
            target.is_read = true;
            this.setCollection('notifications', notifs);
            this.syncWithBackend('PATCH', `/api/notifications/${id}/read`, {});
        }
    }

    markAllNotificationsAsRead(userId = 'all') {
        const notifs = this.getCollection('notifications') || [];
        notifs.forEach(n => {
            if (n.user_id === userId || n.user_id === 'all') {
                n.is_read = true;
            }
        });
        this.setCollection('notifications', notifs);
        this.syncWithBackend('PATCH', '/api/notifications/mark-all-read', {});
    }

    // --- Cloud Sync Helper (Render / Node.js Backend) ---
    async syncWithBackend(method, endpoint, body) {
        if (!this.backendAvailable) return;
        try {
            await fetch(`${this.apiBaseUrl}${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } catch (e) {
            console.warn(`Cloud sync failed for ${endpoint}:`, e);
        }
    }

    // --- Data Export & Backup ---
    exportDatabaseDump() {
        return {
            system: 'I-Trex Platform Enterprise DB',
            version: '2.4.0',
            exportedAt: new Date().toISOString(),
            users: this.getUsers(),
            tasks: this.getTasks(),
            notes: this.getNotes(),
            activity_logs: this.getCollection('activity_logs'),
            shifts: this.getCollection('shifts')
        };
    }
}

// Global database singleton
window.itrexDB = new ItrexDatabaseEngine();
