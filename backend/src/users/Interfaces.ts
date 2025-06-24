import { UserInterfaces } from "interfaces/UserInterfaces";


export type BaseUserData = Pick<UserInterfaces,
    'id' | 'username' | 'profile_picture_url' | 'about_me'> & { isOwner: boolean }

export type PrivateUserInterfaces = BaseUserData & { email: string }
export type PublicUserInterfaces = BaseUserData & { email?: never }