import { usePage } from '@inertiajs/react';

import { StatusBadge, type AttendanceStatus } from '../shared';

type MyAttendance = {
    date: string;
    status: AttendanceStatus;
    remarks?: string;
};

export default function FacultyHistory() {
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

                        {myAttendance.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-8 text-center text-sm text-muted-foreground"
                                >
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
