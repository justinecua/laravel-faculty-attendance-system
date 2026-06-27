import { usePage, useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

import type { Department } from '../shared';

export default function AddUserForm({
    type,
    onBack,
}: {
    type: 'faculty' | 'secretary';
    onBack: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        employee_id: '',
        password: '',
        department_id: '',
    });

    const { departments } = usePage().props as {
        departments: Department[];
    };

    const submit = () => {
        const url =
            type === 'secretary' ? '/users/secretary' : '/users/faculty';

        post(url, {
            onSuccess: () => {
                toast.success(
                    type === 'secretary'
                        ? 'Secretary account created successfully.'
                        : 'Faculty account created successfully.',
                );

                reset();

                setTimeout(() => {
                    onBack();
                }, 1000);
            },
            onError: () => {
                toast.error(
                    'Please fix the errors before creating the account.',
                );
            },
        });
    };

    return (
        <div className="max-w-2xl p-8">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-sm"
            >
                <ChevronLeft size={15} /> Back to User Management
            </button>

            <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="text-xl font-semibold text-foreground">
                    {type === 'secretary'
                        ? 'Register Secretary Account'
                        : 'Register Faculty Account'}
                </h2>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Full Name *
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Ana Reyes"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="secretary@school.edu"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Employee ID *
                        </label>
                        <input
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            placeholder="SEC-001"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.employee_id && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>
                    {type === 'faculty' && (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium">
                                Department *
                            </label>
                            <select
                                value={data.department_id}
                                onChange={(e) =>
                                    setData('department_id', e.target.value)
                                }
                                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                            >
                                <option value="">Select department</option>

                                {departments?.map((department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.code} — {department.name}
                                    </option>
                                ))}
                            </select>

                            {errors.department_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.department_id}
                                </p>
                            )}
                        </div>
                    )}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="text"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-border pt-5">
                        <button
                            onClick={onBack}
                            className="rounded-lg border px-5 py-2.5 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={processing}
                            onClick={submit}
                            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
                            style={{ backgroundColor: '#1e3a5f' }}
                        >
                            <Save size={15} /> Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
