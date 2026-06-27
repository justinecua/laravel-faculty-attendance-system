import { usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Timer,
    Users,
    XCircle,
} from 'lucide-react';

import {
    StatCard,
    StatusBadge,
    type AttendanceRecord,
    type FacultyUser,
} from '../shared';

export default function SecretaryDashboard() {
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
        <div className="h-full space-y-6 bg-[#f9fbfc] p-8">
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
