import { usePage } from '@inertiajs/react';
import { type MyClassSchedule } from '../shared';

export default function FacultyClassSchedule() {
    const { myClassSchedules = [] } = usePage().props as {
        myClassSchedules?: MyClassSchedule[];
    };

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                    <h3 className="font-semibold text-foreground">
                        My Class Schedule
                    </h3>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/40">
                            {['Subject', 'Day', 'Time', 'Room', 'Semester'].map(
                                (heading) => (
                                    <th
                                        key={heading}
                                        className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase"
                                    >
                                        {heading}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {myClassSchedules.map((schedule) => (
                            <tr key={schedule.id}>
                                <td className="px-5 py-3.5 text-sm">
                                    <span className="font-semibold">
                                        {schedule.subject_code}
                                    </span>

                                    <div className="text-xs text-muted-foreground">
                                        {schedule.subject_name}
                                    </div>
                                </td>

                                <td className="px-5 py-3.5 text-sm">
                                    {schedule.day}
                                </td>

                                <td className="px-5 py-3.5 text-sm">
                                    {schedule.start_time} - {schedule.end_time}
                                </td>

                                <td className="px-5 py-3.5 text-sm">
                                    {schedule.room ?? '—'}
                                </td>

                                <td className="px-5 py-3.5 text-sm">
                                    {schedule.school_year_label} -{' '}
                                    {schedule.semester_name}
                                </td>
                            </tr>
                        ))}

                        {myClassSchedules.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                                >
                                    No class schedule found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
