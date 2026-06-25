import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Eye, BookOpen } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a5f]">
                        <BookOpen size={22} className="text-white" />
                    </div>

                    <h2 className="text-xl font-bold text-foreground">
                        Welcome back
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Sign in to access your dashboard
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="mt-1.5"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="mt-1.5"
                                />
                            </div>
                            <InputError
                                className="text-center"
                                message={errors.email}
                            />
                            <InputError
                                className="text-center"
                                message={errors.password}
                            />
                            <Button
                                type="submit"
                                className="mt-4 w-full bg-[#1e3a5f] hover:bg-[#2d5282]"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </>
                    )}
                </Form>

                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <p className="mt-5 text-center text-xs text-muted-foreground">
                    © 2026 St. Michael&apos;s College Inc. All rights reserved.
                </p>
            </div>
        </>
    );
}
