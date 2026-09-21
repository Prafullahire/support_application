'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AuthPageShell,
  PortalField,
  PortalSelect,
  PortalTextarea,
} from '@/components/auth/auth-page-shell';
import { useAuthStore } from '@/lib/auth-store';
import { authApi } from '@/lib/api';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';

type RegisterBranch = { id: string; name: string; code: string };
type RegisterLocation = { id: string; name: string; branchId: string };

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [branches, setBranches] = useState<RegisterBranch[]>([]);
  const [locations, setLocations] = useState<RegisterLocation[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    emailOrPhone: '',
    password: '',
    firstName: '',
    lastName: '',
    branchId: '',
    officeLocationId: '',
    joiningDate: '',
    leavingDate: '',
    address: '',
  });

  useEffect(() => {
    authApi.registerBranches().then(setBranches).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.branchId) {
      setLocations([]);
      setForm((prev) => ({ ...prev, officeLocationId: '' }));
      return;
    }

    authApi
      .registerOfficeLocations(form.branchId)
      .then(setLocations)
      .catch(() => setLocations([]));
  }, [form.branchId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        emailOrPhone: form.emailOrPhone.trim(),
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        branchId: form.branchId || undefined,
        officeLocationId: form.officeLocationId || undefined,
        joiningDate: form.joiningDate || undefined,
        leavingDate: form.leavingDate || undefined,
        address: form.address.trim() || undefined,
      });
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AuthPageShell>
      <form onSubmit={handleSubmit} className="w-full max-w-sm" aria-label="Register">
        <h1 className="text-2xl font-bold text-brand-black">Create Account</h1>
        <p className="mt-1 text-sm text-text-muted">Register to get started.</p>

        <div className="mt-6 space-y-4">
          <ErrorBanner error={error} onDismiss={() => setError('')} />

          <div className="grid grid-cols-2 gap-3">
            <PortalField
              label="First Name"
              value={form.firstName}
              onChange={(value) => setForm({ ...form, firstName: value })}
              placeholder="First name"
              autoComplete="given-name"
              required
            />
            <PortalField
              label="Last Name"
              value={form.lastName}
              onChange={(value) => setForm({ ...form, lastName: value })}
              placeholder="Last name"
              autoComplete="family-name"
              required
            />
          </div>

          <PortalField
            label="Email / Phone Number"
            value={form.emailOrPhone}
            onChange={(value) => setForm({ ...form, emailOrPhone: value })}
            placeholder="you@company.com or 9876543210"
            autoComplete="username"
            required
          />

          <PortalField
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => setForm({ ...form, password: value })}
            placeholder="Enter your password (min. 6 characters)"
            autoComplete="new-password"
            required
            minLength={6}
          />

          {branches.length > 0 && (
            <PortalSelect
              label="Branch"
              value={form.branchId}
              onChange={(value) =>
                setForm({ ...form, branchId: value, officeLocationId: '' })
              }
              placeholder="Select your branch"
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
          )}

          {form.branchId && (
            <PortalSelect
              label="Location"
              value={form.officeLocationId}
              onChange={(value) => setForm({ ...form, officeLocationId: value })}
              placeholder={
                locations.length > 0 ? 'Select your office location' : 'No locations available'
              }
              options={locations.map((l) => ({ value: l.id, label: l.name }))}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <PortalField
              label="Joining Date"
              type="date"
              value={form.joiningDate}
              onChange={(value) => setForm({ ...form, joiningDate: value })}
              required
            />
            <PortalField
              label="Leaving Date"
              type="date"
              value={form.leavingDate}
              onChange={(value) => setForm({ ...form, leavingDate: value })}
            />
          </div>

          <PortalTextarea
            label="Address"
            value={form.address}
            onChange={(value) => setForm({ ...form, address: value })}
            placeholder="Enter your full address"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-black py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-red-bright">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthPageShell>
  );
}
