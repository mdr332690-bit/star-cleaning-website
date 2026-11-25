import type { Language } from './content'

export const bookingServices = [
  { id: 'home', en: 'Home Cleaning', ar: 'تنظيف المنازل' },
  { id: 'apartment', en: 'Apartment Cleaning', ar: 'تنظيف الشقق' },
  { id: 'office', en: 'Office Cleaning', ar: 'تنظيف المكاتب' },
  { id: 'deep', en: 'Deep Cleaning', ar: 'التنظيف العميق' },
  { id: 'sofa', en: 'Sofa Cleaning', ar: 'تنظيف الكنب' },
  { id: 'villa', en: 'Villa Cleaning', ar: 'تنظيف الفلل' },
  { id: 'carpet', en: 'Carpet Cleaning', ar: 'تنظيف السجاد' },
] as const

export const bookingCopy = {
  en: {
    eyebrow: 'BOOKING & INQUIRIES',
    title: 'A cleaner space,',
    titleEm: 'planned around you.',
    intro:
      'Tell us what you need and when. Share your cleaning preferences, and let’s discuss the right service for your space in Kuwait.',
    steps: [
      'Choose your service and tell us about your space.',
      'Share your preferred date and time.',
      'Confirm availability, scope and pricing with our team.',
    ],
    whatsapp: 'Contact us on WhatsApp',
    alternate: 'Prefer to prepare a WhatsApp message?',
    formTitle: 'Your cleaning request',
    formIntro: 'Send a booking request or ask us about a service.',
    serviceBoundary:
      "Professional cleaning visits only. We don't provide hourly maids or household staffing.",
    required: 'Fields marked * are required.',
    optional: 'optional',
    fullName: 'Customer Full Name',
    mobile: 'Mobile Number',
    whatsappNumber: 'WhatsApp Number',
    phoneHint:
      'Kuwait: 8 digits. For other countries, include the country code.',
    service: 'Service Type',
    selectService: 'Choose a cleaning service',
    area: 'Area / Location in Kuwait',
    areaPlaceholder: 'Area, block or nearby landmark',
    preferredDate: 'Preferred Booking Date',
    preferredTime: 'Preferred Time',
    kuwaitTime: 'Preferred date and time are in Kuwait local time.',
    message: 'Additional Message',
    messagePlaceholder:
      'Tell us about the space, its size or any special requests…',
    submit: 'Send booking inquiry',
    whatsappIntro:
      'Hello Star Cleaning Kuwait, I would like to enquire about a cleaning booking.',
    whatsappSubmitHint:
      'Submitting also opens WhatsApp with your details. Press Send in WhatsApp to send the message.',
    whatsappInstructions:
      'Press Send in WhatsApp to send your message. If the chat did not open, use the link below.',
    openWhatsApp: 'Open WhatsApp message',
    notProvided: 'Not provided',
    sending: 'Sending your inquiry…',
    note: 'Sending an inquiry does not confirm a booking. Availability, scope and pricing need to be agreed with our team.',
    privacy: 'Your contact details are used to respond to this inquiry.',
    bot: 'Leave this field empty',
    error:
      'We couldn’t confirm that your inquiry was received. Your details are still here. Please try again or contact us on WhatsApp.',
    successTitle: 'Thank you for your inquiry.',
    successText:
      'Your request has been received by Star Cleaning Kuwait. Our team can contact you using the details you provided to discuss availability and your cleaning needs.',
    successNote:
      'Your booking is confirmed only after the date, time, scope and price are agreed with our team.',
    another: 'Send another inquiry',
    validation: {
      fullName: 'Please enter your full name (2–100 characters).',
      mobile: 'Please enter a valid mobile number with 8–15 digits.',
      whatsappNumber:
        'Please enter a valid WhatsApp number with 8–15 digits, or leave it empty.',
      service: 'Please choose a cleaning service.',
      area: 'Please enter your area in Kuwait (2–200 characters).',
      preferredDate: 'Please choose today or a future date in Kuwait.',
      preferredTime:
        'Please choose a future time in Kuwait for your preferred date.',
      message: 'Please keep your message within 2,000 characters.',
    },
  },
  ar: {
    eyebrow: 'الحجز والاستفسارات',
    title: 'مساحة أنظف،',
    titleEm: 'بموعد يناسبك.',
    intro:
      'أخبرنا بما تحتاج إليه والموعد الذي يناسبك. شاركنا تفضيلاتك لنناقش خدمة التنظيف المناسبة لمساحتك في الكويت.',
    steps: [
      'اختر الخدمة وأخبرنا عن مساحتك.',
      'حدد التاريخ والوقت المفضلين لديك.',
      'اتفق مع فريقنا على التوفر ونطاق العمل والسعر.',
    ],
    whatsapp: 'تواصل معنا عبر واتساب',
    alternate: 'هل تفضّل تجهيز رسالة عبر واتساب؟',
    formTitle: 'طلب خدمة التنظيف',
    formIntro: 'أرسل طلب حجز أو استفسر عن إحدى خدماتنا.',
    serviceBoundary:
      'نقدّم زيارات تنظيف احترافية فقط، ولا نوفر خادمات بالساعة أو عمالة منزلية.',
    required: 'الحقول المميزة بعلامة * مطلوبة.',
    optional: 'اختياري',
    fullName: 'اسم العميل الكامل',
    mobile: 'رقم الجوال',
    whatsappNumber: 'رقم الواتساب',
    phoneHint: 'في الكويت: ٨ أرقام. للأرقام الدولية، أضف رمز الدولة.',
    service: 'نوع الخدمة',
    selectService: 'اختر خدمة التنظيف',
    area: 'المنطقة / الموقع في الكويت',
    areaPlaceholder: 'المنطقة أو القطعة أو معلم قريب',
    preferredDate: 'تاريخ الحجز المفضل',
    preferredTime: 'الوقت المفضل',
    kuwaitTime: 'التاريخ والوقت المفضلان حسب التوقيت المحلي للكويت.',
    message: 'رسالة إضافية',
    messagePlaceholder: 'أخبرنا عن المساحة وحجمها أو أي طلبات خاصة…',
    submit: 'إرسال طلب الحجز والاستفسار',
    whatsappIntro:
      'مرحباً ستار كلينينج الكويت، أرغب في الاستفسار عن حجز خدمة تنظيف.',
    whatsappSubmitHint:
      'عند إرسال الطلب، تُفتح محادثة واتساب مع بياناتك أيضاً. اضغط على زر الإرسال في واتساب لإرسال الرسالة.',
    whatsappInstructions:
      'اضغط على زر الإرسال في واتساب لإرسال رسالتك. إذا لم تُفتح المحادثة، استخدم الرابط أدناه.',
    openWhatsApp: 'فتح رسالة واتساب',
    notProvided: 'لم تُذكر',
    sending: 'جارٍ إرسال استفسارك…',
    note: 'إرسال الاستفسار لا يُعد تأكيداً للحجز. يجب الاتفاق مع فريقنا على التوفر ونطاق العمل والسعر.',
    privacy: 'تُستخدم بيانات الاتصال للرد على هذا الاستفسار.',
    bot: 'اترك هذا الحقل فارغاً',
    error:
      'تعذّر التأكد من استلام استفسارك. ما زالت بياناتك موجودة. يرجى المحاولة مجدداً أو التواصل معنا عبر واتساب.',
    successTitle: 'شكراً لتواصلك معنا.',
    successText:
      'تم استلام طلبك لدى ستار كلينينج الكويت. يمكن لفريقنا التواصل معك عبر البيانات التي قدمتها لمناقشة المواعيد المتاحة واحتياجات التنظيف.',
    successNote:
      'يتم تأكيد الحجز فقط بعد الاتفاق مع فريقنا على التاريخ والوقت ونطاق العمل والسعر.',
    another: 'إرسال استفسار آخر',
    validation: {
      fullName: 'يرجى إدخال اسمك الكامل (من حرفين إلى ١٠٠ حرف).',
      mobile: 'يرجى إدخال رقم جوال صحيح يتكون من ٨ إلى ١٥ رقماً.',
      whatsappNumber:
        'يرجى إدخال رقم واتساب صحيح يتكون من ٨ إلى ١٥ رقماً، أو ترك الحقل فارغاً.',
      service: 'يرجى اختيار خدمة التنظيف.',
      area: 'يرجى إدخال منطقتك في الكويت (من حرفين إلى ٢٠٠ حرف).',
      preferredDate: 'يرجى اختيار تاريخ اليوم أو تاريخ لاحق في الكويت.',
      preferredTime: 'يرجى اختيار وقت قادم بتوقيت الكويت في التاريخ المفضل.',
      message: 'يرجى ألا تتجاوز رسالتك ٢٠٠٠ حرف.',
    },
  },
} satisfies Record<Language, object>

export const bookingFormName = 'star-cleaning-booking'
export const bookingEndpoint = '/__forms.html'
export const bookingFields = [
  'fullName',
  'mobile',
  'whatsappNumber',
  'service',
  'area',
  'preferredDate',
  'preferredTime',
  'message',
] as const
export type BookingField = (typeof bookingFields)[number]
export type BookingErrors = Partial<Record<BookingField, string>>

export function bookingWhatsAppMessage(data: FormData, lang: Language) {
  const t = bookingCopy[lang]
  const value = (field: BookingField) => String(data.get(field) ?? '').trim()
  const service = bookingServices.find((item) => item.en === value('service'))
  return [
    t.whatsappIntro,
    '',
    `${t.fullName}: ${value('fullName')}`,
    `${t.mobile}: ${normalizePhone(value('mobile'))}`,
    ...(value('whatsappNumber')
      ? [`${t.whatsappNumber}: ${normalizePhone(value('whatsappNumber'))}`]
      : []),
    `${t.service}: ${service?.[lang] ?? value('service')}`,
    `${t.area}: ${value('area')}`,
    `${t.preferredDate}: ${value('preferredDate')}`,
    `${t.preferredTime}: ${value('preferredTime')}`,
    t.kuwaitTime,
    `${t.message}: ${value('message') || t.notProvided}`,
  ].join('\n')
}

export function normalizePhone(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (digit) =>
    String(digit.charCodeAt(0) - (digit <= '٩' ? 0x660 : 0x6f0)),
  )
}

export function kuwaitNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kuwait',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)!.value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}

export function validateBooking(
  data: FormData,
  lang: Language,
  now = new Date(),
) {
  const t = bookingCopy[lang].validation
  const errors: BookingErrors = {}
  const value = (field: BookingField) => String(data.get(field) ?? '').trim()
  const validPhone = (phone: string) => {
    const normalized = normalizePhone(phone)
    const digits = normalized.replace(/\D/g, '').length
    return /^\+?[\d\s().-]+$/.test(normalized) && digits >= 8 && digits <= 15
  }
  if (value('fullName').length < 2 || value('fullName').length > 100)
    errors.fullName = t.fullName
  if (!validPhone(value('mobile'))) errors.mobile = t.mobile
  if (value('whatsappNumber') && !validPhone(value('whatsappNumber')))
    errors.whatsappNumber = t.whatsappNumber
  if (!bookingServices.some((service) => service.en === value('service')))
    errors.service = t.service
  if (value('area').length < 2 || value('area').length > 200)
    errors.area = t.area
  const current = kuwaitNow(now)
  const date = value('preferredDate')
  const parsedDate = new Date(`${date}T00:00:00Z`)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date ||
    date < current.date
  )
    errors.preferredDate = t.preferredDate
  const time = value('preferredTime')
  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    (date === current.date && time <= current.time)
  )
    errors.preferredTime = t.preferredTime
  if (value('message').length > 2000) errors.message = t.message
  return errors
}
