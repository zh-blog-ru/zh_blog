import { ArticleInterface } from "../Interfaces/ArticleInterface"
import { LocaleType } from "@/i18n/locales"

type ArticleWithoutContent = Omit<ArticleInterface, 'content'>;
export async function getArticles(locale: LocaleType): Promise<ArticleWithoutContent[] | []> {
    console.log('articles')
        const response = (await fetch("https://zhblog.ru/api/v1/articles/", {
            headers: {
                'Cookie': 'locale='+locale
            }, 
            cache: 'force-cache'
        }))
        if (!response.ok) {
            const error = await response.json()
            console.log(error)
            return []
        }

        const articles: Omit<ArticleWithoutContent, 'articles'>[] | [] = await response.json()
        return articles
}
