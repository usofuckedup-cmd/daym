'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  ShieldCheck,
  LifeBuoy,
  Settings2,
  Bell,
  Menu,
  X,
  Search,
  LogOut,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const { t } = useLanguage()

  const initials =
    session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '··'

  // @ts-expect-error - role is a custom field added via the auth() session callback
  const isAdmin = session?.user?.role === 'ADMIN'

  const baseNavItems = [
    { label: t.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { label: t.nav.myDeals, href: '/dashboard#deals', icon: FileText },
    { label: t.nav.createDeal, href: '/create-deal', icon: PlusCircle },
    { label: t.nav.profile, href: '/profile', icon: User },
    { label: t.nav.helpCenter, href: '/contact', icon: LifeBuoy },
  ]
  const adminNavItem = { label: t.nav.admin, href: '/admin', icon: Settings2 }
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === item.href.split('#')[0]
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-primary p-4 text-primary-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald" />
          <span className="text-sm font-semibold">{t.nav.verifiedAccountTitle}</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/70">
          {t.nav.verifiedAccountDesc}
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-svh bg-secondary/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-sidebar lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-border bg-sidebar">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground sm:flex">
              <Search className="size-4" />
              <span>{t.nav.searchDeals}</span>
            </div>
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-emerald ring-2 ring-background" />
            </button>
            <Link href="/profile" className="flex items-center gap-2 rounded-xl p-1 hover:bg-muted">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {initials}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-muted"
              aria-label={t.nav.logout}
              title={t.nav.logout}
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </div>
  )
}
