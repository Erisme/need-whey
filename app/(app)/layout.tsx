import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppNav from '@/components/AppNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  return (
    <>
      <AppNav userName={session.userName ?? ''} />
      <main>{children}</main>
    </>
  )
}
