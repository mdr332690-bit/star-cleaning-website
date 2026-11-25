export type Language = 'en' | 'ar'

export const promotionCopy = {
  en: {
    label: 'SPECIAL OFFER –',
    discount: '20%',
    discountWord: 'OFF',
    scope: 'All Cleaning Services',
    headline: 'Make Your Home Shine!',
    description:
      'Enjoy a cleaner, fresher and more comfortable space with Star Cleaning Kuwait.',
    contact: 'Book Now – Call or WhatsApp',
  },
  ar: {
    label: 'عرض خاص –',
    discount: '20٪',
    discountWord: 'خصم',
    scope: 'على جميع خدمات التنظيف',
    headline: '',
    description:
      'اجعل منزلك أكثر نظافة وانتعاشاً وراحة مع ستار كلينينج الكويت.',
    contact: 'احجز الآن – اتصل بنا أو عبر واتساب',
  },
} satisfies Record<Language, Record<string, string>>

export const services = [
  {
    id: 'home',
    anchor: 'home-cleaning',
    icon: 'home',
    image: 'home.jpg',
    imageAlt: {
      en: 'Illustrative living room with a caramel sofa, cream armchairs and framed photos',
      ar: 'صورة توضيحية لغرفة معيشة بكنبة بلون الكراميل وكراسٍ كريمية وصور مؤطّرة',
    },
    title: { en: 'Home Cleaning', ar: 'تنظيف المنازل' },
    description: {
      en: 'Home cleaning in Kuwait for living areas, bedrooms, kitchens and bathrooms.',
      ar: 'تنظيف المنازل في الكويت لغرف المعيشة والنوم والمطابخ والحمامات.',
    },
    detail: {
      en: 'Plan a home cleaning visit in Kuwait around the rooms you use every day. Discuss dusting, vacuuming, floor care and kitchen and bathroom surfaces. Share your home’s size and priorities so the scope can be agreed before booking.',
      ar: 'خطط لزيارة تنظيف منزلك في الكويت وفق احتياجات الغرف التي تستخدمها يومياً. ناقش إزالة الغبار والكنس والعناية بالأرضيات وأسطح المطبخ والحمامات. شاركنا مساحة منزلك وأولوياتك للاتفاق على نطاق العمل قبل الحجز.',
    },
    includes: {
      en: [
        'Living areas and bedrooms',
        'Kitchen surfaces and bathrooms',
        'Dusting, vacuuming and floor care',
      ],
      ar: [
        'غرف المعيشة والنوم',
        'أسطح المطبخ والحمامات',
        'إزالة الغبار والعناية بالأرضيات',
      ],
    },
  },
  {
    id: 'office',
    anchor: 'office-cleaning',
    icon: 'building',
    image: 'office.jpg',
    imageAlt: {
      en: 'Illustrative office meeting area with a long table and floor-to-ceiling windows',
      ar: 'صورة توضيحية لمساحة اجتماعات مكتبية بطاولة طويلة ونوافذ ممتدة من الأرض إلى السقف',
    },
    title: { en: 'Office Cleaning', ar: 'تنظيف المكاتب' },
    description: {
      en: 'Office cleaning in Kuwait for workstations, meeting rooms and shared spaces.',
      ar: 'تنظيف المكاتب في الكويت لمحطات العمل وغرف الاجتماعات والمساحات المشتركة.',
    },
    detail: {
      en: 'Discuss office cleaning for your workplace in Kuwait, including desks, meeting rooms, reception areas, pantries and washrooms. Share your working hours and the spaces that need attention so the cleaning plan fits your routine.',
      ar: 'ناقش تنظيف مكان عملك في الكويت، بما يشمل المكاتب وغرف الاجتماعات والاستقبال والمطابخ الصغيرة والحمامات. شاركنا أوقات العمل والمساحات التي تحتاج إلى عناية لوضع خطة تنظيف تناسب روتينك.',
    },
    includes: {
      en: [
        'Workstations and meeting rooms',
        'Reception and shared spaces',
        'Pantry, washrooms and floors',
      ],
      ar: [
        'محطات العمل وغرف الاجتماعات',
        'الاستقبال والمساحات المشتركة',
        'المطبخ الصغير والحمامات والأرضيات',
      ],
    },
  },
  {
    id: 'villa',
    anchor: 'villa-cleaning',
    icon: 'villa',
    image: 'villa.jpg',
    imageAlt: {
      en: 'Illustrative villa with a glass façade, shaded terraces and a pool',
      ar: 'صورة توضيحية لفيلا بواجهة زجاجية وشرفات مظللة ومسبح',
    },
    title: { en: 'Villa Cleaning', ar: 'تنظيف الفلل' },
    description: {
      en: 'Villa cleaning in Kuwait with a plan for larger homes, rooms and staircases.',
      ar: 'تنظيف الفلل في الكويت بخطة تناسب المنازل الواسعة والغرف والسلالم.',
    },
    detail: {
      en: 'Villa cleaning starts with a clear plan for a larger home. Tell us the number of rooms, floors and staircases in your Kuwait villa, along with the interior surfaces that need care. The scope and priorities are discussed before the visit.',
      ar: 'يبدأ تنظيف الفلل بخطة واضحة تناسب المساحات الكبيرة. أخبرنا بعدد الغرف والطوابق والسلالم في فيلتك بالكويت والأسطح الداخلية التي تحتاج إلى عناية. نناقش نطاق العمل والأولويات قبل الزيارة.',
    },
    includes: {
      en: [
        'Multiple rooms and living areas',
        'Staircases and interior surfaces',
        'A cleaning plan tailored to your villa',
      ],
      ar: [
        'الغرف ومساحات المعيشة',
        'السلالم والأسطح الداخلية',
        'خطة تنظيف تناسب فيلتك',
      ],
    },
  },
  {
    id: 'sofa',
    anchor: 'sofa-carpet-cleaning',
    icon: 'sofa',
    image: 'cleaning-detail.png',
    imageAlt: {
      en: 'Illustrative image of a male cleaner using upholstery equipment on a cream sofa',
      ar: 'صورة توضيحية لعامل يستخدم جهاز تنظيف المفروشات على كنبة كريمية',
    },
    title: { en: 'Sofa & Carpet Cleaning', ar: 'تنظيف الكنب والسجاد' },
    description: {
      en: 'Sofa and carpet cleaning in Kuwait, with care discussed for your fabric and rugs.',
      ar: 'تنظيف الكنب والسجاد في الكويت، مع مناقشة العناية المناسبة للأقمشة والمفروشات.',
    },
    detail: {
      en: 'Ask about sofa and carpet cleaning in Kuwait for upholstered seating, carpets and rugs. Share the fabric type, approximate size, condition and any stains or areas of concern. The cleaning approach and expected drying time should be agreed before the visit.',
      ar: 'استفسر عن تنظيف الكنب والسجاد في الكويت للمقاعد المنجدة والسجاد والموكيت. شاركنا نوع القماش والحجم التقريبي والحالة وأي بقع أو مناطق تحتاج إلى اهتمام. يتم الاتفاق على طريقة التنظيف ووقت الجفاف المتوقع قبل الزيارة.',
    },
    includes: {
      en: [
        'Sofas and upholstered seating',
        'Carpets and rugs',
        'Fabric assessment and care guidance',
      ],
      ar: [
        'الكنب والمقاعد المنجدة',
        'السجاد والموكيت',
        'تقييم الأقمشة وإرشادات العناية',
      ],
    },
  },
  {
    id: 'deep',
    anchor: 'deep-cleaning',
    icon: 'sparkles',
    image: 'cleaning-team.png',
    imageAlt: {
      en: 'Illustrative image of male cleaners wiping a countertop and cleaning windows in a bright home',
      ar: 'صورة توضيحية لعاملين يمسحان سطحاً وينظفان النوافذ في منزل مشرق',
    },
    title: { en: 'Deep Cleaning', ar: 'التنظيف العميق' },
    description: {
      en: 'Deep cleaning in Kuwait for corners, edges and areas needing extra attention.',
      ar: 'تنظيف عميق في الكويت للزوايا والحواف والأماكن التي تحتاج إلى عناية إضافية.',
    },
    detail: {
      en: 'Deep cleaning gives extra attention to high-use areas, accessible surfaces, edges and corners beyond your everyday routine. Tell us what needs a more detailed clean in your Kuwait home or workplace. The exact scope is agreed around your priorities before booking.',
      ar: 'يمنح التنظيف العميق عناية إضافية للمناطق كثيرة الاستخدام والأسطح المتاحة والحواف والزوايا التي تتجاوز الروتين اليومي. أخبرنا بما يحتاج إلى تنظيف أدق في منزلك أو مكان عملك بالكويت. نتفق على نطاق العمل وفق أولوياتك قبل الحجز.',
    },
    includes: {
      en: [
        'Detailed attention to high-use areas',
        'Edges, corners and accessible surfaces',
        'A scope agreed around your priorities',
      ],
      ar: [
        'عناية دقيقة بالمناطق كثيرة الاستخدام',
        'الحواف والزوايا والأسطح المتاحة',
        'نطاق عمل محدد وفق أولوياتك',
      ],
    },
  },
] as const

export const copy = {
  en: {
    announcement:
      'Thoughtful cleaning. Exceptional care. Right here in Kuwait.',
    location: 'Proudly serving Kuwait',
    nav: ['Home', 'About us', 'Our services', 'Why choose us', 'Contact'],
    requestQuote: 'Request a Quote',
    menu: 'Open navigation',
    close: 'Close',
    skip: 'Skip to content',
    eyebrow: 'A HIGHER STANDARD OF CLEAN',
    heroLine1: 'Cleaning services',
    heroLine2: 'in',
    heroEm: 'Kuwait.',
    heroDescription:
      'Home, office, villa, sofa and carpet cleaning, plus deep cleaning in Kuwait. Tell Star Cleaning about your space and the care it needs.',
    staffNote:
      'Cleaning services across Kuwait, provided by male cleaning staff only.',
    explore: 'Explore our services',
    heroTrust: 'Experienced hands. A personal touch.',
    years: 'Years of experience',
    clients: 'Clients served',
    specialists: 'Specialists',
    completedJobs: 'Completed cleaning jobs',
    imageLabel: 'CARE YOU CAN COUNT ON',
    imageText: 'The details make the difference.',
    imageAlt:
      'Illustrative image of male cleaners in green uniforms cleaning a bright villa interior',
    benefitStrip: [
      'Professional care',
      'Attention to detail',
      'Made for your space',
      'A personal approach',
    ],
    servicesEyebrow: 'CLEANING SERVICES IN KUWAIT',
    servicesTitle: 'Professional cleaning in Kuwait.',
    servicesEm: 'For your space.',
    servicesDescription:
      'Explore five cleaning services for homes and workplaces in Kuwait. Find the right starting point, then discuss your space, scope and preferred date.',
    serviceGuideIntro:
      'A closer look at each service: explore the suggested scope before preparing your enquiry.',
    servicePageLink: 'Read the full service guide',
    serviceDirectory: 'Cleaning service guides',
    loadingBooking: 'Loading the enquiry form…',
    homeCleaningNote:
      'Our home cleaning service covers house and apartment cleaning in Kuwait. Share the rooms, size and priorities of your home so we can discuss a suitable scope.',
    enquireAbout: 'Ask about',
    serviceExplore: 'Explore service',
    allServices: 'View all services',
    lessServices: 'Show fewer services',
    serviceLabel: 'DISCOVER THE RIGHT CLEAN',
    includes: 'A clean can include',
    discuss: 'Discuss this service',
    scopeNote: 'Scope, availability and pricing are confirmed before booking.',
    aboutEyebrow: 'MEET STAR CLEANING',
    aboutTitle: 'Star Cleaning Kuwait.',
    aboutEm: 'A professional cleaning company in Kuwait.',
    aboutText:
      'Your home is your haven. Your workplace is your reputation. At STAR CLEANING Kuwait, we understand the care both deserve.',
    aboutText2:
      'With over 10 years of experience and more than 20 clients served, we bring a considered approach to every space — and pride to the small details that make it feel truly clean.',
    aboutPoints: [
      'Over a decade of hands-on experience',
      'Cleaning shaped around your needs',
      'Respect for your space and your time',
    ],
    aboutLink: 'Let’s talk about your space',
    experienceLabel: 'A decade of care.',
    experienceSub: 'A standard we keep.',
    aboutImageAlt:
      'Illustrative image of a gloved cleaner guiding an upholstery nozzle over a sofa cushion',
    videoEyebrow: 'THE CARE BEHIND THE CLEAN',
    videoTitle: 'Small details.',
    videoEm: 'Beautiful results.',
    videoDescription: 'Take a closer look at professional carpet care.',
    watch: 'Watch the cleaning film',
    videoLabel: 'CLEANING IN FOCUS',
    videoNote: 'Illustrative stock footage · Carpet care',
    videoFallback: 'Your browser cannot play this video.',
    downloadFilm: 'Open the cleaning film',
    whyEyebrow: 'THE STAR DIFFERENCE',
    whyTitle: 'Why choose',
    whyEm: 'Star Cleaning?',
    whyDescription:
      'It’s the way we approach your space that makes all the difference.',
    whyItems: [
      {
        title: 'Experience that shows',
        text: 'Over 10 years of practical experience, brought to the spaces you care about.',
      },
      {
        title: 'Care in every corner',
        text: 'Thoughtful attention to the little things that make a space feel fresh.',
      },
      {
        title: 'Built around your day',
        text: 'A cleaning plan discussed around your needs, your priorities and your routine.',
      },
      {
        title: 'A personal approach',
        text: 'A clear conversation about your space, from your first enquiry to your clean.',
      },
    ],
    processEyebrow: 'A FRESH START, MADE SIMPLE',
    processTitle: 'Your next clean,',
    processEm: 'in three easy steps.',
    steps: [
      {
        title: 'Tell us about your space',
        text: 'Choose a service and share what you have in mind.',
      },
      {
        title: 'Find the right plan',
        text: 'Discuss your priorities, scope and a suitable time.',
      },
      {
        title: 'Enjoy the difference',
        text: 'Let us take care of the clean while you take back your day.',
      },
    ],
    reviewsEyebrow: 'CUSTOMER TESTIMONIALS',
    reviewsTitle: 'Real experiences.',
    reviewsEm: 'Honest words.',
    reviewsDescription: 'The trust of our clients means everything to us.',
    reviewsComing: 'Our clients’ stories belong here.',
    reviewsText:
      'Verified customer testimonials are coming soon. We look forward to sharing their experiences with you.',
    reviewsBadge: 'AWAITING VERIFIED REVIEWS',
    googleReview: 'Write a Google Review',
    googleBusinessProfile: 'Our Google Business Profile',
    googleBusinessLinks: 'Find us and share your experience on Google',
    opensNewTab: 'opens in a new tab',
    faqEyebrow: 'A LITTLE CLARITY',
    faqTitle: 'Cleaning in Kuwait:',
    faqEm: 'your questions.',
    faqs: [
      {
        question: 'How do I choose the best cleaning company in Kuwait?',
        answer:
          'Compare the cleaning scope, relevant experience, staff arrangements and a clear quotation before deciding. Star Cleaning has over 10 years of experience, has served more than 20 clients and provides male cleaning staff only. Choose a company that explains what is included and confirms availability and pricing before booking.',
      },
      {
        question: 'Do you provide house and apartment cleaning in Kuwait?',
        answer:
          'Yes. House cleaning and apartment cleaning are part of our home cleaning service in Kuwait. Tell us the number of rooms, the approximate size and the surfaces that need attention so we can discuss the scope. All cleaning staff are male.',
      },
      {
        question: 'Do you provide female cleaning staff in Kuwait?',
        answer:
          'No. Star Cleaning provides male cleaning staff only. If you require female cleaning staff, our service does not meet that requirement. Please confirm the staff arrangements and cleaning scope before booking.',
      },
      {
        question: 'Do you offer cleaning services across Kuwait?',
        answer:
          'Star Cleaning serves customers in Kuwait. Share your location, property type and preferred service when making an enquiry so availability and the scope of your visit can be discussed.',
      },
      {
        question: 'Which cleaning services do you offer?',
        answer:
          'We offer home cleaning, office cleaning, villa cleaning, sofa and carpet cleaning, and deep cleaning in Kuwait. Explore a service to see a suggested scope, then discuss the details with us.',
      },
      {
        question: 'How can I get a quote?',
        answer:
          'Choose your service and share a little about your space, its size and your preferred date. You can send your enquiry directly through WhatsApp. Every quote is confirmed before booking.',
      },
      {
        question: 'Can I arrange a one-time or regular clean?',
        answer:
          'Tell us whether you need a one-time refresh or ongoing care. We can discuss a plan and availability around your needs; no booking is confirmed until the details are agreed.',
      },
      {
        question: 'What should I share before sofa or carpet cleaning?',
        answer:
          'Share the material, approximate size and any areas of concern. Photos can help us understand the condition. The cleaning method, expected drying time and scope should be agreed before the visit.',
      },
      {
        question: 'Can I include floor cleaning in my Kuwait home enquiry?',
        answer:
          'Yes. Floor care can be discussed as part of home, office or villa cleaning. Tell us the floor material, approximate area and any care instructions, then agree which rooms and accessible areas to include. If edges or corners need extra attention, mention this when discussing deep cleaning.',
      },
    ],
    contactEyebrow: 'LET’S MAKE YOUR SPACE SHINE',
    contactTitle: 'Ask about cleaning',
    contactEm: 'in Kuwait.',
    contactText:
      'A home to refresh? A workspace to care for? Tell us what you need. We’re here to help you find the right clean.',
    contactLocation: 'Location',
    country: 'Kuwait',
    phoneLabel: 'Phone & WhatsApp',
    callNow: 'Call Now',
    whatsapp: 'WhatsApp',
    emailLabel: 'Email',
    phonePlaceholder: '[Business number to be added]',
    emailPlaceholder: '[Business email to be added]',
    bookingTitle: 'Let’s plan your clean.',
    bookingText: 'Choose a service and prepare your WhatsApp enquiry.',
    selectLabel: 'Your cleaning service',
    messageLabel: 'Your message',
    dateLabel: 'Preferred date (optional)',
    draftIntro: 'Hello STAR CLEANING Kuwait! I’m interested in',
    draftEnd: 'Please share availability and a quote. Thank you.',
    datePhrase: 'Preferred date:',
    copyMessage: 'Copy enquiry',
    copied: 'Enquiry copied',
    copyFailed: 'Please select and copy your message below.',
    unavailable:
      'WhatsApp booking opens when our business number is available. You can copy your enquiry below in the meantime.',
    sendWhatsApp: 'Continue to WhatsApp',
    bookingNote: 'Preparing an enquiry does not confirm a booking.',
    footerTagline:
      'A higher standard of clean.\nA little more care in every detail.',
    footerServices: 'OUR SERVICES',
    footerExplore: 'EXPLORE',
    footerLocation: 'BASED IN KUWAIT',
    footerLocal: 'Thoughtful care for homes,\nvillas and workplaces.',
    copyright: 'STAR CLEANING Kuwait. All rights reserved.',
    mediaNote: 'Images and film are illustrative.',
    languageLabel: 'Switch to Arabic',
    backTop: 'Back to top',
  },
  ar: {
    announcement: 'تنظيف بإتقان. عناية استثنائية. هنا في الكويت.',
    location: 'نخدمكم بكل فخر في الكويت',
    nav: ['الرئيسية', 'من نحن', 'خدماتنا', 'لماذا نحن', 'تواصل معنا'],
    requestQuote: 'اطلب عرض سعر',
    menu: 'فتح القائمة',
    close: 'إغلاق',
    skip: 'انتقل إلى المحتوى',
    eyebrow: 'مستوى أرقى من النظافة',
    heroLine1: 'خدمات تنظيف',
    heroLine2: 'في',
    heroEm: 'الكويت.',
    heroDescription:
      'تنظيف المنازل والمكاتب والفلل والكنب والسجاد، بالإضافة إلى التنظيف العميق في الكويت. أخبر ستار كلينينج عن مساحتك والعناية التي تحتاج إليها.',
    staffNote: 'خدمات تنظيف في أنحاء الكويت يقدمها طاقم تنظيف من الرجال فقط.',
    explore: 'اكتشف خدماتنا',
    heroTrust: 'أيدٍ خبيرة. ولمسة شخصية.',
    years: 'سنوات من الخبرة',
    clients: 'عميلاً خدمناهم',
    specialists: 'مختصون',
    completedJobs: 'عمليات تنظيف مكتملة',
    imageLabel: 'عناية يمكنك الاعتماد عليها',
    imageText: 'التفاصيل تصنع الفرق.',
    imageAlt: 'صورة توضيحية لعاملين بزي أخضر ينظفان فيلا عصرية مشرقة',
    benefitStrip: [
      'عناية احترافية',
      'اهتمام بالتفاصيل',
      'خدمة تناسب مساحتك',
      'لمسة شخصية',
    ],
    servicesEyebrow: 'خدمات التنظيف في الكويت',
    servicesTitle: 'خدمات تنظيف احترافية في الكويت.',
    servicesEm: 'تناسب مساحتك.',
    servicesDescription:
      'اكتشف خمس خدمات تنظيف للمنازل وأماكن العمل في الكويت. اختر الخدمة المناسبة ثم ناقش مساحتك ونطاق العمل والموعد المفضل.',
    serviceGuideIntro:
      'تعرّف على تفاصيل كل خدمة ونطاق العمل المقترح قبل تجهيز استفسارك.',
    servicePageLink: 'اقرأ دليل الخدمة الكامل',
    serviceDirectory: 'أدلة خدمات التنظيف',
    loadingBooking: 'جارٍ تحميل نموذج الاستفسار…',
    homeCleaningNote:
      'نقدم خدمات تنظيف المنازل في الكويت للبيوت والشقق. شاركنا عدد الغرف ومساحة منزلك وأولوياتك لمناقشة نطاق العمل المناسب.',
    enquireAbout: 'استفسر عن',
    serviceExplore: 'اكتشف الخدمة',
    allServices: 'عرض جميع الخدمات',
    lessServices: 'عرض خدمات أقل',
    serviceLabel: 'اكتشف التنظيف المناسب',
    includes: 'يمكن أن تشمل الخدمة',
    discuss: 'استفسر عن هذه الخدمة',
    scopeNote: 'يتم تأكيد نطاق الخدمة والتوافر والسعر قبل الحجز.',
    aboutEyebrow: 'تعرّف على ستار كلينينج',
    aboutTitle: 'ستار كلينينج الكويت.',
    aboutEm: 'شركة تنظيف في الكويت تعتني بالتفاصيل.',
    aboutText:
      'منزلك ملاذك، ومكان عملك عنوانك. في ستار كلينينج الكويت، نعرف مقدار العناية التي يستحقها كلاهما.',
    aboutText2:
      'بخبرة تزيد عن 10 سنوات وخدمة أكثر من 20 عميلاً، نقدم عناية مدروسة لكل مساحة، ونهتم بالتفاصيل الصغيرة التي تجعل النظافة ملموسة.',
    aboutPoints: [
      'أكثر من عقد من الخبرة العملية',
      'تنظيف مصمم وفق احتياجاتك',
      'احترام لمساحتك ووقتك',
    ],
    aboutLink: 'لنتحدث عن مساحتك',
    experienceLabel: 'عقد من العناية.',
    experienceSub: 'ومستوى نحافظ عليه.',
    aboutImageAlt:
      'صورة توضيحية لعامل يرتدي قفازات ويمرّر فوهة جهاز تنظيف المفروشات على وسادة مقعد الكنبة',
    videoEyebrow: 'العناية خلف كل تفصيلة',
    videoTitle: 'تفاصيل صغيرة.',
    videoEm: 'نتائج جميلة.',
    videoDescription: 'شاهد عن قرب العناية الاحترافية بالسجاد.',
    watch: 'شاهد فيديو التنظيف',
    videoLabel: 'التنظيف عن قرب',
    videoNote: 'لقطات توضيحية · العناية بالسجاد',
    videoFallback: 'متصفحك لا يدعم تشغيل هذا الفيديو.',
    downloadFilm: 'افتح فيديو التنظيف',
    whyEyebrow: 'الفرق مع ستار',
    whyTitle: 'لماذا تختار',
    whyEm: 'ستار كلينينج؟',
    whyDescription: 'طريقتنا في العناية بمساحتك هي ما يصنع الفرق.',
    whyItems: [
      {
        title: 'خبرة تظهر في النتائج',
        text: 'أكثر من 10 سنوات من الخبرة العملية في خدمة المساحات التي تهمك.',
      },
      {
        title: 'عناية بكل زاوية',
        text: 'اهتمام بالتفاصيل الصغيرة التي تمنح مساحتك إحساساً متجدداً.',
      },
      {
        title: 'خدمة تناسب يومك',
        text: 'خطة تنظيف نتفق عليها وفق احتياجاتك وأولوياتك وروتينك.',
      },
      {
        title: 'نهج شخصي',
        text: 'تواصل واضح حول مساحتك، من أول استفسار وحتى إتمام التنظيف.',
      },
    ],
    processEyebrow: 'بداية جديدة بكل بساطة',
    processTitle: 'تنظيفك القادم،',
    processEm: 'في ثلاث خطوات.',
    steps: [
      { title: 'أخبرنا عن مساحتك', text: 'اختر الخدمة وشاركنا ما تحتاج إليه.' },
      {
        title: 'اختر الخطة المناسبة',
        text: 'ناقش أولوياتك ونطاق العمل والموعد المناسب.',
      },
      {
        title: 'استمتع بالفرق',
        text: 'دعنا نعتني بالنظافة، واستعد وقتك لما يهمك.',
      },
    ],
    reviewsEyebrow: 'آراء العملاء',
    reviewsTitle: 'تجارب حقيقية.',
    reviewsEm: 'وكلمات صادقة.',
    reviewsDescription: 'ثقة عملائنا تعني لنا الكثير.',
    reviewsComing: 'هنا مكان حكايات عملائنا.',
    reviewsText:
      'آراء العملاء الموثّقة تُضاف قريباً. نتطلع إلى مشاركة تجاربهم معكم.',
    reviewsBadge: 'بانتظار آراء العملاء الموثّقة',
    googleReview: 'اكتب تقييماً على Google',
    googleBusinessProfile: 'ملفنا التجاري على Google',
    googleBusinessLinks: 'تعرّف علينا وشارك تجربتك على Google',
    opensNewTab: 'يفتح في علامة تبويب جديدة',
    faqEyebrow: 'إجابات واضحة',
    faqTitle: 'التنظيف في الكويت:',
    faqEm: 'أسئلتك وإجاباتها.',
    faqs: [
      {
        question: 'كيف أختار أفضل شركة تنظيف بالكويت؟',
        answer:
          'قارن نطاق التنظيف والخبرة المناسبة وترتيبات طاقم العمل ووضوح عرض السعر قبل الاختيار. تتمتع ستار كلينينج بخبرة تزيد عن 10 سنوات وخدمت أكثر من 20 عميلاً، وتوفر طاقم تنظيف من الرجال فقط. اختر شركة توضح ما تشمله الخدمة وتؤكد التوافر والسعر قبل الحجز.',
      },
      {
        question: 'هل تقدمون تنظيف المنازل والشقق في الكويت؟',
        answer:
          'نعم، يندرج تنظيف البيوت والشقق ضمن خدمة تنظيف المنازل في الكويت. أخبرنا بعدد الغرف والمساحة التقريبية والأسطح التي تحتاج إلى عناية لمناقشة نطاق العمل. جميع أفراد طاقم التنظيف من الرجال.',
      },
      {
        question: 'هل توفرون عاملات تنظيف في الكويت؟',
        answer:
          'لا، توفر ستار كلينينج طاقم تنظيف من الرجال فقط. إذا كنت تحتاج إلى عاملات تنظيف، فإن خدمتنا لا تلبي هذا الشرط. يرجى التأكد من ترتيبات طاقم العمل ونطاق التنظيف قبل الحجز.',
      },
      {
        question: 'هل تقدمون خدمات التنظيف في أنحاء الكويت؟',
        answer:
          'تخدم ستار كلينينج العملاء في الكويت. شاركنا موقعك ونوع العقار والخدمة المطلوبة عند الاستفسار لمناقشة التوافر ونطاق الزيارة.',
      },
      {
        question: 'ما خدمات التنظيف التي تقدمونها؟',
        answer:
          'نقدم تنظيف المنازل والمكاتب والفلل والكنب والسجاد، بالإضافة إلى التنظيف العميق في الكويت. اكتشف الخدمة للاطلاع على نطاق مقترح ثم ناقش التفاصيل معنا.',
      },
      {
        question: 'كيف أحصل على عرض سعر؟',
        answer:
          'اختر الخدمة وشاركنا بعض التفاصيل عن مساحتك وحجمها والموعد المفضل. يمكنك إرسال استفسارك مباشرة عبر واتساب. يتم تأكيد السعر قبل الحجز.',
      },
      {
        question: 'هل يمكن طلب تنظيف لمرة واحدة أو بشكل منتظم؟',
        answer:
          'أخبرنا إن كنت تحتاج إلى تنظيف لمرة واحدة أو عناية دورية. نناقش معك الخطة والتوافر وفق احتياجاتك، ولا يُؤكد أي حجز حتى الاتفاق على التفاصيل.',
      },
      {
        question: 'ما المعلومات المطلوبة قبل تنظيف الكنب أو السجاد؟',
        answer:
          'شاركنا نوع القماش والحجم التقريبي وأي مناطق تحتاج إلى اهتمام. تساعدنا الصور على فهم الحالة. يتم الاتفاق على طريقة التنظيف ووقت الجفاف المتوقع ونطاق العمل قبل الزيارة.',
      },
      {
        question:
          'هل يمكن تضمين تنظيف الأرضيات في استفسار تنظيف منزلي بالكويت؟',
        answer:
          'نعم، يمكن مناقشة العناية بالأرضيات ضمن تنظيف المنازل أو المكاتب أو الفلل. أخبرنا بنوع الأرضية والمساحة التقريبية وأي تعليمات للعناية، ثم اتفق معنا على الغرف والمساحات المتاحة المطلوب تضمينها. إذا كانت الحواف أو الزوايا تحتاج إلى عناية إضافية، فاذكر ذلك عند مناقشة التنظيف العميق.',
      },
    ],
    contactEyebrow: 'لنمنح مساحتك إشراقة جديدة',
    contactTitle: 'استفسر عن التنظيف',
    contactEm: 'في الكويت.',
    contactText:
      'منزل يحتاج إلى انتعاش؟ أم مكان عمل يستحق العناية؟ أخبرنا بما تحتاج إليه، وسنساعدك في اختيار الخدمة المناسبة.',
    contactLocation: 'الموقع',
    country: 'الكويت',
    phoneLabel: 'الهاتف وواتساب',
    callNow: 'اتصل الآن',
    whatsapp: 'واتساب',
    emailLabel: 'البريد الإلكتروني',
    phonePlaceholder: '[يُضاف رقم الشركة قريباً]',
    emailPlaceholder: '[يُضاف البريد الإلكتروني قريباً]',
    bookingTitle: 'لنخطط لتنظيف مساحتك.',
    bookingText: 'اختر الخدمة وجهّز استفسارك عبر واتساب.',
    selectLabel: 'خدمة التنظيف',
    messageLabel: 'رسالتك',
    dateLabel: 'الموعد المفضل (اختياري)',
    draftIntro: 'مرحباً ستار كلينينج الكويت! أرغب في خدمة',
    draftEnd: 'يرجى مشاركة المواعيد المتاحة وعرض السعر. شكراً لكم.',
    datePhrase: 'الموعد المفضل:',
    copyMessage: 'نسخ الاستفسار',
    copied: 'تم نسخ الاستفسار',
    copyFailed: 'يرجى تحديد الرسالة أدناه ونسخها.',
    unavailable:
      'يُتاح الحجز عبر واتساب عند إضافة رقم الشركة. يمكنك نسخ استفسارك أدناه في الوقت الحالي.',
    sendWhatsApp: 'المتابعة إلى واتساب',
    bookingNote: 'تجهيز الاستفسار لا يُعد تأكيداً للحجز.',
    footerTagline: 'مستوى أرقى من النظافة.\nوعناية أكثر بكل تفصيلة.',
    footerServices: 'خدماتنا',
    footerExplore: 'اكتشف المزيد',
    footerLocation: 'مقرنا في الكويت',
    footerLocal: 'عناية مدروسة للمنازل\nوالفلل وأماكن العمل.',
    copyright: 'ستار كلينينج الكويت. جميع الحقوق محفوظة.',
    mediaNote: 'الصور والفيديو لغايات توضيحية.',
    languageLabel: 'Switch to English',
    backTop: 'العودة إلى الأعلى',
  },
}
