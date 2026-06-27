import { usePage } from '@inertiajs/react';
import { type MyProfile } from '../shared';

export default function FacultyProfile() {
    const { myProfile } = usePage().props as {
        myProfile?: MyProfile;
    };

    if (!myProfile) {
        return (
            <div className="p-8 text-sm text-muted-foreground">
                Profile not found.
            </div>
        );
    }

    return (
        <div className="h-full bg-[#f9fbfc]">
            <div className="max-w-2xl space-y-5 p-8">
                <div className="rounded-xl border border-border bg-card p-8">
                    <h2 className="text-xl font-semibold text-foreground">
                        {myProfile.name}
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                                Email Address
                            </label>
                            <div className="rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
                                {myProfile.email}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                                Employee ID
                            </label>
                            <div className="rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
                                {myProfile.employee_id}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                                Department
                            </label>
                            <div className="rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
                                {myProfile.department_code} —{' '}
                                {myProfile.department_name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
