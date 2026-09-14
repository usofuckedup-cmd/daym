import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AppShell } from '@/components/app-shell'
import { CreateDealForm } from '@/components/create-deal-form'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function CreateDealPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/create-deal')
  }
  const { t } = await getServerDictionary()

  return (
    <AppShell title={t.nav.createDeal}>
      <CreateDealForm />
    </AppShell>
  )
}
