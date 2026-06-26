export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday';
export type UserStatus = 'active' | 'inactive';

export type Department = {
    id: number;
    code: string;
    name: string;
    facultyCount?: number;
};

export type Semester = {
    id: number;
    school_year_id: number;
    name: string;
    start_date: string;
    end_date: string;
};

export type Holiday = {
    id: number;
    semester_id: number;
    name: string;
    date: string;
};

export type SchoolYear = {
    id: number;
    year_label: string;
    is_active: boolean;
};

export type FacultyUser = {
    id: number;
    name: string;
    email: string;
    employeeId: string;
    dept: string;
    avatar: string;
};

export type AttendanceRecord = {
    faculty_id: number;
    status: AttendanceStatus;
};

export type ClassSchedule = {
    id: number;
    faculty_id: number;
    semester_id: number;
    faculty_name: string;
    semester_name: string;
    school_year_label?: string;
    subject_code: string;
    subject_name: string;
    day: string;
    start_time: string;
    end_time: string;
    room?: string;
};

export type MyProfile = {
    id: number;
    name: string;
    email: string;
    employee_id: string;
    department_code: string;
    department_name: string;
};

export type MonthlyAttendance = {
    month: string;
    present: number;
    absent: number;
    late: number;
};

export type MyClassSchedule = {
    id: number;
    subject_code: string;
    subject_name: string;
    day: string;
    start_time: string;
    end_time: string;
    room?: string;
    semester_name: string;
    school_year_label: string;
};

export function StatusBadge({ status }: { status: AttendanceStatus | '' }) {
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

export function RoleBadge({ role }: { role: Role }) {
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

export function UserStatusBadge({ status }: { status: UserStatus }) {
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

export function StatCard({
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

export function RateBar({ rate }: { rate: number }) {
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
