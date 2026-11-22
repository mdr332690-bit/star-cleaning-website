import type { Language } from './content'

// These are enquiry locations, not verified service areas or branch addresses.
// Keep areaServed in structured data limited to the verified country, Kuwait.
export const localEnquiryCopy = {
  en: {
    eyebrow: 'PLANNING YOUR VISIT IN KUWAIT',
    title: 'Check cleaning availability for your location.',
    intro:
      'Enquiring from Kuwait City, Hawally, Salmiya, Farwaniya, Jahra, Ahmadi or Mubarak Al-Kabeer? Share your area, property type and preferred date so the team can check your request.',
    note: 'Availability at your location, the cleaning scope and the price must be confirmed individually before booking. Mentioning an area here does not confirm service coverage there.',
    action: 'Share your cleaning requirements',
  },
  ar: {
    eyebrow: 'التخطيط لزيارة التنظيف في الكويت',
    title: 'استفسر عن توافر خدمة التنظيف في منطقتك.',
    intro:
      'إذا كان عقارك في مدينة الكويت أو حولي أو السالمية أو الفروانية أو الجهراء أو الأحمدي أو مبارك الكبير، فشاركنا منطقتك ونوع العقار والموعد المفضل حتى يتمكن الفريق من مراجعة طلبك.',
    note: 'يجب تأكيد توافر الخدمة في موقعك ونطاق التنظيف والسعر لكل طلب قبل الحجز. ذكر منطقة هنا لا يعني تأكيد تغطية الخدمة فيها.',
    action: 'شاركنا متطلبات التنظيف',
  },
} satisfies Record<Language, Record<string, string>>

export const localServiceAdvice = {
  home: {
    en: 'For home or apartment cleaning, include the number of rooms, approximate floor area and any building access arrangements. These details help the team assess your enquiry before agreeing a visit.',
    ar: 'عند الاستفسار عن تنظيف منزل أو شقة، اذكر عدد الغرف والمساحة التقريبية وترتيبات دخول المبنى. تساعد هذه التفاصيل الفريق على دراسة طلبك قبل الاتفاق على الزيارة.',
  },
  office: {
    en: 'For office cleaning, include your workplace location, approximate size, working hours and building access rules. Explain when shared areas need to stay in use so the team can assess the proposed visit.',
    ar: 'عند الاستفسار عن تنظيف المكاتب، اذكر موقع مكان العمل ومساحته التقريبية وأوقات العمل وقواعد دخول المبنى. وضّح الأوقات التي يلزم فيها إبقاء المساحات المشتركة قيد الاستخدام حتى يراجع الفريق ترتيبات الزيارة المقترحة.',
  },
  villa: {
    en: 'For villa cleaning, share your area, the number of floors, approximate property size and access details. Identify the interior rooms and staircases you want included before discussing availability.',
    ar: 'عند الاستفسار عن تنظيف الفلل، اذكر منطقتك وعدد الطوابق ومساحة العقار التقريبية وترتيبات الدخول. حدد الغرف الداخلية والسلالم المطلوبة قبل مناقشة التوافر.',
  },
  sofa: {
    en: 'For sofa or carpet cleaning, include your location, the number and size of items, fabric details and any access limits. Discuss the cleaning approach and expected drying time when the team reviews your request.',
    ar: 'عند الاستفسار عن تنظيف الكنب أو السجاد، اذكر موقعك وعدد القطع وأحجامها ونوع القماش وأي قيود على الدخول. ناقش طريقة التنظيف ووقت الجفاف المتوقع عند مراجعة الفريق لطلبك.',
  },
  deep: {
    en: 'For deep cleaning, share your location, property size and the rooms, edges or high-use areas that need extra care. A detailed list helps the team discuss the work and assess availability for your preferred date.',
    ar: 'عند الاستفسار عن تنظيف عميق، اذكر موقعك ومساحة العقار والغرف والحواف أو المناطق كثيرة الاستخدام التي تحتاج إلى عناية إضافية. تساعد القائمة التفصيلية الفريق على مناقشة العمل ودراسة التوافر في الموعد المفضل.',
  },
} satisfies Record<string, Record<Language, string>>
