import { cookies } from "next/headers";
import { ArticleInterface } from "../Interfaces/ArticleInterface"
import { LocaleType } from "@/i18n/locales"

type ArticlesWithoutContent = Omit<ArticleInterface, 'content'>;
export async function getAllArticles(): Promise<(ArticlesWithoutContent & {is_active: boolean})[] | false> {
        const response = (await fetch(`https://zhblog.ru/api/v1/articles/all`, {
            headers: {
                'Cookie': (await cookies()).toString()
            }, 
            cache: 'force-cache'
        }))
        if (!response.ok) {
            const error = await response.json()
            return false
        }
        console.log('all_articles_good')
        const articles: (ArticlesWithoutContent & {is_active: boolean})[] | [] = await response.json()
        return articles
}
