import {
    LayoutDashboard,
    Users,
    CalendarDays,
    FileBarChart,
    Building2,
    LogOut,
    BookOpen,
    Shield,
    Briefcase,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    BarChart3,
    ClipboardList,
    User,
} from 'lucide-react';

import type { Role } from '@/types/attendance';

type SidebarProps = {
    role: Role;
    page: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
    collapsed: boolean;
    onToggle: () => void;
};

export default function Sidebar({
    role,
    page,
    onNavigate,
    onLogout,
    collapsed,
    onToggle,
}: SidebarProps) {
    const navItems: Record<
        Role,
        { id: string; label: string; icon: React.ElementType }[]
    > = {
        admin: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Accounts', icon: Users },
            { id: 'departments', label: 'Departments', icon: Building2 },
            { id: 'schedules', label: 'Class Schedule', icon: CalendarDays },
            { id: 'calendar', label: 'Academic Calendar', icon: CalendarDays },
            { id: 'reports', label: 'Reports', icon: FileBarChart },
        ],
        secretary: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'attendance', label: 'Attendance Checker', icon: UserCheck },
            { id: 'tally', label: 'Tally Report', icon: BarChart3 },
        ],
        faculty: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'my-schedule', label: 'Class Schedule', icon: ClipboardList },
            { id: 'history', label: 'Attendance History', icon: CalendarDays },
            { id: 'profile', label: 'My Profile', icon: User },
        ],
    };

    const items = navItems[role];

    return (
        <aside
            className="flex h-screen shrink-0 flex-col transition-all duration-300"
            style={{
                width: collapsed ? '4rem' : '15rem',
                backgroundColor: '#ffffff',
                borderColor: '#eaeceb',
                borderWidth: 1,
            }}
        >
            <div className="flex items-center justify-between border-b border-[#eaeceb] p-5.5">
                {!collapsed && (
                    <div className="flex min-w-0 items-center gap-2.5">
                        {/* <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                            <BookOpen size={15} className="text-[#4B5563]" />
                        </div> */}

                        <p className="font-billion-dreams ml-10 text-4xl text-[#4B5563]">
                            Assessly
                        </p>
                    </div>
                )}

                {collapsed && (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                        <BookOpen size={15} className="text-[#4B5563]" />
                    </div>
                )}

                <button
                    onClick={onToggle}
                    className="ml-1 shrink-0 text-[#03070f] transition-colors hover:text-white"
                >
                    {collapsed ? (
                        <ChevronRight size={15} />
                    ) : (
                        <ChevronLeft size={15} />
                    )}
                </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
                {items.map((item) => {
                    const active = page === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            title={collapsed ? item.label : undefined}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                    ? 'bg-[#f5f7f9] text-[#131418]'
                                    : 'text-[#03070f] hover:bg-[#f5f7f9] hover:text-[#131418]'
                            } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon size={17} className="shrink-0" />

                            {!collapsed && (
                                <span className="truncate">{item.label}</span>
                            )}

                            {!collapsed && active && (
                                <ChevronRight
                                    size={13}
                                    className="ml-auto shrink-0 opacity-50"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-2">
                <button
                    onClick={onLogout}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#03070f] transition-all hover:bg-[#f5f7f9] hover:text-[#131418] ${
                        collapsed ? 'justify-center' : ''
                    }`}
                >
                    <LogOut size={17} className="shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
