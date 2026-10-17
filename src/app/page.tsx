'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import LandingExperience from '@/components/LandingExperience';
import { useApartmentPrice } from '@/hooks/useApartmentPrice';
import { useBookingAvailability } from '@/hooks/useBookingAvailability';

type Language = 'ge' | 'en';

const copy = {
  ge: {
    brand: 'ქუთაისის ცენტრალური მოედანი',
    tagline: 'აპარტამენტი',
    pricePrefix: 'ფასი:',
    priceLoading: 'ფასი იტვირთება...',
    priceUnavailable: 'ფასის ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით.',
    availabilityCheckFailed: 'თავისუფალი თარიღების შემოწმება ვერ მოხერხდა. სცადეთ მოგვიანებით.',
    datesUnavailable: 'არჩეული თარიღები უკვე დაკავებულია!',
    navGallery: 'გალერეა',
    navLocation: 'მდებარეობა',
    navRecommendations: 'ღირსშესანიშნაობები',
    mainNavigation: 'მთავარი ნავიგაცია',
    heroEyebrow: 'ექსკლუზიური დასვენება ქუთაისის გულში',
    heroTitle: 'თავისუფლება და დახვეწილი კომფორტი',
    heroLineOne: 'ქალაქის გულში,',
    heroAccent: 'შენი',
    heroLineTwo: 'ისტორია.',
    heroDescription: 'სახლი მოგზაურობისთვის.',
    browseApartments: 'დაათვალიერე აპარტამენტი',
    navRestaurants: 'რესტორნები',
    openMenu: 'მენიუს გახსნა',
    closeMenu: 'მენიუს დახურვა',
    scrollDown: 'ჩამოსრიალდი',
    cityLabel: 'ქუთაისი, საქართველო',
    apartmentEyebrow: 'ჩვენი სივრცეები',
    apartmentHeading: 'აპარტამენტები',
    apartmentAccent: 'ისტორიისთვის.',
    apartmentIntro: 'დაისვენე ისე, როგორც სახლში.',
    apartmentDescription: 'მზიანი ოთახები, თბილი ხის დეტალები და ის პატარა კომფორტები, რომლებიც მოგზაურობას სახლად აქცევს.',
    apartmentSuite: 'ცენტრალური სუითი',
    apartmentDetails: 'გაიგე მეტი',
    bedrooms: '1 საძინებელი',
    wifi: 'სწრაფი Wi-Fi',
    storyEyebrow: 'ჩვენი ამბავი',
    storyLineOne: 'აქ ყოფნა',
    storyAccent: 'მარტივია.',
    storyDescription: 'ქუთაისის ყველაზე ცოცხალ უბანში, ქალაქის ხმაურსა და სახლის სიმშვიდეს შორის. შექმნილი მათთვის, ვისაც მოგზაურობისას ადგილობრივად ცხოვრება უყვარს.',
    discoverEyebrow: 'ჩვენ გირჩევთ',
    discoverTitle: 'აღმოაჩინე',
    discoverAccent: 'ქუთაისი.',
    discoverDescription: 'ქალაქის მიღმა კიდევ უფრო დიდი ამბები გელოდება.',
    hostFavorites: 'მასპინძლების რჩეული',
    learnMore: 'გაიგე მეტი',
    backToTop: 'ზემოთ',
    footerHome: 'შენი სახლი ქუთაისში.',
    footerEmail: 'ელფოსტა',
    guestName: 'სრული სახელი',
    guestNamePlaceholder: 'მაგ: გიორგი ბერიძე',
    phone: 'ტელეფონის ნომერი',
    checkIn: 'ჩასვლა',
    checkOut: 'გასვლა',
    loading: 'იგზავნება...',
    bookNow: 'დაჯავშნა',
    whatsappLabel: 'მოგვწერეთ WhatsApp-ზე',
    bookingSuccess: 'ჯავშანი წარმატებით გაიგზავნა! მენეჯერი მალე დაგიკავშირდებათ.',
    bookingFailure: 'შეცდომა ჯავშნის გაფორმებისას: ',
    unknownFailure: 'სერვერთან კავშირის ხარვეზი',
    requiredFields: 'გთხოვთ შეავსოთ ყველა ველი!',
    invalidDates: 'გასვლის თარიღი უნდა აღემატებოდეს ჩასვლის თარიღს!',
    galleryEyebrow: 'ვიზუალური გამოცდილება',
    galleryTitle: 'აპარტამენტის ინტერიერი',
    galleryPrevious: 'წინა ფოტო',
    galleryNext: 'შემდეგი ფოტო',
    livingRoom: 'ელეგანტური მისაღები ოთახი',
    bedroom: 'კომფორტული საძინებელი',
    kitchen: 'თანამედროვე სამზარეულო',
    locationEyebrow: 'პრემიუმ ლოკაცია',
    locationTitle: 'ადგილმდებარეობა',
    address: 'ქუთაისის ცენტრალური მოედანი',
    directions: 'მარშრუტის ნახვა',
    locationDescription: 'აპარტამენტი მდებარეობს უშუალოდ ცენტრალურ მოედანზე. ფეხით სავალ მანძილზეა ყველა მთავარი კულტურული ობიექტი, საუკეთესო რესტორნები და ტრანსპორტი.',
    airport: 'აეროპორტიდან დაახლოებით 15 წუთი',
    fountainView: 'ხედი ცენტრალურ შადრევანზე',
    mapTitle: 'ქუთაისის ცენტრალური მოედნის რუკა',
    recommendationsEyebrow: 'კულტურული მემკვიდრეობა',
    recommendationsTitle: 'ღირსშესანიშნაობები',
    restaurantsEyebrow: 'გასტრონომიული რეკომენდაციები',
    restaurantsTitle: 'რეკომენდებული რესტორნები',
    viewOnMap: 'რუკაზე ნახვა',
    viewAddress: 'მისამართი',
    footerTagline: 'უმაღლესი სტანდარტების რეზიდენცია',
    copyright: 'ყველა უფლება დაცულია.',
    adminPanel: 'ადმინისტრირება',
    adminLogin: 'ადმინისტრაციის პანელი',
    languageLabel: 'ენის არჩევა',
  },
  en: {
    brand: 'Kutaisi Central Square',
    tagline: 'Apartment',
    pricePrefix: 'Rate:',
    priceLoading: 'Loading price...',
    priceUnavailable: 'Unable to load the price. Please try again later.',
    availabilityCheckFailed: 'Unable to check availability. Please try again later.',
    datesUnavailable: 'Selected dates are already booked.',
    navGallery: 'Gallery',
    navLocation: 'Location',
    navRecommendations: 'Local Highlights',
    mainNavigation: 'Main navigation',
    heroEyebrow: 'Exclusive Stay in the Heart of Kutaisi',
    heroTitle: 'Elegance & Uncompromised Comfort',
    heroLineOne: 'In the heart',
    heroAccent: 'of the city,',
    heroLineTwo: 'your story.',
    heroDescription: 'A home for your travels. A space that lets you gently feel the rhythm of Kutaisi.',
    browseApartments: 'Explore the apartment',
    navRestaurants: 'Restaurants',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    scrollDown: 'Scroll down',
    cityLabel: 'Kutaisi, Georgia',
    apartmentEyebrow: 'Our spaces',
    apartmentHeading: 'Apartments',
    apartmentAccent: 'for your story.',
    apartmentIntro: 'Feel at home — only a little more beautifully.',
    apartmentDescription: 'Sunlit rooms, warm wood details, and the thoughtful comforts that make travel feel like home.',
    apartmentSuite: 'Central Suite',
    apartmentDetails: 'Discover more',
    bedrooms: '1 bedroom',
    wifi: 'High-speed Wi-Fi',
    storyEyebrow: 'Our story',
    storyLineOne: 'Being here',
    storyAccent: 'feels easy.',
    storyDescription: 'In Kutaisi’s liveliest neighborhood, between the city’s energy and the quiet of home. Made for travelers who love to live like locals.',
    discoverEyebrow: 'Our recommendations',
    discoverTitle: 'Discover',
    discoverAccent: 'Kutaisi.',
    discoverDescription: 'Even bigger stories are waiting just beyond the city.',
    hostFavorites: 'Host favorites',
    learnMore: 'Learn more',
    backToTop: 'Back to top',
    footerHome: 'Your home in Kutaisi.',
    footerEmail: 'Email',
    guestName: 'Full name',
    guestNamePlaceholder: 'e.g. Giorgi Beridze',
    phone: 'Phone number',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    loading: 'Submitting...',
    bookNow: 'Reserve Now',
    whatsappLabel: 'Message us on WhatsApp',
    bookingSuccess: 'Your booking request was sent. Our host will be in touch shortly.',
    bookingFailure: 'Unable to submit your booking: ',
    unknownFailure: 'A server connection error occurred.',
    requiredFields: 'Please complete all fields.',
    invalidDates: 'Check-out must be later than check-in.',
    galleryEyebrow: 'Visual Experience',
    galleryTitle: 'Apartment Interior',
    galleryPrevious: 'Previous photo',
    galleryNext: 'Next photo',
    livingRoom: 'Elegant living room',
    bedroom: 'Comfortable bedroom',
    kitchen: 'Contemporary kitchen',
    locationEyebrow: 'Prime Location',
    locationTitle: 'Location',
    address: 'Kutaisi Central Square',
    directions: 'Get directions',
    locationDescription: 'The apartment sits directly on the central square, within easy walking distance of the city’s cultural landmarks, acclaimed restaurants, and transport.',
    airport: 'Around 15 minutes from the airport',
    fountainView: 'Views over the central fountain',
    mapTitle: 'Map of Kutaisi Central Square',
    recommendationsEyebrow: 'Cultural Heritage',
    recommendationsTitle: 'Attractions',
    restaurantsEyebrow: 'Gastronomy',
    restaurantsTitle: 'Recommended restaurants',
    viewOnMap: 'View on map',
    viewAddress: 'Address',
    footerTagline: 'Luxury residence of exceptional standards',
    copyright: 'All rights reserved.',
    adminPanel: 'Administration',
    adminLogin: 'Management login',
    languageLabel: 'Choose language',
  },
} satisfies Record<Language, Record<string, string>>;

const galleryData = [
  { imagePath: '/images/gallery/1.jpg', title: { ge: 'მისაღები ოთახი', en: 'Living room' } },
  { imagePath: '/images/gallery/2.jpg', title: { ge: 'საძინებელი', en: 'Bedroom' } },
  { imagePath: '/images/gallery/3.jpg', title: { ge: 'სამზარეულო', en: 'Kitchen' } },
  { imagePath: '/images/gallery/4.jpg', title: { ge: 'აპარტამენტის დეტალები', en: 'Apartment details' } },
  { imagePath: '/images/gallery/5.jpg', title: { ge: 'თანამედროვე კომფორტი', en: 'Modern comfort' } },
  { imagePath: '/images/gallery/6.jpg', title: { ge: 'დასასვენებელი სივრცე', en: 'Lounge area' } },
  { imagePath: '/images/gallery/7.jpg', title: { ge: 'მყუდრო ინტერიერი', en: 'Warm interior' } },
  { imagePath: '/images/gallery/8.jpg', title: { ge: 'რეზიდენციის გარემო', en: 'Residence ambiance' } },
] as const;

const attractionsData = [
  {
    imagePath: '/images/attractions/1.jpg',
    title: { ge: 'ბაგრატის ტაძარი', en: 'Bagrati Cathedral' },
    description: { ge: 'ისტორიული ტაძარი და ქუთაისის პანორამული ხედები.', en: 'A historic cathedral with panoramic views across Kutaisi.' },
    distance: { ge: '1.5 კმ', en: '1.5 km' },
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Bagrati+Cathedral+Kutaisi',
  },
  {
    imagePath: '/images/attractions/2.jpg',
    title: { ge: 'გელათის მონასტერი', en: 'Gelati Monastery' },
    description: { ge: 'შუა საუკუნეების მონასტერი, რომელიც იუნესკოს მსოფლიო მემკვიდრეობას ეკუთვნის.', en: 'A medieval monastery and UNESCO World Heritage Site.' },
    distance: { ge: '11 კმ', en: '11 km' },
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Gelati+Monastery',
  },
  {
    imagePath: '/images/attractions/3.jpg',
    title: { ge: 'პრომეთეს მღვიმე', en: 'Prometheus Cave' },
    description: { ge: 'შთამბეჭდავი მიწისქვეშა დარბაზები, სტალაქტიტები და განათებული ბილიკები.', en: 'Impressive underground chambers, stalactites, and illuminated pathways.' },
    distance: { ge: '20 კმ', en: '20 km' },
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Prometheus+Cave+Georgia',
  },
  {
    imagePath: '/images/attractions/4.jpg',
    title: { ge: 'ოკაცეს კანიონი', en: 'Okatse Canyon' },
    description: { ge: 'კანიონის თავზე მოწყობილი საფეხმავლო ბილიკი და ბუნების ხედები.', en: 'A scenic walkway above the canyon surrounded by lush nature.' },
    distance: { ge: '50 კმ', en: '50 km' },
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Okatse+Canyon',
  },
  {
    imagePath: '/images/attractions/5.jpg',
    title: { ge: 'სათაფლიის ნაკრძალი', en: 'Sataplia Nature Reserve' },
    description: { ge: 'კარსტული მღვიმე, დინოზავრის ნაკვალევი და ტყის ბილიკები.', en: 'A karst cave, dinosaur footprints, and forest trails.' },
    distance: { ge: '10 კმ', en: '10 km' },
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Sataplia+Nature+Reserve',
  },
  {
    imagePath: '/images/attractions/6.jpg',
    title: { ge: 'თეთრი ხიდი', en: 'White Bridge' },
    description: { ge: 'ქალაქის ცნობილი საფეხმავლო ხიდი რიონის ულამაზესი ხედებით.', en: 'A celebrated pedestrian bridge with beautiful views of the Rioni River.' },
    distance: { ge: '600 მ', en: '600 m' },
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=White+Bridge+Kutaisi',
  },
] as const;

const restaurantsData = [
  {
    imagePath: '/images/restaurants/1.jpg',
    title: { ge: 'ჰოეგარდენი', en: 'Hoegarden' },
    cuisine: { ge: 'ქართული და ევროპული სამზარეულო', en: 'Georgian & European cuisine' },
    description: { ge: 'მყუდრო გარემო და მრავალფეროვანი მენიუ ქალაქის ცენტრში.', en: 'A relaxed atmosphere and varied menu in the city center.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Hoegarden+Kutaisi',
  },
  {
    imagePath: '/images/restaurants/2.jpg',
    title: { ge: 'ვაინშტეფანი', en: 'Weihenstephan' },
    cuisine: { ge: 'ევროპული სამზარეულო', en: 'European cuisine' },
    description: { ge: 'კლასიკური კერძები და სასიამოვნო გარემო მეგობრებთან შესახვედრად.', en: 'Classic dishes and a welcoming spot for meeting friends.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Weihenstephan+Kutaisi',
  },
  {
    imagePath: '/images/restaurants/3.jpg',
    title: { ge: 'სთორი', en: 'Story' },
    cuisine: { ge: 'ქართული და თანამედროვე სამზარეულო', en: 'Georgian & contemporary cuisine' },
    description: { ge: 'ადგილობრივი გემოები თანამედროვე ინტერპრეტაციით.', en: 'Local flavors served with a contemporary touch.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Story+Restaurant+Kutaisi',
  },
  {
    imagePath: '/images/restaurants/4.jpg',
    title: { ge: 'პალატი', en: 'Palaty' },
    cuisine: { ge: 'ტრადიციული ქართული სამზარეულო', en: 'Traditional Georgian cuisine' },
    description: { ge: 'ქართული სტუმართმოყვარეობა და ტრადიციული კერძები.', en: 'Georgian hospitality and traditional local dishes.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Palaty+Kutaisi',
  },
] as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>('ge');
  const text = copy[language];
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const {
    pricePerNight,
    currency,
    loading: priceLoading,
    error: priceError,
  } = useApartmentPrice();
  const {
    bookings: availabilityBookings,
    loading: availabilityLoading,
    error: availabilityError,
    checkAvailability,
  } = useBookingAvailability();

  useEffect(() => {
    document.documentElement.lang = language === 'ge' ? 'ka' : 'en';
  }, [language]);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * (pricePerNight ?? 0);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!guestName || !guestEmail || !startDate || !endDate) {
      setErrorMessage(text.requiredFields);
      return;
    }

    if (pricePerNight === null) {
      setErrorMessage(text.priceUnavailable);
      return;
    }

    if (priceError) {
      setErrorMessage(text.priceUnavailable);
      return;
    }

    if (nights <= 0) {
      setErrorMessage(text.invalidDates);
      return;
    }

    try {
      setLoading(true);
      if (availabilityError) {
        setErrorMessage(text.availabilityCheckFailed);
        return;
      }

      const isAvailable = await checkAvailability(startDate, endDate);
      if (isAvailable === null) {
        setErrorMessage(text.availabilityCheckFailed);
        return;
      }
      if (!isAvailable) {
        setErrorMessage(text.datesUnavailable);
        return;
      }

      const dateRange = `[${startDate},${endDate}]`;

      const { error } = await supabase.from('bookings').insert([
        {
          guest_name: guestName,
          guest_email: guestEmail,
          date_range: dateRange,
          total_price: totalPrice,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSuccessMessage(text.bookingSuccess);
      setGuestName('');
      setGuestEmail('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      const message = err instanceof Error ? err.message : text.unknownFailure;
      setErrorMessage(text.bookingFailure + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LandingExperience
      text={text}
      language={language}
      setLanguage={setLanguage}
      guestName={guestName}
      setGuestName={setGuestName}
      guestEmail={guestEmail}
      setGuestEmail={setGuestEmail}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      loading={loading}
      successMessage={successMessage}
      errorMessage={errorMessage}
      galleryIndex={galleryIndex}
      setGalleryIndex={setGalleryIndex}
      pricePerNight={pricePerNight}
      currency={currency}
      availabilityBookings={availabilityBookings}
      availabilityLoading={availabilityLoading}
      availabilityError={availabilityError}
      priceLoading={priceLoading}
      priceError={priceError}
      nights={nights}
      totalPrice={totalPrice}
      onBooking={handleBooking}
      galleryData={galleryData}
      attractionsData={attractionsData}
      restaurantsData={restaurantsData}
    />
  );
}