import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Search, Plus, Edit2, UserX } from 'lucide-react';

import type { Role } from '@/types/attendance';
import {
    RoleBadge,
    UserStatusBadge,
    type Department,
    type UserStatus,
} from '../shared';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    employeeId: string;
    role: Role;
    dept: string;
    departmentName: string;
    position: string;
    status: UserStatus;
    avatar: string;
};

export default function AdminUsers({
    onNavigate,
}: {
    onNavigate: (p: string) => void;
}) {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    const { users = [], departments = [] } = usePage().props as {
        users?: AdminUser[];
        departments?: Department[];
    };

    const filtered = users.filter((u) => {
        const s =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.employeeId?.toLowerCase().includes(search.toLowerCase());

        const d = deptFilter === 'all' || u.dept === deptFilter;
        const r = roleFilter === 'all' || u.role === roleFilter;

        return s && d && r;
    });

    return (
        <div className="h-full space-y-5 bg-[#f9fbfc] p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Search name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-56 rounded-lg border border-border bg-card py-2 pr-4 pl-8 text-sm text-foreground focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        />
                    </div>

                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Departments</option>
                        {departments?.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.code}
                            </option>
                        ))}
                    </select>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="faculty">Faculty</option>
                        <option value="secretary">Secretary</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onNavigate('add-secretary')}
                        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                        <Plus size={14} /> Add Secretary
                    </button>

                    <button
                        onClick={() => onNavigate('add-faculty')}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors"
                        style={{ backgroundColor: '#1e3a5f' }}
                    >
                        <Plus size={14} /> Add Faculty
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                {[
                                    'Name',
                                    'Role',
                                    'Department',
                                    'Position',
                                    'Employee ID',
                                    'Status',
                                    // 'Actions',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className={`px-5 py-3.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase ${
                                            h === 'Actions'
                                                ? 'text-right'
                                                : 'text-left'
                                        }`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filtered.map((u) => (
                                <tr
                                    key={u.id}
                                    className="transition-colors hover:bg-muted/25"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                                                    u.role === 'faculty'
                                                        ? 'bg-[#1e3a5f]'
                                                        : 'bg-amber-500'
                                                }`}
                                            >
                                                {u.avatar}
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {u.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <RoleBadge role={u.role} />
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className="text-sm font-medium"
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {u.dept}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="text-sm text-muted-foreground">
                                            {u.position}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className="text-xs font-medium"
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {u.employeeId}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <UserStatusBadge status={u.status} />
                                    </td>

                                    {/* <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                                                <Edit2 size={13} />
                                            </button>

                                            <button className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600">
                                                <UserX size={13} />
                                            </button>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-8 text-center text-sm text-muted-foreground"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                    <span>
                        Showing {filtered.length} of {users?.length ?? 0} users
                    </span>
                </div>
            </div>
        </div>
    );
}
