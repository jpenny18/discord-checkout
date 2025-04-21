import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Arena | Ascendant Markets',
  description: 'Compete in the Ascendant Markets Trading Arena. No rules, just flip. Win cash prizes and funded accounts.',
};

export default function TradingArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 