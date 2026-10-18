import { ArrowUpRight, Clock, Mail, MapPin, Phone, Plane } from 'lucide-react'
import { contact } from '@/lib/site-data'
import { Eyebrow, Reveal, RevealText } from './motion-primitives'

const details = [
  { icon: MapPin, label: 'Address', value: contact.address, href: contact.mapsHref },
  { icon: Phone, label: 'Phone & WhatsApp', value: contact.phone, href: contact.phoneHref },
  { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  { icon: Clock, label: 'Check-in / out', value: `${contact.checkIn} / ${contact.checkOut}`, href: null },
  { icon: Plane, label: 'Airport (KUT)', value: '15 minutes · transfer on request', href: null },
]

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow className="mb-6 text-bronze">Location & Contact</Eyebrow>
          <RevealText
            text={'Find us on\n*Central* Square.'}
            className="font-serif text-5xl font-light leading-none text-ivory md:text-7xl"
          />
          <span id="contact-title" className="sr-only">
            Location and contact
          </span>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-pretty leading-relaxed text-sand">
              Steps from the Colchis Fountain, the Opera House and the White Bridge — everything in Kutaisi begins at our
              door.
            </p>
          </Reveal>

          <dl className="mt-12 border-t border-border">
            {details.map(({ icon: Icon, label, value, href }, i) => (
              <Reveal key={label} delay={i * 0.05} y={16}>
                <div className="group flex items-center gap-5 border-b border-border py-5">
                  <Icon className="size-4 shrink-0 text-bronze" aria-hidden="true" />
                  <dt className="w-36 shrink-0 text-[10px] uppercase tracking-[0.25em] text-stone">{label}</dt>
                  <dd className="min-w-0 flex-1 truncate text-ivory">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="transition-colors hover:text-bronze"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-bronze px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ivory"
            >
              Message on WhatsApp
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </a>
            <a
              href={contact.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-ivory/25 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:border-bronze hover:text-bronze"
            >
              Get directions
            </a>
          </div>
        </div>

        <Reveal className="relative min-h-[420px] overflow-hidden border border-border lg:min-h-full">
          <iframe
            title="Map showing Kutaisi Central Square"
            src="https://www.google.com/maps?q=Kutaisi+Central+Square&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9]"
          />
          <div className="pointer-events-none absolute inset-0 bg-bronze/10 mix-blend-color" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  )
}
