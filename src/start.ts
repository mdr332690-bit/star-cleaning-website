import { createMiddleware, createStart } from '@tanstack/react-start'
import { indexNowVerificationResponse } from './server/indexNowVerification'

const indexNowVerification = createMiddleware().server(({ request, next }) => {
  return (
    indexNowVerificationResponse(request, process.env.INDEXNOW_KEY_V2) ?? next()
  )
})

export const startInstance = createStart(() => ({
  requestMiddleware: [indexNowVerification],
}))
