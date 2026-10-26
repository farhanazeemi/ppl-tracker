import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | PPL Hypertrophy Tracker',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
