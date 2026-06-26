import { usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, TrendingUp, XCircle } from 'lucide-react';

import {
    StatusBadge,
    type AttendanceStatus,
    type MonthlyAttendance,
} from '../shared';

type MyAttendance = {
    date: string;
    status: AttendanceStatus;
    remarks?: string;
};

export default function FacultyDashboard() {
    const { myAttendance = [], adminStats } = usePage().props as {
        myAttendance?: MyAttendance[];
        adminStats?: {
            currentSemester?: {
                id: number;
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
                <div className="rounded-xl border border-border bg-[#fff] bg-card p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                        <CheckCircle2 size={18} />
                        Present
                    </div>
                    <p className="mt-3 text-4xl font-bold text-green-700">
                        {present}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-[#fff] bg-card p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                        <XCircle size={18} />
                        Absent
                    </div>
                    <p className="mt-3 text-4xl font-bold text-red-600">
                        {absent}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-[#fff] bg-card p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                        <Clock size={18} />
                        Late
                    </div>
                    <p className="mt-3 text-4xl font-bold text-orange-600">
                        {late}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-[#fff] bg-card p-6">
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
