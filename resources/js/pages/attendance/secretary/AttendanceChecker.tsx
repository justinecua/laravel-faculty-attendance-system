import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, RefreshCw, Save, X } from 'lucide-react';
import { toast } from 'sonner';

import {
    StatusBadge,
    type AttendanceRecord,
    type AttendanceStatus,
    type ClassSchedule,
    type Department,
    type FacultyUser,
} from '../shared';

export default function AttendanceChecker() {
    const {
        facultyUsers = [],
        attendanceRecords = [],
        departments = [],
        classSchedules = [],
        adminStats,
    } = usePage().props as {
        facultyUsers?: FacultyUser[];
        attendanceRecords?: AttendanceRecord[];
        departments?: Department[];
        classSchedules?: ClassSchedule[];
        adminStats?: {
            activeSchoolYear?: {
                year_label: string;
            } | null;
            currentSemester?: {
                name: string;
            } | null;
        };
    };

    const getToday = () => {
        const now = new Date();
        return now.toLocaleDateString('en-CA');
    };

    const [date, setDate] = useState(getToday());
    const selectedDay = new Date(date + 'T00:00:00').toLocaleDateString(
        'en-US',
        {
            weekday: 'long',
        },
    );

    const getFacultySchedules = (facultyId: number) => {
        return classSchedules.filter(
            (schedule) =>
                schedule.faculty_id === facultyId &&
                schedule.day === selectedDay,
        );
    };
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

    useEffect(() => {
        const timer = setInterval(() => {
            setDate((currentDate) => {
                const today = getToday();

                // only auto-update if user is still on today's date
                return currentDate < today ? today : currentDate;
            });
        }, 60000);

        return () => clearInterval(timer);
    }, []);

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

    const visible = facultyUsers.filter((faculty) => {
        const departmentMatches = dept === 'all' || faculty.dept === dept;

        const hasScheduleToday = classSchedules.some(
            (schedule) =>
                schedule.faculty_id === faculty.id &&
                schedule.day === selectedDay,
        );

        return departmentMatches && hasScheduleToday;
    });

    const present = visible.filter(
        (faculty) => attendance[faculty.id] === 'present',
    ).length;

    const absent = visible.filter(
        (faculty) => attendance[faculty.id] === 'absent',
    ).length;

    const late = visible.filter(
        (faculty) => attendance[faculty.id] === 'late',
    ).length;

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
        <div className="h-full space-y-5 bg-slate-50 p-8">
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

                    <div className="rounded-xl border border-border bg-card px-5 py-2">
                        <p className="text-sm text-foreground">
                            SY{' '}
                            <span className="text-[#1e3a5f]">
                                {adminStats?.activeSchoolYear?.year_label ??
                                    'Not set'}{' '}
                            </span>{' '}
                            {adminStats?.currentSemester?.name ??
                                'No active semester for today'}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground"></p>
                    </div>
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
                        {marked} / {visible.length} marked
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
                            const schedules = getFacultySchedules(f.id);

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

                                                <div className="mt-2 space-y-1">
                                                    {schedules.length > 0 ? (
                                                        schedules.map(
                                                            (schedule) => (
                                                                <div
                                                                    key={
                                                                        schedule.id
                                                                    }
                                                                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                                                                >
                                                                    <span className="font-semibold">
                                                                        {
                                                                            schedule.subject_code
                                                                        }
                                                                    </span>{' '}
                                                                    {
                                                                        schedule.start_time
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        schedule.end_time
                                                                    }
                                                                    {schedule.room && (
                                                                        <span className="text-muted-foreground">
                                                                            {' '}
                                                                            ·{' '}
                                                                            {
                                                                                schedule.room
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ),
                                                        )
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground">
                                                            No class schedule
                                                            for {selectedDay}
                                                        </p>
                                                    )}
                                                </div>
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
