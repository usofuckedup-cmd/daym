import type { Metadata } from "next"
import { Mail, MessageCircle, Phone, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { getServerDictionary } from "@/lib/i18n/server"

export const metadata: Metadata = {
  title: "Contact — SafeDeal",
  description: "Get in touch with the SafeDeal support team. We're here to help with your escrow transactions.",
}

const icons = [Mail, MessageCircle, Phone, MapPin]

export default async function ContactPage() {
  const { t } = await getServerDictionary()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {t.contactPage.badge}
          </span>
          <h1 className="mt-5 text-pretty text-4xl font-bold tracking-tight md:text-5xl">
            {t.contactPage.title}
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {t.contactPage.subtitle}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {t.contactPage.channels.map((c, i) => {
              const Icon = icons[i]
              return (
                <div
                  key={c.label}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p className="mt-0.5 font-semibold text-foreground">{c.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.hint}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
