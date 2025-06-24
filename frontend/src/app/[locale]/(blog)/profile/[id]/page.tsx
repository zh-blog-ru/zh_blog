import React, { Suspense } from 'react'
import s from './page.module.css'
import { locales, LocaleType } from '@/i18n/locales'
import User from './User'
import { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'

type Props = {
    params: Promise<{ locale: LocaleType, id: number }>;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { locale } = await params
    const meta = (await getDictionary(locale)).blog.profile.meta
    return {
        title: meta.title,
        description: meta.description
    }
}

export default function page({
    params
}: Props) {
    console.log('profile')

    return (
        <div className={s.main}>
            {/* <Suspense fallback={<div>LOAD....</div>}> */}
            <User params={params} />
            {/* </Suspense> */}
        </div>
    )
}
