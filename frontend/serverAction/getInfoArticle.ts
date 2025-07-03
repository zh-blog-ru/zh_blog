import { ArticleInterface } from "../Interfaces/ArticleInterface"
import { notFound } from "next/navigation"
import { LocaleType } from "@/i18n/locales"
import { cookies } from "next/headers"


type InfoArticle = ArticleInterface & {is_active: boolean}
export async function getInfoArticle(article_id: number, lang: LocaleType): Promise<InfoArticle | never> {
    console.log('article/[id]')
    const response = (await fetch(`https://zhblog.ru/api/v1/articles/info/${article_id}?locale=${lang}`, {
        headers: {
            'Cookie': (await cookies()).toString()
        },
        cache: 'no-cache'
    }))
    if (!response.ok) {
        const error = await response.json()
        console.log(error)
        notFound()
    }
    const article = await response.json()
    return article
}
