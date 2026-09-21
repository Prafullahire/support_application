'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { AuthPageShell, PortalField } from '@/components/auth/auth-page-shell';
import { ErrorBanner } from '@/components/ui/error-banner';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.resetPassword(token, password);
      toast.success(result.message);
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reset password';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <form onSubmit={handleSubmit} className="w-full max-w-sm" aria-label="Reset password">
        <h1 className="text-2xl font-bold text-brand-black">Set New Password</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your new admin password below.
        </p>

        <div className="mt-6 space-y-4">
          <ErrorBanner error={error} onDismiss={() => setError('')} />

          {!token && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              This reset link is invalid. Please request a new one from the forgot password page.
            </div>
          )}

          <PortalField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="Enter new password (min. 6 characters)"
            autoComplete="new-password"
            required
            minLength={6}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <PortalField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
            minLength={6}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-lg bg-brand-black py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Updating password...' : 'Update Password'}
          </button>

          <p className="text-center text-sm text-text-muted">
            <Link href="/login" className="font-semibold text-brand-red-bright">
              Back to Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-text-muted">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
