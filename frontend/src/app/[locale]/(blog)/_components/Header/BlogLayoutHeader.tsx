import { Irish_Grover } from 'next/font/google'
import React from 'react'
import s from './BlogLayoutHeader.module.css'
import { LocaleType } from '@/i18n/locales';
import { getDictionary } from '@/i18n/getDictionary';
import AuthHeader from './AuthHeader';
import LocalizedLink from '@/i18n/routes/LocalizedLink';



const irish_grover = Irish_Grover({
  weight: '400',
  subsets: ['latin'],
  preload: false,
})
export default async function BlogLayoutHeader({ params }: { params: Promise<{ locale: LocaleType }> }) {
  const { locale } = await params
  const dict = (await getDictionary((locale))).blog.blogLayout.header


  return (
    <div className={s.main}>
      <div className={s.logoBlock}>
        <LocalizedLink href={'/articles'} className={irish_grover.className}>
          ZH Blog
        </LocalizedLink>
        <nav className={s.navigation}>
          <LocalizedLink href={'/about_me'}>{dict.navigation['about me']}</LocalizedLink>
          <LocalizedLink href={'/articles'}>{dict.navigation.articles}</LocalizedLink>
        </nav>
      </div>
      <AuthHeader dict={dict} />
    </div>
  )
}
