import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    FileBarChart,
    Building2,
    LogOut,
    Search,
    Plus,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    MoreHorizontal,
    Eye,
    Edit2,
    Bell,
    TrendingUp,
    BookOpen,
    User,
    FileSpreadsheet,
    FileText,
    Shield,
    Briefcase,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    X,
    Save,
    AlertTriangle,
    RefreshCw,
    BarChart3,
    Timer,
    UserX,
    UserCheck,
} from 'lucide-react';

import { usePage, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

type Role = 'admin' | 'secretary' | 'faculty';
type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';
type UserStatus = 'active' | 'inactive';

interface Faculty {
    id: number;
    name: string;
    email: string;
    dept: string;
    position: string;
    employeeId: string;
    status: UserStatus;
    avatar: string;
}

interface TallyRecord {
    facultyId: number;
    name: string;
    dept: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    rate: number;
}

// const PERSONAL_HISTORY: {
//     date: string;
//     day: string;
//     status: AttendanceStatus;
// }[] = [
//     { date: '2024-12-20', day: 'Friday', status: 'present' },
//     { date: '2024-12-19', day: 'Thursday', status: 'present' },
//     { date: '2024-12-18', day: 'Wednesday', status: 'late' },
//     { date: '2024-12-17', day: 'Tuesday', status: 'present' },
//     { date: '2024-12-16', day: 'Monday', status: 'absent' },
//     { date: '2024-12-13', day: 'Friday', status: 'present' },
//     { date: '2024-12-12', day: 'Thursday', status: 'holiday' },
//     { date: '2024-12-11', day: 'Wednesday', status: 'present' },
//     { date: '2024-12-10', day: 'Tuesday', status: 'present' },
//     { date: '2024-12-09', day: 'Monday', status: 'late' },
// ];

// ===== REUSABLE COMPONENTS =====

function StatusBadge({ status }: { status: AttendanceStatus | '' }) {
    const cfg: Record<string, { label: string; cls: string; dot: string }> = {
        present: {
            label: 'Present',
            cls: 'bg-green-50 text-green-700 border-green-200',
            dot: 'bg-green-500',
        },
        absent: {
            label: 'Absent',
            cls: 'bg-red-50 text-red-700 border-red-200',
            dot: 'bg-red-500',
        },
        late: {
            label: 'Late',
            cls: 'bg-orange-50 text-orange-700 border-orange-200',
            dot: 'bg-orange-500',
        },
        holiday: {
            label: 'Holiday',
            cls: 'bg-gray-50 text-gray-600 border-gray-200',
            dot: 'bg-gray-400',
        },
        '': {
            label: 'Not Marked',
            cls: 'bg-slate-50 text-slate-500 border-slate-200',
            dot: 'bg-slate-300',
        },
    };
    const { label, cls, dot } = cfg[status] ?? cfg[''];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}

function RoleBadge({ role }: { role: Role }) {
    const cfg = {
        admin: 'bg-red-50 text-red-700 border-red-200',
        secretary: 'bg-amber-50 text-amber-700 border-amber-200',
        faculty: 'bg-green-50 text-green-700 border-green-200',
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cfg[role]}`}
        >
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                status === 'active'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}
            />
            {status === 'active' ? 'Active' : 'Inactive'}
        </span>
    );
}

function StatCard({
    label,
    value,
    icon: Icon,
    sub,
    color,
}: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    sub?: string;
    color: string;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                    {label}
                </span>
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
                >
                    <Icon size={18} className="text-white" />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span
                    className="text-3xl font-bold text-foreground"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    {value}
                </span>
                {sub && (
                    <span className="mb-1 text-xs text-muted-foreground">
                        {sub}
                    </span>
                )}
            </div>
        </div>
    );
}

function RateBar({ rate }: { rate: number }) {
    const color =
        rate >= 90
            ? 'bg-green-500'
            : rate >= 80
              ? 'bg-orange-500'
              : 'bg-red-500';
    const textColor =
        rate >= 90
            ? 'text-green-600'
            : rate >= 80
              ? 'text-orange-600'
              : 'text-red-600';
    return (
        <div className="flex items-center justify-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${rate}%` }}
                />
            </div>
            <span
                className={`text-sm font-semibold ${textColor}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
                {rate}%
            </span>
        </div>
    );
}

function Sidebar({
    role,
    page,
    onNavigate,
    onLogout,
    collapsed,
    onToggle,
}: {
    role: Role;
    page: string;
    onNavigate: (p: string) => void;
    onLogout: () => void;
    collapsed: boolean;
    onToggle: () => void;
}) {
    const navItems: Record<
        Role,
        { id: string; label: string; icon: React.ElementType }[]
    > = {
        admin: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Accounts', icon: Users },
            { id: 'departments', label: 'Departments', icon: Building2 },
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
            { id: 'history', label: 'Attendance History', icon: CalendarDays },
            { id: 'profile', label: 'My Profile', icon: User },
        ],
    };

    const roleInfo = {
        admin: { label: 'Administrator', icon: Shield, accent: 'text-red-300' },
        secretary: {
            label: 'Secretary',
            icon: Briefcase,
            accent: 'text-amber-300',
        },
        faculty: {
            label: 'Faculty',
            icon: GraduationCap,
            accent: 'text-green-300',
        },
    };

    const info = roleInfo[role];
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
            {/* Logo */}
            <div className="flex items-center justify-between border-b border-[#eaeceb] p-5.5">
                {!collapsed && (
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                            <BookOpen size={15} className="text-[#4B5563]" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-billion-dreams ml-4 text-4xl text-[#4B5563]">
                                Assessly
                            </p>
                        </div>
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

            {/* Role label
            {!collapsed && (
                <div className="border-b border-white/10 px-4 py-3">
                    <div className={`flex items-center gap-2 ${info.accent}`}>
                        <info.icon size={13} className="text-[#03070f]" />
                        <span className="text-xs font-medium text-[#03070f]">
                            {info.label}
                        </span>
                    </div>
                </div>
            )} */}

            {/* Nav */}
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

            {/* Logout */}
            <div className="border-t border-white/10 p-2">
                <button
                    onClick={onLogout}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#03070f] transition-all hover:bg-[#f5f7f9] hover:text-[#131418] ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={17} className="shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

function TopBar({
    title,
    subtitle,
    role,
    userName,
}: {
    title: string;
    subtitle?: string;
    role: Role;
    userName: string;
}) {
    const roleColor = {
        admin: 'bg-red-500',
        secretary: 'bg-amber-500',
        faculty: 'bg-green-600',
    };
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    return (
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-8 py-4">
            <div>
                <h1 className="text-lg font-semibold text-foreground">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <div className="flex items-center gap-3">
                    <div
                        className={`h-9 w-9 rounded-full ${roleColor[role]} flex shrink-0 items-center justify-center text-sm font-semibold text-white`}
                    >
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm leading-tight font-medium text-foreground">
                            {userName}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {role}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

type AdminStats = {
    totalFaculty: number;
    totalSecretaries: number;
    totalDepartments: number;
    totalHolidays: number;
    currentSemester?: {
        name: string;
        start_date: string;
        end_date: string;
    };
    activeSchoolYear?: {
        year_label: string;
    };
};

function AdminDashboard() {
    const { adminStats, departments } = usePage().props as {
        adminStats: AdminStats;
        departments: Department[];
    };

    return (
        <div className="h-full space-y-6 bg-[#f9fbfc] p-8">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    label="Total Faculty"
                    value={adminStats.totalFaculty}
                    icon={GraduationCap}
                    sub="registered faculty"
                    color="bg-[#1e3a5f]"
                />

                <StatCard
                    label="Secretaries"
                    value={adminStats.totalSecretaries}
                    icon={Briefcase}
                    sub="registered secretaries"
                    color="bg-amber-500"
                />

                <StatCard
                    label="Departments"
                    value={adminStats.totalDepartments}
                    icon={Building2}
                    sub="academic departments"
                    color="bg-green-600"
                />

                <StatCard
                    label="Holidays"
                    value={adminStats.totalHolidays}
                    icon={CalendarDays}
                    sub="no-class days"
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-semibold text-foreground">
                        Faculty by Department
                    </h3>

                    <div className="space-y-3">
                        {departments?.map((dept) => (
                            <div
                                key={dept.id}
                                className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-semibold">
                                        {dept.code}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {dept.name}
                                    </p>
                                </div>

                                <p className="text-xl font-bold">
                                    {dept.facultyCount ?? 0}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-4 font-semibold text-foreground">
                        Current Semester
                    </h3>

                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                School Year
                            </span>
                            <span className="font-medium">
                                {adminStats.activeSchoolYear?.year_label ??
                                    'Not set'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Semester
                            </span>
                            <span className="font-medium">
                                {adminStats.currentSemester?.name ?? 'Not set'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Start Date
                            </span>
                            <span className="font-medium">
                                {adminStats.currentSemester?.start_date ??
                                    'Not set'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                End Date
                            </span>
                            <span className="font-medium">
                                {adminStats.currentSemester?.end_date ??
                                    'Not set'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

type AdminUser = {
    id: number;
    name: string;
    email: string;
    employeeId: string;
    role: Role;
    dept: string;
    departmentName: string;
    position: string;
    status: UserStatus;
    avatar: string;
};

function AdminUsers({ onNavigate }: { onNavigate: (p: string) => void }) {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    const { users = [], departments = [] } = usePage().props as {
        users?: AdminUser[];
        departments?: Department[];
    };

    const filtered = users.filter((u) => {
        const s =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.employeeId?.toLowerCase().includes(search.toLowerCase());

        const d = deptFilter === 'all' || u.dept === deptFilter;
        const r = roleFilter === 'all' || u.role === roleFilter;

        return s && d && r;
    });

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Search name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-56 rounded-lg border border-border bg-card py-2 pr-4 pl-8 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        />
                    </div>

                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Departments</option>
                        {departments?.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="faculty">Faculty</option>
                        <option value="secretary">Secretary</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onNavigate('add-secretary')}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                        <Plus size={14} /> Add Secretary
                    </button>

                    <button
                        onClick={() => onNavigate('add-faculty')}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <Plus size={14} /> Add Faculty
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                {[
                                    'Name',
                                    'Role',
                                    'Department',
                                    'Position',
                                    'Employee ID',
                                    'Status',
                                    'Actions',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className={`px-5 py-3.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase ${
                                            h === 'Actions'
                                                ? 'text-right'
                                                : 'text-left'
                                        }`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filtered.map((u) => (
                                <tr
                                    key={u.id}
                                    className="transition-colors hover:bg-muted/25"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                                                    u.role === 'faculty'
                                                        ? 'bg-[#1e3a5f]'
                                                        : 'bg-amber-500'
                                                }`}
                                            >
                                                {u.avatar}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {u.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <RoleBadge role={u.role} />
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className="text-sm font-medium"
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {u.dept}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="text-sm text-muted-foreground">
                                            {u.position}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className="text-xs font-medium"
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {u.employeeId}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <UserStatusBadge status={u.status} />
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                                                <Edit2 size={13} />
                                            </button>

                                            <button className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600">
                                                <UserX size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-8 text-center text-sm text-muted-foreground"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                    <span>
                        Showing {filtered.length} of {users?.length ?? 0} users
                    </span>
                </div>
            </div>
        </div>
    );
}

function AddUserForm({
    type,
    onBack,
}: {
    type: 'faculty' | 'secretary';

    onBack: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        employee_id: '',
        password: '',
        department_id: '',
    });

    const { departments } = usePage().props as {
        departments: Department[];
    };

    const submit = () => {
        const url =
            type === 'secretary' ? '/users/secretary' : '/users/faculty';

        post(url, {
            onSuccess: () => {
                toast.success(
                    type === 'secretary'
                        ? 'Secretary account created successfully.'
                        : 'Faculty account created successfully.',
                );

                reset();

                setTimeout(() => {
                    onBack();
                }, 1000);
            },
            onError: () => {
                toast.error(
                    'Please fix the errors before creating the account.',
                );
            },
        });
    };

    return (
        <div className="max-w-2xl p-8">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-sm"
            >
                <ChevronLeft size={15} /> Back to User Management
            </button>

            <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="text-xl font-semibold text-foreground">
                    {type === 'secretary'
                        ? 'Register Secretary Account'
                        : 'Register Faculty Account'}
                </h2>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Full Name *
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Ana Reyes"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="secretary@school.edu"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Employee ID *
                        </label>
                        <input
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            placeholder="SEC-001"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.employee_id && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>
                    {type === 'faculty' && (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Department *
                            </label>
                            <select
                                value={data.department_id}
                                onChange={(e) =>
                                    setData('department_id', e.target.value)
                                }
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                            >
                                <option value="">Select department</option>

                                {departments?.map((department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.code} — {department.name}
                                    </option>
                                ))}
                            </select>

                            {errors.department_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.department_id}
                                </p>
                            )}
                        </div>
                    )}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="text"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-border pt-5">
                        <button
                            onClick={onBack}
                            className="rounded-lg border px-5 py-2.5 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={processing}
                            onClick={submit}
                            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            <Save size={15} /> Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

type Department = {
    id: number;
    code: string;
    name: string;
    facultyCount?: number;
};

function AdminDepartments({
    onAddDepartment,
}: {
    onAddDepartment: () => void;
}) {
    const { departments } = usePage().props as {
        departments: Department[];
    };

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="flex justify-end">
                <button
                    onClick={onAddDepartment}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors"
                    style={{ backgroundColor: '#1e3a5f' }}
                >
                    <Plus size={14} /> Add Department
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {departments?.map((dept) => (
                    <div
                        key={dept.id}
                        className="group rounded-xl border border-border bg-card p-6"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: 'rgba(30,58,95,0.1)',
                                }}
                            >
                                <Building2
                                    size={18}
                                    style={{ color: '#1e3a5f' }}
                                />
                            </div>
                            <span
                                className="mb-2 inline-block rounded-md px-2.5 py-1 text-xs font-bold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    backgroundColor: 'rgba(30,58,95,0.1)',
                                    color: '#1e3a5f',
                                }}
                            >
                                {dept.code}
                            </span>
                        </div>

                        <h3 className="mb-4 text-sm leading-snug font-medium text-foreground">
                            {dept.name}
                        </h3>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Faculty Members
                            </p>
                            <p className="text-2xl font-bold">
                                {dept.facultyCount ?? 0}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AddDepartmentForm({ onBack }: { onBack: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        name: '',
    });

    const submit = () => {
        post('/departments', {
            onSuccess: () => {
                toast.success('Department added successfully.');
                reset();
                setTimeout(onBack, 800);
            },
            onError: () => {
                toast.error('Please fix the department details.');
            },
        });
    };

    return (
        <div className="max-w-2xl p-8">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-sm"
            >
                <ChevronLeft size={15} /> Back to Departments
            </button>

            <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="text-xl font-semibold text-foreground">
                    Register Department
                </h2>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Department Code *
                        </label>
                        <input
                            value={data.code}
                            onChange={(e) =>
                                setData('code', e.target.value.toUpperCase())
                            }
                            placeholder="e.g. CCS"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.code && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Department Name *
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. College of Computer Studies"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-border pt-5">
                        <button
                            onClick={onBack}
                            className="rounded-lg border px-5 py-2.5 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={processing}
                            onClick={submit}
                            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            <Save size={15} />
                            {processing ? 'Saving...' : 'Create Department'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

type Semester = {
    id: number;
    school_year_id: number;
    name: string;
    start_date: string;
    end_date: string;
};

type Holiday = {
    id: number;
    semester_id: number;
    name: string;
    date: string;
};

type SchoolYear = {
    id: number;
    year_label: string;
    is_active: boolean;
};

function AdminCalendar() {
    const {
        schoolYears = [],
        semesters = [],
        holidays = [],
    } = usePage().props as {
        schoolYears?: SchoolYear[];
        semesters?: Semester[];
        holidays?: Holiday[];
    };

    const schoolYearForm = useForm({
        year_label: '',
    });

    const configForm = useForm({
        school_year_id:
            schoolYears.find((year) => year.is_active)?.id?.toString() ?? '',
        semester_name: '',
        start_date: '',
        end_date: '',
    });

    const holidayForm = useForm({
        semester_id: '',
        name: '',
        date: '',
    });

    const addSchoolYear = () => {
        schoolYearForm.post('/school-years', {
            onSuccess: () => {
                toast.success('School year added.');
                schoolYearForm.reset();
            },
            onError: () => toast.error('Please check the school year.'),
        });
    };

    const activateSchoolYear = (id: number) => {
        router.patch(
            `/school-years/${id}/activate`,
            {},
            {
                onSuccess: () => toast.success('School year activated.'),
            },
        );
    };

    const saveConfig = () => {
        configForm.post('/calendar/configuration', {
            onSuccess: () => {
                toast.success('Semester saved.');
                configForm.reset('semester_name', 'start_date', 'end_date');
            },
            onError: () => toast.error('Please fix the semester details.'),
        });
    };

    const addHoliday = () => {
        holidayForm.post('/calendar/holidays', {
            onSuccess: () => {
                toast.success('Holiday added successfully.');
                holidayForm.reset();
            },
            onError: () => toast.error('Please fix the holiday details.'),
        });
    };

    const remove = (id: number) => {
        router.delete(`/calendar/holidays/${id}`, {
            onSuccess: () => toast.success('Holiday deleted.'),
        });
    };

    useEffect(() => {
        const activeYear = schoolYears.find((year) => year.is_active);

        if (activeYear && !configForm.data.school_year_id) {
            configForm.setData('school_year_id', activeYear.id.toString());
        }
    }, [schoolYears]);

    return (
        <div className="h-full bg-[#f9fbfc] p-8">
            <div className="grid grid-cols-3 gap-5">
                <div className="space-y-5">
                    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-foreground">
                            School Years
                        </h3>

                        <div className="flex gap-2">
                            <input
                                value={schoolYearForm.data.year_label}
                                onChange={(e) =>
                                    schoolYearForm.setData(
                                        'year_label',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. 2026–2027"
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                            />

                            <button
                                disabled={schoolYearForm.processing}
                                onClick={addSchoolYear}
                                className="rounded-lg px-4 py-2.5 text-sm text-white"
                                style={{ backgroundColor: '#1e3a5f' }}
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            {schoolYears.map((year) => (
                                <div
                                    key={year.id}
                                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {year.year_label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {year.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </p>
                                    </div>

                                    {!year.is_active && (
                                        <button
                                            onClick={() =>
                                                activateSchoolYear(year.id)
                                            }
                                            className="rounded-md border px-3 py-1 text-xs"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-foreground">
                            Calendar Configuration
                        </h3>

                        <select
                            value={configForm.data.school_year_id}
                            onChange={(e) =>
                                configForm.setData(
                                    'school_year_id',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        >
                            <option value="">Select school year</option>
                            {schoolYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    {year.year_label}
                                    {year.is_active ? ' (Active)' : ''}
                                </option>
                            ))}
                        </select>

                        <input
                            value={configForm.data.semester_name}
                            onChange={(e) =>
                                configForm.setData(
                                    'semester_name',
                                    e.target.value,
                                )
                            }
                            placeholder="Semester e.g. 1st Semester"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />

                        <input
                            type="date"
                            value={configForm.data.start_date}
                            onChange={(e) =>
                                configForm.setData('start_date', e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />

                        <input
                            type="date"
                            value={configForm.data.end_date}
                            onChange={(e) =>
                                configForm.setData('end_date', e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />

                        <button
                            disabled={configForm.processing}
                            onClick={saveConfig}
                            className="w-full rounded-lg py-2.5 text-sm font-medium text-white"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            {configForm.processing
                                ? 'Saving...'
                                : 'Save Semester'}
                        </button>
                    </div>
                </div>

                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-foreground">
                        Holidays & No-Class Days
                    </h3>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                        <select
                            value={holidayForm.data.semester_id}
                            onChange={(e) =>
                                holidayForm.setData(
                                    'semester_id',
                                    e.target.value,
                                )
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select semester</option>
                            {semesters?.map((semester) => {
                                const year = schoolYears.find(
                                    (schoolYear) =>
                                        schoolYear.id ===
                                        semester.school_year_id,
                                );

                                return (
                                    <option
                                        key={semester.id}
                                        value={semester.id}
                                    >
                                        {year?.year_label} - {semester.name}
                                    </option>
                                );
                            })}
                        </select>

                        <input
                            value={holidayForm.data.name}
                            onChange={(e) =>
                                holidayForm.setData('name', e.target.value)
                            }
                            placeholder="Holiday name"
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />

                        <input
                            type="date"
                            value={holidayForm.data.date}
                            onChange={(e) =>
                                holidayForm.setData('date', e.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />

                        <button
                            disabled={holidayForm.processing}
                            onClick={addHoliday}
                            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            <Plus size={13} /> Add
                        </button>
                    </div>

                    <div className="mt-5 space-y-1.5">
                        {holidays?.map((h) => (
                            <div
                                key={h.id}
                                className="group flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {h.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            h.date + 'T00:00:00',
                                        ).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <button
                                    onClick={() => remove(h.id)}
                                    className="rounded p-1 text-muted-foreground hover:text-red-600"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminReports() {
    const [deptFilter, setDeptFilter] = useState('all');
    const [semesterFilter, setSemesterFilter] = useState('all');

    const {
        tallyData = [],
        departments = [],
        semesters = [],
        schoolYears = [],
        adminStats,
    } = usePage().props as {
        tallyData?: TallyRow[];
        departments?: Department[];
        semesters?: Semester[];
        schoolYears?: SchoolYear[];
        adminStats?: {
            currentSemester?: {
                name: string;
                start_date: string;
                end_date: string;
            } | null;
            activeSchoolYear?: {
                year_label: string;
            } | null;
        };
    };

    const filtered =
        deptFilter === 'all'
            ? tallyData
            : tallyData.filter((t) => t.dept === deptFilter);

    const totalRecords = filtered.reduce((sum, row) => sum + row.total, 0);
    const totalPresent = filtered.reduce((sum, row) => sum + row.present, 0);
    const totalAbsent = filtered.reduce((sum, row) => sum + row.absent, 0);
    const totalLate = filtered.reduce((sum, row) => sum + row.late, 0);

    const avgRate =
        totalRecords > 0
            ? Number(
                  (((totalPresent + totalLate) / totalRecords) * 100).toFixed(
                      1,
                  ),
              )
            : 0;

    const facultyAtRisk = filtered.filter((row) => row.rate < 85).length;
    const perfectAttendance = filtered.filter(
        (row) => row.total > 0 && row.absent === 0 && row.late === 0,
    ).length;

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="grid grid-cols-4 gap-4">
                {[
                    {
                        label: 'Avg Attendance Rate',
                        value: `${avgRate}%`,
                        sub:
                            avgRate >= 90
                                ? '↑ Above 90% threshold'
                                : 'Below 90% threshold',
                        subColor:
                            avgRate >= 90
                                ? 'text-green-600'
                                : 'text-orange-600',
                    },
                    {
                        label: 'Faculty At Risk',
                        value: facultyAtRisk,
                        sub: 'Below 85% rate',
                        subColor:
                            facultyAtRisk > 0
                                ? 'text-red-600'
                                : 'text-green-600',
                    },
                    {
                        label: 'Total Records',
                        value: totalRecords,
                        sub: 'Saved attendance entries',
                        subColor: 'text-muted-foreground',
                    },
                    {
                        label: 'Perfect Attendance',
                        value: perfectAttendance,
                        sub: 'Faculty members',
                        subColor: 'text-muted-foreground',
                    },
                ].map(({ label, value, sub, subColor }) => (
                    <div
                        key={label}
                        className="rounded-xl border border-border bg-card p-5"
                    >
                        <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            {label}
                        </p>
                        <p
                            className="text-3xl font-bold"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            {value}
                        </p>
                        <p className={`mt-1 text-xs ${subColor}`}>{sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Departments</option>
                        {departments.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>

                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Semesters</option>

                        {semesters?.map((semester) => {
                            const year = schoolYears.find(
                                (schoolYear) =>
                                    schoolYear.id === semester.school_year_id,
                            );

                            return (
                                <option key={semester.id} value={semester.id}>
                                    {year?.year_label} - {semester.name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                        <FileSpreadsheet size={14} /> Export Excel
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <FileText size={14} /> Export PDF
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                    <h3 className="font-semibold text-foreground">
                        Attendance Tally Report
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {adminStats?.currentSemester?.name ?? 'No semester'} ·{' '}
                        {adminStats?.activeSchoolYear?.year_label ??
                            'No school year'}{' '}
                        · Total Records: {totalRecords}
                    </p>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/40">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Faculty Name
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Dept
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Total
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold tracking-wider text-green-600 uppercase">
                                Present
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold tracking-wider text-red-600 uppercase">
                                Absent
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold tracking-wider text-orange-600 uppercase">
                                Late
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Rate
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {filtered.map((row) => (
                            <tr
                                key={row.facultyId}
                                className="transition-colors hover:bg-muted/25"
                            >
                                <td className="px-6 py-3.5 text-sm font-medium text-foreground">
                                    {row.name}
                                </td>
                                <td className="px-4 py-3.5">
                                    <span
                                        className="rounded-md px-2 py-1 text-xs font-semibold"
                                        style={{
                                            fontFamily:
                                                "'JetBrains Mono', monospace",
                                            backgroundColor:
                                                'rgba(30,58,95,0.1)',
                                            color: '#1e3a5f',
                                        }}
                                    >
                                        {row.dept}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-center text-sm">
                                    {row.total}
                                </td>
                                <td className="px-4 py-3.5 text-center text-sm font-bold text-green-600">
                                    {row.present}
                                </td>
                                <td className="px-4 py-3.5 text-center text-sm font-bold text-red-600">
                                    {row.absent}
                                </td>
                                <td className="px-4 py-3.5 text-center text-sm font-bold text-orange-600">
                                    {row.late}
                                </td>
                                <td className="px-4 py-3.5">
                                    <RateBar rate={row.rate} />
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-8 text-center text-sm text-muted-foreground"
                                >
                                    No report data found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                    <tfoot>
                        <tr className="border-t-2 border-border bg-muted/30">
                            <td className="px-6 py-3.5 text-sm font-bold">
                                Total
                            </td>
                            <td className="px-4 py-3.5" />
                            <td className="px-4 py-3.5 text-center text-sm font-bold">
                                {totalRecords}
                            </td>
                            <td className="px-4 py-3.5 text-center text-sm font-bold text-green-600">
                                {totalPresent}
                            </td>
                            <td className="px-4 py-3.5 text-center text-sm font-bold text-red-600">
                                {totalAbsent}
                            </td>
                            <td className="px-4 py-3.5 text-center text-sm font-bold text-orange-600">
                                {totalLate}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold"
                                style={{ color: '#1e3a5f' }}
                            >
                                {avgRate}%
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

function SecretaryDashboard() {
    const { facultyUsers = [], attendanceRecords = [] } = usePage().props as {
        facultyUsers?: FacultyUser[];
        attendanceRecords?: AttendanceRecord[];
    };

    const total = facultyUsers.length;

    const presentN = attendanceRecords.filter(
        (record) => record.status === 'present',
    ).length;

    const absentN = attendanceRecords.filter(
        (record) => record.status === 'absent',
    ).length;

    const lateN = attendanceRecords.filter(
        (record) => record.status === 'late',
    ).length;

    const marked = presentN + absentN + lateN;

    return (
        <div className="space-y-6 p-8">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
                <StatCard
                    label="Present Today"
                    value={presentN}
                    icon={CheckCircle2}
                    color="bg-green-600"
                />
                <StatCard
                    label="Absent Today"
                    value={absentN}
                    icon={XCircle}
                    color="bg-red-500"
                />
                <StatCard
                    label="Late Today"
                    value={lateN}
                    icon={Timer}
                    color="bg-orange-500"
                />
                <StatCard
                    label="Not Marked"
                    value={total - marked}
                    icon={AlertTriangle}
                    color="bg-slate-400"
                />
                <StatCard
                    label="Total Faculty"
                    value={total}
                    icon={Users}
                    color="bg-[#1e3a5f]"
                />
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Today&apos;s Attendance Status
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: total
                                            ? `${(marked / total) * 100}%`
                                            : '0%',
                                        backgroundColor: '#1e3a5f',
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {marked}/{total} marked
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {facultyUsers.slice(0, 7).map((f) => {
                            const record = attendanceRecords.find(
                                (r) => r.faculty_id === f.id,
                            );

                            const status = record?.status ?? '';

                            return (
                                <div
                                    key={f.id}
                                    className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                            style={{
                                                backgroundColor: '#1e3a5f',
                                            }}
                                        >
                                            {f.avatar}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {f.name}
                                            </p>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                style={{
                                                    fontFamily:
                                                        "'JetBrains Mono', monospace",
                                                }}
                                            >
                                                {f.dept}
                                            </p>
                                        </div>
                                    </div>

                                    <StatusBadge status={status} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
                        <h3 className="mb-4 self-start font-semibold text-foreground">
                            Marking Progress
                        </h3>

                        <div className="relative h-32 w-32">
                            <svg
                                viewBox="0 0 120 120"
                                className="h-full w-full -rotate-90"
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#f1f5f9"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#1e3a5f"
                                    strokeWidth="12"
                                    strokeDasharray={`${
                                        total ? (marked / total) * 314 : 0
                                    } 314`}
                                    strokeLinecap="round"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span
                                    className="text-2xl font-bold"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {total
                                        ? Math.round((marked / total) * 100)
                                        : 0}
                                    %
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    done
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            {total - marked} faculty still need to be marked
                        </p>
                    </div>

                    <div
                        className="rounded-xl p-5 text-white"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <p className="mb-1 text-xs text-blue-200">
                            Today&apos;s Date
                        </p>
                        <p className="text-xl font-bold">
                            {new Date().toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

type FacultyUser = {
    id: number;
    name: string;
    email: string;
    employeeId: string;
    dept: string;
    avatar: string;
};

type AttendanceRecord = {
    faculty_id: number;
    status: AttendanceStatus;
};

function AttendanceChecker() {
    const {
        facultyUsers = [],
        attendanceRecords = [],
        departments = [],
    } = usePage().props as {
        facultyUsers?: FacultyUser[];
        attendanceRecords?: AttendanceRecord[];
        departments?: Department[];
    };

    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [dept, setDept] = useState('all');

    const [attendance, setAttendance] = useState<
        Record<number, AttendanceStatus | ''>
    >(
        Object.fromEntries(
            attendanceRecords.map((r) => [r.faculty_id, r.status]),
        ) as Record<number, AttendanceStatus | ''>,
    );

    useEffect(() => {
        fetch(`/attendance/records?date=${date}`)
            .then((res) => res.json())
            .then((records: AttendanceRecord[]) => {
                setAttendance(
                    Object.fromEntries(
                        records.map((r) => [r.faculty_id, r.status]),
                    ) as Record<number, AttendanceStatus | ''>,
                );
            });
    }, [date]);

    const toggle = (id: number, status: AttendanceStatus) => {
        setAttendance((prev) => ({
            ...prev,
            [id]: prev[id] === status ? '' : status,
        }));
    };

    const reset = () => setAttendance({});

    const saveAttendance = () => {
        const payload = Object.entries(attendance)
            .filter(([, status]) => status !== '')
            .map(([facultyId, status]) => ({
                faculty_id: Number(facultyId),
                status,
            }));

        router.post(
            '/attendance/store',
            { date, attendance: payload },
            {
                onSuccess: () =>
                    toast.success('Attendance saved successfully.'),
                onError: () => toast.error('Please mark at least one faculty.'),
            },
        );
    };

    const visible =
        dept === 'all'
            ? facultyUsers
            : facultyUsers.filter((f) => f.dept === dept);

    const present = Object.values(attendance).filter(
        (v) => v === 'present',
    ).length;
    const absent = Object.values(attendance).filter(
        (v) => v === 'absent',
    ).length;
    const late = Object.values(attendance).filter((v) => v === 'late').length;
    const marked = present + absent + late;

    const statusButtonClass = (current: string, status: AttendanceStatus) => {
        const active = current === status;

        if (!active) {
            return 'border-slate-200 bg-white text-transparent hover:border-slate-300';
        }

        if (status === 'present')
            return 'border-green-500 bg-green-500 text-white';
        if (status === 'absent') return 'border-red-500 bg-red-500 text-white';
        return 'border-orange-500 bg-orange-500 text-white';
    };

    return (
        <div className="space-y-5 bg-slate-50 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium"
                    />

                    <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium"
                    >
                        <option value="all">All Departments</option>
                        {departments.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold"
                    >
                        <RefreshCw size={15} /> Reset
                    </button>

                    <button
                        onClick={saveAttendance}
                        className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <Save size={15} /> Save Attendance
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <StatusBadge status="present" />
                        <span className="font-bold">{present}</span>

                        <StatusBadge status="absent" />
                        <span className="font-bold">{absent}</span>

                        <StatusBadge status="late" />
                        <span className="font-bold">{late}</span>
                    </div>

                    <span className="font-mono text-sm text-muted-foreground">
                        {marked} / {facultyUsers.length} marked
                    </span>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                Faculty
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                Department
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-green-600 uppercase">
                                Present
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-red-600 uppercase">
                                Absent
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-orange-600 uppercase">
                                Late
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {visible.map((f) => {
                            const cur = attendance[f.id] ?? '';

                            return (
                                <tr
                                    key={f.id}
                                    className={!cur ? 'bg-yellow-50/30' : ''}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                                                style={{
                                                    backgroundColor: '#1e3a5f',
                                                }}
                                            >
                                                {f.avatar}
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    {f.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Faculty Member
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-[#1e3a5f]">
                                            {f.dept}
                                        </span>
                                    </td>

                                    {(
                                        [
                                            'present',
                                            'absent',
                                            'late',
                                        ] as AttendanceStatus[]
                                    ).map((status) => (
                                        <td
                                            key={status}
                                            className="px-6 py-4 text-center"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggle(f.id, status)
                                                }
                                                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${statusButtonClass(
                                                    cur,
                                                    status,
                                                )}`}
                                            >
                                                {status === 'present' && (
                                                    <CheckCircle2 size={16} />
                                                )}
                                                {status === 'absent' && (
                                                    <X size={16} />
                                                )}
                                                {status === 'late' && (
                                                    <Clock size={16} />
                                                )}
                                            </button>
                                        </td>
                                    ))}

                                    <td className="px-6 py-4">
                                        <StatusBadge status={cur} />
                                    </td>
                                </tr>
                            );
                        })}

                        {visible.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No faculty found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

type TallyRow = {
    facultyId: number;
    name: string;
    dept: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    rate: number;
};

function TallyReport() {
    const [deptFilter, setDeptFilter] = useState('all');

    const {
        tallyData = [],
        departments = [],
        semesters = [],
    } = usePage().props as {
        tallyData?: TallyRow[];
        departments?: Department[];
        semesters?: Semester[];
    };

    const filtered =
        deptFilter === 'all'
            ? tallyData
            : tallyData.filter((t) => t.dept === deptFilter);

    return (
        <div className="space-y-5 p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
                        {semesters?.map((semester) => (
                            <option key={semester.id}>{semester.name}</option>
                        ))}
                    </select>

                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                        <option value="all">All Departments</option>
                        {departments?.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                    <h3 className="font-semibold text-foreground">
                        Attendance Tally Report
                    </h3>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/40">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase">
                                Faculty Name
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase">
                                Dept
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-muted-foreground uppercase">
                                Total
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-green-600 uppercase">
                                Present
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-red-600 uppercase">
                                Absent
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-orange-600 uppercase">
                                Late
                            </th>
                            <th className="px-4 py-3.5 text-center text-xs font-semibold text-muted-foreground uppercase">
                                Rate
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {filtered.map((row) => (
                            <tr key={row.facultyId}>
                                <td className="px-6 py-3.5 text-sm font-medium">
                                    {row.name}
                                </td>
                                <td className="px-4 py-3.5 text-sm">
                                    {row.dept}
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                    {row.total}
                                </td>
                                <td className="px-4 py-3.5 text-center font-bold text-green-600">
                                    {row.present}
                                </td>
                                <td className="px-4 py-3.5 text-center font-bold text-red-600">
                                    {row.absent}
                                </td>
                                <td className="px-4 py-3.5 text-center font-bold text-orange-600">
                                    {row.late}
                                </td>
                                <td className="px-4 py-3.5">
                                    <RateBar rate={row.rate} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

type MyProfile = {
    id: number;
    name: string;
    email: string;
    employee_id: string;
    department_code: string;
    department_name: string;
};

type MyAttendance = {
    date: string;
    status: AttendanceStatus;
    remarks?: string;
};

type MonthlyAttendance = {
    month: string;
    present: number;
    absent: number;
    late: number;
};

function FacultyDashboard() {
    const { myAttendance = [], adminStats } = usePage().props as {
        myAttendance?: MyAttendance[];
        adminStats?: {
            currentSemester?: {
                name: string;
                start_date: string;
                end_date: string;
            } | null;
            activeSchoolYear?: {
                year_label: string;
            } | null;
        };
    };

    const present = myAttendance.filter((r) => r.status === 'present').length;
    const absent = myAttendance.filter((r) => r.status === 'absent').length;
    const late = myAttendance.filter((r) => r.status === 'late').length;

    const total = myAttendance.length;

    const rate =
        total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 0;

    const monthlyData = myAttendance.reduce<MonthlyAttendance[]>(
        (months, record) => {
            const month = new Date(
                record.date + 'T00:00:00',
            ).toLocaleDateString('en-US', { month: 'short' });

            let currentMonth = months.find((item) => item.month === month);

            if (!currentMonth) {
                currentMonth = {
                    month,
                    present: 0,
                    absent: 0,
                    late: 0,
                };

                months.push(currentMonth);
            }

            if (record.status === 'present') currentMonth.present++;
            if (record.status === 'absent') currentMonth.absent++;
            if (record.status === 'late') currentMonth.late++;

            return months;
        },
        [],
    );

    const totalClassDays = total;

    const getDayName = (date: string) => {
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
        });
    };

    const rateLabel =
        rate >= 90 ? 'Good' : rate >= 75 ? 'Needs Improvement' : 'At Risk';

    return (
        <div className="space-y-6 bg-slate-50 p-8">
            {/* TOP CARDS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                        <CheckCircle2 size={18} />
                        Present
                    </div>
                    <p className="mt-3 text-4xl font-bold text-green-700">
                        {present}
                    </p>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                        <XCircle size={18} />
                        Absent
                    </div>
                    <p className="mt-3 text-4xl font-bold text-red-600">
                        {absent}
                    </p>
                </div>

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                        <Clock size={18} />
                        Late
                    </div>
                    <p className="mt-3 text-4xl font-bold text-orange-600">
                        {late}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-300 bg-slate-200 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1e3a5f]">
                        <TrendingUp size={18} />
                        Attendance Rate
                    </div>
                    <p className="mt-3 font-mono text-4xl font-bold text-[#1e3a5f]">
                        {rate}%
                    </p>
                </div>
            </div>

            {/* CHART + RATE */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-7 xl:col-span-2">
                    <h3 className="mb-7 text-xl font-bold text-foreground">
                        Monthly Attendance Breakdown
                    </h3>

                    {monthlyData.length === 0 ? (
                        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                            No attendance records yet.
                        </div>
                    ) : (
                        <div className="flex h-64 items-end justify-around gap-6 border-b border-dashed border-slate-200 px-6">
                            {monthlyData.map((month) => {
                                const max = Math.max(
                                    ...monthlyData.flatMap((item) => [
                                        item.present,
                                        item.absent,
                                        item.late,
                                    ]),
                                    1,
                                );

                                return (
                                    <div
                                        key={month.month}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="flex h-48 items-end gap-1.5">
                                            <div
                                                className="w-7 rounded-t bg-green-600"
                                                style={{
                                                    height: `${(month.present / max) * 100}%`,
                                                }}
                                                title={`Present: ${month.present}`}
                                            />
                                            <div
                                                className="w-7 rounded-t bg-red-600"
                                                style={{
                                                    height: `${(month.absent / max) * 100}%`,
                                                }}
                                                title={`Absent: ${month.absent}`}
                                            />
                                            <div
                                                className="w-7 rounded-t bg-orange-500"
                                                style={{
                                                    height: `${(month.late / max) * 100}%`,
                                                }}
                                                title={`Late: ${month.late}`}
                                            />
                                        </div>

                                        <span className="text-sm text-muted-foreground">
                                            {month.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-6 flex justify-center gap-5 text-sm">
                        <span className="flex items-center gap-2 text-green-600">
                            <span className="h-3 w-3 bg-green-600" />
                            Present
                        </span>
                        <span className="flex items-center gap-2 text-red-600">
                            <span className="h-3 w-3 bg-red-600" />
                            Absent
                        </span>
                        <span className="flex items-center gap-2 text-orange-500">
                            <span className="h-3 w-3 bg-orange-500" />
                            Late
                        </span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-xl border border-border bg-card p-7">
                        <h3 className="text-xl font-bold text-foreground">
                            Attendance Rate
                        </h3>

                        <div className="mt-7 flex flex-col items-center">
                            <div
                                className="relative flex h-40 w-40 items-center justify-center rounded-full"
                                style={{
                                    background: `conic-gradient(#16a34a ${rate * 3.6}deg, #e5e7eb 0deg)`,
                                }}
                            >
                                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-card">
                                    <span className="font-mono text-3xl font-bold">
                                        {rate}%
                                    </span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {rateLabel}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-5 text-center text-sm text-muted-foreground">
                                Target: ≥ 90% attendance rate
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="mb-5 text-lg font-bold text-foreground">
                            Semester Info
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    School Year
                                </span>
                                <span className="font-mono font-semibold">
                                    {adminStats?.activeSchoolYear?.year_label ??
                                        'Not configured'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Semester
                                </span>
                                <span className="font-mono font-semibold">
                                    {adminStats?.currentSemester?.name ??
                                        'Not configured'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Class Days
                                </span>
                                <span className="font-mono font-semibold">
                                    {totalClassDays}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT RECORDS */}
            <div className="rounded-xl border border-border bg-card p-7">
                <h3 className="mb-5 text-xl font-bold text-foreground">
                    Recent Attendance Records
                </h3>

                <div className="divide-y divide-border">
                    {myAttendance.slice(0, 10).map((record) => (
                        <div
                            key={record.date}
                            className="flex items-center justify-between py-4"
                        >
                            <div className="flex items-center gap-10">
                                <span className="w-28 font-mono text-sm font-semibold text-muted-foreground">
                                    {record.date}
                                </span>

                                <span className="text-sm font-medium text-foreground">
                                    {getDayName(record.date)}
                                </span>
                            </div>

                            <StatusBadge status={record.status} />
                        </div>
                    ))}

                    {myAttendance.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No attendance records found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function FacultyHistory() {
    const { myAttendance = [] } = usePage().props as {
        myAttendance?: MyAttendance[];
    };

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/40">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase">
                                Date
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase">
                                Remarks
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {myAttendance.map((rec) => (
                            <tr key={rec.date}>
                                <td className="px-6 py-3.5 text-sm">
                                    {rec.date}
                                </td>
                                <td className="px-4 py-3.5">
                                    <StatusBadge status={rec.status} />
                                </td>
                                <td className="px-4 py-3.5 text-sm text-muted-foreground">
                                    {rec.remarks ?? '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function FacultyProfile() {
    const { myProfile } = usePage().props as {
        myProfile?: MyProfile;
    };

    if (!myProfile) {
        return (
            <div className="p-8 text-sm text-muted-foreground">
                Profile not found.
            </div>
        );
    }

    return (
        <div className="h-full bg-[#f9fbfc]">
            <div className="max-w-2xl space-y-5 p-8">
                <div className="rounded-xl border border-border bg-card p-8">
                    <h2 className="text-xl font-semibold text-foreground">
                        {myProfile.name}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                                Email Address
                            </label>
                            <div className="rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
                                {myProfile.email}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                                Employee ID
                            </label>
                            <div className="rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
                                {myProfile.employee_id}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                                Department
                            </label>
                            <div className="rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
                                {myProfile.department_code} —{' '}
                                {myProfile.department_name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview and quick stats' },
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
};

const USER_NAMES: Record<Role, string> = {
    admin: 'System Administrator',
    secretary: 'Ana Reyes',
    faculty: 'Juan dela Cruz',
};

function AppLayout({ role, onLogout }: { role: Role; onLogout: () => void }) {
    const [page, setPage] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const meta = PAGE_META[page] ?? { title: page, subtitle: '' };

    const renderScreen = () => {
        if (role === 'admin') {
            if (page === 'dashboard') return <AdminDashboard />;
            if (page === 'users') return <AdminUsers onNavigate={setPage} />;
            if (page === 'add-faculty')
                return (
                    <AddUserForm
                        type="faculty"
                        onBack={() => setPage('users')}
                    />
                );
            if (page === 'add-secretary')
                return (
                    <AddUserForm
                        type="secretary"
                        onBack={() => setPage('users')}
                    />
                );
            if (page === 'departments')
                return (
                    <AdminDepartments
                        onAddDepartment={() => setPage('add-department')}
                    />
                );
            if (page === 'add-department')
                return (
                    <AddDepartmentForm onBack={() => setPage('departments')} />
                );
            if (page === 'calendar') return <AdminCalendar />;
            if (page === 'reports') return <AdminReports />;
        }
        if (role === 'secretary') {
            if (page === 'dashboard') return <SecretaryDashboard />;
            if (page === 'attendance') return <AttendanceChecker />;
            if (page === 'tally') return <TallyReport />;
        }
        if (role === 'faculty') {
            if (page === 'dashboard') return <FacultyDashboard />;
            if (page === 'history') return <FacultyHistory />;
            if (page === 'profile') return <FacultyProfile />;
        }
        return null;
    };

    return (
        <div
            className="flex h-screen overflow-hidden bg-background"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <Sidebar
                role={role}
                page={page}
                onNavigate={setPage}
                onLogout={() => router.post('/logout')}
                collapsed={collapsed}
                onToggle={() => setCollapsed((c) => !c)}
            />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <TopBar
                    title={meta.title}
                    subtitle={meta.subtitle}
                    role={role}
                    userName={USER_NAMES[role]}
                />
                <main className="flex-1 overflow-y-auto">{renderScreen()}</main>
            </div>
        </div>
    );
}

export default function AttendanceIndex() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const role: Role =
        user.role_id === 1
            ? 'admin'
            : user.role_id === 2
              ? 'secretary'
              : 'faculty';

    return <AppLayout role={role} onLogout={() => router.post('/logout')} />;
}
