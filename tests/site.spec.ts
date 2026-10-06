import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('page renders locally, images load, real contacts work, and layout does not overflow', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Красотабыть собой.')
  await page.locator('#contacts').scrollIntoViewIfNeeded()
  await expect(page.getByText('г. Орёл, ул. Раздольная, д. 82Б', { exact: true })).toBeVisible()
  await expect(page.locator('.contact-phone')).toHaveAttribute('href', 'tel:+79102664823')
  await expect(page.getByRole('link', { name: 'Построить маршрут' })).toHaveAttribute(
    'href',
    /yandex\.ru\/maps/,
  )
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) => {
        image.loading = 'eager'
        return image.decode()
      }),
    )
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect(errors).toEqual([])
})

test('service details and inspiration filters work', async ({ page }) => {
  await page.goto('./')
  const services = page.locator('#services')
  await services.getByRole('button', { name: '02 Окрашивание' }).click()
  await expect(services.getByText('Окрашивание в один тон', { exact: true })).toBeVisible()
  await expect(services.getByText('Женская стрижка', { exact: true })).toBeHidden()
  await services.getByRole('button', { name: 'Записаться', exact: true }).click()
  await expect(page.getByRole('radio', { name: /Окрашивание/ })).toBeChecked()
  await page.getByRole('button', { name: 'Закрыть запись' }).click()
  const inspiration = page.locator('#inspiration')
  await inspiration.getByRole('button', { name: 'Стрижки', exact: true }).click()
  await expect(inspiration.locator('.inspiration-card')).toHaveCount(1)
  await expect(inspiration.getByText('Характер в деталях')).toBeVisible()
  await inspiration.getByRole('button', { name: 'Все образы' }).click()
  await expect(inspiration.locator('.inspiration-card')).toHaveCount(4)
})

test('booking validates input and prepares an SMS without pretending the booking was sent', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Записаться в салон', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('radio', { name: /Укладки/ }).check()
  await dialog.getByRole('button', { name: 'Выбрать дату' }).click()
  await dialog.getByRole('button', { name: 'Подготовить заявку' }).click()
  await expect(dialog.getByRole('heading', { name: 'Ваш идеальный визит' })).toBeVisible()
  await dialog.getByLabel('Как к вам обращаться').fill('Анна')
  await dialog.getByLabel('Удобное время').selectOption('Вечером')
  await dialog.getByLabel('Пожелания').fill('Хочу естественные локоны')
  await dialog.getByRole('button', { name: 'Подготовить заявку' }).click()
  await expect(dialog.getByRole('heading', { name: 'Осталось отправить' })).toBeVisible()
  await expect(
    dialog.getByText('Запись будет подтверждена после ответа салона.', { exact: false }),
  ).toBeVisible()
  const href = await dialog.getByRole('link', { name: 'Отправить SMS' }).getAttribute('href')
  expect(href).toMatch(/^sms:\+79102664823\?body=/)
  expect(decodeURIComponent(href!)).toContain('Имя: Анна')
  expect(decodeURIComponent(href!)).toContain('Услуга: Укладки')
  expect(decodeURIComponent(href!)).toContain('Хочу естественные локоны')
  await dialog.getByRole('button', { name: 'Изменить пожелания' }).click()
  await expect(dialog.getByLabel('Как к вам обращаться')).toHaveValue('Анна')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Записаться в салон', exact: true })).toBeFocused()
})

test('FAQ and privacy content are accessible', async ({ page }) => {
  await page.goto('./')
  const faq = page.getByRole('button', { name: 'Как перенести или отменить запись?' })
  await faq.click()
  await expect(faq).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('Позвоните нам по номеру', { exact: false })).toBeVisible()
  await faq.click()
  await expect(faq).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: 'Конфиденциальность' }).click()
  await expect(page.getByRole('dialog', { name: 'Ваши данные' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('page and booking pass accessibility checks', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => document.fonts.ready)
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.getByRole('button', { name: 'Записаться в салон', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
})

test('mobile menu and persistent booking bar work', async ({ page, isMobile }) => {
  test.skip(!isMobile)
  await page.goto('./')
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  await expect(page.getByRole('dialog', { name: 'Меню сайта' })).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Мобильная навигация' })
    .getByRole('link', { name: '04 Контакты' })
    .click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('.mobile-booking-bar')).toHaveClass(/visible/)
  await page.locator('.mobile-booking-bar').getByRole('button', { name: 'Записаться' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})
