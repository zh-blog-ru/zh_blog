'use server'
import { cookies } from 'next/headers'
import { locales, LocaleType } from '@/i18n/locales'

export async function changeLocale(newLocale: LocaleType) {
    if (locales.includes(newLocale)) {
        (await cookies()).set('locale', newLocale, { sameSite: 'lax', secure: true, httpOnly: true })
    }
}