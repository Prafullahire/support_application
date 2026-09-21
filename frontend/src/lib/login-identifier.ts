export function normalizeLoginPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
}

export function isEmailIdentifier(value: string): boolean {
  return value.trim().includes('@');
}

export function isPhoneIdentifier(value: string): boolean {
  const phone = normalizeLoginPhone(value.trim());
  return phone.length === 10;
}

export function getLoginIdentifierError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Email or mobile number is required';
  if (isEmailIdentifier(trimmed)) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Enter a valid email address';
    }
    return null;
  }
  if (isPhoneIdentifier(trimmed)) return null;
  return 'Admin: use email or 10-digit mobile. Office Boy: use 10-digit mobile only.';
}
