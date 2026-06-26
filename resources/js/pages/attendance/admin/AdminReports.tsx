import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { FileSpreadsheet, FileText } from 'lucide-react';

import {
    RateBar,
    type Department,
    type SchoolYear,
    type Semester,
} from '../shared';

type TallyRow = {
    facultyId: number;
    semesterId?: number;
    name: string;
    dept: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    rate: number;
};

export default function AdminReports() {
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

    const filteredBySemester = tallyData.filter((row) => {
        const deptMatch = deptFilter === 'all' || row.dept === deptFilter;

        const semesterMatch =
            semesterFilter === 'all' ||
            row.semesterId === Number(semesterFilter);

        return deptMatch && semesterMatch;
    });

    const filtered =
        semesterFilter === 'all'
            ? Object.values(
                  filteredBySemester.reduce<Record<number, TallyRow>>(
                      (acc, row) => {
                          const existing = acc[row.facultyId];

                          if (!existing) {
                              acc[row.facultyId] = {
                                  ...row,
                                  semesterId: undefined,
                              };
                              return acc;
                          }

                          existing.total += row.total;
                          existing.present += row.present;
                          existing.absent += row.absent;
                          existing.late += row.late;

                          existing.rate =
                              existing.total > 0
                                  ? Number(
                                        (
                                            ((existing.present +
                                                existing.late) /
                                                existing.total) *
                                            100
                                        ).toFixed(1),
                                    )
                                  : 0;

                          return acc;
                      },
                      {},
                  ),
              )
            : filteredBySemester;

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

                {/* <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                        <FileSpreadsheet size={14} /> Export Excel
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <FileText size={14} /> Export PDF
                    </button>
                </div> */}
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
                                key={`${row.facultyId}-${row.semesterId ?? 'all'}`}
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
