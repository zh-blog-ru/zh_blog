import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function LocalizedRedirect(path?: string) {
    const locale = (await cookies()).get('locale')?.value ?? 'ru'
    redirect('/' + locale + (path ?? '/home'))
}