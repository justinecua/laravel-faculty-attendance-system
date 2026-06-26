import { useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AddDepartmentForm({ onBack }: { onBack: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        name: '',
    });

    const submit = () => {
        post('/departments', {
            onSuccess: () => {
                toast.success('Department added successfully.');
                reset();
                setTimeout(onBack, 800);
            },
            onError: () => {
                toast.error('Please fix the department details.');
            },
        });
    };

    return (
        <div className="max-w-2xl p-8">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-sm"
            >
                <ChevronLeft size={15} /> Back to Departments
            </button>

            <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="text-xl font-semibold text-foreground">
                    Register Department
                </h2>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Department Code *
                        </label>
                        <input
                            value={data.code}
                            onChange={(e) =>
                                setData('code', e.target.value.toUpperCase())
                            }
                            placeholder="e.g. CCS"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.code && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium">
                            Department Name *
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. College of Computer Studies"
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
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
                            <Save size={15} />
                            {processing ? 'Saving...' : 'Create Department'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
