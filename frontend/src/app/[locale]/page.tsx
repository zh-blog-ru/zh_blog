import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  const locale = (await cookies()).get('locale')?.value ?? 'ru'
  redirect('/' + locale + '/articles')
}