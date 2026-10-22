import { ArrowUpRight, Clock, Mail, MapPin, Phone, Plane } from 'lucide-react'
import { contact } from '@/lib/site-data'
import { Eyebrow, Reveal, RevealText } from './motion-primitives'

export function Contact({ language, text }: { language: 'ge' | 'en'; text: Record<string, string> }) {
  const details = [
    { icon: MapPin, label: text.addressLabel, value: language === 'ge' ? text.address : contact.address, href: contact.mapsHref },
    { icon: Phone, label: text.phoneLabel, value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: text.emailLabel, value: contact.email, href: `mailto:${contact.email}` },
    { icon: Clock, label: text.checkInOutLabel, value: `${contact.checkIn} / ${contact.checkOut}`, href: null },
    { icon: Plane, label: text.airportLabel, value: text.airportTransfer, href: null },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative w-full max-w-full overflow-x-hidden bg-ink px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto w-full max-w-full">
        
        {/* ზედა ბლოკი: "მდებარეობა და კონტაქტი" + აღწერა + მთავარი სათაური */}
        <div className="mb-12 flex w-full max-w-3xl flex-col items-center text-center mx-auto">
          
          {/* 1. მცირე სათაური: "მდებარეობა და კონტაქტი" */}
          <Eyebrow className="mb-3 text-bronze justify-center">{text.contactEyebrow}</Eyebrow>
          
          {/* 2. აღწერა (კოლხური შადრევნიდან...) - ახლა ზუსტად შუაშია ატანილი! */}
          <Reveal delay={0.05}>
            <p className="mb-4 max-w-2xl text-pretty leading-relaxed text-sand text-base sm:text-lg font-light text-center">
              {text.contactDescription}
            </p>
          </Reveal>

          {/* 3. მთავარი სათაური: "ქუთაისის ცენტრალური მოედანი" */}
          <RevealText
            text={text.contactHeading}
            className="font-serif text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl text-center"
          />
          
          <span id="contact-title" className="sr-only">
            {text.contactEyebrow}
          </span>
        </div>

        {/* ქვედა ბლოკი: კონტაქტების სია და რუკა გვერდიგვერდ */}
        <div className="grid w-full max-w-full gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          
          {/* კონტაქტები */}
          <div className="w-full max-w-full min-w-0">
            <dl className="border-t border-border w-full max-w-full">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div 
                  key={label}
                  className="group flex flex-col items-start justify-between gap-1 border-b border-border py-4 sm:flex-row sm:items-center sm:gap-4 w-full"
                >
                  <dt className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-stone shrink-0">
                    <Icon className="size-4 shrink-0 text-bronze" aria-hidden="true" />
                    <span>{label}</span>
                  </dt>
                  
                  <dd className="w-full min-w-0 break-all text-left text-ivory text-sm sm:w-auto sm:flex-1 sm:break-words sm:text-right">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="break-all transition-colors hover:text-bronze sm:break-words"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* ღილაკები */}
            <div className="mt-8 flex flex-wrap gap-4 w-full">
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-bronze px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ivory"
              >
                {text.messageWhatsApp}
                <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
              </a>
              
              <a
                href={contact.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-ivory/25 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors hover:border-bronze hover:text-bronze"
              >
                {text.directions}
              </a>
            </div>
          </div>

          {/* რუკა */}
          <div className="w-full max-w-full overflow-hidden">
            <div className="relative w-full max-w-full overflow-hidden rounded-xl border border-border">
              <iframe
                title={text.mapTitle}
                src="https://www.google.com/maps?q=Kutaisi+Central+Square&z=16&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[300px] w-full rounded-xl border-0 grayscale invert-[0.92] hue-rotate-180 contrast-[0.9] sm:h-[380px] block"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-bronze/10 mix-blend-color" aria-hidden="true" />
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}