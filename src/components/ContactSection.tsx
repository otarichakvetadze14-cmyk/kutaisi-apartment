'use client';

import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  language: 'ge' | 'en';
}

export default function ContactSection({ language }: ContactSectionProps) {
  const isGe = language === 'ge';

  return (
    <section className="section contact-section max-w-7xl mx-auto px-4 py-16" id="contact">
      <div className="section-heading mb-12 text-center md:text-left">
        <p className="eyebrow"><span />{isGe ? 'კონტაქტი' : 'Contact Us'}</p>
        <h2 className="text-3xl font-serif font-medium">
          {isGe ? 'დაგვიკავშირდით' : 'Get in Touch'}
        </h2>
        <p className="section-intro max-w-2xl mt-2 text-neutral-600">
          {isGe
            ? 'მზად ვართ გუპასუხოთ ნებისმიერ შეკითხვაზე და დაგეხმაროთ იდეალური დასვენების დაგეგმვაში.'
            : 'We are here to answer your questions and help you plan your perfect stay.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* მისამართი */}
        <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              {isGe ? 'მისამართი' : 'Address'}
            </h3>
            <p className="text-sm font-medium text-neutral-900">
              {isGe ? 'ქუთაისის ცენტრალური მოედანი' : 'Kutaisi Central Square'}
            </p>
            <p className="text-xs text-neutral-500">{isGe ? 'ქუთაისი, საქართველო' : 'Kutaisi, Georgia'}</p>
          </div>
        </div>

        {/* ტელეფონი / WhatsApp */}
        <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Phone size={20} />
          </div>
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              {isGe ? 'ტელეფონი / WhatsApp' : 'Phone / WhatsApp'}
            </h3>
            <a href="https://wa.me/995598542424" target="_blank" rel="noreferrer" className="text-sm font-medium text-neutral-900 hover:underline block">
              +995 598 54 24 24
            </a>
            <span className="text-xs text-emerald-600 font-medium">
              {isGe ? 'ხელმისაწვდომია WhatsApp-ზე' : 'Available on WhatsApp'}
            </span>
          </div>
        </div>

        {/* ელფოსტა */}
        <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Mail size={20} />
          </div>
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              {isGe ? 'ელფოსტა' : 'Email'}
            </h3>
            <a href="mailto:hello@kutaisi-square.ge" className="text-sm font-medium text-neutral-900 hover:underline block">
              hello@kutaisi-square.ge
            </a>
            <p className="text-xs text-neutral-500">{isGe ? 'სწრაფი უკუკავშირი' : 'Quick response'}</p>
          </div>
        </div>

        {/* რეგისტრაციის საათები */}
        <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
              {isGe ? 'ჩასვლა / გასვლა' : 'Check-in / Check-out'}
            </h3>
            <p className="text-sm font-medium text-neutral-900">
              Check-in: 14:00+
            </p>
            <p className="text-xs text-neutral-500">Check-out: 12:00-მდე</p>
          </div>
        </div>
      </div>
    </section>
  );
}