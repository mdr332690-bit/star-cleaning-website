import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { copy } from '../data/content'
import { atlasCopy, governorates } from '../data/serviceAreas'
import { ServiceAreas } from './ServiceAreas'

afterEach(cleanup)

const dialogPrototype = HTMLDialogElement.prototype
const dialogFallbacks = {
  showModal(this: HTMLDialogElement) {
    this.open = true
  },
  close(this: HTMLDialogElement) {
    this.open = false
  },
}
const missingMethods = (
  Object.keys(dialogFallbacks) as (keyof typeof dialogFallbacks)[]
).filter((method) => typeof dialogPrototype[method] !== 'function')

beforeAll(() => {
  for (const method of missingMethods) {
    Object.defineProperty(dialogPrototype, method, {
      configurable: true,
      value: dialogFallbacks[method],
    })
  }
})

afterAll(() => {
  for (const method of missingMethods)
    Reflect.deleteProperty(dialogPrototype, method)
})

describe('Kuwait service areas', () => {
  it.each(['en', 'ar'] as const)(
    'opens the right bilingual details from every map pin and list item in %s',
    async (lang) => {
      const user = userEvent.setup()
      const t = atlasCopy[lang]
      render(<ServiceAreas lang={lang} />)
      expect(
        screen.getByRole('heading', { name: `${t.title} ${t.titleEm}` }),
      ).toBeTruthy()
      const map = within(screen.getByRole('figure', { name: t.map }))
      const index = within(screen.getByRole('list'))
      expect(map.getAllByRole('button')).toHaveLength(6)
      expect(index.getAllByRole('button')).toHaveLength(6)

      for (const area of governorates) {
        const name = new RegExp(
          `${area[lang]}.*${area[lang === 'ar' ? 'en' : 'ar']}`,
        )
        const pin = map.getByRole('button', { name: area[lang] })
        const row = index.getByRole('button', { name })
        for (const control of [pin, row]) {
          await user.click(control)
          const dialog = screen.getByRole('dialog', { name })
          expect(within(dialog).getByText(copy[lang].scopeNote)).toBeTruthy()
          expect(
            within(dialog)
              .getByRole('link', { name: t.book })
              .getAttribute('href'),
          ).toBe('#booking')
          expect(pin.getAttribute('aria-current')).toBe('location')
          expect(row.getAttribute('aria-current')).toBe('location')
          await user.click(
            within(dialog).getByRole('button', { name: copy[lang].close }),
          )
          expect(screen.queryByRole('dialog')).toBeNull()
        }
      }
      expect(map.getAllByRole('button', { current: 'location' })).toHaveLength(
        1,
      )
    },
  )

  it('closes on cancel, backdrop click and booking navigation', async () => {
    const user = userEvent.setup()
    render(<ServiceAreas lang="en" />)
    const pin = screen.getByRole('button', { name: 'Jahra' })
    await user.click(pin)
    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { cancelable: true }),
    )
    expect(screen.queryByRole('dialog')).toBeNull()

    await user.click(pin)
    await user.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).toBeNull()

    await user.click(pin)
    await user.click(
      within(screen.getByRole('dialog')).getByRole('link', {
        name: atlasCopy.en.book,
      }),
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
