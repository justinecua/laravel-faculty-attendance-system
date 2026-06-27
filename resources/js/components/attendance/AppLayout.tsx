import { useState } from 'react';
import { router } from '@inertiajs/react';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import type { Role } from '@/types/attendance';

type AppLayoutProps = {
    role: Role;
    userName: string;
    page: string;
    onNavigate: (page: string) => void;
    children: React.ReactNode;
};

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview and quick stats',
    },
    users: {
        title: 'User Management',
        subtitle: 'Manage faculty and secretary accounts',
    },
    'add-faculty': {
        title: 'Add Faculty Member',
        subtitle: 'Register a new faculty account',
    },
    'add-secretary': {
        title: 'Add Secretary',
        subtitle: 'Register a new secretary account',
    },
    departments: {
        title: 'Department Management',
        subtitle: 'Manage academic departments',
    },
    calendar: {
        title: 'Academic Calendar',
        subtitle: 'Configure school year and semester settings',
    },
    reports: {
        title: 'Attendance Reports',
        subtitle: 'System-wide tally and analytics',
    },
    attendance: {
        title: 'Attendance Checker',
        subtitle: 'Mark daily faculty attendance',
    },
    tally: {
        title: 'Tally Report',
        subtitle: 'Summarized attendance counts per faculty',
    },
    history: {
        title: 'Attendance History',
        subtitle: 'Your day-by-day attendance records',
    },
    profile: {
        title: 'My Profile',
        subtitle: 'Personal information and account settings',
    },
    schedules: {
        title: 'Class Schedule',
        subtitle: 'Manage faculty class schedules',
    },
    'my-schedule': {
        title: 'Class Schedule',
        subtitle: 'Your assigned teaching schedule',
    },
};

export default function AppLayout({
    role,
    userName,
    page,
    onNavigate,
    children,
}: AppLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    const meta = PAGE_META[page] ?? {
        title: page,
        subtitle: '',
    };

    return (
        <div
            className="flex h-screen overflow-hidden bg-background"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <Sidebar
                role={role}
                page={page}
                onNavigate={onNavigate}
                onLogout={() => router.post('/logout')}
                collapsed={collapsed}
                onToggle={() => setCollapsed((current) => !current)}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <TopBar
                    title={meta.title}
                    subtitle={meta.subtitle}
                    role={role}
                    userName={userName}
                />

                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
