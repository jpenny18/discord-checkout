// This is the server component
import { ModulePageClient } from './ModulePageClient';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ModulePageWrapper({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  return <ModulePageClient params={resolvedParams} searchParams={searchParams} />;
} 