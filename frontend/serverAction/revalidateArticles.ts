'use server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateArticles() {
  revalidateTag('articles')
  revalidatePath('/articles/')
}