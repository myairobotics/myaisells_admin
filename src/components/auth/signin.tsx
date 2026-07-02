'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Button, FormField } from '@/components/ui';

type SignInData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();

  const onSubmit = async (data: SignInData) => {
    setErrorMsg('');
    setLoading(true);

    try {
      const authResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!authResult || authResult.error || authResult.ok === false) {
        const msg = 'Invalid credentials. Check your email and password and try again.';
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

      toast.success('Signed in successfully!');
      router.refresh();
      router.push('/');
    } catch (err: any) {
      const msg = err.message || 'Network error. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[2rem] leading-tight font-bold text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your admin account to continue
        </p>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <FormField
            label="Email address"
            id="email"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full py-3 text-sm font-bold"
            >
              {loading ? 'Signing in…' : 'Sign in to dashboard'}
            </Button>
          </div>

        </form>
      </div>

      {/* Support link */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Having trouble signing in?
        {' '}
        <a href="mailto:support@myaisells.com" className="font-medium text-primary-600 hover:underline">
          Contact support
        </a>
      </p>

    </div>
  );
}
