'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function SiteFooter() {
  const { t } = useLanguage()

  const columns = [
    {
      title: t.siteFooter.company.title,
      links: [
        { label: t.siteFooter.company.about, href: '/#why' },
        { label: t.siteFooter.company.support, href: '/contact' },
        { label: t.siteFooter.company.faq, href: '/faq' },
      ],
    },
    {
      title: t.siteFooter.product.title,
      links: [
        { label: t.siteFooter.product.howItWorks, href: '/#how-it-works' },
        { label: t.siteFooter.product.createDeal, href: '/create-deal' },
        { label: t.siteFooter.product.dashboard, href: '/dashboard' },
      ],
    },
    {
      title: t.siteFooter.legal.title,
      links: [
        { label: t.siteFooter.legal.privacy, href: '/faq' },
        { label: t.siteFooter.legal.terms, href: '/faq' },
        { label: t.siteFooter.legal.helpCenter, href: '/contact' },
      ],
    },
    {
      title: t.siteFooter.social.title,
      links: [
        { label: t.siteFooter.social.instagram, href: '#' },
        { label: t.siteFooter.social.telegram, href: '#' },
        { label: t.siteFooter.social.contact, href: '/contact' },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald text-emerald-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">SafeDeal</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.siteFooter.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t.siteFooter.copyright}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex size-2 rounded-full bg-emerald" />
            {t.siteFooter.encryption}
          </div>
        </div>
      </div>
    </footer>
  )
}
