/**
 * I-Trex Platform Seed Data & Database Models
 * Satyam's Unified Startup & Internal Workspace System
 */

const ITREX_INITIAL_DATA = {
  company: {
    name: "I-Trex",
    brandName: "I-TREX INNOVATIONS",
    founder: "Satyam",
    tagline: "The Autonomous Operating System & Edge Platform for Next-Gen Enterprises",
    heroHeading: "One Platform. Infinite Trajectory.",
    heroSubheading: "Bridging public innovation and private enterprise execution under a unified zero-gravity workspace.",
    mission: "To eliminate the friction between external market impact and internal engineering momentum through AI-augmented operating systems.",
    vision: "A world where every enterprise operates with zero latency, adaptive intelligence, and seamless transparency.",
    founded: "2025",
    headquarters: "Global Hub / Distributed",
    stats: [
      { label: "Active Edge Nodes", value: "84,200+", delta: "+38% this quarter" },
      { label: "Kernel Execution Speed", value: "0.42 ms", delta: "Sub-millisecond" },
      { label: "Enterprise Uptime", value: "99.998%", delta: "SLA Guaranteed" },
      { label: "Global Patents Filed", value: "14", delta: "Zero-Trust & AI" }
    ]
  },

  products: [
    {
      id: "prod-trexos",
      name: "TrexOS Neural Kernel",
      code: "TRX-01",
      category: "Core OS",
      badge: "Flagship",
      status: "Production v2.4",
      rating: 4.9,
      summary: "AI-native microkernel with distributed neural scheduling, zero-trust memory isolation, and sub-millisecond edge response.",
      description: "TrexOS replaces legacy POSIX thread schedulers with an autonomous neural orchestrator that anticipates resource spikes before they occur.",
      features: [
        "Sub-millisecond scheduling latency across heterogeneous cores",
        "Zero-trust microkernel memory isolation with hardware enclaves",
        "Distributed peer-to-peer telemetry mesh",
        "Autonomous AI agent execution sandbox"
      ],
      pricing: "$49 / node / month",
      leadArchitect: "Satyam & Elena Vance"
    },
    {
      id: "prod-trexcore",
      name: "TrexCore Cloud Mesh",
      code: "TRX-02",
      category: "Infrastructure",
      badge: "Enterprise",
      status: "Global Beta",
      rating: 4.8,
      summary: "Hyper-converged distributed compute mesh with automated geo-sharding, serverless micro-runtimes, and instant local sync.",
      description: "Deploy once, run simultaneously across 180+ global edge pops with automatic data residency compliance and zero cold-start overhead.",
      features: [
        "Multi-cloud automatic failover under 50ms",
        "Cold starts reduced to under 12ms globally",
        "Bidirectional edge-to-core state replication",
        "SOC 2 Type II and HIPAA compliant infrastructure"
      ],
      pricing: "Custom Enterprise SLA",
      leadArchitect: "Kavita Rao"
    },
    {
      id: "prod-trexvision",
      name: "TrexVision Spatial Engine",
      code: "TRX-03",
      category: "Perception & AI",
      badge: "New Release",
      status: "Release Candidate",
      rating: 4.9,
      summary: "High-performance multimodal spatial vision API engineered for ambient enterprise robotics, spatial computing, and visual telemetry.",
      description: "Direct WebGPU/Vulkan accelerated spatial intelligence processing 4K streams at 120 FPS on local edge silicons.",
      features: [
        "120 FPS real-time 3D pose and environment meshing",
        "Hardware-accelerated on-device neural acceleration",
        "Sensor fusion for LiDAR, stereo optics, and thermal feeds",
        "Zero cloud telemetry leakage mode for military & medical use"
      ],
      pricing: "$120 / stream channel",
      leadArchitect: "Marcus Chen"
    },
    {
      id: "prod-trexshield",
      name: "TrexShield Autonomous SecOps",
      code: "TRX-04",
      category: "Cybersecurity",
      badge: "SecOps",
      status: "Production v3.1",
      rating: 5.0,
      summary: "Autonomous self-healing cybersecurity fabric capable of predictive zero-day isolation and automated protocol defense.",
      description: "Monitors eBPF system calls at the kernel layer, neutralizing ransomware and lateral movement in under 4 milliseconds.",
      features: [
        "Autonomous kernel honeypot injection upon probing",
        "eBPF-level deep packet verification with zero overhead",
        "Instant cryptographical quarantine of compromised micro-containers",
        "Automated compliance evidence generation (ISO27001, FedRAMP)"
      ],
      pricing: "Included with TrexOS Enterprise",
      leadArchitect: "Satyam"
    }
  ],

  employees: [
    {
      id: "emp-001",
      name: "Satyam",
      email: "admin@itrex.internal",
      password: "admin",
      role: "admin",
      title: "Founder & Chief Architect",
      department: "Executive & Core Systems",
      status: "Active",
      avatar: "👑",
      joinedDate: "2025-01-15",
      location: "San Francisco / Global HQ",
      phone: "+1 (555) 019-8821",
      bio: "Founding visionary of I-Trex. Driving the convergence of autonomous kernels, anti-gravity computing, and distributed systems."
    },
    {
      id: "emp-002",
      name: "Elena Vance",
      email: "employee@itrex.internal",
      password: "employee",
      role: "employee",
      title: "Lead Systems Architect",
      department: "Kernel Engineering",
      status: "Active",
      avatar: "👩‍💻",
      joinedDate: "2025-04-10",
      location: "Zurich, Switzerland",
      phone: "+41 44 668 2011",
      bio: "Specializing in microkernel memory isolation, Rust concurrency, and distributed state consensus."
    },
    {
      id: "emp-003",
      name: "Marcus Chen",
      email: "marcus@itrex.internal",
      password: "employee",
      role: "employee",
      title: "Principal AI Research Engineer",
      department: "Neural & Vision Systems",
      status: "Active",
      avatar: "👨‍🔬",
      joinedDate: "2025-06-01",
      location: "San Francisco, CA",
      phone: "+1 (555) 019-3341",
      bio: "Focusing on low-precision quantization, spatial multimodal vision, and on-device neuromorphic models."
    },
    {
      id: "emp-004",
      name: "Sarah Miller",
      email: "sarah@itrex.internal",
      password: "employee",
      role: "employee",
      title: "VP of Product Experience",
      department: "Product & Growth",
      status: "Active",
      avatar: "🎨",
      joinedDate: "2025-08-20",
      location: "London, UK",
      phone: "+44 20 7946 0912",
      bio: "Crafting frictionless human-computer interactions, zero-gravity UI aesthetics, and enterprise onboarding."
    },
    {
      id: "emp-005",
      name: "Kavita Rao",
      email: "kavita@itrex.internal",
      password: "employee",
      role: "employee",
      title: "Cloud Infrastructure Lead",
      department: "Edge Infrastructure",
      status: "Active",
      avatar: "⚡",
      joinedDate: "2025-10-05",
      location: "Bengaluru, India",
      phone: "+91 80 4123 9980",
      bio: "Building resilient geo-distributed edge meshes, low-latency BGP routing, and Kubernetes auto-provisioning."
    }
  ],

  tasks: [
    {
      id: "tsk-101",
      title: "Optimize TrexOS scheduler context-switch overhead",
      description: "Profile eBPF scheduler hooks on AMD EPYC Zen 4 cores to achieve <0.35ms switch time.",
      assignedTo: "emp-002",
      assigneeName: "Elena Vance",
      priority: "Critical",
      status: "in_progress",
      dueDate: "2026-11-04",
      tags: ["Kernel", "Performance", "eBPF"]
    },
    {
      id: "tsk-102",
      title: "Finalize WebGPU pipeline for TrexVision 120 FPS benchmark",
      description: "Complete shader compilation pipeline and memory ring buffer tests for spatial point cloud ingestion.",
      assignedTo: "emp-003",
      assigneeName: "Marcus Chen",
      priority: "High",
      status: "todo",
      dueDate: "2026-11-12",
      tags: ["Vision", "WebGPU", "AI"]
    },
    {
      id: "tsk-103",
      title: "Publish interactive zero-gravity product documentation",
      description: "Sync public API references with TrexOS v2.4 Release Candidate specifications.",
      assignedTo: "emp-004",
      assigneeName: "Sarah Miller",
      priority: "Medium",
      status: "review",
      dueDate: "2026-10-31",
      tags: ["Docs", "Design", "Release"]
    },
    {
      id: "tsk-104",
      title: "Deploy Singapore edge cluster (SG-EAST-01)",
      description: "Provision 32 bare-metal nodes and configure BGP anycast routing with zero packet loss.",
      assignedTo: "emp-005",
      assigneeName: "Kavita Rao",
      priority: "High",
      status: "done",
      dueDate: "2026-10-25",
      tags: ["Infrastructure", "Network", "BGP"]
    },
    {
      id: "tsk-105",
      title: "Executive investor demo & security compliance audit review",
      description: "Conduct end-to-end dry run of the unified public/private workspace and verify role-based permissions.",
      assignedTo: "emp-001",
      assigneeName: "Satyam",
      priority: "Critical",
      status: "in_progress",
      dueDate: "2026-10-30",
      tags: ["Executive", "Compliance", "Security"]
    }
  ],

  auditLogs: [
    { id: "log-1", timestamp: "2026-10-28 12:15:30", user: "Satyam (Founder)", action: "SYSTEM_ACCESS", details: "Logged into Admin Executive Workspace. Security token verified.", level: "INFO" },
    { id: "log-2", timestamp: "2026-10-28 11:42:19", user: "Elena Vance", action: "CODE_DEPLOY", details: "Pushed patch v2.4.1 to TrexOS staging cluster (Passed 48/48 unit tests)", level: "SUCCESS" },
    { id: "log-3", timestamp: "2026-10-28 10:05:01", user: "Security Watchdog", action: "ZERO_TRUST_AUDIT", details: "All 5 employee role credentials verified. No privilege escalations detected.", level: "INFO" },
    { id: "log-4", timestamp: "2026-10-28 09:12:44", user: "Kavita Rao", action: "CLUSTER_EXPANSION", details: "Singapore SG-EAST-01 nodes transitioned to active state.", level: "SUCCESS" },
    { id: "log-5", timestamp: "2026-10-27 23:55:10", user: "System Telemetry", action: "BACKUP_SNAPSHOT", details: "Automated distributed snapshot saved to cold vault.", level: "INFO" }
  ],

  companyRoadmap: [
    { quarter: "Q1 2025", title: "Genesis & Neural Core", status: "Completed", desc: "Satyam initiates I-Trex. Architecture proof-of-concept for zero-trust microkernel." },
    { quarter: "Q3 2025", title: "TrexOS Alpha & Seed Round", status: "Completed", desc: "Successful execution of 0.42ms scheduler. Secured initial tier-one venture backing." },
    { quarter: "Q1 2026", title: "TrexCore Global Mesh", status: "Completed", desc: "Distributed edge network deployed across North America, Europe, and Asia." },
    { quarter: "Q3 2026", title: "TrexVision & Spatial Release", status: "In Progress", desc: "Enterprise pilots in automated robotics, aerospace, and spatial visual telemetry." },
    { quarter: "Q1 2027", title: "Autonomous Enterprise Fleet", status: "Upcoming", desc: "Full commercial availability of unified public & private self-governing workspace." }
  ]
};
