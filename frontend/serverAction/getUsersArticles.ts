import { cookies } from "next/headers"
import { ArticleInterface } from "../Interfaces/ArticleInterface"


export async function getUsersArticles(id: number): Promise<Pick<ArticleInterface, 'img' | 'title' | 'id'>[] | []> {
        const cookie = await cookies()
        const response = (await fetch(`https://zhblog.ru/api/v1/users/${id}/liked_articles`, {
            headers: {
                'Cookie': cookie.toString()
            },
        }))
        if (!response.ok) {
            const error = await response.json()
            console.log(error)
            return []
        }
        const article = await response.json()
        return article
}
