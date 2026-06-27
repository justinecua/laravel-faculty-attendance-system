import { useEffect } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import type { Holiday, SchoolYear, Semester } from '../shared';

export default function AdminCalendar() {
    const {
        schoolYears = [],
        semesters = [],
        holidays = [],
    } = usePage().props as {
        schoolYears?: SchoolYear[];
        semesters?: Semester[];
        holidays?: Holiday[];
    };

    const schoolYearForm = useForm({
        year_label: '',
    });

    const configForm = useForm({
        school_year_id:
            schoolYears.find((year) => year.is_active)?.id?.toString() ?? '',
        semester_name: '',
        start_date: '',
        end_date: '',
    });

    const holidayForm = useForm({
        semester_id: '',
        name: '',
        date: '',
    });

    useEffect(() => {
        const activeYear = schoolYears.find((year) => year.is_active);

        if (activeYear && !configForm.data.school_year_id) {
            configForm.setData('school_year_id', activeYear.id.toString());
        }
    }, [schoolYears]);

    const addSchoolYear = () => {
        schoolYearForm.post('/school-years', {
            onSuccess: () => {
                toast.success('School year added.');
                schoolYearForm.reset();
            },
            onError: () => toast.error('Please check the school year.'),
        });
    };

    const activateSchoolYear = (id: number) => {
        router.patch(
            `/school-years/${id}/activate`,
            {},
            {
                onSuccess: () => toast.success('School year activated.'),
                onError: () => toast.error('Could not activate school year.'),
            },
        );
    };

    const saveConfig = () => {
        configForm.post('/calendar/configuration', {
            onSuccess: () => {
                toast.success('Semester saved.');
                configForm.reset('semester_name', 'start_date', 'end_date');
            },
            onError: () => toast.error('Please fix the semester details.'),
        });
    };

    const addHoliday = () => {
        holidayForm.post('/calendar/holidays', {
            onSuccess: () => {
                toast.success('Holiday added successfully.');
                holidayForm.reset();
            },
            onError: () => toast.error('Please fix the holiday details.'),
        });
    };

    const removeHoliday = (id: number) => {
        router.delete(`/calendar/holidays/${id}`, {
            onSuccess: () => toast.success('Holiday deleted.'),
            onError: () => toast.error('Could not delete holiday.'),
        });
    };

    const getSemesterLabel = (semester: Semester) => {
        const year = schoolYears.find(
            (schoolYear) => schoolYear.id === semester.school_year_id,
        );

        return `${year?.year_label ?? 'Unknown School Year'} - ${semester.name}`;
    };

    return (
        <div className="h-full bg-[#f9fbfc] p-8">
            <div className="grid grid-cols-3 gap-5">
                <div className="space-y-5">
                    {/* SCHOOL YEARS */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-foreground">
                            School Years
                        </h3>

                        <div className="flex gap-2">
                            <input
                                value={schoolYearForm.data.year_label}
                                onChange={(e) =>
                                    schoolYearForm.setData(
                                        'year_label',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. 2026–2027"
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                            />

                            <button
                                type="button"
                                disabled={schoolYearForm.processing}
                                onClick={addSchoolYear}
                                className="rounded-lg px-4 py-2.5 text-sm text-white disabled:opacity-50"
                                style={{ backgroundColor: '#1e3a5f' }}
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            {schoolYears.map((year) => (
                                <div
                                    key={year.id}
                                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {year.year_label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {year.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </p>
                                    </div>

                                    {!year.is_active && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                activateSchoolYear(year.id)
                                            }
                                            className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </div>
                            ))}

                            {schoolYears.length === 0 && (
                                <p className="py-3 text-center text-sm text-muted-foreground">
                                    No school years added yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* SEMESTER */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                        <h3 className="font-semibold text-foreground">
                            Calendar Configuration
                        </h3>

                        <select
                            value={configForm.data.school_year_id}
                            onChange={(e) =>
                                configForm.setData(
                                    'school_year_id',
                                    e.target.value,
                                )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        >
                            <option value="">Select school year</option>

                            {schoolYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    {year.year_label}
                                    {year.is_active ? ' (Active)' : ''}
                                </option>
                            ))}
                        </select>

                        <input
                            value={configForm.data.semester_name}
                            onChange={(e) =>
                                configForm.setData(
                                    'semester_name',
                                    e.target.value,
                                )
                            }
                            placeholder="e.g. 1st Semester"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />

                        <input
                            type="date"
                            value={configForm.data.start_date}
                            onChange={(e) =>
                                configForm.setData('start_date', e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />

                        <input
                            type="date"
                            value={configForm.data.end_date}
                            onChange={(e) =>
                                configForm.setData('end_date', e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />

                        <button
                            type="button"
                            disabled={configForm.processing}
                            onClick={saveConfig}
                            className="w-full rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-50"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            {configForm.processing
                                ? 'Saving...'
                                : 'Save Semester'}
                        </button>
                    </div>
                </div>

                {/* HOLIDAYS */}
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-foreground">
                        Holidays & No-Class Days
                    </h3>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                        <select
                            value={holidayForm.data.semester_id}
                            onChange={(e) =>
                                holidayForm.setData(
                                    'semester_id',
                                    e.target.value,
                                )
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        >
                            <option value="">Select semester</option>

                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    {getSemesterLabel(semester)}
                                </option>
                            ))}
                        </select>

                        <input
                            value={holidayForm.data.name}
                            onChange={(e) =>
                                holidayForm.setData('name', e.target.value)
                            }
                            placeholder="Holiday name"
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />

                        <input
                            type="date"
                            value={holidayForm.data.date}
                            onChange={(e) =>
                                holidayForm.setData('date', e.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />

                        <button
                            type="button"
                            disabled={holidayForm.processing}
                            onClick={addHoliday}
                            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            <Plus size={13} /> Add
                        </button>
                    </div>

                    <div className="mt-5 space-y-1.5">
                        {holidays.map((holiday) => {
                            const semester = semesters.find(
                                (item) => item.id === holiday.semester_id,
                            );

                            return (
                                <div
                                    key={holiday.id}
                                    className="group flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {holiday.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                holiday.date + 'T00:00:00',
                                            ).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                            {semester
                                                ? ` · ${getSemesterLabel(semester)}`
                                                : ''}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeHoliday(holiday.id)
                                        }
                                        className="rounded p-1 text-muted-foreground hover:text-red-600"
                                        title="Delete holiday"
                                    >
                                        <X size={13} />
                                    </button>
                                </div>
                            );
                        })}

                        {holidays.length === 0 && (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No holidays or no-class days added yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
