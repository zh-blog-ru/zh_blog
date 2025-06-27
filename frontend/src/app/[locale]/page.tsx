import { cookies } from "next/headers"
import { permanentRedirect } from "next/navigation"

export default async function Page() {
  const locale = (await cookies()).get('locale')?.value ?? 'ru'
  permanentRedirect('/' + locale + '/articles')
}