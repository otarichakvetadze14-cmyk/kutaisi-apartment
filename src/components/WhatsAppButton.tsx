export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/995542424"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[100] flex size-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-lg shadow-black/30 transition-transform duration-200 ease-out hover:scale-110 hover:bg-[#075E54] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#128C7E]/40"
    >
      <svg viewBox="0 0 32 32" className="size-8 fill-current" aria-hidden="true">
        <path d="M16.04 3.2A12.7 12.7 0 0 0 5.13 22.4L3.4 28.7l6.45-1.69A12.7 12.7 0 1 0 16.04 3.2Zm0 23.1a10.35 10.35 0 0 1-5.28-1.45l-.38-.23-3.83 1 1.02-3.73-.25-.39a10.38 10.38 0 1 1 8.72 4.8Zm5.7-7.77c-.31-.16-1.84-.91-2.13-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.23-.68.08-.31-.16-1.31-.48-2.49-1.53-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.62 0 1.54 1.12 3.03 1.28 3.24.16.21 2.2 3.36 5.33 4.71.74.32 1.32.51 1.77.65.74.24 1.41.21 1.94.13.59-.09 1.84-.75 2.1-1.48.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
      </svg>
    </a>
  )
}
