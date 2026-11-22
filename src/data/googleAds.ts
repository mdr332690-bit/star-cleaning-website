type ConversionParameters = {
  send_to: string
  value?: number
  currency?: 'USD'
}

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      event: 'conversion',
      parameters: ConversionParameters,
    ) => void
  }
}

function sendConversion(parameters: ConversionParameters) {
  if (typeof window === 'undefined') return
  try {
    // Reuse the existing Google tag without overriding its consent state.
    // Never retry or forward form data, contact URLs, or customer details.
    if (typeof window.gtag === 'function')
      window.gtag('event', 'conversion', parameters)
  } catch {
    // Tracking failure must not interrupt a call or change a form's success.
  }
}

export function trackBookingSuccess() {
  sendConversion({ send_to: 'AW-18535502279/KBtqCJDU97wdEMejtYZF' })
}

export function trackPhoneClick() {
  sendConversion({
    send_to: 'AW-18535502279/jZEvCP7fqLwdEMejtYZF',
    value: 1.0,
    currency: 'USD',
  })
}
