import { cookies } from "next/headers"
import { ArticleInterface } from "../Interfaces/ArticleInterface"
import { redirect } from "next/navigation"


export async function IsAdmin(): Promise<void> {
        const cookie = await cookies()
        const response = (await fetch("https://zhblog.ru/api/v1/validation/admin", {
            headers: {
                'Cookie': cookie.toString()
            },
        }))
        if (!response.ok) {
            redirect('/articles')            
        }
}
