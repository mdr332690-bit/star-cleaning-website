export const apartmentService = {
  id: 'apartment',
  anchor: 'apartment-cleaning',
  icon: 'building',
  image: 'home.jpg',
  imageAlt: {
    en: 'Illustrative living room with a tan sofa, round coffee table and tall windows',
    ar: 'صورة توضيحية لغرفة معيشة فيها كنبة بنية فاتحة وطاولة قهوة مستديرة ونوافذ طويلة',
  },
  title: { en: 'Apartment Cleaning', ar: 'تنظيف الشقق' },
  description: {
    en: 'Plan a room-by-room clean for your apartment, with the scope agreed before the visit.',
    ar: 'خطط لتنظيف شقتك غرفةً غرفة، واتفق معنا على نطاق العمل قبل الزيارة.',
  },
  page: {
    slug: 'apartment-cleaning',
    heading: {
      en: 'Apartment Cleaning in Kuwait',
      ar: 'تنظيف الشقق في الكويت',
    },
    title: {
      en: 'Apartment Cleaning in Kuwait | Star Cleaning',
      ar: 'تنظيف الشقق في الكويت | ستار كلينينج',
    },
    description: {
      en: 'Plan apartment cleaning in Kuwait with Star Cleaning. Discuss bedrooms, bathrooms, kitchen and living areas, then request a quote for your flat.',
      ar: 'خطط لتنظيف شقتك في الكويت مع ستار كلينينج. حدّد الغرف والحمامات والمطبخ والأماكن التي تحتاج إلى عناية، واطلب عرض سعر يناسب نطاق العمل.',
    },
    intro: {
      en: 'Give the rooms you use every day the attention they need. Tell us about your flat, from the bedroom and kitchen to the spots you want us to focus on, and we’ll discuss a cleaning plan around your priorities.',
      ar: 'امنح الغرف التي تستخدمها كل يوم العناية التي تحتاج إليها. أخبرنا عن شقتك والغرف التي تريد تنظيفها والأماكن التي تحتاج إلى اهتمام خاص، لنناقش معك خطة تنظيف تراعي أولوياتك.',
    },
  },
} as const

export const apartmentCopy = {
  en: {
    imageNote: 'Illustrative image.',
    scopeTitle: 'A room-by-room cleaning plan',
    scopeIntro:
      'Use this checklist to tell us what you’d like cleaned. We’ll agree the tasks and accessible areas with you before booking.',
    rooms: [
      [
        'Bedrooms',
        'Dust reachable surfaces and clean accessible floor areas around beds and furniture.',
      ],
      [
        'Bathrooms and toilets',
        'Discuss cleaning toilets, sinks, mirrors, shower or bath surfaces, and floors.',
      ],
      [
        'Kitchen',
        'Focus on the sink, worktops and other accessible surfaces used for everyday cooking.',
      ],
      [
        'Living and dining rooms',
        'Discuss dusting reachable surfaces, wiping tables and cleaning the exposed floors.',
      ],
      [
        'Floors, doors and windows',
        'Tell us which floors, doors and handles need attention and whether to include safely reachable interior window glass. Share any care instructions for delicate finishes.',
      ],
    ],
    processTitle: 'From quote to cleaning day',
    steps: [
      [
        'Tell us about your flat',
        'Share your area in Kuwait, room count, approximate size and any building access arrangements.',
      ],
      [
        'Agree the scope and quote',
        'Discuss the rooms and tasks, what can be reached safely, and your preferred time. Confirm the price and availability before booking.',
      ],
      [
        'Know what to expect on the day',
        'Arrange entry and clear personal items from the surfaces you want cleaned. The visit follows the scope agreed with you.',
      ],
    ],
    faqTitle: 'Questions about apartment cleaning',
    faqs: [
      [
        'Can I request cleaning for just a few rooms?',
        'Yes. List the rooms you want cleaned and tell us which tasks matter most. We’ll discuss what can be included in the quote.',
      ],
      [
        'Is window cleaning included?',
        'Please mention windows when you enquire. We can discuss safely reachable interior glass and confirm whether it’s part of your quote. Exterior or high-access windows aren’t included in this checklist.',
      ],
      [
        'What affects my quote?',
        'The quote depends on the size and condition of the flat, the areas you want cleaned and the tasks we agree on. Send those details so we can discuss pricing.',
      ],
    ],
    contactTitle: 'Request a quote for your apartment',
    contactIntro:
      'Tell us which rooms need cleaning and where your flat is. Use the enquiry form or message us directly on WhatsApp to discuss the scope, availability and price.',
    whatsappMessage:
      'Hello Star Cleaning Kuwait, I’d like a quote for apartment cleaning.',
  },
  ar: {
    imageNote: 'صورة لأغراض توضيحية.',
    scopeTitle: 'خطة تنظيف لكل غرفة في شقتك',
    scopeIntro:
      'استعن بهذه القائمة لتحديد الأماكن التي تريد تنظيفها. نتفق معك على المهام والمساحات التي يمكن الوصول إليها قبل الحجز.',
    rooms: [
      [
        'غرف النوم',
        'إزالة الغبار عن الأسطح التي يسهل الوصول إليها وتنظيف الأجزاء المكشوفة من الأرضية حول الأسرّة والأثاث.',
      ],
      [
        'الحمامات ودورات المياه',
        'ناقش معنا تنظيف المراحيض والمغاسل والمرايا وأسطح الدش أو حوض الاستحمام، بالإضافة إلى الأرضيات.',
      ],
      [
        'المطبخ',
        'التركيز على حوض المطبخ وأسطح التحضير وغيرها من الأسطح المتاحة التي تستخدمها في الطهي اليومي.',
      ],
      [
        'غرف المعيشة والطعام',
        'ناقش معنا إزالة الغبار عن الأسطح المتاحة ومسح الطاولات وتنظيف الأجزاء المكشوفة من الأرضيات.',
      ],
      [
        'الأرضيات والأبواب والنوافذ',
        'حدّد الأرضيات والأبواب والمقابض التي تحتاج إلى تنظيف، وأخبرنا إن كنت تريد تنظيف زجاج النوافذ من الداخل حيث يمكن الوصول إليه بأمان. اذكر أي تعليمات خاصة بالعناية بالأسطح الحساسة.',
      ],
    ],
    processTitle: 'من طلب عرض السعر إلى يوم التنظيف',
    steps: [
      [
        'أخبرنا عن شقتك',
        'اذكر منطقتك في الكويت وعدد الغرف والمساحة التقريبية وأي ترتيبات لازمة للدخول إلى المبنى.',
      ],
      [
        'اتفق معنا على نطاق العمل والسعر',
        'ناقش معنا الغرف والمهام والأماكن التي يمكن الوصول إليها بأمان والموعد الذي تفضّله. يُؤكَّد السعر وتوافر الموعد قبل الحجز.',
      ],
      [
        'استعدّ ليوم التنظيف',
        'رتّب الدخول إلى الشقة وأبعد الأغراض الشخصية عن الأسطح التي تريد تنظيفها. تُنفّذ الزيارة وفق نطاق العمل المتفق عليه.',
      ],
    ],
    faqTitle: 'أسئلة شائعة عن تنظيف الشقق',
    faqs: [
      [
        'هل يمكنني طلب تنظيف بعض الغرف فقط؟',
        'نعم. حدّد الغرف التي تريد تنظيفها والمهام التي تهمك أكثر، وسنناقش معك ما يمكن إدراجه في عرض السعر.',
      ],
      [
        'هل يشمل التنظيف النوافذ؟',
        'اذكر النوافذ عند الاستفسار. يمكننا مناقشة تنظيف الزجاج الداخلي الذي يسهل الوصول إليه بأمان وتأكيد إدراجه في عرض السعر. لا تشمل هذه القائمة الزجاج الخارجي أو النوافذ التي يتطلب الوصول إليها العمل على ارتفاع.',
      ],
      [
        'ما الذي يحدد سعر تنظيف شقتي؟',
        'يعتمد السعر على مساحة الشقة وحالتها والأماكن التي ترغب في تنظيفها والمهام المتفق عليها. أرسل لنا هذه التفاصيل لنناقش السعر معك.',
      ],
    ],
    contactTitle: 'اطلب عرض سعر لتنظيف شقتك',
    contactIntro:
      'أخبرنا بموقع الشقة والغرف التي تحتاج إلى تنظيف. أرسل استفسارك عبر النموذج أو راسلنا مباشرةً على واتساب لمناقشة نطاق العمل والموعد والسعر.',
    whatsappMessage:
      'مرحباً ستار كلينينج الكويت، أود الحصول على عرض سعر لتنظيف شقتي.',
  },
}
