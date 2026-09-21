'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/office-boy/portal/page-header';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuthStore } from '@/lib/auth-store';
import { formatPortalTableDate } from '@/lib/portal';

function formatProfileDate(value?: string | null) {
  if (!value) return '—';
  return formatPortalTableDate(value);
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-brand-black">{value || '—'}</p>
    </div>
  );
}

export default function OfficeBoyProfilePage() {
  const { user, loadProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <LoadingState height="h-40" message="Loading profile..." />
      </div>
    );
  }

  const profile = user;
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : '—';

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        backHref="/office-boy/dashboard"
      />

      <main className="-mt-4 flex-1 rounded-t-3xl bg-white px-5 pb-8 pt-5 md:mx-6 md:mt-6 md:rounded-3xl md:px-8 md:pb-10 lg:mx-8">
        <div className="mb-6 flex items-center gap-4 rounded-2xl bg-surface-muted p-5">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-red/10 text-xl font-bold text-brand-red">
            {profile?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-lg font-bold text-brand-black">{fullName}</p>
            <p className="text-sm text-text-muted">{profile?.employeeId || profile?.email || '—'}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ProfileDetail label="Full Name" value={fullName} />
          <ProfileDetail label="Phone Number" value={profile?.phone || '—'} />
          <ProfileDetail label="Email" value={profile?.email || '—'} />
          <ProfileDetail label="Branch" value={profile?.branch?.name || '—'} />
          <ProfileDetail label="Location" value={profile?.officeLocation?.name || '—'} />
          <ProfileDetail label="Joining Date" value={formatProfileDate(profile?.joiningDate)} />
          <ProfileDetail label="Leaving Date" value={formatProfileDate(profile?.leavingDate)} />
          <div className="sm:col-span-2">
            <ProfileDetail label="Address" value={profile?.address || '—'} />
          </div>
        </div>
      </main>
    </>
  );
}
