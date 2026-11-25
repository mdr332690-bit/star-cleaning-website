import type { Language } from './content'

export const reviewPath = (lang: Language) =>
  lang === 'ar' ? '/ar/review' : '/review'
export function isPrivateReviewSurface(path: string) {
  try {
    return /^\/(?:ar\/)?review\/?$|^\/admin\/reviews(?:\/|$)/i.test(
      decodeURIComponent(path),
    )
  } catch {
    return false
  }
}

export const reviewCopy = {
  en: {
    title: 'Write a Review | Star Cleaning Kuwait',
    description:
      'Share your recent cleaning experience with Star Cleaning Kuwait. Reviews are moderated before publication.',
    eyebrow: 'Customer feedback',
    heading: 'How was your clean?',
    intro:
      'Tell us about your recent service. We welcome honest feedback, whatever your rating.',
    invite: 'Private invitation code',
    inviteHint:
      'Open the link we sent, or paste your personal code. Each invitation can be used once.',
    request: 'Request an invitation on WhatsApp',
    name: 'Display name',
    nameHint: 'Use the name you want shown publicly.',
    rating: 'Overall rating',
    stars: (value: number) =>
      `${value} ${value === 1 ? 'star' : 'stars'} out of 5`,
    experience: 'Your cleaning experience',
    experienceHint: '10–1,500 characters. Do not include private details.',
    photo: 'Add a photo (optional)',
    photoHint:
      'JPEG, PNG or WebP, up to 3 MB. Avoid faces, addresses and private documents.',
    consent:
      'I agree that Star Cleaning may publish my display name, rating, written review and optional photo if approved.',
    privacy:
      'We do not ask for your phone number or email. The team checks each submission before publishing it. Contact us on WhatsApp to request removal.',
    submit: 'Submit review',
    submitting: 'Submitting…',
    complete: 'Review received',
    pending:
      'Thank you. Your review is pending moderation and isn’t public yet.',
    home: 'Back to Star Cleaning',
    language: 'العربية',
    share: 'Share the review page',
    shareHint: 'This is the public page link, not your personal invitation.',
    copy: 'Copy link',
    copied: 'Link copied.',
    manual: 'Select and copy the link below.',
    deviceShare: 'Share…',
    whatsapp: 'WhatsApp',
    reviews: 'Customer reviews',
    reviewsIntro:
      'First-hand experiences from customers who used our cleaning service in Kuwait.',
    write: 'Write a Review',
    empty: 'No approved reviews yet.',
    emptyHint:
      'Completed a service with us? Share your experience using a personal invitation from our team.',
    loading: 'Loading customer reviews…',
    loadError: 'Reviews are temporarily unavailable.',
    retry: 'Try again',
    average: (rating: string, count: string) =>
      `${rating} out of 5 · ${count} approved reviews`,
    photoAlt: 'Photo shared with this customer review',
    template: (url: string) =>
      `Thank you for choosing Star Cleaning Kuwait. We welcome your honest feedback about your cleaning service. Leave a review using your personal link: ${url}`,
    error: {
      invitation:
        'Enter a valid, unused invitation code. If your link expired or was already used, contact our team.',
      name: 'Enter a display name of 1–70 characters.',
      rating: 'Choose a rating from 1 to 5 stars.',
      experience: 'Write 10–1,500 characters about your experience.',
      consent: 'Agree to publication if approved before submitting.',
      photo:
        'Choose a valid, still JPEG, PNG or WebP photo. Remove the selected photo to submit without one.',
      photoSize: 'The photo must be 3 MB or smaller.',
      rate: 'Too many attempts. Wait a few minutes and try again.',
      invalid: 'Check the form and try again.',
      unavailable:
        'We could not confirm your submission. Your entries are still here. Try again, or contact our team.',
    },
  },
  ar: {
    title: 'اكتب تقييمًا | ستار كلينينج الكويت',
    description:
      'شارك تجربتك مع خدمات ستار كلينينج الكويت. يراجع فريقنا التقييمات قبل نشرها.',
    eyebrow: 'آراء العملاء',
    heading: 'كيف كانت تجربة التنظيف؟',
    intro: 'أخبرنا عن تجربتك الأخيرة. نرحّب برأيك الصريح أيًا كان تقييمك.',
    invite: 'رمز الدعوة الخاص',
    inviteHint:
      'افتح الرابط الذي أرسلناه أو الصق رمزك الخاص. يمكن استخدام كل دعوة مرة واحدة.',
    request: 'اطلب دعوة عبر واتساب',
    name: 'الاسم المعروض',
    nameHint: 'اكتب الاسم الذي ترغب في ظهوره للعموم.',
    rating: 'التقييم العام',
    stars: (value: number) => `${value.toLocaleString('ar-KW')} من ٥ نجوم`,
    experience: 'تجربتك مع خدمة التنظيف',
    experienceHint: 'من ١٠ إلى ١٥٠٠ حرف. يُرجى عدم إضافة معلومات خاصة.',
    photo: 'أضف صورة (اختياري)',
    photoHint:
      'بصيغة JPEG أو PNG أو WebP وبحجم لا يزيد عن ٣ ميغابايت. تجنّب الوجوه والعناوين والمستندات الخاصة.',
    consent:
      'أوافق على نشر اسمي المعروض وتقييمي وتجربتي والصورة الاختيارية إذا اعتمد فريق ستار كلينينج التقييم.',
    privacy:
      'لا نطلب رقم هاتفك أو بريدك الإلكتروني. يراجع فريقنا كل تقييم قبل نشره. لطلب إزالة تقييمك، تواصل معنا عبر واتساب.',
    submit: 'إرسال التقييم',
    submitting: 'جارٍ الإرسال…',
    complete: 'تم استلام تقييمك',
    pending: 'شكرًا لك. تقييمك قيد المراجعة ولم يُنشر بعد.',
    home: 'العودة إلى ستار كلينينج',
    language: 'English',
    share: 'شارك صفحة التقييم',
    shareHint: 'هذا رابط الصفحة العامة وليس رابط دعوتك الخاص.',
    copy: 'نسخ الرابط',
    copied: 'تم نسخ الرابط.',
    manual: 'حدّد الرابط أدناه وانسخه.',
    deviceShare: 'مشاركة…',
    whatsapp: 'واتساب',
    reviews: 'تقييمات العملاء',
    reviewsIntro: 'تجارب يرويها عملاء استخدموا خدماتنا للتنظيف في الكويت.',
    write: 'اكتب تقييمًا',
    empty: 'لا توجد تقييمات معتمدة بعد.',
    emptyHint:
      'هل استفدت من خدماتنا؟ شارك تجربتك باستخدام دعوة خاصة من فريقنا.',
    loading: 'جارٍ تحميل تقييمات العملاء…',
    loadError: 'التقييمات غير متاحة مؤقتًا.',
    retry: 'حاول مجددًا',
    average: (rating: string, count: string) =>
      `${rating} من ٥ · ${count} تقييم معتمد`,
    photoAlt: 'صورة أرفقها العميل مع التقييم',
    template: (url: string) =>
      `شكرًا لاختياركم ستار كلينينج الكويت. يسعدنا معرفة رأيكم الصريح في خدمة التنظيف. يمكنكم كتابة تقييمكم عبر رابطكم الخاص: ${url}`,
    error: {
      invitation:
        'أدخل رمز دعوة صالحًا وغير مستخدم. تواصل معنا إذا انتهت صلاحية الرابط أو تم استخدامه.',
      name: 'اكتب اسمًا يتكوّن من حرف واحد إلى ٧٠ حرفًا.',
      rating: 'اختر تقييمًا من نجمة واحدة إلى ٥ نجوم.',
      experience: 'اكتب من ١٠ إلى ١٥٠٠ حرف عن تجربتك.',
      consent: 'وافق على النشر في حال اعتماد التقييم قبل الإرسال.',
      photo:
        'اختر صورة ثابتة وصالحة بصيغة JPEG أو PNG أو WebP، أو أزل الصورة للإرسال دونها.',
      photoSize: 'يجب ألا يتجاوز حجم الصورة ٣ ميغابايت.',
      rate: 'محاولات كثيرة. انتظر بضع دقائق ثم حاول مجددًا.',
      invalid: 'تحقّق من البيانات ثم حاول مجددًا.',
      unavailable:
        'تعذّر تأكيد الإرسال. بياناتك ما زالت موجودة. حاول مجددًا أو تواصل مع فريقنا.',
    },
  },
} as const

export type DisplayReview = {
  id: string
  name: string | null
  rating: number
  experience: string | null
  language: Language
  submittedAt: string
  hasPhoto: boolean
}

export type ReviewFeed = {
  average: number | null
  total: number
  reviews: DisplayReview[]
}

export const reviewDate = (lang: Language, value: string) =>
  new Intl.DateTimeFormat(lang === 'ar' ? 'ar-KW' : 'en-KW', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kuwait',
  }).format(new Date(value))
