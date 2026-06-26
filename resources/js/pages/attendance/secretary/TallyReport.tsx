import { useState } from 'react';
import { usePage } from '@inertiajs/react';

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

export default function TallyReport() {
    const [deptFilter, setDeptFilter] = useState('all');
    const [semesterFilter, setSemesterFilter] = useState('all');

    const {
        tallyData = [],
        departments = [],
        semesters = [],
        schoolYears = [],
    } = usePage().props as {
        tallyData?: TallyRow[];
        departments?: Department[];
        semesters?: Semester[];
        schoolYears?: SchoolYear[];
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

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                        <option value="all">All Semesters</option>

                        {semesters.map((semester) => {
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
                            <tr
                                key={`${row.facultyId}-${row.semesterId ?? 'all'}`}
                            >
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
