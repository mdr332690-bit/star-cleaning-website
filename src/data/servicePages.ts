import { services } from './content'
import type { Language } from './content'
import { apartmentService } from './apartmentCleaning'

export const servicePageCopy = {
  home: {
    slug: 'house-cleaning',
    heading: {
      en: 'House & Apartment Cleaning in Kuwait',
      ar: 'تنظيف المنازل والشقق في الكويت',
    },
    title: {
      en: 'House & Apartment Cleaning Kuwait | Star Cleaning',
      ar: 'تنظيف المنازل والشقق في الكويت | ستار كلينينج',
    },
    description: {
      en: 'House and apartment cleaning in Kuwait with male cleaning staff. Discuss rooms, kitchen and bathroom surfaces, floor care and your priorities with Star Cleaning.',
      ar: 'خدمات تنظيف المنازل في الكويت مع ستار كلينينج للشقق والبيوت بطاقم من الرجال فقط. ناقش تنظيف الغرف والمطبخ والحمامات والأرضيات ونطاق العمل قبل الحجز.',
    },
    intro: {
      en: 'Choosing a house cleaning company in Kuwait starts with explaining what your home needs. A house and an apartment can need different plans, even with the same number of rooms. Our home cleaning service focuses on the spaces you use, their approximate size and the surfaces that need attention. House and apartment cleaning are part of this service, with the details agreed for your home.',
      ar: 'عند اختيار شركة تنظيف منازل في الكويت، ابدأ بتوضيح احتياجات منزلك. قد يحتاج البيت والشقة إلى خطتين مختلفتين حتى مع تساوي عدد الغرف. تركز خدماتنا على المساحات التي تستخدمها ومساحتها التقريبية والأسطح التي تحتاج إلى عناية. يشمل ذلك تنظيف البيوت والشقق، مع الاتفاق على التفاصيل وفق احتياجات منزلك.',
    },
    planningTitle: {
      en: 'Planning your home cleaning visit',
      ar: 'التخطيط لزيارة تنظيف منزلك',
    },
    planning: {
      en: 'List your living areas, bedrooms, kitchen and bathrooms, then note any surfaces that need particular care. Tell us about access arrangements and the date you prefer. If specific corners or high-use areas need more detailed attention, compare deep cleaning before choosing the scope.',
      ar: 'حدد غرف المعيشة والنوم والمطبخ والحمامات، ثم اذكر أي أسطح تحتاج إلى عناية خاصة. أخبرنا بترتيبات الدخول والموعد المفضل. إذا كانت هناك زوايا أو مناطق كثيرة الاستخدام تحتاج إلى اهتمام أدق، فتعرّف على التنظيف العميق قبل اختيار نطاق العمل.',
    },
    careTitle: {
      en: 'Floor cleaning for homes in Kuwait',
      ar: 'تنظيف أرضيات المنازل في الكويت',
    },
    care: {
      en: 'Floor care is part of planning your home cleaning. Tell us whether the rooms have tile, stone, wood or another surface, and share any care instructions. Note the approximate floor area and where furniture limits access. These details help us discuss the approach and agree which rooms and accessible floor areas to include, without assuming every material needs the same treatment.',
      ar: 'العناية بالأرضيات جزء من التخطيط لتنظيف منزلك. أخبرنا إن كانت الأرضيات من البلاط أو الحجر أو الخشب أو خامة أخرى، وشاركنا تعليمات العناية بها. اذكر المساحة التقريبية والأماكن التي يحد فيها الأثاث من الوصول. تساعدنا هذه التفاصيل في مناقشة الطريقة والاتفاق على الغرف والأرضيات المتاحة المطلوب تضمينها، فليست كل الخامات بحاجة إلى المعاملة نفسها.',
    },
    compareId: 'deep',
    compareIntro: {
      en: 'For edges, corners and high-use areas that need extra attention, explore:',
      ar: 'للحواف والزوايا والمناطق كثيرة الاستخدام التي تحتاج إلى عناية إضافية، تعرّف على:',
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
      ar: 'تنظيف المكاتب في الكويت | ستار كلينينج',
    },
    description: {
      en: 'Office cleaning in Kuwait for workstations, meeting rooms and shared spaces. Discuss your workplace routine and cleaning scope with Star Cleaning’s male staff.',
      ar: 'تنظيف المكاتب في الكويت لمحطات العمل وغرف الاجتماعات والمساحات المشتركة. ناقش أوقات العمل ونطاق التنظيف مع ستار كلينينج، بطاقم من الرجال فقط.',
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
    careTitle: {
      en: 'Floor care and access around the office',
      ar: 'العناية بالأرضيات وترتيبات الوصول في المكتب',
    },
    care: {
      en: 'Reception areas, corridors and spaces around desks can have different floor-care needs. Include the floor materials and accessible areas in your enquiry, and explain when shared routes need to stay in use. Identify cables, equipment and documents that should not be moved. Agreeing these details helps separate the cleaning work from the items your staff need to secure before a visit.',
      ar: 'قد تختلف احتياجات العناية بأرضيات الاستقبال والممرات والمساحات المحيطة بالمكاتب. اذكر خامات الأرضيات والمساحات المتاحة في استفسارك، ووضّح الأوقات التي يلزم فيها إبقاء الممرات قيد الاستخدام. حدد الكابلات والأجهزة والمستندات التي ينبغي عدم تحريكها. يساعد الاتفاق على هذه التفاصيل في فصل أعمال التنظيف عن الأغراض التي يحتاج موظفوك إلى تأمينها قبل الزيارة.',
    },
    compareId: 'deep',
    compareIntro: {
      en: 'If your workplace needs attention beyond its usual cleaning routine, compare:',
      ar: 'إذا احتاج مكان عملك إلى عناية تتجاوز التنظيف المعتاد، قارن مع:',
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
      ar: 'تنظيف الفلل في الكويت | ستار كلينينج',
    },
    description: {
      en: 'Villa cleaning in Kuwait with male cleaning staff. Plan care for rooms, stairs and interior surfaces, with the scope agreed for your villa before booking.',
      ar: 'تنظيف الفلل في الكويت بطاقم من الرجال فقط. خطط لتنظيف الغرف والسلالم والأسطح الداخلية مع ستار كلينينج، وناقش مساحة الفيلا ونطاق العمل قبل الحجز.',
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
    careTitle: {
      en: 'Room and floor priorities for your villa',
      ar: 'أولويات الغرف والأرضيات في فيلتك',
    },
    care: {
      en: 'Separate the areas you use daily from rooms that need occasional attention. Note changes in floor material between levels and any care instructions for stairs or interior surfaces. Share which rooms are furnished and whether any spaces are unavailable during the visit. A floor-by-floor list makes it easier to discuss the work that matters most before agreeing the cleaning scope.',
      ar: 'ميّز بين المساحات التي تستخدمها يومياً والغرف التي تحتاج إلى عناية من حين لآخر. اذكر اختلاف خامات الأرضيات بين الطوابق وأي تعليمات للعناية بالسلالم أو الأسطح الداخلية. وضّح الغرف المؤثثة والمساحات غير المتاحة أثناء الزيارة. تسهّل قائمة تحدد احتياجات كل طابق مناقشة أولوياتك قبل الاتفاق على نطاق التنظيف.',
    },
    compareId: 'home',
    compareIntro: {
      en: 'For the everyday rooms and surfaces within a smaller home or apartment, explore:',
      ar: 'للغرف والأسطح المستخدمة يومياً في منزل أصغر أو شقة، تعرّف على:',
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
      ar: 'تنظيف الكنب والسجاد في الكويت | ستار كلينينج',
    },
    description: {
      en: 'Sofa cleaning and carpet cleaning in Kuwait with male cleaning staff. Discuss fabric, size, condition and expected drying time with Star Cleaning before your visit.',
      ar: 'تنظيف الكنب والسجاد في الكويت مع ستار كلينينج بطاقم من الرجال فقط. شاركنا نوع القماش والحجم والحالة لمناقشة طريقة العناية ووقت الجفاف قبل الزيارة.',
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
    careTitle: {
      en: 'Preparing for upholstery and carpet care',
      ar: 'الاستعداد للعناية بالمفروشات والسجاد',
    },
    care: {
      en: 'Keep fabric labels or care instructions available and point out any existing wear or discoloration. Explain which sofa sections, cushions or rugs you want included so these can be discussed individually. Before the visit, ask when the treated items can be used again and what access or ventilation arrangements are needed. The answer depends on the material and agreed cleaning approach.',
      ar: 'جهّز ملصقات الأقمشة أو تعليمات العناية بها، ووضّح أي تآكل أو تغير لون موجود مسبقاً. حدد أجزاء الكنب أو الوسائد أو قطع السجاد التي ترغب في تضمينها لمناقشة كل منها. اسأل قبل الزيارة عن موعد إعادة استخدام القطع وترتيبات الوصول أو التهوية المطلوبة. تعتمد الإجابة على الخامة وطريقة التنظيف المتفق عليها.',
    },
    compareId: 'home',
    compareIntro: {
      en: 'For rooms and hard-floor care alongside your upholstery enquiry, explore:',
      ar: 'للعناية بالغرف والأرضيات الصلبة إلى جانب استفسارك عن المفروشات، تعرّف على:',
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
      ar: 'تنظيف عميق في الكويت | ستار كلينينج',
    },
    description: {
      en: 'Deep cleaning in Kuwait for high-use areas, edges, corners and accessible surfaces. Discuss a detailed cleaning scope with Star Cleaning’s male cleaning staff.',
      ar: 'تنظيف عميق في الكويت للمناطق كثيرة الاستخدام والحواف والزوايا والأسطح المتاحة. ناقش أولويات منزلك أو مكتبك مع ستار كلينينج بطاقم من الرجال فقط.',
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
    careTitle: {
      en: 'Agreeing a detailed cleaning checklist',
      ar: 'الاتفاق على قائمة تفصيلية للتنظيف',
    },
    care: {
      en: 'Describe the specific edges, corners and frequently used surfaces you want addressed, rather than relying on the words “deep clean” alone. For floor cleaning, share the material and any care instructions, and identify areas obstructed by furniture. Agree what is accessible and which tasks are included before the visit. This gives you a practical checklist for discussing the completed work.',
      ar: 'صف الحواف والزوايا والأسطح كثيرة الاستخدام التي تريد الاهتمام بها، بدلاً من الاكتفاء بعبارة «تنظيف عميق». لتنظيف الأرضيات، شاركنا نوع الخامة وتعليمات العناية وحدد الأماكن التي يعيق الأثاث الوصول إليها. اتفق معنا على المساحات المتاحة والمهام المشمولة قبل الزيارة، لتكون لديك قائمة عملية لمناقشة العمل المنجز.',
    },
    compareId: 'home',
    compareIntro: {
      en: 'If your priority is the living areas and surfaces used every day, compare:',
      ar: 'إذا كانت أولويتك مساحات المعيشة والأسطح المستخدمة يومياً، قارن مع:',
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

export const catalogServicePages = services.map((service) => ({
  ...service,
  page: servicePageCopy[service.id],
}))

export const servicePages = [...catalogServicePages, apartmentService]

export type CatalogServicePageData = (typeof catalogServicePages)[number]
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
      'Star Cleaning provides male cleaning staff only. Female cleaning staff are not offered. Share your property location and service requirements so the scope and availability can be discussed before booking.',
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
      'توفر ستار كلينينج طاقم تنظيف من الرجال فقط، ولا توفر عاملات تنظيف. شاركنا موقع العقار والخدمة المطلوبة لمناقشة نطاق العمل والتوافر قبل الحجز.',
    enquiry: 'جهّز استفسارك',
  },
}
