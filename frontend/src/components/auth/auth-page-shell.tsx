import { ReactNode } from 'react';

export function BrandMark({ compact = false }: { compact?: boolean }) {
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

export function AuthPageShell({ children }: { children: ReactNode }) {
  const copyright = (
    <p className="text-center text-[11px] text-white/50">
      Copyright © 2022 NeoSOFT Pvt. Ltd. {new Date().getFullYear()}
    </p>
  );

  return (
    <main className="min-h-screen">
      <div className="brand-gradient flex min-h-screen flex-col items-center px-6 py-10 lg:hidden">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <BrandMark />
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl sm:max-w-md sm:p-8">
          {children}
        </div>

        <div className="mt-8">{copyright}</div>
      </div>

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
          {children}
        </div>
      </div>
    </main>
  );
}

export function PortalField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  required,
  minLength,
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
  minLength?: number;
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
          minLength={minLength}
          className={`w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 ${
            trailing ? 'pr-10' : ''
          }`}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </div>
  );
}

export function PortalTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
      />
    </div>
  );
}

export function PortalSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
