import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Shield } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="w-full min-w-md rounded-xl bg-white p-9 shadow-sm">
                {/* Logo */}
                <div className="mb-8 flex items-center gap-2.5">
                    <div className="flex h-8 w-9 shrink-0 items-center justify-center rounded-[7px] bg-[#1e3a5f]">
                        <Shield
                            size={15}
                            className="text-white"
                            strokeWidth={1.8}
                        />
                    </div>
                    <div>
                        <p className="font-serif text-[15px] leading-tight text-[#1e3a5f]">
                            St. Michael's College
                        </p>
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-[17px] font-medium text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-0.5 mb-6 text-[13px] text-gray-500">
                    Sign in to your account
                </p>

                {/* Form */}
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-medium text-gray-700"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    placeholder="you@stmichaels.edu.ph"
                                    className="mt-1.5 border-gray-300 text-sm focus-visible:border-[#1e3a5f] focus-visible:ring-0"
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-medium text-gray-700"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="mt-1.5 border-gray-300 text-sm focus-visible:border-[#1e3a5f] focus-visible:ring-0"
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-1"
                                />

                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="mt-1.5 block text-right text-[11.5px] text-[#1e3a5f] hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-[#1e3a5f] text-sm font-medium tracking-wide hover:bg-[#2d5282]"
                                disabled={processing}
                            >
                                {processing && (
                                    <Spinner className="mr-2 h-4 w-4" />
                                )}
                                Sign in
                            </Button>
                        </>
                    )}
                </Form>

                {status && (
                    <p className="mt-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </p>
                )}

                <p className="mt-7 text-center text-[11px] text-gray-400">
                    © 2026 St. Michael&apos;s College Inc. All rights reserved.
                </p>
            </div>
        </>
    );
}
