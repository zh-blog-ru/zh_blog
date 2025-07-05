import Link from 'next/link'
import React, { ReactNode } from 'react'
import { IoMdSettings } from 'react-icons/io'
import { FaUserCircle } from 'react-icons/fa'
import { MiniArticles } from './_components/MiniArticles'
import s from './User.module.css'
import { getUser } from '../../../../../../serverAction/getUser'
import { LocalizedRedirect } from '@/i18n/routes/LocalizedRedirect'
import { locales, LocaleType } from '@/i18n/locales'
import { notFound, redirect } from 'next/navigation'
import { getDictionary } from '@/i18n/getDictionary'
import { cookies } from 'next/headers'
import Image from 'next/image'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import ProfileImage from '../../../../../../components/ProfileImage/ProfileImage'

export default async function User({
    params
}: {
    params: Promise<{ locale: LocaleType, id: number }>;
}) {
    const { locale, id } = await params;
    const user = await getUser(id)
    if (!user) {
        redirect('/' + locale + ('/articles'))
    }
    if (!locales.includes(locale)) {
        notFound();
    }
    const dict = (await getDictionary(locale)).blog.profile
    return (
        <>

            <div className={s.user}>
                {user.isOwner ?
                    <LocalizedLink href={'/settings'} className={s.settings}>
                        <IoMdSettings />
                    </LocalizedLink>
                    : null}
                <div className={s.userData}>
                    <ProfileImage size={75} profile_picture_url={user.profile_picture_url} />
                    <div >
                        <p>{user.username}</p>
                        {user.isOwner ?
                            <p>{user.email}</p>
                            : null
                        }
                    </div>
                </div>
                <div className={s.line}></div>
                <div className={s.status}>
                    <p>
                        {dict.about_me}
                    </p>
                    <p>
                        {user.about_me ?? (user.isOwner ? dict.write_about_me : dict.not_about_me)}
                    </p>
                </div>
            </div>
            {user.isOwner ?
                <MiniArticles dict={dict.likes} user_id={id}/>
                : null
            }
            {/* <div className={s.comments}>
                {dict.comments.empty}
            </div> */}
        </>
    )
}
