'use client';

import { FormEvent, ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { getCurrentPosition } from '@/lib/geolocation';
import {
  getLoginIdentifierError,
  isEmailIdentifier,
  isPhoneIdentifier,
  normalizeLoginPhone,
} from '@/lib/login-identifier';
import { ErrorBanner } from '@/components/ui/error-banner';
import { toast } from 'sonner';

function isOfficeBoyLoginError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes('office boy') ||
    lower.includes('location verification') ||
    lower.includes('office boy login')
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-lg font-bold text-white">
        N
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-2xl font-bold text-white">
        N
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-wide text-white">
        NeoSOFT<span className="align-top text-xs">®</span>
      </h1>
      <p className="text-[10px] tracking-[0.3em] text-white/60">TECHNOLOGIES</p>
    </div>
  );
}

export function UnifiedLoginScreen() {
  const router = useRouter();
  const { login, officeBoyLogin, isLoading } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);

  const phoneMode = useMemo(() => isPhoneIdentifier(identifier), [identifier]);
  const fieldLabel = phoneMode ? 'Mobile Number' : 'Email/Mobile Number';
  const fieldPlaceholder = phoneMode
    ? 'Enter 10-digit mobile number'
    : 'Enter email or mobile number';

  const handleOfficeBoyLogin = async (phone: string) => {
    setLocating(true);
    setLastCoords(null);
    try {
      const position = await getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLastCoords({ lat, lng });
      await officeBoyLogin(phone, password, lat, lng);
      toast.success('Login successful. Tap Sign In on the dashboard to mark attendance.');
      router.push('/office-boy/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLastCoords(null);

    const trimmed = identifier.trim();
    const idError = getLoginIdentifierError(trimmed);
    if (idError) {
      setError(idError);
      return;
    }

    if (isEmailIdentifier(trimmed)) {
      try {
        const loggedInUser = await login(trimmed, password);
        toast.success('Signed in successfully');
        router.push(loggedInUser.role === 'OFFICE_BOY' ? '/office-boy/dashboard' : '/dashboard');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        toast.error(message);
      }
      return;
    }

    const phone = normalizeLoginPhone(trimmed);

    try {
      const loggedInUser = await login(phone, password);
      toast.success('Signed in successfully');
      router.push(loggedInUser.role === 'OFFICE_BOY' ? '/office-boy/dashboard' : '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      if (isOfficeBoyLoginError(message)) {
        await handleOfficeBoyLogin(phone);
        return;
      }
      setError(message);
      toast.error(message);
    }
  };

  const showGpsHelp =
    lastCoords &&
    (error.toLowerCase().includes('allowed') || error.toLowerCase().includes('outside'));

  const busy = isLoading || locating;

  const loginForm = (
    <LoginForm
      fieldLabel={fieldLabel}
      fieldPlaceholder={fieldPlaceholder}
      identifier={identifier}
      setIdentifier={setIdentifier}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      phoneMode={phoneMode}
      error={error}
      setError={setError}
      showGpsHelp={!!showGpsHelp}
      lastCoords={lastCoords}
      busy={busy}
      locating={locating}
      onSubmit={handleSubmit}
    />
  );

  const copyright = (
    <p className="text-center text-[11px] text-white/50">
      Copyright © 2022 NeoSOFT Pvt. Ltd. {new Date().getFullYear()}
    </p>
  );

  return (
    <main className="min-h-screen">
      {/* Mobile & tablet */}
      <div className="brand-gradient flex min-h-screen flex-col items-center px-6 py-10 lg:hidden">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <BrandMark />
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl sm:max-w-md sm:p-8">
          {loginForm}
        </div>

        <div className="mt-8">{copyright}</div>
      </div>

      {/* Desktop split */}
      <div className="hidden min-h-screen lg:flex">
        <div className="brand-gradient relative flex w-1/2 flex-col justify-between p-12 xl:w-[45%]">
          <div className="flex items-center gap-3">
            <BrandMark compact />
            <div>
              <p className="text-lg font-bold leading-none text-white">
                NeoSOFT<span className="align-top text-[10px]">®</span>
              </p>
              <p className="text-[9px] tracking-[0.3em] text-white/60">TECHNOLOGIES</p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
              Your workday, tracked without the hassle.
            </h2>
            <p className="mt-4 text-sm text-white/70">
              Sign in, sign out, and review your attendance history from one simple portal.
            </p>
          </div>

          {copyright}
        </div>

        <div className="flex w-1/2 items-center justify-center bg-white p-12 xl:w-[55%]">
          {loginForm}
        </div>
      </div>
    </main>
  );
}

function LoginForm({
  fieldLabel,
  fieldPlaceholder,
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  phoneMode,
  error,
  setError,
  showGpsHelp,
  lastCoords,
  busy,
  locating,
  onSubmit,
}: {
  fieldLabel: string;
  fieldPlaceholder: string;
  identifier: string;
  setIdentifier: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((v: boolean) => boolean)) => void;
  phoneMode: boolean;
  error: string;
  setError: (v: string) => void;
  showGpsHelp: boolean;
  lastCoords: { lat: number; lng: number } | null;
  busy: boolean;
  locating: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm" aria-label="Sign in">
      <h1 className="text-2xl font-bold text-brand-black">Welcome Back</h1>
      <p className="mt-1 text-sm text-text-muted">Sign in to your Account.</p>

      <div className="mt-6 space-y-4">
        <ErrorBanner error={error} onDismiss={() => setError('')} />

        {showGpsHelp && lastCoords && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <p className="flex items-center gap-1 font-semibold">
              <MapPin className="h-3.5 w-3.5" />
              GPS: {lastCoords.lat.toFixed(6)}, {lastCoords.lng.toFixed(6)}
            </p>
          </div>
        )}

        <PortalField
          label={fieldLabel}
          value={identifier}
          onChange={setIdentifier}
          placeholder={fieldPlaceholder}
          autoComplete="username"
          inputMode={phoneMode ? 'numeric' : 'text'}
          required
        />

        <div>
          <PortalField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
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
          {!phoneMode && (
            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-brand-red-bright hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-brand-black py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {locating ? 'Verifying location...' : busy ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-brand-red-bright">
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}

function PortalField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  required,
  trailing,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  required?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <div className="relative mt-1.5">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 pr-10 text-sm text-gray-800 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </div>
  );
}
