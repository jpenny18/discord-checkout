import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ACI Challenge',
  description: 'Start your prop firm challenge',
};

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 