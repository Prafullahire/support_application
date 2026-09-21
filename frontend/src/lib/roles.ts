export type AppUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OFFICE_BOY';

export function isSuperAdmin(role?: string | null): boolean {
  return role === 'SUPER_ADMIN';
}

export function isPrivilegedAdmin(role?: string | null): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function isBranchAdmin(role?: string | null): boolean {
  return role === 'ADMIN';
}
