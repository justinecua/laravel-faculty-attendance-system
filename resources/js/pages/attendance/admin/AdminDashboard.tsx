import { usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Building2,
    Briefcase,
    GraduationCap,
} from 'lucide-react';
import { StatCard, type Department } from '../shared';

type AdminStats = {
    totalFaculty: number;
    totalSecretaries: number;
    totalDepartments: number;
    totalHolidays: number;
    totalSchedules: number;
    currentSemester?: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
    };
    activeSchoolYear?: {
        year_label: string;
    };
};

export default function AdminDashboard() {
    const { adminStats, departments } = usePage().props as {
        adminStats: AdminStats;
        departments: Department[];
    };

    return (
        <div className="h-full space-y-6 bg-[#f9fbfc] p-8">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    label="Total Faculty"
                    value={adminStats.totalFaculty}
                    icon={GraduationCap}
                    sub="registered faculty"
                    color="bg-[#1e3a5f]"
                />

                <StatCard
                    label="Secretaries"
                    value={adminStats.totalSecretaries}
                    icon={Briefcase}
                    sub="registered secretaries"
                    color="bg-amber-500"
                />

                <StatCard
                    label="Departments"
                    value={adminStats.totalDepartments}
                    icon={Building2}
                    sub="academic departments"
                    color="bg-green-600"
                />

                <StatCard
                    label="Holidays"
                    value={adminStats.totalHolidays}
                    icon={CalendarDays}
                    sub="no-class days"
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-semibold text-foreground">
                        Faculty by Department
                    </h3>

                    <div className="space-y-3">
                        {departments?.map((dept) => (
                            <div
                                key={dept.id}
                                className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-semibold">
                                        {dept.code}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {dept.name}
                                    </p>
                                </div>

                                <p className="text-xl font-bold">
                                    {dept.facultyCount ?? 0}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-4 font-semibold text-foreground">
                        Current Semester
                    </h3>

                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                School Year
                            </span>
                            <span className="font-medium">
                                {adminStats.activeSchoolYear?.year_label ??
                                    'Not set'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Semester
                            </span>
                            <span className="font-medium">
                                {adminStats.currentSemester?.name ?? 'Not set'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Start Date
                            </span>
                            <span className="font-medium">
                                {adminStats.currentSemester?.start_date ??
                                    'Not set'}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                End Date
                            </span>
                            <span className="font-medium">
                                {adminStats.currentSemester?.end_date ??
                                    'Not set'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
