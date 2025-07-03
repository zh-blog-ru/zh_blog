import { cookies } from "next/headers";
import { ArticleInterface } from "../Interfaces/ArticleInterface"

type ArticlesWithoutContent = Omit<ArticleInterface, 'content'>;
export async function getInfoArticles(): Promise<(ArticlesWithoutContent & {is_active: boolean})[] | false> {
        const response = (await fetch(`https://zhblog.ru/api/v1/articles/info`, {
            headers: {
                'Cookie': (await cookies()).toString()
            }, 
            cache: 'no-cache'
        }))
        if (!response.ok) {
            const error = await response.json()
            return false
        }
        console.log('all_articles_good')
        const articles: (ArticlesWithoutContent & {is_active: boolean})[] | [] = await response.json()
        return articles
}
