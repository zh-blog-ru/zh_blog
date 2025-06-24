'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

export async function redirectTo(path: string, hasLocale?: boolean) {
  revalidatePath('/') // Update cached posts
  const locale = (await cookies()).get('locale')?.value ?? 'ru'
  if (hasLocale) {
    redirect(sanitizeUrl(path))
  } else {
    redirect(sanitizeUrl('/' + locale + path))
  }
}