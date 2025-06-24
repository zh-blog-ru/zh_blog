import 'server-only'
import { cookies } from "next/headers"
import { UserInterfaces } from "../Interfaces/UserInterfaces"
import { notFound } from "next/navigation";
import { PrivateUserInterfaces } from './getCurrentUser';


export type PublicUserInterfaces = Pick<UserInterfaces,
    'id' | 'username' | 'profile_picture_url' | 'about_me'> & { isOwner: false }

type ReturnGetUserType = Promise<PrivateUserInterfaces | PublicUserInterfaces | false> | never
export async function getUser(id: number): ReturnGetUserType {
        const cookie = await cookies()
        const response = await fetch('https://zhblog.ru/api/v1/users/' + id, {
            headers: {
                'Cookie': cookie.toString()
            },
        })
        if (response.status == 404) {
            notFound()
        }
        if (!response.ok) {
            const error = await response.json()
            console.log(error)
            return false
        }
        const user = await response.json()
        return user
}
