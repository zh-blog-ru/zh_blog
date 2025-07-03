import { ArticleInterface } from "../Interfaces/ArticleInterface"
import { notFound } from "next/navigation"
import { LocaleType } from "@/i18n/locales"


export async function getArticle(article_id: number, lang: LocaleType): Promise<ArticleInterface | never> {
    console.log('article/[id]')
    const response = (await fetch(`https://zhblog.ru/api/v1/articles/${article_id}?locale=${lang}`, {
        headers: {
            'Cookie': `locale=${lang}`
        },
        cache: 'force-cache',
        next: {
            tags: ['articles']
        }
    }))
    if (!response.ok) {
        const error = await response.json()
        console.log(error)
        notFound()
    }
    const article = await response.json()
    return article
}
