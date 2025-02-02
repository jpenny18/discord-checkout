// This is the server component
import { ModulePageClient } from './ModulePageClient';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ModulePageWrapper({ params, searchParams }: PageProps) {
  // Await both promises
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  return <ModulePageClient params={resolvedParams} searchParams={resolvedSearchParams} />;
} 