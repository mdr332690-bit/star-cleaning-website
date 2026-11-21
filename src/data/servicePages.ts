import { services } from './content'
import type { Language } from './content'

export const servicePageCopy = {
  home: {
    slug: 'house-cleaning',
    heading: {
      en: 'House & Apartment Cleaning in Kuwait',
      ar: 'تنظيف المنازل والشقق في الكويت',
    },
    title: {
      en: 'House & Apartment Cleaning Kuwait | Star Cleaning',
      ar: 'تنظيف منازل وشقق الكويت | ستار كلينينج',
    },
    description: {
      en: 'House and apartment cleaning in Kuwait with male cleaning staff. Discuss rooms, kitchen and bathroom surfaces, floor care and your priorities with Star Cleaning.',
      ar: 'تنظيف منازل وشقق الكويت مع ستار كلينينج بطاقم من الرجال فقط. ناقش تنظيف الغرف وأسطح المطبخ والحمامات والأرضيات ونطاق العمل المناسب لمنزلك قبل الحجز.',
    },
    intro: {
      en: 'A house and an apartment can need different cleaning plans, even when they have the same number of rooms. Our home cleaning service in Kuwait starts with the spaces you use, their approximate size and the surfaces you want us to focus on. House cleaning and apartment cleaning are part of this service, with the details agreed for your home.',
      ar: 'قد يحتاج البيت والشقة إلى خطتين مختلفتين للتنظيف حتى مع تساوي عدد الغرف. تبدأ خدمة تنظيف المنازل في الكويت بتحديد المساحات التي تستخدمها ومساحتها التقريبية والأسطح التي ترغب في التركيز عليها. يندرج تنظيف البيوت والشقق ضمن هذه الخدمة، ونتفق على التفاصيل وفق احتياجات منزلك.',
    },
    planningTitle: {
      en: 'Planning your home cleaning visit',
      ar: 'التخطيط لزيارة تنظيف منزلك',
    },
    planning: {
      en: 'List your living areas, bedrooms, kitchen and bathrooms, then note any surfaces that need particular care. Tell us about access arrangements and the date you prefer. If specific corners or high-use areas need more detailed attention, compare deep cleaning before choosing the scope.',
      ar: 'حدد غرف المعيشة والنوم والمطبخ والحمامات، ثم اذكر أي أسطح تحتاج إلى عناية خاصة. أخبرنا بترتيبات الدخول والموعد المفضل. إذا كانت هناك زوايا أو مناطق كثيرة الاستخدام تحتاج إلى اهتمام أدق، فتعرّف على التنظيف العميق قبل اختيار نطاق العمل.',
    },
    question: {
      en: 'What information helps plan apartment cleaning?',
      ar: 'ما المعلومات التي تساعد في التخطيط لتنظيف الشقق؟',
    },
    answer: {
      en: 'Share the approximate floor area, number of rooms and bathrooms, floor types and your main priorities. Mention any access arrangements for the apartment. These details help define the work before availability and pricing are confirmed.',
      ar: 'شاركنا المساحة التقريبية وعدد الغرف والحمامات وأنواع الأرضيات وأهم أولوياتك. اذكر ترتيبات الدخول إلى الشقة. تساعد هذه التفاصيل في تحديد العمل قبل تأكيد التوافر والسعر.',
    },
  },
  office: {
    slug: 'office-cleaning',
    heading: { en: 'Office Cleaning in Kuwait', ar: 'تنظيف المكاتب في الكويت' },
    title: {
      en: 'Office Cleaning Kuwait | Star Cleaning',
      ar: 'تنظيف مكاتب الكويت | ستار كلينينج',
    },
    description: {
      en: 'Office cleaning in Kuwait for workstations, meeting rooms and shared spaces. Discuss your workplace routine and cleaning scope with Star Cleaning’s male staff.',
      ar: 'تنظيف مكاتب الكويت لمحطات العمل وغرف الاجتماعات والمساحات المشتركة. ناقش أوقات العمل ونطاق التنظيف مع ستار كلينينج، بطاقم تنظيف من الرجال فقط.',
    },
    intro: {
      en: 'Office cleaning in Kuwait needs a plan around the people who use the workplace. Identify the workstations, meeting rooms and shared spaces that need care, then discuss a visit that fits your working routine. Star Cleaning focuses the conversation on the areas you actually need cleaned.',
      ar: 'يحتاج تنظيف المكاتب في الكويت إلى خطة تراعي مستخدمي مكان العمل. حدد محطات العمل وغرف الاجتماعات والمساحات المشتركة التي تحتاج إلى عناية، ثم ناقش زيارة تناسب روتين العمل. تركز ستار كلينينج على المساحات التي تحتاج فعلاً إلى تنظيفها.',
    },
    planningTitle: {
      en: 'Planning around your workplace',
      ar: 'خطة تناسب مكان عملك',
    },
    planning: {
      en: 'Share your office size, working hours and access requirements. Separate the reception, meeting spaces, pantry and washrooms in your list of priorities. Explain which desks or surfaces can be cleaned and flag anything that should be left untouched so the scope is clear before the visit.',
      ar: 'شاركنا مساحة المكتب وأوقات العمل ومتطلبات الدخول. حدد أولويات الاستقبال وغرف الاجتماعات والمطبخ الصغير والحمامات. وضّح المكاتب والأسطح المتاحة للتنظيف وأي أغراض ينبغي عدم لمسها حتى يكون نطاق العمل واضحاً قبل الزيارة.',
    },
    question: {
      en: 'Can I discuss cleaning around office working hours?',
      ar: 'هل يمكن مناقشة التنظيف بما يناسب أوقات عمل المكتب؟',
    },
    answer: {
      en: 'Yes. Include your working hours and preferred visit time in the enquiry. The cleaning plan and available appointment need to be discussed and agreed before booking; a preferred time is not a confirmed appointment.',
      ar: 'نعم، اذكر أوقات العمل والموعد المفضل في استفسارك. يجب مناقشة خطة التنظيف والموعد المتاح والاتفاق عليهما قبل الحجز؛ اختيار موعد مفضل لا يعني تأكيده.',
    },
  },
  villa: {
    slug: 'villa-cleaning',
    heading: { en: 'Villa Cleaning in Kuwait', ar: 'تنظيف الفلل في الكويت' },
    title: {
      en: 'Villa Cleaning Kuwait | Star Cleaning',
      ar: 'تنظيف فلل الكويت | ستار كلينينج',
    },
    description: {
      en: 'Villa cleaning in Kuwait with male cleaning staff. Plan care for rooms, stairs and interior surfaces, with the scope agreed for your villa before booking.',
      ar: 'تنظيف فلل الكويت بطاقم من الرجال فقط. خطط لتنظيف الغرف والسلالم والأسطح الداخلية مع ستار كلينينج، وناقش مساحة الفيلا والأولويات ونطاق العمل قبل الحجز.',
    },
    intro: {
      en: 'A larger home benefits from a room-by-room plan. For villa cleaning in Kuwait, Star Cleaning discusses the layout, floors and interior areas that matter most to you. A clear list helps distinguish everyday room care from areas that need a more detailed clean.',
      ar: 'يستفيد المنزل الواسع من خطة تحدد احتياجات كل غرفة. عند مناقشة تنظيف الفلل في الكويت، تتعرف ستار كلينينج على توزيع الغرف والطوابق والمساحات الداخلية الأهم لك. تساعد القائمة الواضحة على التمييز بين العناية المعتادة بالغرف والأماكن التي تحتاج إلى تنظيف أدق.',
    },
    planningTitle: {
      en: 'A cleaning plan for a larger home',
      ar: 'خطة تنظيف تناسب المنازل الواسعة',
    },
    planning: {
      en: 'Tell us the number of floors, rooms and staircases, together with the approximate size of the villa. Identify interior surfaces that need attention and any access considerations. Discuss the priorities for each floor so the agreed work reflects the layout of your home.',
      ar: 'أخبرنا بعدد الطوابق والغرف والسلالم، إلى جانب مساحة الفيلا التقريبية. حدد الأسطح الداخلية التي تحتاج إلى عناية وأي ترتيبات للدخول. ناقش أولويات كل طابق حتى يناسب العمل المتفق عليه توزيع منزلك.',
    },
    question: {
      en: 'What should I include in a villa cleaning enquiry?',
      ar: 'ماذا أذكر في استفسار تنظيف الفيلا؟',
    },
    answer: {
      en: 'Include the villa’s approximate size, number of floors and rooms, staircase details and your cleaning priorities. Describe the interior areas you want included. The service scope, availability and quotation are discussed before booking.',
      ar: 'اذكر مساحة الفيلا التقريبية وعدد الطوابق والغرف وتفاصيل السلالم وأولويات التنظيف. صف المساحات الداخلية التي ترغب في تضمينها. تتم مناقشة نطاق الخدمة والتوافر وعرض السعر قبل الحجز.',
    },
  },
  sofa: {
    slug: 'sofa-carpet-cleaning',
    heading: {
      en: 'Sofa & Carpet Cleaning in Kuwait',
      ar: 'تنظيف الكنب والسجاد في الكويت',
    },
    title: {
      en: 'Sofa & Carpet Cleaning Kuwait | Star Cleaning',
      ar: 'تنظيف كنب وسجاد الكويت | ستار كلينينج',
    },
    description: {
      en: 'Sofa and carpet cleaning in Kuwait with male cleaning staff. Discuss fabric, size, condition and expected drying time with Star Cleaning before your visit.',
      ar: 'تنظيف كنب وسجاد الكويت مع ستار كلينينج بطاقم من الرجال فقط. شاركنا نوع القماش والحجم والحالة لمناقشة طريقة العناية ووقت الجفاف المتوقع قبل الزيارة.',
    },
    intro: {
      en: 'Sofa cleaning in Kuwait starts with understanding the fabric and its condition. The same care matters for carpets and rugs. Tell Star Cleaning about the seating or flooring you want cleaned so the approach can be discussed for the material, rather than assuming every fabric needs the same treatment.',
      ar: 'يبدأ تنظيف الكنب في الكويت بفهم نوع القماش وحالته، وتنطبق العناية نفسها على السجاد والموكيت. أخبر ستار كلينينج بالمقاعد أو المفروشات التي ترغب في تنظيفها لمناقشة طريقة تناسب الخامة، فالأقمشة لا تحتاج جميعها إلى المعاملة نفسها.',
    },
    planningTitle: {
      en: 'Fabric details to share before the visit',
      ar: 'تفاصيل الأقمشة المطلوبة قبل الزيارة',
    },
    planning: {
      en: 'Share the number and approximate size of the sofas, carpets or rugs, any fabric care information and the areas of concern. Photos can help explain the condition. Ask about the proposed cleaning approach and expected drying time, and agree the scope before the visit.',
      ar: 'شاركنا عدد الكنب أو قطع السجاد وحجمها التقريبي وأي معلومات عن العناية بالقماش والمناطق التي تحتاج إلى اهتمام. قد تساعد الصور في توضيح الحالة. استفسر عن طريقة التنظيف المقترحة ووقت الجفاف المتوقع، واتفق على نطاق العمل قبل الزيارة.',
    },
    question: {
      en: 'Can every sofa stain be removed?',
      ar: 'هل يمكن إزالة كل بقع الكنب؟',
    },
    answer: {
      en: 'Results depend on the fabric, its condition and the type and age of the stain. Share these details when enquiring so expectations and the cleaning approach can be discussed. No specific stain-removal result or drying time is guaranteed on this website.',
      ar: 'تعتمد النتيجة على نوع القماش وحالته ونوع البقعة وعمرها. شاركنا هذه التفاصيل عند الاستفسار لمناقشة التوقعات وطريقة التنظيف. لا يضمن هذا الموقع نتيجة محددة لإزالة البقع أو وقتاً ثابتاً للجفاف.',
    },
  },
  deep: {
    slug: 'deep-cleaning',
    heading: { en: 'Deep Cleaning in Kuwait', ar: 'تنظيف عميق في الكويت' },
    title: {
      en: 'Deep Cleaning Kuwait | Star Cleaning',
      ar: 'تنظيف عميق الكويت | ستار كلينينج',
    },
    description: {
      en: 'Deep cleaning in Kuwait for high-use areas, edges, corners and accessible surfaces. Discuss a detailed cleaning scope with Star Cleaning’s male cleaning staff.',
      ar: 'تنظيف عميق الكويت للمناطق كثيرة الاستخدام والحواف والزوايا والأسطح المتاحة. ناقش أولويات منزلك أو مكتبك مع ستار كلينينج بطاقم تنظيف من الرجال فقط.',
    },
    intro: {
      en: 'Deep cleaning in Kuwait is a way to focus on the details that your everyday routine may miss. Star Cleaning discusses the accessible surfaces, edges, corners and high-use areas that need extra attention in your home or workplace. The plan follows your priorities and an agreed scope.',
      ar: 'يساعد التنظيف العميق في الكويت على التركيز على التفاصيل التي قد لا يشملها الروتين اليومي. تناقش ستار كلينينج الأسطح المتاحة والحواف والزوايا والمناطق كثيرة الاستخدام التي تحتاج إلى عناية إضافية في منزلك أو مكان عملك. تتبع الخطة أولوياتك ونطاق العمل المتفق عليه.',
    },
    planningTitle: {
      en: 'Deciding where extra attention is needed',
      ar: 'تحديد الأماكن التي تحتاج إلى عناية إضافية',
    },
    planning: {
      en: 'Start with a list of the rooms and surfaces that need more than routine care. Explain the condition, approximate size and any access limits. Compare this detailed scope with home or office cleaning so the service you discuss matches the work you need.',
      ar: 'ابدأ بقائمة الغرف والأسطح التي تحتاج إلى عناية تتجاوز التنظيف المعتاد. وضّح الحالة والمساحة التقريبية وأي قيود على الوصول. قارن هذا النطاق التفصيلي بتنظيف المنازل أو المكاتب حتى تناقش الخدمة التي تناسب العمل المطلوب.',
    },
    question: {
      en: 'How is deep cleaning different from home cleaning?',
      ar: 'ما الفرق بين التنظيف العميق وتنظيف المنازل؟',
    },
    answer: {
      en: 'Home cleaning focuses on the living areas and surfaces you use every day. Deep cleaning gives additional attention to agreed details such as accessible edges, corners and high-use areas. The exact tasks depend on your space and are discussed before booking.',
      ar: 'يركز تنظيف المنازل على مساحات المعيشة والأسطح التي تستخدمها يومياً. يمنح التنظيف العميق اهتماماً إضافياً بتفاصيل متفق عليها مثل الحواف والزوايا المتاحة والمناطق كثيرة الاستخدام. تعتمد المهام المحددة على مساحتك وتتم مناقشتها قبل الحجز.',
    },
  },
}

export const servicePages = services.map((service) => ({
  ...service,
  page: servicePageCopy[service.id],
}))

export type ServicePageData = (typeof servicePages)[number]

export const homePath = (lang: Language) => (lang === 'ar' ? '/ar' : '/')

export const servicePath = (lang: Language, slug: string) =>
  `${lang === 'ar' ? '/ar' : ''}/services/${slug}`

export const findServicePage = (slug: string) =>
  servicePages.find((service) => service.page.slug === slug)

export const serviceLabels = {
  en: {
    breadcrumb: 'Breadcrumb navigation',
    overview: 'About this cleaning service',
    scope: 'Suggested cleaning scope',
    prepare: 'Prepare your service enquiry',
    prepareText:
      'Choose your preferred date and edit your message before continuing to WhatsApp. Your enquiry does not confirm a booking.',
    related: 'Explore our other cleaning services',
    home: 'All cleaning services in Kuwait',
    faq: 'Service questions',
    maleQuestion: 'Who provides the cleaning service?',
    maleAnswer:
      'Star Cleaning provides male cleaning staff only, serving Kuwait as a whole. Share your property and service requirements so the scope and availability can be discussed before booking.',
    enquiry: 'Prepare an enquiry',
  },
  ar: {
    breadcrumb: 'مسار التصفح',
    overview: 'عن خدمة التنظيف',
    scope: 'نطاق التنظيف المقترح',
    prepare: 'جهّز استفسارك عن الخدمة',
    prepareText:
      'اختر الموعد المفضل وعدّل رسالتك قبل المتابعة إلى واتساب. إرسال الاستفسار لا يؤكد الحجز.',
    related: 'اكتشف خدمات التنظيف الأخرى',
    home: 'جميع خدمات التنظيف في الكويت',
    faq: 'أسئلة عن الخدمة',
    maleQuestion: 'من يقدم خدمة التنظيف؟',
    maleAnswer:
      'توفر ستار كلينينج طاقم تنظيف من الرجال فقط لخدمة الكويت ككل. شاركنا تفاصيل العقار والخدمة المطلوبة لمناقشة نطاق العمل والتوافر قبل الحجز.',
    enquiry: 'جهّز استفسارك',
  },
}
