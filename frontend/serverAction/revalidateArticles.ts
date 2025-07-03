'use server'
import { revalidateTag } from 'next/cache'

export async function revalidateArticles() {
  revalidateTag('articles')
}