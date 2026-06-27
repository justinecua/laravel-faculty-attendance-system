import { Bell } from 'lucide-react';
import type { Role } from '@/types/attendance';

type TopBarProps = {
    title: string;
    subtitle?: string;
    role: Role;
    userName: string;
};

export default function TopBar({
    title,
    subtitle,
    role,
    userName,
}: TopBarProps) {
    const roleColor = {
        admin: 'bg-red-500',
        secretary: 'bg-amber-500',
        faculty: 'bg-green-600',
    };

    const initials = userName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-8 py-4">
            <div>
                <h1 className="text-lg font-semibold text-foreground">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button> */}

                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${roleColor[role]}`}
                    >
                        {initials}
                    </div>

                    <div>
                        <p className="text-sm leading-tight font-medium text-foreground">
                            {userName}
                        </p>

                        <p className="text-xs text-muted-foreground capitalize">
                            {role}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
