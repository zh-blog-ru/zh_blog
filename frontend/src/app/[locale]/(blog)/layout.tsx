import React from 'react'
import s from './layout.module.css'
import BlogLayoutHeader from './_components/Header/BlogLayoutHeader'
import BlogLayoutFotter from './_components/BlogLayoutFotter'
import { LocaleType } from '@/i18n/locales'



export default function Layout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ locale: LocaleType }>
}) {
    return (
        <div className={s.blogLayout}>
            <BlogLayoutHeader params={params} />
            {children}
            <BlogLayoutFotter params={params} />
        </div>
    )
}
