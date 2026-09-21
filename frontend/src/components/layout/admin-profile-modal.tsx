'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuthStore } from '@/lib/auth-store';
import { formatDate, getUserDisplayEmail, getUserDisplayPhone } from '@/lib/utils';

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-surface-muted p-3">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-brand-black">{value || '—'}</p>
    </div>
  );
}

interface AdminProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminProfileModal({ open, onClose }: AdminProfileModalProps) {
  const { user, loadProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
    : 'U';

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    loadProfile()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, loadProfile]);

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : '—';

  return (
    <Modal open={open} onClose={onClose} title="My Profile" size="lg">
      {loading ? (
        <LoadingState height="h-40" message="Loading profile..." />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-surface-muted p-4">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-red ring-2 ring-white">
              {avatarError ? (
                <span className="text-lg font-bold text-white">{initials}</span>
              ) : (
                <Image
                  src="/images/admin-user-avatar.png"
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="64px"
                  onError={() => setAvatarError(true)}
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-brand-black">{fullName}</p>
              <p className="text-sm text-text-muted">{user?.role || '—'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileField label="First Name" value={user?.firstName || '—'} />
            <ProfileField label="Last Name" value={user?.lastName || '—'} />
            <ProfileField label="Email" value={getUserDisplayEmail(user || {})} />
            <ProfileField label="Phone Number" value={getUserDisplayPhone(user || {})} />
            <ProfileField label="Role" value={user?.role || '—'} />
            <ProfileField label="Employee ID" value={user?.employeeId || '—'} />
            <ProfileField label="Branch" value={user?.branch?.name || '—'} />
            <ProfileField
              label={user?.role === 'OFFICE_BOY' ? 'Office Location' : 'Department'}
              value={
                user?.role === 'OFFICE_BOY'
                  ? user?.officeLocation?.name || '—'
                  : user?.department?.name || '—'
              }
            />
            <ProfileField
              label="Joining Date"
              value={user?.joiningDate ? formatDate(user.joiningDate) : '—'}
            />
            <ProfileField
              label="Leaving Date"
              value={user?.leavingDate ? formatDate(user.leavingDate) : '—'}
            />
            <div className="sm:col-span-2">
              <ProfileField label="Address" value={user?.address || '—'} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
