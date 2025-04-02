// This file ensures the /dashboard/my-accounts page is never statically generated
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const generateStaticParams = () => { return [] }
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const preferredRegion = 'auto' 