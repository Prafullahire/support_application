import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | NS Portal',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
