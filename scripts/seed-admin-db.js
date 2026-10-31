const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'itrex_system_db.json');
let db = {};
if (fs.existsSync(dbPath)) {
    try {
        db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        db = {};
    }
}

// Preserve existing users or update roles
const existingUsers = db.users || [];
const userMap = new Map();
existingUsers.forEach(u => userMap.set(u.id, u));

// Define complete user roster
const seededUsers = [
    {
        id: 'usr-001',
        name: 'Satyam Swami',
        email: 'satys9267@gmail.com',
        role: 'founder',
        title: 'Founder & Chief Architect',
        department: 'Executive Systems & Kernel',
        avatar: '👑',
        phone: '+91 74998 25344',
        bio: 'Founding visionary of I-Trex Innovations. Leading autonomous neural microkernels, eBPF security enclaves, and distributed state consensus.',
        skills: ['Microkernel Systems', 'eBPF Security Enclaves', 'Consensus Protocols', 'Bare-Metal Rust'],
        social: {
            linkedin: 'https://linkedin.com/in/satyam-swami',
            github: 'https://github.com/satys9267-cyber',
            twitter: 'https://x.com/itrex_innovations'
        },
        provider: 'Google OAuth (Verified)',
        verified: true,
        status: 'active',
        totalShiftHours: '142.5',
        joiningDate: '2025-01-01',
        lastLoginAt: new Date().toISOString()
    },
    {
        id: 'usr-002',
        name: 'Ishwari Patil',
        email: 'ishwari.patil@itrex.internal',
        role: 'co-founder',
        title: 'Co-Founder & AI Systems Lead',
        department: 'Neural Systems & Core AI',
        avatar: '🔬',
        phone: '+91 98220 00000',
        bio: 'Co-Founder leading cognitive spatial perception engines, 120 FPS WebGPU neural acceleration, and low-latency edge inference models.',
        skills: ['Spatial Perception', 'WebGPU Engines', 'Edge Neural Models', 'Distributed ML'],
        social: {
            linkedin: 'https://linkedin.com/in/ishwari-patil',
            github: 'https://github.com/itrex-patil',
            twitter: 'https://x.com/itrex_ai'
        },
        provider: 'Google OAuth (Verified)',
        verified: true,
        status: 'active',
        totalShiftHours: '118.0',
        joiningDate: '2025-01-15'
    },
    {
        id: 'usr-003',
        name: 'Elena Vance',
        email: 'elena.vance@itrex.internal',
        role: 'employee',
        title: 'Lead Systems Architect',
        department: 'Kernel Architecture',
        avatar: '⚡',
        phone: '+91 98111 10001',
        bio: 'Microkernel memory isolation, Rust concurrency, and distributed consensus.',
        skills: ['Rust 2024', 'DMA Enclaves', 'Ring 0', 'Linux Kernel'],
        provider: 'Email/Password (Verified)',
        verified: true,
        status: 'active',
        totalShiftHours: '94.5',
        joiningDate: '2026-01-15',
        assignedProjects: ['TrexOS']
    },
    {
        id: 'usr-004',
        name: 'Marcus Chen',
        email: 'marcus.chen@itrex.internal',
        role: 'employee',
        title: 'Principal AI Research Engineer',
        department: 'Neural Systems',
        avatar: '🧠',
        phone: '+91 98111 10002',
        bio: 'Low-precision quantization, spatial vision, and on-device neuromorphic models.',
        skills: ['Quantization', 'Neuromorphic', 'WebGPU', 'PyTorch'],
        provider: 'Email/Password (Verified)',
        verified: true,
        status: 'active',
        totalShiftHours: '82.0',
        joiningDate: '2026-02-01',
        assignedProjects: ['TrexVision']
    },
    {
        id: 'usr-005',
        name: 'Sarah Miller',
        email: 'sarah.miller@itrex.internal',
        role: 'employee',
        title: 'VP of Product Experience',
        department: 'Product Experience',
        avatar: '🎨',
        phone: '+91 98111 10003',
        bio: 'Frictionless human-computer interactions and enterprise engineering design.',
        skills: ['HCI Architecture', 'Design Systems', 'Web Standards', 'TypeScript'],
        provider: 'Email/Password (Verified)',
        verified: true,
        status: 'active',
        totalShiftHours: '76.0',
        joiningDate: '2026-02-20',
        assignedProjects: ['TrexConnect', 'Developer Portal']
    },
    {
        id: 'usr-006',
        name: 'Alex Mercer',
        email: 'alex.mercer@itrex.internal',
        role: 'employee',
        title: 'Distributed Systems Engineer (Candidate)',
        department: 'Distributed Cloud Mesh',
        avatar: '🌐',
        phone: '+91 98111 22233',
        bio: 'Over 6 years in distributed systems engineering and BGP anycast networks. Seeking to contribute to TrexCore planetary mesh.',
        skills: ['WireGuard', 'mTLS', 'Go 1.23', 'BGP Anycast'],
        provider: 'Email/Password (Verified)',
        verified: true,
        status: 'pending_activation',
        totalShiftHours: '0.0',
        joiningDate: '2026-10-30',
        assignedProjects: ['TrexCore']
    }
];

// Merge seeded users into DB
db.users = seededUsers.map(u => {
    const existing = userMap.get(u.id);
    return existing ? { ...existing, ...u, role: u.role } : u;
});

// Seed Products (5 I-Trex Canonical Products)
db.products = [
    {
        id: 'trx-01',
        slug: 'trexos',
        code: 'TRX-01',
        name: 'TrexOS',
        tagline: 'Deterministic Neural Microkernel Architecture',
        category: 'Operating Systems & Kernel',
        status: 'published',
        stage: 'Production v2.4',
        assurance: '99.999% ASSURANCE',
        leadArchitect: 'Satyam Swami & Elena Vance',
        pricing: '$49 / node / month',
        shortDescription: 'Deterministic real-time microkernel operating system built for autonomous robotics, spatial computing, and safety-critical edge infrastructure.',
        detailedDescription: 'TrexOS replaces legacy POSIX thread schedulers with an autonomous neural orchestrator that anticipates resource spikes before they occur. Written in bare-metal memory-safe systems architecture, it guarantees sub-millisecond execution times for robotics, autonomous vehicles, and deep-edge nodes.',
        technologies: ['Bare-Metal Rust', 'eBPF Enclaves', 'Ring 0 Memory Barriers', 'Predictive Dispatch'],
        keyFeatures: [
            'Neural scheduling that predicts context switches before hardware latency strikes',
            'DMA Ring 0 protection shielding direct memory access from rogue processes',
            'Bare-metal compiled footprint of only 1.4 MB with zero external dependencies',
            'Real-time deterministic scheduling guaranteeing < 0.35ms latency'
        ],
        specs: {
            latency: '< 0.35 ms (EPYC Zen 4 Benchmark)',
            memory: 'Ring 0 Hardware Enclaves (Rust FFI)',
            overhead: 'Zero Userland Transition Overhead',
            footprint: '1.4 MB Binary Size'
        },
        banner: 'assets/images/itrex_logo_silver_transparent.png',
        demoLink: 'https://i-trex.internal/demo/trexos',
        githubLink: 'https://github.com/satys9267-cyber/I-Trex-app',
        docLink: 'https://docs.i-trex.internal/trexos',
        launchDate: '2026-04-15',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'trx-02',
        slug: 'trexcore',
        code: 'TRX-02',
        name: 'TrexCore',
        tagline: 'Planetary Edge Cloud Fabric & State Mesh',
        category: 'Distributed Cloud Mesh',
        status: 'published',
        stage: 'Global Beta',
        assurance: '180+ GLOBAL POPS',
        leadArchitect: 'Kavita Rao & Satyam Swami',
        pricing: '$0.00015 / req',
        shortDescription: 'Decentralized high-throughput compute mesh delivering planetary-scale zero-cold-start execution with millisecond consensus.',
        detailedDescription: 'Deploy once, execute simultaneously across 180+ global edge points of presence with automatic data residency compliance and zero cold-start overhead. TrexCore utilizes a peer-to-peer mTLS WireGuard mesh fabric that reconciles globally distributed state in sub-12ms.',
        technologies: ['Go 1.23 Edge Runtime', 'WireGuard mTLS', 'BGP Anycast', 'Byzantine State Consensus'],
        keyFeatures: [
            'Automatic data sovereignty enforcement (GDPR, HIPAA, and Indian DPDP compliant)',
            'Cross-cloud multi-region state replication with Byzantine Fault Tolerance',
            'Continuous health probes with zero-downtime rolling firmware upgrades',
            'Sub-12ms median global state reconciliation across 6 continents'
        ],
        specs: {
            latency: '11.4 ms Across 6 Continents',
            memory: '< 2 ms (Warm Memory Snapshot)',
            overhead: '< 45 ms Automatic Anycast Failover',
            footprint: '180+ Global Points of Presence'
        },
        banner: 'assets/images/itrex_logo_silver_transparent.png',
        demoLink: 'https://i-trex.internal/demo/trexcore',
        githubLink: 'https://github.com/satys9267-cyber/I-Trex-app',
        docLink: 'https://docs.i-trex.internal/trexcore',
        launchDate: '2026-06-01',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'trx-03',
        slug: 'trexvision',
        code: 'TRX-03',
        name: 'TrexVision',
        tagline: 'Spatial Intelligence & 120 FPS WebGPU Perception',
        category: 'Spatial AI & Vision',
        status: 'published',
        stage: 'Production v1.8',
        assurance: '120 FPS HARDWARE ACCELERATED',
        leadArchitect: 'Ishwari Patil & Marcus Chen',
        pricing: '$89 / stream / month',
        shortDescription: 'Photorealistic neural rendering and real-time volumetric spatial reasoning running entirely inside WebGPU hardware pipelines.',
        detailedDescription: 'TrexVision brings spatial machine learning to the client browser without remote cloud GPU latency. Utilizing WebGPU compute shaders and tensor decomposition, it processes live multi-camera feeds with sub-8ms 6-DOF tracking.',
        technologies: ['WebGPU Compute Shaders', 'WGSL Pipelines', 'TensorRT Quantization', '6-DOF Odometry'],
        keyFeatures: [
            'Real-time volumetric 3D neural reconstruction at 120 FPS',
            'Browser-native WebGPU acceleration with zero plugin downloads',
            'Dynamic occlusion culling and depth estimation with sub-8ms latency',
            'Multi-sensor fusion combining LiDAR, stereoscopic RGB, and IMU streams'
        ],
        specs: {
            latency: '< 8 ms Frame-to-Render',
            memory: '45 MB VRAM Allocation',
            overhead: '120 FPS Stable on Apple M-Series / RTX',
            footprint: 'Client-Side In-Browser Execution'
        },
        banner: 'assets/images/itrex_logo_silver_transparent.png',
        demoLink: 'https://i-trex.internal/demo/trexvision',
        githubLink: 'https://github.com/satys9267-cyber/I-Trex-app',
        docLink: 'https://docs.i-trex.internal/trexvision',
        launchDate: '2026-05-20',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'trx-04',
        slug: 'trexshield',
        code: 'TRX-04',
        name: 'TrexShield',
        tagline: 'eBPF Autonomous SecOps & Cryptographic Guard',
        category: 'Cybersecurity & SecOps',
        status: 'published',
        stage: 'Enterprise v3.1',
        assurance: 'ZERO-TRUST VERIFIED',
        leadArchitect: 'Devin Thorne & Satyam Swami',
        pricing: '$120 / cluster / month',
        shortDescription: 'Zero-trust kernel-level security fabric powered by continuous eBPF telemetry, anomaly trapping, and quantum-resistant encryption.',
        detailedDescription: 'TrexShield protects against zero-day supply chain compromises by monitoring every syscall at Ring 0. Rogue process behavior is trapped and neutralized within 2 microseconds before arbitrary code execution can compromise host memory.',
        technologies: ['eBPF Kernel Probes', 'Post-Quantum Kyber-1024', 'Memory Enclave Traps', 'Zero-Trust mTLS'],
        keyFeatures: [
            'Sub-2 microsecond kernel syscall interception and rogue process killing',
            'Cryptographic post-quantum key exchange protecting data in-flight',
            'Continuous SOC2 Type II and ISO 27001 automated audit proofs',
            'Zero performance penalty on production application workloads'
        ],
        specs: {
            latency: '< 2 µs Kernel Interception',
            memory: '< 0.8% CPU Overhead at 500k req/sec',
            overhead: 'Kyber-1024 Post-Quantum Key Exchange',
            footprint: 'Compatible with Kubernetes & Linux 6.x'
        },
        banner: 'assets/images/itrex_logo_silver_transparent.png',
        demoLink: 'https://i-trex.internal/demo/trexshield',
        githubLink: 'https://github.com/satys9267-cyber/I-Trex-app',
        docLink: 'https://docs.i-trex.internal/trexshield',
        launchDate: '2026-07-10',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'trx-05',
        slug: 'trexconnect',
        code: 'TRX-05',
        name: 'TrexConnect',
        tagline: 'Zero-Latency Aerospace Neural Interop Protocol',
        category: 'Aerospace & Telemetry',
        status: 'published',
        stage: 'Release Candidate',
        assurance: 'SUB-MICROSECOND INTEROP',
        leadArchitect: 'Sarah Miller & Satyam Swami',
        pricing: 'Enterprise Custom',
        shortDescription: 'High-density asynchronous RPC communication protocol engineered for inter-satellite links, avionics buses, and deep-space telemetry.',
        detailedDescription: 'TrexConnect eliminates JSON parsing latency with flat-binary zero-copy serialization. Designed to operate across intermittent radio links and satellite laser crosslinks, it guarantees transactional data integrity in high-loss environments.',
        technologies: ['Zero-Copy Binary Serialization', 'UDP Quick-Ack', 'Loss-Tolerant FEC', 'Laser Interop'],
        keyFeatures: [
            'Zero-copy memory mapped serialization delivering 10M messages/sec',
            'Forward Error Correction surviving up to 35% packet drops on deep-space links',
            'Hardware-accelerated cryptographic signing on FPGA and ASIC modules',
            'Unified bidirectional streaming protocol across ground and orbital nodes'
        ],
        specs: {
            latency: '< 0.08 µs Serialization Overhead',
            memory: 'Zero Allocations on Hot Path',
            overhead: 'Forward Error Correction up to 35% loss',
            footprint: 'C99 / Rust / Embedded compliant'
        },
        banner: 'assets/images/itrex_logo_silver_transparent.png',
        demoLink: 'https://i-trex.internal/demo/trexconnect',
        githubLink: 'https://github.com/satys9267-cyber/I-Trex-app',
        docLink: 'https://docs.i-trex.internal/trexconnect',
        launchDate: '2026-08-30',
        updatedAt: new Date().toISOString()
    }
];

// Seed Approval Requests (Alex Mercer activation)
db.approval_requests = [
    {
        id: 'appr-001',
        applicantId: 'usr-006',
        applicantName: 'Alex Mercer',
        applicantEmail: 'alex.mercer@itrex.internal',
        requestedDesignation: 'Distributed Systems Engineer',
        department: 'Distributed Cloud Mesh',
        bio: 'Over 6 years in distributed systems engineering and BGP anycast networks. Seeking to contribute to TrexCore planetary mesh.',
        status: 'pending', // 'pending' | 'approved' | 'rejected'
        emailVerified: true,
        submittedAt: '2026-10-30T10:15:00.000Z',
        decision: null
    }
];

// Seed Employee Tasks & Work Monitoring
db.employee_tasks = [
    {
        id: 'etask-001',
        employeeId: 'usr-003',
        employeeName: 'Elena Vance',
        project: 'TrexOS',
        title: 'Ring 0 DMA Enclave Memory Barrier Isolation',
        priority: 'Critical',
        status: 'in_progress',
        progress: 85,
        deadline: '2026-11-04',
        description: 'Validate zero userland transition overhead on EPYC Zen 4 benchmarks.'
    },
    {
        id: 'etask-002',
        employeeId: 'usr-004',
        employeeName: 'Marcus Chen',
        project: 'TrexVision',
        title: '120 FPS WebGPU Spatial Tensor Pipeline',
        priority: 'High',
        status: 'in_progress',
        progress: 70,
        deadline: '2026-11-10',
        description: 'Quantize spatial vision priors to INT4 for sub-8ms browser inferences.'
    },
    {
        id: 'etask-003',
        employeeId: 'usr-005',
        employeeName: 'Sarah Miller',
        project: 'Product Experience',
        title: 'Aerospace Design Token Specification v2.4',
        priority: 'Medium',
        status: 'completed',
        progress: 100,
        deadline: '2026-10-29',
        description: 'Finalize high-contrast HUD components and telemetry typography across desktop and mobile.'
    }
];

// Seed Work Submissions
db.work_submissions = [
    {
        id: 'sub-001',
        taskId: 'etask-001',
        employeeId: 'usr-003',
        employeeName: 'Elena Vance',
        commitHash: 'git-a4f91b8',
        repo: 'itrex-kernel/trexos-core',
        title: 'Memory Barrier FFI Benchmark Results',
        notes: 'Benchmarked Ring 0 enclave bindings on 64-core AMD EPYC. Average latency clocked at 0.342 ms, beating target threshold of 0.35 ms.',
        submittedAt: '2026-10-30T13:45:00.000Z',
        status: 'under_review'
    },
    {
        id: 'sub-002',
        taskId: 'etask-003',
        employeeId: 'usr-005',
        employeeName: 'Sarah Miller',
        commitHash: 'git-e8c14d2',
        repo: 'itrex-ui/aerospace-tokens',
        title: 'Design Token CSS Matrix v2.4 Published',
        notes: 'Completed chamfer button variables, glowing micro-stars styling, and bidirectional character reveal timing.',
        submittedAt: '2026-10-29T16:20:00.000Z',
        status: 'approved'
    }
];

// Seed Contact Inquiries / Connections
db.contact_inquiries = [
    {
        id: 'inq-001',
        name: 'Dr. Aris Thorne',
        email: 'aris.thorne@apexdynamics.tech',
        category: 'Autonomous Systems & AGVs',
        subject: 'TrexOS Deterministic Microkernel Integration for Industrial AGVs',
        message: 'We are engineering next-generation autonomous ground vehicles for automated gigafactories. We require sub-millisecond scheduling latency and memory protection. Could we schedule a technical briefing regarding TrexOS Ring 0 licensing?',
        status: 'unread',
        createdAt: '2026-10-30T14:22:00.000Z',
        replies: []
    },
    {
        id: 'inq-002',
        name: 'Maya Lin',
        email: 'maya.lin@skymesh.systems',
        category: 'Distributed Cloud Mesh',
        subject: 'TrexCore 180+ PoP Latency Guarantees for High-Frequency Telemetry',
        message: 'SkyMesh is evaluating multi-region edge clouds for our global drone fleet. We would like to benchmark TrexCore WireGuard state mesh against our existing infrastructure in Singapore and Frankfurt.',
        status: 'read',
        createdAt: '2026-10-30T09:10:00.000Z',
        replies: []
    },
    {
        id: 'inq-003',
        name: 'Vikram Mehta',
        email: 'vikram.mehta@cybershield.in',
        category: 'Cybersecurity & SecOps',
        subject: 'eBPF Zero-Trust Compliance Verification for Enterprise Banking Core',
        message: 'We are reviewing runtime kernel security solutions for Indian banking compliance under DPDP. Does TrexShield provide automated compliance proofs?',
        status: 'replied',
        createdAt: '2026-10-29T16:45:00.000Z',
        replies: [
            {
                id: 'rep-001',
                sender: 'Satyam Swami (Founder)',
                senderEmail: 'satys9267@gmail.com',
                text: 'Hello Vikram, our TrexShield architecture guarantees cryptographically isolated enclaves and generates continuous automated SOC2 Type II and DPDP proofs. I have initiated a technical whitepaper transmission to your email.',
                sentAt: '2026-10-29T18:00:00.000Z',
                delivered: true
            }
        ]
    }
];

// Seed Admin Audit Logs
db.admin_audit_logs = [
    {
        id: 'alog-seed-01',
        action: 'PLATFORM_INITIALIZATION',
        actorId: 'usr-001',
        actorName: 'Satyam Swami',
        actorRole: 'founder',
        targetType: 'system',
        targetId: 'itrex-admin-core',
        details: 'Admin Control Center v2.4 initialized with 20 Security Hardening Rules.',
        ipAddress: '127.0.0.1',
        timestamp: '2026-10-30T12:00:00.000Z'
    },
    {
        id: 'alog-seed-02',
        action: 'PRODUCT_PUBLISHED',
        actorId: 'usr-001',
        actorName: 'Satyam Swami',
        actorRole: 'founder',
        targetType: 'product',
        targetId: 'trx-01',
        details: 'Published TrexOS Flagship v2.4 to public ecosystem showroom.',
        ipAddress: '127.0.0.1',
        timestamp: '2026-10-30T12:30:00.000Z'
    }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully enriched itrex_system_db.json with Products, Users, Approvals, Tasks, Submissions, Connections, and Audit Logs!');
