import { useState } from 'react';
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
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { usePage, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

// ===== TYPES =====
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

// ===== SAMPLE DATA =====

const DEPARTMENTS = [
    {
        id: 1,
        code: 'CITE',
        name: 'College of Information Technology Education',
        facultyCount: 12,
    },
    { id: 2, code: 'CED', name: 'College of Education', facultyCount: 18 },
    {
        id: 3,
        code: 'CBE',
        name: 'College of Business and Economics',
        facultyCount: 15,
    },
    { id: 4, code: 'CON', name: 'College of Nursing', facultyCount: 10 },
    {
        id: 5,
        code: 'CAS',
        name: 'College of Arts and Sciences',
        facultyCount: 20,
    },
];

const FACULTY_LIST: Faculty[] = [
    {
        id: 1,
        name: 'Juan dela Cruz',
        email: 'jdelacruz@university.edu',
        dept: 'CITE',
        position: 'Associate Professor',
        employeeId: 'EMP-001',
        status: 'active',
        avatar: 'JD',
    },
    {
        id: 2,
        name: 'Maria Santos',
        email: 'msantos@university.edu',
        dept: 'CED',
        position: 'Professor',
        employeeId: 'EMP-002',
        status: 'active',
        avatar: 'MS',
    },
    {
        id: 3,
        name: 'Roberto Mendoza',
        email: 'rmendoza@university.edu',
        dept: 'CBE',
        position: 'Assistant Professor',
        employeeId: 'EMP-003',
        status: 'active',
        avatar: 'RM',
    },
    {
        id: 4,
        name: 'Liza Reyes',
        email: 'lreyes@university.edu',
        dept: 'CON',
        position: 'Lecturer',
        employeeId: 'EMP-004',
        status: 'active',
        avatar: 'LR',
    },
    {
        id: 5,
        name: 'Carlos Torres',
        email: 'ctorres@university.edu',
        dept: 'CAS',
        position: 'Professor',
        employeeId: 'EMP-005',
        status: 'inactive',
        avatar: 'CT',
    },
    {
        id: 6,
        name: 'Ana Villanueva',
        email: 'avillanueva@university.edu',
        dept: 'CITE',
        position: 'Assistant Professor',
        employeeId: 'EMP-006',
        status: 'active',
        avatar: 'AV',
    },
    {
        id: 7,
        name: 'Miguel Ramos',
        email: 'mramos@university.edu',
        dept: 'CBE',
        position: 'Associate Professor',
        employeeId: 'EMP-007',
        status: 'active',
        avatar: 'MR',
    },
    {
        id: 8,
        name: 'Sofia Castillo',
        email: 'scastillo@university.edu',
        dept: 'CED',
        position: 'Professor',
        employeeId: 'EMP-008',
        status: 'active',
        avatar: 'SC',
    },
];

const TALLY_DATA: TallyRecord[] = [
    {
        facultyId: 1,
        name: 'Juan dela Cruz',
        dept: 'CITE',
        total: 90,
        present: 82,
        absent: 5,
        late: 3,
        rate: 94.4,
    },
    {
        facultyId: 2,
        name: 'Maria Santos',
        dept: 'CED',
        total: 90,
        present: 88,
        absent: 2,
        late: 0,
        rate: 97.8,
    },
    {
        facultyId: 3,
        name: 'Roberto Mendoza',
        dept: 'CBE',
        total: 90,
        present: 79,
        absent: 8,
        late: 3,
        rate: 91.1,
    },
    {
        facultyId: 4,
        name: 'Liza Reyes',
        dept: 'CON',
        total: 90,
        present: 85,
        absent: 3,
        late: 2,
        rate: 96.7,
    },
    {
        facultyId: 5,
        name: 'Carlos Torres',
        dept: 'CAS',
        total: 90,
        present: 70,
        absent: 15,
        late: 5,
        rate: 83.3,
    },
    {
        facultyId: 6,
        name: 'Ana Villanueva',
        dept: 'CITE',
        total: 90,
        present: 87,
        absent: 2,
        late: 1,
        rate: 97.8,
    },
    {
        facultyId: 7,
        name: 'Miguel Ramos',
        dept: 'CBE',
        total: 90,
        present: 83,
        absent: 4,
        late: 3,
        rate: 95.6,
    },
    {
        facultyId: 8,
        name: 'Sofia Castillo',
        dept: 'CED',
        total: 90,
        present: 86,
        absent: 3,
        late: 1,
        rate: 96.7,
    },
];

const INIT_ATTENDANCE: Record<number, AttendanceStatus | ''> = {
    1: 'present',
    2: 'present',
    3: 'late',
    4: '',
    5: '',
    6: 'present',
    7: 'absent',
    8: 'present',
};

const DEPT_CHART_DATA = [
    { dept: 'CITE', present: 10, absent: 1, late: 1 },
    { dept: 'CED', present: 16, absent: 1, late: 1 },
    { dept: 'CBE', present: 12, absent: 2, late: 1 },
    { dept: 'CON', present: 9, absent: 0, late: 1 },
    { dept: 'CAS', present: 15, absent: 3, late: 2 },
];

const MONTHLY_TREND = [
    { month: 'Aug', present: 88, absent: 5, late: 7 },
    { month: 'Sep', present: 85, absent: 8, late: 7 },
    { month: 'Oct', present: 90, absent: 4, late: 6 },
    { month: 'Nov', present: 87, absent: 6, late: 7 },
    { month: 'Dec', present: 83, absent: 10, late: 7 },
];

const PERSONAL_HISTORY: {
    date: string;
    day: string;
    status: AttendanceStatus;
}[] = [
    { date: '2024-12-20', day: 'Friday', status: 'present' },
    { date: '2024-12-19', day: 'Thursday', status: 'present' },
    { date: '2024-12-18', day: 'Wednesday', status: 'late' },
    { date: '2024-12-17', day: 'Tuesday', status: 'present' },
    { date: '2024-12-16', day: 'Monday', status: 'absent' },
    { date: '2024-12-13', day: 'Friday', status: 'present' },
    { date: '2024-12-12', day: 'Thursday', status: 'holiday' },
    { date: '2024-12-11', day: 'Wednesday', status: 'present' },
    { date: '2024-12-10', day: 'Tuesday', status: 'present' },
    { date: '2024-12-09', day: 'Monday', status: 'late' },
];

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

// ===== SIDEBAR =====

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
            { id: 'users', label: 'User Management', icon: Users },
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
                backgroundColor: '#1e3a5f',
            }}
        >
            {/* Logo */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
                {!collapsed && (
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                            <BookOpen size={15} className="text-blue-200" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm leading-tight font-semibold text-white">
                                AcadTrack
                            </p>
                            <p className="truncate text-xs text-blue-300">
                                Attendance System
                            </p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                        <BookOpen size={15} className="text-blue-200" />
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className="ml-1 shrink-0 text-blue-300 transition-colors hover:text-white"
                >
                    {collapsed ? (
                        <ChevronRight size={15} />
                    ) : (
                        <ChevronLeft size={15} />
                    )}
                </button>
            </div>

            {/* Role label */}
            {!collapsed && (
                <div className="border-b border-white/10 px-4 py-3">
                    <div className={`flex items-center gap-2 ${info.accent}`}>
                        <info.icon size={13} />
                        <span className="text-xs font-medium">
                            {info.label}
                        </span>
                    </div>
                </div>
            )}

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
                                    ? 'bg-white/15 text-white'
                                    : 'text-blue-200 hover:bg-white/8 hover:text-white'
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
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-blue-200 transition-all hover:bg-white/8 hover:text-white ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={17} className="shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

// ===== TOP BAR =====

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

// ===== LOGIN =====
// import { useForm } from '@inertiajs/react';

// function LoginScreen({ onLogin }: { onLogin: (r: Role) => void }) {
//     const { data, setData, post, processing, errors } = useForm({
//         email: '',
//         password: '',
//     });
//     const [selectedRole, setSelectedRole] = useState<Role>('admin');
//     const [showPw, setShowPw] = useState(false);

//     const emails: Record<Role, string> = {
//         admin: 'admin@university.edu',
//         secretary: 'secretary@university.edu',
//         faculty: 'faculty@university.edu',
//     };

//     const roles: {
//         value: Role;
//         label: string;
//         desc: string;
//         icon: React.ElementType;
//         border: string;
//     }[] = [
//         {
//             value: 'admin',
//             label: 'Admin',
//             desc: 'Full access',
//             icon: Shield,
//             border: 'border-red-300 bg-red-50 text-red-700',
//         },
//         {
//             value: 'secretary',
//             label: 'Secretary',
//             desc: 'Attendance',
//             icon: Briefcase,
//             border: 'border-amber-300 bg-amber-50 text-amber-700',
//         },
//         {
//             value: 'faculty',
//             label: 'Faculty',
//             desc: 'Personal view',
//             icon: GraduationCap,
//             border: 'border-green-300 bg-green-50 text-green-700',
//         },
//     ];

//     return (
//         <div
//             className="flex min-h-screen"
//             style={{ fontFamily: "'Inter', sans-serif" }}
//         >
//             {/* Left panel */}
//             {/* <div
//                 className="hidden w-[480px] shrink-0 flex-col justify-between p-12 lg:flex"
//                 style={{ backgroundColor: '#1e3a5f' }}
//             >
//                 <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
//                         <BookOpen size={20} className="text-white" />
//                     </div>
//                     <div>
//                         <p className="text-lg font-bold text-white">
//                             AcadTrack
//                         </p>
//                         <p className="text-xs text-blue-300">
//                             Attendance Monitoring System
//                         </p>
//                     </div>
//                 </div>

//                 <div>
//                     <h2 className="mb-4 text-4xl leading-tight font-bold text-white">
//                         Monitor Faculty
//                         <br />
//                         Attendance
//                         <br />
//                         with Precision.
//                     </h2>
//                     <p className="mb-10 text-sm leading-relaxed text-blue-200">
//                         A comprehensive platform for academic institutions to
//                         track, manage, and report faculty attendance across all
//                         departments and semesters.
//                     </p>
//                     <div className="space-y-3">
//                         {[
//                             {
//                                 icon: CheckCircle2,
//                                 text: 'Real-time daily attendance tracking',
//                             },
//                             {
//                                 icon: FileBarChart,
//                                 text: 'Automated tally reports & PDF/Excel exports',
//                             },
//                             {
//                                 icon: Building2,
//                                 text: 'Multi-department role-based management',
//                             },
//                         ].map(({ icon: I, text }) => (
//                             <div key={text} className="flex items-center gap-3">
//                                 <I
//                                     size={15}
//                                     className="shrink-0 text-blue-300"
//                                 />
//                                 <span className="text-sm text-blue-100">
//                                     {text}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="text-xs text-blue-400">
//                     © 2024–2025 University Academic Management System
//                 </div>
//             </div> */}

//             {/* Right panel */}
//             <div className="flex flex-1 items-center justify-center bg-[#f1f5f9] p-8">
//                 <div className="max-w-l w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
//                     <div className="mb-7">
//                         <h2 className="text-xl font-bold text-foreground">
//                             Welcome back
//                         </h2>
//                         <p className="mt-1 text-sm text-muted-foreground">
//                             Sign in to access your dashboard
//                         </p>
//                     </div>

//                     <div className="mb-5">
//                         <label className="mb-3 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
//                             Sign in as
//                         </label>
//                         <div className="grid grid-cols-3 gap-2">
//                             {roles.map(
//                                 ({ value, label, desc, icon: I, border }) => (
//                                     <button
//                                         key={value}
//                                         onClick={() => setSelectedRole(value)}
//                                         className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
//                                             selectedRole === value
//                                                 ? `${border} shadow-sm`
//                                                 : 'border-border bg-card hover:bg-muted'
//                                         }`}
//                                     >
//                                         <I
//                                             size={18}
//                                             className={
//                                                 selectedRole === value
//                                                     ? ''
//                                                     : 'text-muted-foreground'
//                                             }
//                                         />
//                                         <p
//                                             className={`text-xs font-semibold ${selectedRole === value ? '' : 'text-muted-foreground'}`}
//                                         >
//                                             {label}
//                                         </p>
//                                     </button>
//                                 ),
//                             )}
//                         </div>
//                     </div>

//                     <div className="mb-5 space-y-4">
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-foreground">
//                                 Email
//                             </label>
//                             {/* <input
//                                 type="email"
//                                 value={emails[selectedRole]}
//                                 readOnly
//                             /> */}
//                             <input
//                                 type="email"
//                                 value={data.email}
//                                 onChange={(e) =>
//                                     setData('email', e.target.value)
//                                 }
//                                 className="w-full rounded-lg border border-border bg-muted/50 px-3.5 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-foreground">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type={showPw ? 'text' : 'password'}
//                                     value={data.password}
//                                     onChange={(e) =>
//                                         setData('password', e.target.value)
//                                     }
//                                     className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
//                                 />
//                                 <button
//                                     onClick={() => setShowPw(!showPw)}
//                                     className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                                 >
//                                     <Eye size={15} />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="flex items-center justify-center text-xs">
//                             <button className="font-medium text-blue-600 hover:text-blue-700">
//                                 Forgot password?
//                             </button>
//                         </div>
//                     </div>

//                     <button
//                         disabled={processing}
//                         onClick={() => post(route('login'))}
//                         className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors"
//                         style={{ backgroundColor: '#1e3a5f' }}
//                         onMouseEnter={(e) =>
//                             (e.currentTarget.style.backgroundColor = '#2d5282')
//                         }
//                         onMouseLeave={(e) =>
//                             (e.currentTarget.style.backgroundColor = '#1e3a5f')
//                         }
//                     >
//                         Sign in
//                     </button>

//                     <p className="mt-5 text-center text-xs text-muted-foreground">
//                         © 2026 St. Michael`s College Inc. All rights reserved.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// ===== ADMIN: DASHBOARD =====

function AdminDashboard() {
    return (
        <div className="space-y-6 p-8">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    label="Total Faculty"
                    value={75}
                    icon={GraduationCap}
                    sub="across 5 departments"
                    color="bg-[#1e3a5f]"
                />
                <StatCard
                    label="Today Present"
                    value={62}
                    icon={CheckCircle2}
                    sub="of 72 teaching today"
                    color="bg-green-600"
                />
                <StatCard
                    label="Today Absent"
                    value={7}
                    icon={XCircle}
                    sub="faculty members"
                    color="bg-red-500"
                />
                <StatCard
                    label="Today Late"
                    value={3}
                    icon={Timer}
                    sub="faculty members"
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Attendance by Department
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Tuesday, June 24, 2024
                            </p>
                        </div>
                        <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none">
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={DEPT_CHART_DATA} barSize={16}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f4f8"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="dept"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar
                                dataKey="present"
                                name="Present"
                                fill="#16a34a"
                                radius={[3, 3, 0, 0]}
                            />
                            <Bar
                                dataKey="absent"
                                name="Absent"
                                fill="#dc2626"
                                radius={[3, 3, 0, 0]}
                            />
                            <Bar
                                dataKey="late"
                                name="Late"
                                fill="#ea580c"
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-5">
                        <h3 className="font-semibold text-foreground">
                            Monthly Trend
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            1st Semester 2024
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={210}>
                        <LineChart data={MONTHLY_TREND}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f4f8"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="present"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                name="Present"
                            />
                            <Line
                                type="monotone"
                                dataKey="absent"
                                stroke="#dc2626"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                name="Absent"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-semibold text-foreground">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {[
                            {
                                text: 'Attendance marked for CITE department (12 faculty)',
                                time: '2 min ago',
                                dot: 'bg-green-500',
                            },
                            {
                                text: 'New faculty registered: Ana Villanueva (CITE)',
                                time: '1 hour ago',
                                dot: 'bg-blue-500',
                            },
                            {
                                text: 'Tally report exported by Secretary Ana Reyes',
                                time: '3 hours ago',
                                dot: 'bg-purple-500',
                            },
                            {
                                text: 'Academic calendar updated for 1st Semester 2024',
                                time: 'Yesterday',
                                dot: 'bg-amber-500',
                            },
                            {
                                text: 'Holiday added: Feast of the Immaculate Conception (Dec 8)',
                                time: 'Dec 7',
                                dot: 'bg-gray-400',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 border-b border-border py-2 last:border-0"
                            >
                                <span
                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.dot}`}
                                />
                                <div>
                                    <p className="text-sm text-foreground">
                                        {item.text}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="mb-4 font-semibold text-foreground">
                            Current Semester
                        </h3>
                        <div className="space-y-2.5">
                            {[
                                { label: 'School Year', value: '2024–2025' },
                                { label: 'Semester', value: '1st Semester' },
                                { label: 'Start Date', value: 'Aug 12, 2024' },
                                { label: 'End Date', value: 'Dec 20, 2024' },
                                { label: 'Class Days', value: '90 days' },
                                { label: 'Holidays', value: '8 dates' },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-muted-foreground">
                                        {label}
                                    </span>
                                    <span
                                        className="font-medium text-foreground"
                                        style={{
                                            fontFamily:
                                                "'JetBrains Mono', monospace",
                                        }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className="rounded-xl p-5 text-white"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <p className="mb-1 text-xs text-blue-200">
                            Overall Attendance Rate
                        </p>
                        <p
                            className="text-4xl font-bold"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            94.2%
                        </p>
                        <p className="mt-1.5 text-xs text-blue-300">
                            ↑ 1.3% from last semester
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== ADMIN: USER MANAGEMENT =====

function AdminUsers({ onNavigate }: { onNavigate: (p: string) => void }) {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    const secretaries = [
        {
            id: 101,
            name: 'Ana Reyes',
            email: 'areyes@university.edu',
            dept: '—',
            position: 'Administrative Secretary',
            employeeId: 'SEC-001',
            status: 'active' as UserStatus,
            avatar: 'AR',
            role: 'secretary' as Role,
        },
        {
            id: 102,
            name: 'Carla Bautista',
            email: 'cbautista@university.edu',
            dept: '—',
            position: 'Administrative Secretary',
            employeeId: 'SEC-002',
            status: 'active' as UserStatus,
            avatar: 'CB',
            role: 'secretary' as Role,
        },
    ];

    const allUsers = [
        ...FACULTY_LIST.map((f) => ({ ...f, role: 'faculty' as Role })),
        ...secretaries,
    ];

    const filtered = allUsers.filter((u) => {
        const s =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const d = deptFilter === 'all' || u.dept === deptFilter;
        const r = roleFilter === 'all' || u.role === roleFilter;
        return s && d && r;
    });

    return (
        <div className="space-y-5 p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Search name or email..."
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
                        {DEPARTMENTS.map((d) => (
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
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#2d5282')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#1e3a5f')
                        }
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
                                        className={`px-5 py-3.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}
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
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${u.role === 'faculty' ? 'bg-[#1e3a5f]' : 'bg-amber-500'}`}
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
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                    <span>
                        Showing {filtered.length} of {allUsers.length} users
                    </span>
                    <div className="flex items-center gap-1">
                        <button className="rounded border border-border px-3 py-1.5 transition-colors hover:bg-muted">
                            Prev
                        </button>
                        <button
                            className="rounded border px-3 py-1.5 text-white"
                            style={{
                                backgroundColor: '#1e3a5f',
                                borderColor: '#1e3a5f',
                            }}
                        >
                            1
                        </button>
                        <button className="rounded border border-border px-3 py-1.5 transition-colors hover:bg-muted">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== ADMIN: ADD USER FORM =====

// type Department = {
//     id: number;
//     code: string;
//     name: string;
// };

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

// ===== ADMIN: DEPARTMENTS =====

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
        <div className="space-y-5 p-8">
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
// ===== ADMIN: ACADEMIC CALENDAR =====

function AdminCalendar() {
    const [holidays, setHolidays] = useState([
        { id: 1, name: 'National Heroes Day', date: '2024-08-26' },
        { id: 2, name: 'All Saints Day', date: '2024-11-01' },
        { id: 3, name: 'All Souls Day', date: '2024-11-02' },
        { id: 4, name: 'Bonifacio Day', date: '2024-11-30' },
        {
            id: 5,
            name: 'Feast of the Immaculate Conception',
            date: '2024-12-08',
        },
        { id: 6, name: 'Christmas Day', date: '2024-12-25' },
        { id: 7, name: 'Rizal Day', date: '2024-12-30' },
        { id: 8, name: "New Year's Day", date: '2025-01-01' },
    ]);

    const remove = (id: number) =>
        setHolidays((h) => h.filter((x) => x.id !== id));

    return (
        <div className="p-8">
            <div className="grid grid-cols-3 gap-5">
                <div className="space-y-5">
                    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-foreground">
                            Calendar Configuration
                        </h3>
                        {[
                            {
                                label: 'School Year',
                                type: 'select',
                                opts: [
                                    '2024 – 2025',
                                    '2023 – 2024',
                                    '2025 – 2026',
                                ],
                            },
                            {
                                label: 'Semester',
                                type: 'select',
                                opts: [
                                    '1st Semester',
                                    '2nd Semester',
                                    'Summer',
                                ],
                            },
                        ].map(({ label, type, opts }) => (
                            <div key={label}>
                                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {label}
                                </label>
                                <select className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none">
                                    {opts.map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Class Start Date
                            </label>
                            <input
                                type="date"
                                defaultValue="2024-08-12"
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Class End Date
                            </label>
                            <input
                                type="date"
                                defaultValue="2024-12-20"
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2 border-t border-border pt-4">
                            {[
                                { label: 'Total Calendar Days', value: '131' },
                                { label: 'Weekends Excluded', value: '37' },
                                {
                                    label: 'Holidays',
                                    value: `${holidays.length}`,
                                },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-muted-foreground">
                                        {label}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily:
                                                "'JetBrains Mono', monospace",
                                        }}
                                        className="font-medium"
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
                                <span>Class Days</span>
                                <span
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                        color: '#1e3a5f',
                                    }}
                                >
                                    90 days
                                </span>
                            </div>
                        </div>
                        <button
                            className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors"
                            style={{ backgroundColor: '#1e3a5f' }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    '#2d5282')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    '#1e3a5f')
                            }
                        >
                            Save Configuration
                        </button>
                    </div>
                </div>

                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                            Holidays & No-Class Days
                        </h3>
                        <button
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition-colors"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            <Plus size={13} /> Add Holiday
                        </button>
                    </div>
                    <div className="space-y-1.5">
                        {holidays.map((h) => (
                            <div
                                key={h.id}
                                className="group flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 transition-colors hover:bg-muted/70"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {h.name}
                                        </p>
                                        <p
                                            className="mt-0.5 text-xs text-muted-foreground"
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                            }}
                                        >
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
                                </div>
                                <button
                                    onClick={() => remove(h.id)}
                                    className="rounded p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-red-600"
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

// ===== ADMIN: REPORTS =====

function AdminReports() {
    const [deptFilter, setDeptFilter] = useState('all');
    const filtered =
        deptFilter === 'all'
            ? TALLY_DATA
            : TALLY_DATA.filter((t) => t.dept === deptFilter);

    return (
        <div className="space-y-5 p-8">
            <div className="grid grid-cols-4 gap-4">
                {[
                    {
                        label: 'Avg Attendance Rate',
                        value: '94.2%',
                        sub: '↑ Above 90% threshold',
                        subColor: 'text-green-600',
                    },
                    {
                        label: 'Faculty At Risk',
                        value: '2',
                        sub: 'Below 85% rate',
                        subColor: 'text-red-600',
                    },
                    {
                        label: 'Total Class Days',
                        value: '90',
                        sub: '1st Semester 2024',
                        subColor: 'text-muted-foreground',
                    },
                    {
                        label: 'Perfect Attendance',
                        value: '3',
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
                        {DEPARTMENTS.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>
                    <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                        <option>1st Semester 2024</option>
                        <option>2nd Semester 2024</option>
                    </select>
                    <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                        <option>SY 2024–2025</option>
                        <option>SY 2023–2024</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100">
                        <FileSpreadsheet size={14} /> Export Excel
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
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
                        1st Semester · SY 2024–2025 · Total Class Days: 90
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
                                <td
                                    className="px-4 py-3.5 text-center text-sm"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.total}
                                </td>
                                <td
                                    className="px-4 py-3.5 text-center text-sm font-bold text-green-600"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.present}
                                </td>
                                <td
                                    className="px-4 py-3.5 text-center text-sm font-bold text-red-600"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.absent}
                                </td>
                                <td
                                    className="px-4 py-3.5 text-center text-sm font-bold text-orange-600"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.late}
                                </td>
                                <td className="px-4 py-3.5">
                                    <RateBar rate={row.rate} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-border bg-muted/30">
                            <td className="px-6 py-3.5 text-sm font-bold">
                                Total
                            </td>
                            <td className="px-4 py-3.5" />
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {filtered.reduce((s, r) => s + r.total, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold text-green-600"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {filtered.reduce((s, r) => s + r.present, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold text-red-600"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {filtered.reduce((s, r) => s + r.absent, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold text-orange-600"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {filtered.reduce((s, r) => s + r.late, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    color: '#1e3a5f',
                                }}
                            >
                                94.2%
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

// ===== SECRETARY: DASHBOARD =====

function SecretaryDashboard() {
    const total = FACULTY_LIST.length;
    const marked = Object.values(INIT_ATTENDANCE).filter(
        (s) => s !== '',
    ).length;
    const presentN = Object.values(INIT_ATTENDANCE).filter(
        (s) => s === 'present',
    ).length;
    const absentN = Object.values(INIT_ATTENDANCE).filter(
        (s) => s === 'absent',
    ).length;
    const lateN = Object.values(INIT_ATTENDANCE).filter(
        (s) => s === 'late',
    ).length;

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
                                Today's Attendance Status
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Tuesday, June 24, 2024
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${(marked / total) * 100}%`,
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
                        {FACULTY_LIST.slice(0, 7).map((f) => {
                            const status = INIT_ATTENDANCE[f.id] as
                                | AttendanceStatus
                                | '';
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
                                    strokeDasharray={`${(marked / total) * 314} 314`}
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
                                    {Math.round((marked / total) * 100)}%
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
                            Today's Date
                        </p>
                        <p className="text-xl font-bold">June 24, 2024</p>
                        <p className="mt-1.5 text-xs text-blue-300">
                            1st Semester · Day 89 of 90
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== SECRETARY: ATTENDANCE CHECKER =====

function AttendanceChecker() {
    const [attendance, setAttendance] = useState<
        Record<number, AttendanceStatus | ''>
    >({ ...INIT_ATTENDANCE });
    const [date, setDate] = useState('2024-06-24');
    const [dept, setDept] = useState('all');

    const toggle = (id: number, status: AttendanceStatus) => {
        setAttendance((prev) => ({
            ...prev,
            [id]: prev[id] === status ? '' : status,
        }));
    };

    const visible =
        dept === 'all'
            ? FACULTY_LIST
            : FACULTY_LIST.filter((f) => f.dept === dept);
    const totalMarked = Object.values(attendance).filter(
        (v) => v !== '',
    ).length;

    return (
        <div className="space-y-5 p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                    <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Departments</option>
                        {DEPARTMENTS.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAttendance({ ...INIT_ATTENDANCE })}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                        <RefreshCw size={13} /> Reset
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <Save size={13} /> Save Attendance
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3">
                    <div className="flex items-center gap-4">
                        {(
                            ['present', 'absent', 'late'] as AttendanceStatus[]
                        ).map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <StatusBadge status={s} />
                                <span
                                    className="text-sm font-semibold"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {
                                        Object.values(attendance).filter(
                                            (v) => v === s,
                                        ).length
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                    <span
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {totalMarked} / {FACULTY_LIST.length} marked
                    </span>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Faculty
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Department
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
                            <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
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
                                    className={`transition-colors ${!cur ? 'bg-yellow-50/30 hover:bg-yellow-50/50' : 'hover:bg-muted/20'}`}
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
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
                                                <p className="text-xs text-muted-foreground">
                                                    {f.position}
                                                </p>
                                            </div>
                                        </div>
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
                                            className="px-4 py-3.5 text-center"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggle(f.id, status)
                                                }
                                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                                                    cur === status
                                                        ? status === 'present'
                                                            ? 'border-green-500 bg-green-500 text-white'
                                                            : status ===
                                                                'absent'
                                                              ? 'border-red-500 bg-red-500 text-white'
                                                              : 'border-orange-500 bg-orange-500 text-white'
                                                        : 'border-border bg-card hover:border-slate-400'
                                                }`}
                                            >
                                                {cur === status &&
                                                    (status === 'present' ? (
                                                        <CheckCircle2
                                                            size={13}
                                                        />
                                                    ) : status === 'absent' ? (
                                                        <X size={13} />
                                                    ) : (
                                                        <Clock size={13} />
                                                    ))}
                                            </button>
                                        </td>
                                    ))}
                                    <td className="px-4 py-3.5">
                                        <StatusBadge
                                            status={
                                                cur as AttendanceStatus | ''
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ===== SECRETARY: TALLY REPORT =====

function TallyReport() {
    return (
        <div className="space-y-5 p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                        <option>1st Semester 2024</option>
                        <option>2nd Semester 2024</option>
                    </select>
                    <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                        <option>All Departments</option>
                        {DEPARTMENTS.map((d) => (
                            <option key={d.code}>{d.code}</option>
                        ))}
                    </select>
                    <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                        <option>All Faculty</option>
                        {FACULTY_LIST.map((f) => (
                            <option key={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100">
                        <FileSpreadsheet size={14} /> Export Excel
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100">
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
                        1st Semester · SY 2024–2025 · Class Days: 90
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
                        {TALLY_DATA.map((row) => (
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
                                <td
                                    className="px-4 py-3.5 text-center text-sm"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.total}
                                </td>
                                <td
                                    className="px-4 py-3.5 text-center text-sm font-bold text-green-600"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.present}
                                </td>
                                <td
                                    className="px-4 py-3.5 text-center text-sm font-bold text-red-600"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.absent}
                                </td>
                                <td
                                    className="px-4 py-3.5 text-center text-sm font-bold text-orange-600"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {row.late}
                                </td>
                                <td className="px-4 py-3.5">
                                    <RateBar rate={row.rate} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-border bg-muted/30">
                            <td className="px-6 py-3.5 text-sm font-bold">
                                Total
                            </td>
                            <td className="px-4 py-3.5" />
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {TALLY_DATA.reduce((s, r) => s + r.total, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold text-green-600"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {TALLY_DATA.reduce((s, r) => s + r.present, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold text-red-600"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {TALLY_DATA.reduce((s, r) => s + r.absent, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold text-orange-600"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {TALLY_DATA.reduce((s, r) => s + r.late, 0)}
                            </td>
                            <td
                                className="px-4 py-3.5 text-center text-sm font-bold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    color: '#1e3a5f',
                                }}
                            >
                                94.2%
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

// ===== FACULTY: DASHBOARD =====

function FacultyDashboard() {
    const me = TALLY_DATA[0];
    return (
        <div className="space-y-6 p-8">
            <div className="grid grid-cols-4 gap-4">
                {[
                    {
                        label: 'Present',
                        value: me.present,
                        cls: 'bg-green-50 text-green-700 border border-green-200',
                        icon: CheckCircle2,
                    },
                    {
                        label: 'Absent',
                        value: me.absent,
                        cls: 'bg-red-50 text-red-700 border border-red-200',
                        icon: XCircle,
                    },
                    {
                        label: 'Late',
                        value: me.late,
                        cls: 'bg-orange-50 text-orange-700 border border-orange-200',
                        icon: Clock,
                    },
                    {
                        label: 'Attendance Rate',
                        value: `${me.rate}%`,
                        cls: 'bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/20',
                        icon: TrendingUp,
                    },
                ].map(({ label, value, cls, icon: I }) => (
                    <div
                        key={label}
                        className={`flex flex-col gap-2 rounded-xl p-5 ${cls}`}
                    >
                        <div className="flex items-center gap-2">
                            <I size={15} />
                            <span className="text-sm font-medium">{label}</span>
                        </div>
                        <span
                            className="text-4xl font-bold"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-5 font-semibold text-foreground">
                        Monthly Attendance Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={MONTHLY_TREND} barSize={22}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f4f8"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar
                                dataKey="present"
                                name="Present"
                                fill="#16a34a"
                                radius={[3, 3, 0, 0]}
                            />
                            <Bar
                                dataKey="absent"
                                name="Absent"
                                fill="#dc2626"
                                radius={[3, 3, 0, 0]}
                            />
                            <Bar
                                dataKey="late"
                                name="Late"
                                fill="#ea580c"
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
                        <h3 className="mb-4 self-start font-semibold text-foreground">
                            Attendance Rate
                        </h3>
                        <div className="relative h-36 w-36">
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
                                    stroke={
                                        me.rate >= 90
                                            ? '#16a34a'
                                            : me.rate >= 80
                                              ? '#ea580c'
                                              : '#dc2626'
                                    }
                                    strokeWidth="12"
                                    strokeDasharray={`${me.rate * 3.14} 314`}
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
                                    {me.rate}%
                                </span>
                                <span className="text-xs font-semibold text-green-600">
                                    Good
                                </span>
                            </div>
                        </div>
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            Target: ≥ 90% attendance rate
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <h4 className="mb-3 text-sm font-semibold text-foreground">
                            Semester Info
                        </h4>
                        <div className="space-y-2 text-sm">
                            {[
                                { l: 'School Year', v: '2024–2025' },
                                { l: 'Semester', v: '1st Semester' },
                                { l: 'Total Class Days', v: `${me.total}` },
                            ].map(({ l, v }) => (
                                <div key={l} className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {l}
                                    </span>
                                    <span
                                        className="font-medium"
                                        style={{
                                            fontFamily:
                                                "'JetBrains Mono', monospace",
                                        }}
                                    >
                                        {v}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                    Recent Attendance Records
                </h3>
                <div className="space-y-1.5">
                    {PERSONAL_HISTORY.slice(0, 5).map((rec) => (
                        <div
                            key={rec.date}
                            className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5"
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className="w-28 text-sm font-medium text-muted-foreground"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {rec.date}
                                </span>
                                <span className="text-sm text-foreground">
                                    {rec.day}
                                </span>
                            </div>
                            <StatusBadge status={rec.status} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ===== FACULTY: HISTORY =====

function FacultyHistory() {
    return (
        <div className="space-y-5 p-8">
            <div className="flex items-center gap-2">
                <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                    <option>1st Semester 2024</option>
                    <option>2nd Semester 2024</option>
                </select>
                <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none">
                    <option>All Months</option>
                    {[
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                    ].map((m) => (
                        <option key={m}>{m}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    {
                        label: 'Present',
                        value: 82,
                        cls: 'text-green-700 bg-green-50 border-green-200',
                    },
                    {
                        label: 'Absent',
                        value: 5,
                        cls: 'text-red-700 bg-red-50 border-red-200',
                    },
                    {
                        label: 'Late',
                        value: 3,
                        cls: 'text-orange-700 bg-orange-50 border-orange-200',
                    },
                    {
                        label: 'Holiday',
                        value: 8,
                        cls: 'text-gray-600 bg-gray-50 border-gray-200',
                    },
                ].map(({ label, value, cls }) => (
                    <div key={label} className={`rounded-xl border p-5 ${cls}`}>
                        <p className="mb-1 text-sm font-medium">{label}</p>
                        <p
                            className="text-3xl font-bold"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/40">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Date
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Day
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Remarks
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {PERSONAL_HISTORY.map((rec) => (
                            <tr
                                key={rec.date}
                                className="transition-colors hover:bg-muted/25"
                            >
                                <td
                                    className="px-6 py-3.5 text-sm text-foreground"
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {rec.date}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-muted-foreground">
                                    {rec.day}
                                </td>
                                <td className="px-4 py-3.5">
                                    <StatusBadge status={rec.status} />
                                </td>
                                <td className="px-4 py-3.5 text-sm text-muted-foreground">
                                    {rec.status === 'holiday'
                                        ? 'University Holiday'
                                        : rec.status === 'late'
                                          ? 'Arrived 15 minutes late'
                                          : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ===== FACULTY: PROFILE =====

function FacultyProfile() {
    const me = FACULTY_LIST[0];
    return (
        <div className="max-w-2xl space-y-5 p-8">
            <div className="rounded-xl border border-border bg-card p-8">
                <div className="mb-8 flex items-start gap-5">
                    <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        {me.avatar}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {me.name}
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {me.position}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <span
                                className="rounded-md px-2 py-1 text-xs font-semibold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    backgroundColor: 'rgba(30,58,95,0.1)',
                                    color: '#1e3a5f',
                                }}
                            >
                                {me.dept}
                            </span>
                            <UserStatusBadge status={me.status} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Email Address', value: me.email },
                        { label: 'Employee ID', value: me.employeeId },
                        {
                            label: 'Department',
                            value: 'College of Information Technology Education',
                        },
                        { label: 'Position', value: me.position },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                {label}
                            </label>
                            <div className="rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-7 flex items-center justify-end gap-3 border-t border-border pt-5">
                    <button className="rounded-lg border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted">
                        Cancel
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <Save size={14} /> Update Profile
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-5 font-semibold text-foreground">
                    Change Password
                </h3>
                <div className="space-y-4">
                    {[
                        'Current Password',
                        'New Password',
                        'Confirm New Password',
                    ].map((label) => (
                        <div key={label}>
                            <label className="mb-1.5 block text-sm font-medium text-foreground">
                                {label}
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== LAYOUT + ROUTING =====

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

// ===== ROOT =====
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
