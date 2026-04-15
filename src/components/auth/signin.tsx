'use client';

import { getCsrfToken, signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, Input } from '@/components/ui';
import { getBaseUrl } from '@/utils/Helpers';

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
      const baseUrl = getBaseUrl();

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json.message || `Login failed (${res.status})`;
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

      await getCsrfToken();

      const authResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (authResult?.error) {
        const msg = 'Could not start your session. Check your account status or try again.';
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

      toast.success('Signed in successfully!');
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-primary-500 via-primary-600 to-primary-700">
      <div className="absolute top-0 left-0 h-96 w-96 animate-pulse rounded-full bg-linear-to-br from-primary-400/40 to-primary-600/40 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 animate-pulse rounded-full bg-linear-to-br from-primary-300/30 to-primary-500/30 blur-3xl" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary-400/20 blur-3xl" style={{ animationDelay: '2s' }} />

      <div className="relative mx-4 w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-white/30 blur-xl" />
        <div className="relative rounded-3xl border-2 border-white/50 bg-white/95 p-8 shadow-2xl shadow-primary-900/30 backdrop-blur-2xl md:p-10">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 p-4 shadow-lg shadow-primary-500/50">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={120}
                height={32}
                priority
                className="relative brightness-0 invert"
              />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600">Sign in to continue to your dashboard</p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-primary-700">
                Email Address
              </label>
              <div className="group relative">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  validationError={errors.email?.message}
                  isValid={!!errors.email}
                  status={errors.email ? 'error' : undefined}
                  className="relative border-2 border-primary-200 focus:border-primary-500 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-primary-700">
                Password
              </label>
              <div className="group relative">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  validationError={errors.password?.message}
                  isValid={!!errors.password}
                  status={errors.password ? 'error' : undefined}
                  className="relative border-2 border-primary-200 focus:border-primary-500 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                variant="primary"
                className="w-full rounded-xl bg-linear-to-r from-primary-600 via-primary-500 to-primary-600 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/50 transition-all duration-300 hover:scale-[1.02] hover:from-primary-700 hover:via-primary-600 hover:to-primary-700 hover:shadow-2xl hover:shadow-primary-600/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
