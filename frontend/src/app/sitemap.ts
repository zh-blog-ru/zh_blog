import type { MetadataRoute } from 'next'
import { locales } from "@/i18n/locales"
import { getArticles } from '../../serverAction/getArticles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://zhblog.ru'

    // 1. Получаем статьи для всех локалей
    const allArticles = await getArticles() 
    // 3. Генерируем записи для статей
    const articlePages: MetadataRoute.Sitemap = allArticles.map(article => ({
        url: `${baseUrl}/${article.locale}/articles/${article.id}`,
        lastModified: new Date(article.update_at),
        alternates: {
            languages: Object.fromEntries(
                locales.map(l => [
                    l,
                    `${baseUrl}/${l}/articles/${article.id}`
                ])
            )
        }
    }))

    // 4. Генерируем записи для about_me и списков статей
    const commonPages: MetadataRoute.Sitemap = locales.flatMap(locale => [
        {
            url: `${baseUrl}/${locale}/about_me`,
            lastModified: new Date(),
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}/about_me`])
                )
            }
        },
        {
            url: `${baseUrl}/${locale}/privacy`,
            lastModified: new Date(),
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}/about_me`])
                )
            }
        },
        {
            url: `${baseUrl}/${locale}/terms`,
            lastModified: new Date(),
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}/about_me`])
                )
            }
        },
        {
            url: `${baseUrl}/${locale}/articles`,
            lastModified: new Date(),
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}/articles`])
                )
            }
        }
    ])

    return [...commonPages, ...articlePages]
}