export const contact = {
  address: 'Central Square, Kutaisi 4600, Georgia',
  phone: '+995 598 54 24 24',
  phoneHref: 'tel:+995598542424',
  whatsappHref: 'https://wa.me/995598542424',
  email: 'kutaisicentralsquare@gmail.com',
  checkIn: '15:00',
  checkOut: '12:00',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Kutaisi+Central+Square',
}

export const navLinks = [
  { label: 'Residences', href: '#residences' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Discover', href: '#discover' },
  { label: 'Contact', href: '#contact' },
]

export type Residence = {
  id: string
  name: string
  tagline: string
  description: string
  size: string
  guests: number
  bed: string
  view: string
  price: number
  images: { src: string; alt: string }[]
  amenities: string[]
}

export const residences: Residence[] = [
  {
    id: 'central-apartment',
    name: 'The Central Apartment',
    tagline: 'A private stay above Kutaisi Central Square',
    description:
      'A calm, sunlit apartment in the heart of Kutaisi, with warm timber details and the comforts of home within walking distance of the city’s landmarks.',
    size: '1 bedroom',
    guests: 4,
    bed: 'Double bed',
    view: 'Central Square',
    price: 0,
    images: [
      { src: '/images/redesign/suite-square.webp', alt: 'A bedroom in the Central Apartment' },
      { src: '/images/redesign/suite-living.webp', alt: 'The apartment living room' },
      { src: '/images/redesign/detail.webp', alt: 'A detail from the apartment interior' },
    ],
    amenities: ['Fast Wi-Fi', 'Kitchen', 'Air conditioning', 'Central location'],
  },
]

export const galleryImages = [
  { src: '/images/redesign/hero.webp', alt: 'Colchis Fountain on Central Square at dusk' },
  { src: '/images/redesign/suite-square.webp', alt: 'Bedroom in the Central Apartment' },
  { src: '/images/redesign/detail.webp', alt: 'Coffee on the windowsill' },
  { src: '/images/redesign/suite-living.webp', alt: 'Living room in the Central Apartment' },
  { src: '/images/redesign/ritual.webp', alt: 'Stone bathtub ritual' },
  { src: '/images/redesign/suite-loft.webp', alt: 'Apartment interior detail' },
  { src: '/images/redesign/dining.webp', alt: 'Imeretian feast' },
  { src: '/images/redesign/bagrati.webp', alt: 'Bagrati Cathedral at sunrise' },
  { src: '/images/redesign/gelati.webp', alt: 'Gelati Monastery' },
]

export const destinations = [
  { name: 'Bagrati Cathedral', distance: '2 km', time: '6 min', note: 'UNESCO-listed, 11th century', image: '/images/redesign/bagrati.webp' },
  { name: 'Gelati Monastery', distance: '11 km', time: '20 min', note: 'Golden Age frescoes', image: '/images/redesign/gelati.webp' },
  { name: 'Sataplia Reserve', distance: '10 km', time: '18 min', note: 'Dinosaur tracks & caves', image: '/images/redesign/sataplia.webp' },
  { name: 'Prometheus Cave', distance: '20 km', time: '30 min', note: 'Underground river by boat', image: '/images/redesign/prometheus.webp' },
  { name: 'Martvili Canyon', distance: '45 km', time: '55 min', note: 'Emerald waters', image: '/images/redesign/martvili.webp' },
  { name: 'Okatse Canyon', distance: '50 km', time: '60 min', note: 'Suspended cliff walkway', image: '/images/redesign/okatse.webp' },
]

export const testimonials = [
  {
    quote:
      'We opened the curtains to the fountain glowing below and simply stayed in. It felt less like a rental and more like borrowing a friend’s beautiful home.',
    name: 'Mariam & Luka',
    origin: 'Tbilisi, Georgia',
  },
  {
    quote:
      'Impeccably clean, quietly elegant and the location is unbeatable. The host’s restaurant list alone made our trip to Imereti.',
    name: 'Hannah W.',
    origin: 'Berlin, Germany',
  },
  {
    quote:
      'Fifteen minutes from the airport and you are in the very heart of Kutaisi. Sunlight, wood, silence — we did not want to leave.',
    name: 'Daniel K.',
    origin: 'Tel Aviv, Israel',
  },
]

export const restaurants = [
  { name: 'Palaty', cuisine: 'Imeretian classics', walk: '3 min walk' },
  { name: 'Sisters', cuisine: 'Live folk & wine', walk: '4 min walk' },
  { name: 'Bikentia’s Kebabery', cuisine: 'A local legend', walk: '6 min walk' },
]
