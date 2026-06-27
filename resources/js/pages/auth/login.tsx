import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Shield } from 'lucide-react';
import logo from '../../../../public/images/logo.png';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    // console.log(status);
    return (
        <>
            <Head title="Log in" />

            {/* Full-page centered background */}
            <div
                className="flex min-h-screen items-center justify-center bg-slate-100 px-4"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 20%, rgba(30,58,95,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(30,58,95,0.04) 0%, transparent 55%)',
                }}
            >
                {/* Card */}
                <div className="w-full max-w-md rounded-xl border border-[#1e3a5f]/[0.08] bg-white p-9 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(30,58,95,0.07)]">
                    {/* Logo */}

                    <div className="flex w-full justify-center">
                        <div className="mb-2 flex flex-col items-center text-center">
                            <div className="rounded-md border border-[#E5E7EB] p-4">
                                <img
                                    src={logo}
                                    alt="SMCI Logo"
                                    className="h-16 w-16"
                                />
                            </div>

                            <h2 className="font-billion-dreams mt-3 text-5xl text-[#1E3A8A]">
                                Assessly
                            </h2>
                        </div>
                    </div>
                    {/* Heading */}
                    <div className="mb-5 flex w-full items-center justify-center text-center">
                        <h2 className="items-center justify-center text-[17px] font-medium text-[#1E3A8A]">
                            Welcome back,
                        </h2>
                        <h2 className="ml-1 items-center justify-center text-[17px] font-medium text-[#1E3A8A]">
                            sign in to your account!
                        </h2>
                    </div>

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
                                        placeholder="username@my.smciligan.edu.ph"
                                        className="mt-1.5 h-12 border-gray-300 text-sm focus-visible:border-[#1e3a5f] focus-visible:ring-[3px] focus-visible:ring-[#1e3a5f]/[0.07]"
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
                                        className="mt-1.5 h-12 border-gray-300 text-sm focus-visible:border-[#1e3a5f] focus-visible:ring-[3px] focus-visible:ring-[#1e3a5f]/[0.07]"
                                    />

                                    {/* {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="mt-1.5 block text-right text-[11.5px] text-[#1e3a5f] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )} */}
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-1 text-center"
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-1 text-center"
                                />
                                <Button
                                    type="submit"
                                    className="mt-2 h-12 w-full bg-[#1E3A8A] text-sm font-medium tracking-wide hover:bg-[#2d5282]"
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
                        © 2026 St. Michael&apos;s College Inc. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </>
    );
}
