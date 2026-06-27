import { router, useForm, usePage } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

import type {
    FacultyUser,
    SchoolYear,
    Semester,
    ClassSchedule,
} from '../shared';

export default function AdminClassSchedules() {
    const {
        classSchedules = [],
        facultyUsers = [],
        semesters = [],
        schoolYears = [],
    } = usePage().props as {
        classSchedules?: ClassSchedule[];
        facultyUsers?: FacultyUser[];
        semesters?: Semester[];
        schoolYears?: SchoolYear[];
    };

    const { data, setData, post, processing, reset } = useForm({
        faculty_id: '',
        semester_id: '',
        subject_code: '',
        subject_name: '',
        day: '',
        start_time: '',
        end_time: '',
        room: '',
    });

    const submit = () => {
        post('/class-schedules', {
            onSuccess: () => {
                toast.success('Class schedule added.');
                reset();
            },
            onError: () => toast.error('Please fix the schedule details.'),
        });
    };

    const remove = (id: number) => {
        router.delete(`/class-schedules/${id}`, {
            onSuccess: () => toast.success('Class schedule deleted.'),
        });
    };

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold">Add Class Schedule</h3>

                <div className="grid grid-cols-4 gap-3">
                    <select
                        value={data.faculty_id}
                        onChange={(e) => setData('faculty_id', e.target.value)}
                        className="rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value="">Select faculty</option>
                        {facultyUsers.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={data.semester_id}
                        onChange={(e) => setData('semester_id', e.target.value)}
                        className="rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value="">Select semester</option>
                        {semesters.map((s) => {
                            const year = schoolYears.find(
                                (y) => y.id === s.school_year_id,
                            );
                            return (
                                <option key={s.id} value={s.id}>
                                    {year?.year_label} - {s.name}
                                </option>
                            );
                        })}
                    </select>

                    <input
                        value={data.subject_code}
                        onChange={(e) =>
                            setData('subject_code', e.target.value)
                        }
                        placeholder="Subject Code"
                        className="rounded-lg border px-3 py-2 text-sm"
                    />

                    <input
                        value={data.subject_name}
                        onChange={(e) =>
                            setData('subject_name', e.target.value)
                        }
                        placeholder="Subject Name"
                        className="rounded-lg border px-3 py-2 text-sm"
                    />

                    <select
                        value={data.day}
                        onChange={(e) => setData('day', e.target.value)}
                        className="rounded-lg border px-3 py-2 text-sm"
                    >
                        <option value="">Select day</option>
                        {[
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                        ].map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>

                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="rounded-lg border px-3 py-2 text-sm"
                    />

                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        className="rounded-lg border px-3 py-2 text-sm"
                    />

                    <input
                        value={data.room}
                        onChange={(e) => setData('room', e.target.value)}
                        placeholder="Room"
                        className="rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                <button
                    disabled={processing}
                    onClick={submit}
                    className="mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
                    style={{ backgroundColor: '#1e3a5f' }}
                >
                    <Save size={15} className="mr-2 inline" />
                    Save Schedule
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/40">
                            {[
                                'Faculty',
                                'Semester',
                                'Subject',
                                'Day',
                                'Time',
                                'Room',
                                'Actions',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {classSchedules.map((s) => (
                            <tr key={s.id}>
                                <td className="px-5 py-3.5 text-sm font-medium">
                                    {s.faculty_name}
                                </td>
                                <td className="px-5 py-3.5 text-sm">
                                    {s.school_year_label} - {s.semester_name}
                                </td>
                                <td className="px-5 py-3.5 text-sm">
                                    <span className="font-semibold">
                                        {s.subject_code}
                                    </span>
                                    <div className="text-xs text-muted-foreground">
                                        {s.subject_name}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-sm">{s.day}</td>
                                <td className="px-5 py-3.5 text-sm">
                                    {s.start_time} - {s.end_time}
                                </td>
                                <td className="px-5 py-3.5 text-sm">
                                    {s.room ?? '—'}
                                </td>
                                <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => remove(s.id)}
                                        className="rounded p-1 text-muted-foreground hover:text-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {classSchedules.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                                >
                                    No class schedules found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
