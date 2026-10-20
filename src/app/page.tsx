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
    perNight: 'ღამეში',
    totalPrice: 'ჯამური ღირებულება',
    selectDates: 'აირჩიეთ თარიღები',
    guests: 'სტუმრები',
    guest: 'სტუმარი',
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
    discoverEyebrow: 'აღმოაჩინეთ იმერეთი',
    discoverTitle: 'კანიონები, მღვიმეები\nდა *ტაძრები*.',
    discoverAccent: 'ქუთაისი.',
    discoverDescription: 'ქუთაისი დასავლეთ საქართველოს შთამბეჭდავი ბუნებისა და ისტორიული ძეგლებისკენ მიმავალი კარიბჭეა. ექსკურსიებისთვის მასპინძელი კერძო მძღოლს დაგიჯავშნით და წინასწარ შესვლის პირობებს მოგიგვარებთ.',
    hostFavorites: 'მასპინძლების რჩეული',
    learnMore: 'გაიგე მეტი',
    backToTop: 'ზემოთ დაბრუნება',
    footerHome: 'შენი სახლი ქუთაისში.',
    footerEmail: 'ელფოსტა',
    guestName: 'სრული სახელი',
    guestNamePlaceholder: 'მაგ: გიორგი ბერიძე',
    phone: 'ტელეფონის ნომერი',
    checkIn: 'შესვლა (Check-in)',
    checkOut: 'გასვლა (Check-out)',
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
    restaurantsTitle: 'რესტორნები',
    viewOnMap: 'რუკაზე ნახვა',
    viewAddress: 'მისამართი',
    footerTagline: 'უმაღლესი სტანდარტების რეზიდენცია',
    copyright: 'ყველა უფლება დაცულია.',
    adminPanel: 'ადმინისტრირება',
    adminLogin: 'ადმინისტრაციის პანელი',
    languageLabel: 'ენის არჩევა',
    menuOpen: 'მენიუ',
    menuClose: 'დახურვა',
    cursorView: 'ნახვა',
    cursorOpen: 'გახსნა',
    siteMenu: 'მთავარი მენიუ',
    homeLink: 'ქუთაისის ცენტრალური მოედანი — მთავარი',
    headerTagline: 'ქუთაისის ცენტრალური მოედანი',
    reserve: 'დაჯავშნა',
    navResidences: 'აპარტამენტი',
    navExperiences: 'შთაბეჭდილებები',
    navDiscover: 'აღმოაჩინეთ',
    navContact: 'კონტაქტი',
    introEyebrow: 'ჩვენი რეზიდენცია',
    introStatement: 'პირადი სივრცე საქართველოს უძველესი ქალაქის უძველეს მოედანზე — სადაც ფუფუნება *სიმშვიდით*, სინათლითა და ბუნებრივი მასალებით გამოიხატება.',
    introDescription: 'ჩვენი ბინა მდებარეობს ქუთაისის ისტორიულ ცენტრში, თამარ მეფის ქუჩა №2-ში, დავით აღმაშენებლის მოედნის მახლობლად. XIX საუკუნის მიწურულის არქიტექტურულ მემკვიდრეობას გერმანელი არქიტექტორის, ედმუნდ ფრიკის, სახელი უკავშირდება. აქ ძველი ქუთაისის ევროპული ელეგანტურობა, ისტორია და მყუდრო გარემო ერთმანეთს ერწყმის და თქვენს სტუმრობას განსაკუთრებულ ხიბლს სძენს.',
    introLivingAlt: 'ხედი ქუთაისის ცენტრალურ მოედანზე',
    introDetailAlt: 'ქუთაისის ცენტრალური მოედნის ხედი ზემოდან',
    factFountain: 'კოლხური შადრევნიდან ფეხით',
    factAirport: 'ქუთაისის საერთაშორისო აეროპორტიდან',
    factCheckIn: 'პირადი დახვედრა სტუმრებს',
    factHost: 'მასპინძელი WhatsApp-ზე',
    factMinute: 'წთ',
    residencesEyebrow: 'აპარტამენტი',
    residencesTitle: 'განსაკუთრებული აპარტამენტი',
    residencesDescription: 'ქუთაისის შუაგულში მდებარე, ინდივიდუალური ხასიათითა და ყურადღებით აღდგენილი სივრცე.',
    residenceName: 'ცენტრალური აპარტამენტი',
    residenceTagline: 'პირადი სივრცე ქუთაისის ცენტრალურ მოედანზე',
    residenceDescription: 'მყუდრო და მზიანი აპარტამენტი ქუთაისის გულში — ხის თბილი დეტალებითა და სახლის ყველა საჭირო კომფორტით. ქალაქის ღირსშესანიშნაობები ფეხით სავალ მანძილზეა.',
    residenceSize: '1 საძინებელი',
    residenceGuests: 'სტუმარი',
    residenceView: 'ცენტრალური მოედანი',
    residenceBed: 'ორადგილიანი საწოლი',
    residenceAmenities: 'აპარტამენტის პირობები',
    residenceAmenitiesList: 'სწრაფი Wi-Fi|სამზარეულო|კონდიციონერი|მდებარეობა ქალაქის ცენტრში',
    residenceImageAlt: 'ცენტრალური აპარტამენტის ინტერიერი',
    sizeLabel: 'ფართობი',
    guestCapacityLabel: 'სტუმრები',
    upTo: 'მაქსიმუმ',
    bedLabel: 'საწოლი',
    viewLabel: 'ხედი',
    amenityWifi: 'სწრაფი Wi-Fi',
    amenityKitchen: 'სამზარეულო',
    amenityAirConditioning: 'კონდიციონერი',
    amenityLocation: 'ცენტრალური მდებარეობა',
    fromPrice: 'ფასი —',
    perNightShort: 'ღამეში',
    longerStay: 'დიდხანს აპირებთ დარჩენას ან ოჯახთან ერთად მოგზაურობთ?',
    longerStayDescription: 'თვიური ტარიფებისა და რამდენიმე აპარტამენტის დაჯავშნის პირობების შესახებ მოგვმართეთ.',
    contactHost: 'დაუკავშირდით მასპინძელს',
    viewResidence: 'აპარტამენტის დეტალების ნახვა',
    closeDetails: 'დეტალების დახურვა',
    showImage: 'ფოტოს ჩვენება',
    reserveResidence: 'ამ აპარტამენტის დაჯავშნა',
    beyondStay: 'დასვენებაზე *მეტი*.',
    experiencesEyebrow: 'შთაბეჭდილებები',
    ritualKicker: 'განტვირთვა',
    ritualTitle: 'ნელი დილა,\n*მშვიდი* საღამო.',
    ritualBody: 'ტრავერტინის ღრმა აბაზანა, წვიმის ტიპის შხაპი და სელის ხალათები. სურვილისამებრ, მასპინძელი აპარტამენტში მასაჟს ან ახლომდებარე წყალტუბოს გოგირდის აბანოებში კერძო ვიზიტს მოგიწყობთ.',
    ritualList: 'მასაჟი აპარტამენტში|ტრანსფერი წყალტუბოს სპა-ცენტრებში|ნატურალური სააბაზანო საშუალებები',
    ritualImageAlt: 'სანთლებით განათებული ტრავერტინის აბაზანა',
    ritualDetailAlt: 'დილის ყავა ფანჯარასთან',
    tableImageAlt: 'იმერული სუფრა ხაჭაპურითა და ქვევრის ღვინით',
    tableDetailAlt: 'მისაღები ოთახი ღვინის დოქით',
    tableKicker: 'გემოები',
    tableTitle: 'იმერეთის\n*გემო*.',
    tableBody: 'იმერული ხაჭაპური, ფხალი და ქვევრში დავარგებული ქარვისფერი ღვინო. თითოეულ სტუმარს საოჯახო მარნის ღვინით ვუმასპინძლდებით და ადგილობრივების საყვარელ რესტორნებსაც გაგიზიარებთ.',
    openInMaps: 'რუკაზე გახსნა',
    galleryHeading: 'ისტორია, რომელიც დროს უძლებს.',
    galleryDescription: 'ძველი ქუთაისის ატმოსფერო, არქიტექტურული ხიბლი და დეტალები, რომლებიც დროს ინარჩუნებს.',
    openImage: 'ფოტოს ნახვა',
    imageViewer: 'ფოტოების დათვალიერება',
    closeViewer: 'ფოტოს დახურვა',
    previousImage: 'წინა ფოტო',
    nextImage: 'შემდეგი ფოტო',
    contactEyebrow: 'მდებარეობა და კონტაქტი',
    contactHeading: 'გვიპოვეთ\n*ცენტრალურ* მოედანზე.',
    contactDescription: 'კოლხური შადრევნიდან, ოპერის თეატრიდან და თეთრი ხიდიდან რამდენიმე ნაბიჯში — ქუთაისის მთავარი ადგილები ჩვენი კარიდან იწყება.',
    addressLabel: 'მისამართი',
    phoneLabel: 'ტელეფონი და WhatsApp',
    emailLabel: 'ელფოსტა',
    checkInOutLabel: 'შესვლა / გასვლა',
    airportLabel: 'აეროპორტი (KUT)',
    airportTransfer: '15 წუთი · ტრანსფერი მოთხოვნით',
    messageWhatsApp: 'მოგვწერეთ WhatsApp-ზე',
    guestVoices: 'სტუმრების შთაბეჭდილებები',
    guestReviewsTitle: 'რას ამბობენ ჩვენი სტუმრები',
    fiveStarStay: 'ხუთვარსკვლავიანი დასვენება',
    previousReview: 'წინა შეფასება',
    nextReview: 'შემდეგი შეფასება',
    showReview: 'შეფასება',
    reviewOne: 'ფარდები გადავწიეთ, ქვემოთ მოოქროსფრო შადრევანი დავინახეთ და გარეთ გასვლა აღარ მოგვინდა. ეს უფრო მეგობრის ლამაზ სახლში სტუმრობას ჰგავდა, ვიდრე აპარტამენტის დაქირავებას.',
    reviewTwo: 'ყველაფერი უნაკლოდ სუფთა და დახვეწილი იყო, მდებარეობა კი — შეუდარებელი. მასპინძლის რესტორნების რეკომენდაციებმა იმერეთში მოგზაურობა დაუვიწყარი გახადა.',
    reviewThree: 'აეროპორტიდან სულ რაღაც თხუთმეტ წუთში ქუთაისის შუაგულში აღმოჩნდებით. სინათლე, ხის სითბო და სიმშვიდე — წასვლა აღარ გვინდოდა.',
    menuExplore: 'აღმოაჩინეთ',
    footerLetter: 'წერილები ქუთაისიდან — სეზონური შეთავაზებები, ახალი აპარტამენტები და რეგიონის გამორჩეული ადგილები.',
    thankYou: 'გმადლობთ — გამოწერა წარმატებით შესრულდა.',
    emailAddress: 'ელფოსტის მისამართი',
    subscribe: 'გამოწერა',
    footerContact: 'კონტაქტი',
    administration: 'ადმინისტრაცია',
    allRightsReserved: 'ყველა უფლება დაცულია.',
    marqueeWords: 'ქუთაისი|ცენტრალური მოედანი|იმერეთი|ოქროს ხანა|დარჩით კიდევ',
  },
  en: {
    brand: 'Kutaisi Central Square',
    tagline: 'Apartment',
    pricePrefix: 'Rate:',
    perNight: 'night',
    totalPrice: 'Total price',
    selectDates: 'Select dates',
    guests: 'Guests',
    guest: 'guest',
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
    discoverEyebrow: 'Discover Imereti',
    discoverTitle: 'Canyons, caves\n& *cathedrals*.',
    discoverAccent: 'Kutaisi.',
    discoverDescription: 'Kutaisi is the gateway to western Georgia’s dramatic landscapes and historic sites. Our host can arrange a private driver and help secure early entry for your excursions.',
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
    bookNow: 'Book now',
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
    restaurantsTitle: 'Restaurants',
    viewOnMap: 'View on map',
    viewAddress: 'Address',
    footerTagline: 'Luxury residence of exceptional standards',
    copyright: 'All rights reserved.',
    adminPanel: 'Administration',
    adminLogin: 'Management login',
    languageLabel: 'Choose language',
    menuOpen: 'Menu',
    menuClose: 'Close',
    cursorView: 'View',
    cursorOpen: 'Open',
    siteMenu: 'Main menu',
    homeLink: 'Kutaisi Central Square — home',
    headerTagline: 'Kutaisi Central Square',
    reserve: 'Reserve',
    navResidences: 'Residences',
    navExperiences: 'Experiences',
    navDiscover: 'Discover',
    navContact: 'Contact',
    introEyebrow: 'The Residence',
    introStatement: 'A private address on the oldest square of Georgia’s oldest city — where luxury is found in *quiet*, light and natural materials.',
    introDescription: 'Our apartment is located in the historic center of Kutaisi, at 2 Tamar Mepe Street, near David Agmashenebeli Square. The late-19th-century architectural heritage is associated with German architect Edmund Frick. Here, the European elegance and history of old Kutaisi blend with a welcoming atmosphere, adding a special charm to your stay.',
    introLivingAlt: 'View over Kutaisi Central Square',
    introDetailAlt: 'View of Kutaisi Central Square from above',
    factFountain: 'Walk to the Colchis Fountain',
    factAirport: 'From Kutaisi International Airport',
    factCheckIn: 'Personal welcome for every guest',
    factHost: 'Host available on WhatsApp',
    factMinute: 'min',
    residencesEyebrow: 'The Residence',
    residencesTitle: 'One thoughtfully restored residence',
    residencesDescription: 'A characterful, individually restored apartment in the heart of Kutaisi.',
    residenceName: 'The Central Apartment',
    residenceTagline: 'A private stay above Kutaisi Central Square',
    residenceDescription: 'A calm, sunlit apartment in the heart of Kutaisi, with warm timber details and the comforts of home within walking distance of the city’s landmarks.',
    residenceSize: '1 bedroom',
    residenceGuests: 'guests',
    residenceView: 'Central Square',
    residenceBed: 'Double bed',
    residenceAmenities: 'In the residence',
    residenceAmenitiesList: 'Fast Wi-Fi|Kitchen|Air conditioning|Central location',
    residenceImageAlt: 'Interior of the Central Apartment',
    sizeLabel: 'Size',
    guestCapacityLabel: 'Guests',
    upTo: 'Up to',
    bedLabel: 'Bed',
    viewLabel: 'View',
    amenityWifi: 'Fast Wi-Fi',
    amenityKitchen: 'Kitchen',
    amenityAirConditioning: 'Air conditioning',
    amenityLocation: 'Central location',
    fromPrice: 'From',
    perNightShort: 'per night',
    longerStay: 'Planning a longer stay or travelling as a family?',
    longerStayDescription: 'Ask us about monthly rates and booking multiple residences.',
    contactHost: 'Speak with the host',
    viewResidence: 'View details for',
    closeDetails: 'Close details',
    showImage: 'Show image',
    reserveResidence: 'Reserve this residence',
    beyondStay: 'Beyond the *stay*.',
    experiencesEyebrow: 'Experiences',
    ritualKicker: 'The Ritual',
    ritualTitle: 'Slow mornings,\n*restorative* evenings.',
    ritualBody: 'Deep travertine tubs, rain showers and linen robes. On request, our host arranges an in-residence massage with a local therapist, or a private visit to the sulphur baths of nearby Tskaltubo.',
    ritualList: 'In-residence massage|Tskaltubo spa transfers|Organic bath amenities',
    ritualImageAlt: 'Candlelit travertine bathtub',
    ritualDetailAlt: 'Morning coffee by the window',
    tableImageAlt: 'Imeretian feast with khachapuri and qvevri wine',
    tableDetailAlt: 'The salon with a carafe of wine',
    tableKicker: 'The Table',
    tableTitle: 'The flavours\nof *Imereti*.',
    tableBody: 'Imeretian khachapuri, pkhali and amber wine aged in clay qvevri. We welcome every guest with a bottle from a family winery, and keep a hand-written list of the tables locals love most.',
    openInMaps: 'Open in maps',
    galleryHeading: 'A story that stands the test of time.',
    galleryDescription: 'The atmosphere of old Kutaisi, architectural charm, and details that endure.',
    openImage: 'Open image',
    imageViewer: 'Image viewer',
    closeViewer: 'Close viewer',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    contactEyebrow: 'Location & Contact',
    contactHeading: 'Find us on\n*Central* Square.',
    contactDescription: 'Steps from the Colchis Fountain, the Opera House and the White Bridge — everything in Kutaisi begins at our door.',
    addressLabel: 'Address',
    phoneLabel: 'Phone & WhatsApp',
    emailLabel: 'Email',
    checkInOutLabel: 'Check-in / out',
    airportLabel: 'Airport (KUT)',
    airportTransfer: '15 minutes · transfer on request',
    messageWhatsApp: 'Message on WhatsApp',
    guestVoices: 'Guest Voices',
    guestReviewsTitle: 'What our guests say',
    fiveStarStay: 'Five-star stay',
    previousReview: 'Previous testimonial',
    nextReview: 'Next testimonial',
    showReview: 'Show testimonial',
    reviewOne: 'We opened the curtains to the fountain glowing below and simply stayed in. It felt less like a rental and more like borrowing a friend’s beautiful home.',
    reviewTwo: 'Impeccably clean, quietly elegant and in an unbeatable location. The host’s restaurant recommendations made our Imereti trip all the more memorable.',
    reviewThree: 'Fifteen minutes from the airport and you are in the very heart of Kutaisi. Sunlight, wood, silence — we did not want to leave.',
    menuExplore: 'Explore',
    footerLetter: 'Letters from Kutaisi — seasonal rates, new residences and the region’s best-kept secrets.',
    thankYou: 'Thank you — you are on the list.',
    emailAddress: 'Email address',
    subscribe: 'Subscribe',
    footerContact: 'Contact',
    administration: 'Administration',
    allRightsReserved: 'All rights reserved.',
    marqueeWords: 'Stay a while|Kutaisi|Central Square|Imereti|Since the Golden Age',
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
    imagePath: '/images/restaurants/hoegardem-1.jpg',
    title: { ge: 'Hoegaarden', en: 'Hoegaarden' },
    cuisine: { ge: 'ქართული და ევროპული სამზარეულო', en: 'Georgian & European cuisine' },
    description: { ge: 'მყუდრო გარემო და მრავალფეროვანი მენიუ ქალაქის ცენტრში.', en: 'A relaxed atmosphere and varied menu in the city center.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Hoegaarden+Kutaisi',
  },
  {
    imagePath: '/images/restaurants/palaty-4.jpg',
    title: { ge: 'Palaty', en: 'Palaty' },
    cuisine: { ge: 'ტრადიციული ქართული სამზარეულო', en: 'Traditional Georgian cuisine' },
    description: { ge: 'ქართული სტუმართმოყვარეობა და ტრადიციული კერძები.', en: 'Georgian hospitality and traditional local dishes.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Palaty+Kutaisi',
  },
  {
    imagePath: '/images/restaurants/story-3.jpg',
    title: { ge: 'Story', en: 'Story' },
    cuisine: { ge: 'ქართული და თანამედროვე სამზარეულო', en: 'Georgian & contemporary cuisine' },
    description: { ge: 'ადგილობრივი გემოები თანამედროვე ინტერპრეტაციით.', en: 'Local flavors served with a contemporary touch.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Story+Restaurant+Kutaisi',
  },
  {
    imagePath: '/images/restaurants/weihnstephan-2.jpg',
    title: { ge: 'Weihenstephan', en: 'Weihenstephan' },
    cuisine: { ge: 'ევროპული სამზარეულო', en: 'European cuisine' },
    description: { ge: 'კლასიკური კერძები და სასიამოვნო გარემო მეგობრებთან შესახვედრად.', en: 'Classic dishes and a welcoming spot for meeting friends.' },
    addressUrl: 'https://www.google.com/maps/search/?api=1&query=Weihenstephan+Kutaisi',
  },
] as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>('ge');
  const text = copy[language];
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guests, setGuests] = useState<number>(1);
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

  const basePrice = pricePerNight ?? 0;
  const extraGuestPrice = 10;
  const effectivePricePerNight = basePrice + (guests - 1) * extraGuestPrice;

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * effectivePricePerNight;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!guestName || !guestEmail || !startDate || !endDate) {
      setErrorMessage(text.requiredFields);
      return;
    }

    if (pricePerNight === null || priceError) {
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
      setGuests(1);
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
      guests={guests}
      setGuests={setGuests}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      loading={loading}
      successMessage={successMessage}
      errorMessage={errorMessage}
      galleryIndex={galleryIndex}
      setGalleryIndex={setGalleryIndex}
      pricePerNight={effectivePricePerNight}
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