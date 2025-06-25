import React from 'react'
import s from './page.module.css'
import { getCurrentUser} from '../../../../../serverAction/getCurrentUser'
import { notFound, redirect } from 'next/navigation'
import Settings from './_components/Settings'
import { locales, LocaleType } from '@/i18n/locales'
import { getDictionary } from '@/i18n/getDictionary'
import { Metadata } from 'next'


type Props = {
    params: Promise<{ locale: LocaleType }>;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { locale } = await params
    const meta = (await getDictionary(locale)).blog.settings.meta
    return {
        title: meta.title,
        description: meta.description
    }
}

export default async function page({
    params
}: Props) {
    console.log('settings')
    const user = await getCurrentUser('me')
    if (!user) {
        redirect('/articles')
    }
    const { locale } = await params;
    if (!locales.includes(locale)) {
        notFound();
    }
    const dict = (await getDictionary(locale)).blog.settings
    return (
        <div className={s.main}>
            <h2>
                {dict.h2}
            </h2>
            <Settings user={user} dict={dict} />
        </div>
    )
}
