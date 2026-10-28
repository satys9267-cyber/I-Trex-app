-- =========================================================================
-- I-TREX INNOVATIONS — PRODUCTION MYSQL DATABASE SCHEMA (MVP)
-- Compatible with MySQL 8.0+, TiDB Cloud Serverless, MariaDB, Aiven, RDS
-- Designed for 24/7 Zero-Charge Free-Forever Cloud Hosting
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `itrex_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `itrex_db`;

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'employee',
    `title` VARCHAR(255) NULL,
    `department` VARCHAR(255) NULL,
    `phone` VARCHAR(100) NULL,
    `bio` TEXT NULL,
    `avatar` VARCHAR(50) DEFAULT '👤',
    `provider` VARCHAR(100) DEFAULT 'Google OAuth (Verified)',
    `verified` BOOLEAN DEFAULT TRUE,
    `total_shift_hours` VARCHAR(50) DEFAULT '0.0',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TASKS & SPRINT KANBAN TABLE
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `assigned_to` VARCHAR(100) NULL,
    `assignee_name` VARCHAR(255) NULL,
    `priority` VARCHAR(50) NOT NULL DEFAULT 'Medium',
    `status` VARCHAR(50) NOT NULL DEFAULT 'todo',
    `category` VARCHAR(100) DEFAULT 'General',
    `due_date` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_tasks_status` (`status`),
    INDEX `idx_tasks_assigned` (`assigned_to`),
    INDEX `idx_tasks_priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. REAL-TIME TEAM NOTES & SCRATCHPAD
CREATE TABLE IF NOT EXISTS `notes` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `author` VARCHAR(255) NOT NULL,
    `author_avatar` VARCHAR(50) DEFAULT '📝',
    `text` TEXT NOT NULL,
    `category` VARCHAR(100) DEFAULT 'General',
    `timestamp` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_notes_author` (`author`),
    INDEX `idx_notes_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EMPLOYEE WORKING SHIFTS & STOPWATCH LOGS
CREATE TABLE IF NOT EXISTS `shifts` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(100) NULL,
    `user_name` VARCHAR(255) NULL,
    `duration_seconds` INT NOT NULL DEFAULT 0,
    `duration_formatted` VARCHAR(50) NOT NULL DEFAULT '00:00:00',
    `date` VARCHAR(50) NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_shifts_user` (`user_id`),
    INDEX `idx_shifts_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. COMPLETE CHANGE LOGS & ZERO-TRUST AUDIT TRAIL
-- Records every single modification: who changed what, when, and before/after details
CREATE TABLE IF NOT EXISTS `change_logs` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(100) NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `action_type` VARCHAR(100) NOT NULL,
    `target_entity` VARCHAR(100) NOT NULL,
    `target_id` VARCHAR(100) NULL,
    `change_details` TEXT NULL,
    `ip_address` VARCHAR(100) DEFAULT '127.0.0.1',
    `level` VARCHAR(50) DEFAULT 'INFO',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_clogs_user` (`user_id`),
    INDEX `idx_clogs_action` (`action_type`),
    INDEX `idx_clogs_entity` (`target_entity`),
    INDEX `idx_clogs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. REAL-TIME UPDATE NOTIFICATIONS TABLE
-- Records in-app alerts and update broadcasts for each user or team-wide
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(100) NOT NULL DEFAULT 'all',
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'info',
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `link` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_notifs_user` (`user_id`),
    INDEX `idx_notifs_unread` (`is_read`),
    INDEX `idx_notifs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PUBLIC CONTACT TERMINAL & INQUIRIES
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) DEFAULT 'General',
    `message` TEXT NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'new',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_inquiries_email` (`email`),
    INDEX `idx_inquiries_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- INITIAL SEED RECORDS (MVP Foundation)
-- =========================================================================

-- Insert Founder & Co-Founder
INSERT INTO `users` (`id`, `name`, `email`, `role`, `title`, `department`, `phone`, `bio`, `avatar`, `provider`, `verified`, `total_shift_hours`)
VALUES 
('usr-001', 'Satyam Swami', 'satys9267@gmail.com', 'admin', 'Founder & Chief Architect', 'Executive Systems & Kernel', '+91 74998 25344', 'Founding visionary of I-Trex Innovations. Leading autonomous neural microkernels and distributed systems.', '👑', 'Google OAuth (Verified)', TRUE, '142.5'),
('usr-002', 'Ishwari Patil', 'ishwari.patil@itrex.internal', 'admin', 'Co-Founder & AI Systems Lead', 'Neural Systems & Core AI', '+91 98220 00000', 'Co-Founder at I-Trex Innovations. Leading distributed ML systems and spatial telemetry algorithms.', '🔬', 'Google OAuth (Verified)', TRUE, '118.0')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `title`=VALUES(`title`);

-- Insert Seed Tasks
INSERT INTO `tasks` (`id`, `title`, `description`, `assigned_to`, `assignee_name`, `priority`, `status`, `category`, `due_date`)
VALUES
('tsk-seed-01', 'TrexOS Deterministic Kernel v2.4 Release', 'Compile and benchmark microkernel Ring 0 memory enclaves with sub-0.35ms scheduling latency.', 'usr-001', 'Satyam Swami', 'Critical', 'in_progress', 'Kernel Architecture', '2026-11-05'),
('tsk-seed-02', 'Planetary State Sync Mesh Optimization', 'Deploy WireGuard mTLS consensus nodes across 12 edge cloud regions.', 'usr-002', 'Ishwari Patil', 'High', 'review', 'Distributed Mesh', '2026-11-08'),
('tsk-seed-03', 'eBPF Behavioral Quarantine Rule Set', 'Finalize zero-trust container threat isolation signatures with sub-4ms response.', 'usr-001', 'Satyam Swami', 'High', 'todo', 'SecOps Enclave', '2026-11-12'),
('tsk-seed-04', '120 FPS WebGPU Spatial SLAM Telemetry', 'Integrate robotics 3D odometry telemetry pipeline into founder dashboard.', 'usr-002', 'Ishwari Patil', 'Medium', 'completed', 'Spatial Perception', '2026-10-28')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- Insert Initial System Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `link`)
VALUES
('notif-seed-01', 'all', 'MySQL Database Online', 'Autonomous MySQL relational database initialized with full change logs & notification engine.', 'success', FALSE, 'dashboard.html'),
('notif-seed-02', 'usr-001', 'Welcome Founder Satyam Swami', 'Your I-Trex Workspace is fully synchronized across 24/7 cloud persistence.', 'info', FALSE, 'dashboard.html#profile'),
('notif-seed-03', 'all', 'Sprint Milestone Active', 'Sprint v2.4 is active: 4 Core Architecture Pillars synchronized.', 'update', FALSE, 'dashboard.html#tasks')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- Insert Seed Change Log Record
INSERT INTO `change_logs` (`id`, `user_id`, `user_name`, `action_type`, `target_entity`, `target_id`, `change_details`, `level`)
VALUES
('clog-seed-01', 'usr-001', 'Satyam Swami', 'SYSTEM_INIT', 'database', 'itrex_db', '{"event": "MySQL Schema Initialized", "tables": 7, "mode": "24/7 Zero Charges"}', 'INFO')
ON DUPLICATE KEY UPDATE `action_type`=VALUES(`action_type`);
