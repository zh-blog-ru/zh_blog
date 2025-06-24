import 'server-only'
import { cookies } from "next/headers"
import { UserInterfaces } from "../Interfaces/UserInterfaces"
import { cache } from 'react'

export type PrivateUserInterfaces = Pick<UserInterfaces,
    'id' | 'username' | 'profile_picture_url' | 'about_me' | 'email'> & { isOwner: true }

export const getCurrentUser = async (id: "me"): Promise<PrivateUserInterfaces | false> => {
        const cookie = await cookies()
        const response = await fetch('https://zhblog.ru/api/v1/users/' + id, {
            headers: {
                'Cookie': cookie.toString()
            },
        })
        if (!response.ok) {
            return false
        }
        const user = await response.json()
        return user
}
