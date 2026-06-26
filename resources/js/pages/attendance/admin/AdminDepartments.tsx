import { usePage } from '@inertiajs/react';
import { Plus, Building2 } from 'lucide-react';

import type { Department } from '../shared';

type Props = {
    onAddDepartment: () => void;
};

export default function AdminDepartments({ onAddDepartment }: Props) {
    const { departments = [] } = usePage().props as {
        departments?: Department[];
    };

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="flex justify-end">
                <button
                    onClick={onAddDepartment}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors"
                    style={{ backgroundColor: '#1e3a5f' }}
                >
                    <Plus size={14} /> Add Department
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {departments.map((dept) => (
                    <div
                        key={dept.id}
                        className="group rounded-xl border border-border bg-card p-6"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: 'rgba(30,58,95,0.1)',
                                }}
                            >
                                <Building2
                                    size={18}
                                    style={{ color: '#1e3a5f' }}
                                />
                            </div>

                            <span
                                className="mb-2 inline-block rounded-md px-2.5 py-1 text-xs font-bold"
                                style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    backgroundColor: 'rgba(30,58,95,0.1)',
                                    color: '#1e3a5f',
                                }}
                            >
                                {dept.code}
                            </span>
                        </div>

                        <h3 className="mb-4 text-sm leading-snug font-medium text-foreground">
                            {dept.name}
                        </h3>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Faculty Members
                            </p>
                            <p className="text-2xl font-bold">
                                {dept.facultyCount ?? 0}
                            </p>
                        </div>
                    </div>
                ))}

                {departments.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                        No departments added yet.
                    </div>
                )}
            </div>
        </div>
    );
}
