import { ArticleInterface } from "../Interfaces/ArticleInterface"
import { notFound } from "next/navigation"
import { LocaleType } from "@/i18n/locales"


export async function getArticle(article_id: number, locale: LocaleType): Promise<ArticleInterface | never> {
    console.log('article/[id]')
        const response = (await fetch("https://zhblog.ru/api/v1/articles/" + article_id, {
            headers: {
                'Cookie': 'locale='+locale
            },
            cache: 'force-cache'
        }))
        if (!response.ok) {
            const error = await response.json()
            console.log(error)
            notFound()
        }
        const article: ArticleInterface = await response.json()
        return article
}
