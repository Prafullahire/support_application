'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { AuthPageShell, PortalField } from '@/components/auth/auth-page-shell';
import { ErrorBanner } from '@/components/ui/error-banner';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid admin email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.forgotPassword(trimmed);
      setSuccess(result.message);
      toast.success('Reset link sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not send reset link';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <form onSubmit={handleSubmit} className="w-full max-w-sm" aria-label="Forgot password">
        <h1 className="text-2xl font-bold text-brand-black">Forgot Password</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your admin email. We will send you a link to reset your password.
        </p>

        <div className="mt-6 space-y-4">
          <ErrorBanner error={error} onDismiss={() => setError('')} />

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {success}
            </div>
          )}

          <PortalField
            label="Admin Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@support.com"
            autoComplete="email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-black py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-sm text-text-muted">
            Remember your password?{' '}
            <Link href="/login" className="font-semibold text-brand-red-bright">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthPageShell>
  );
}
