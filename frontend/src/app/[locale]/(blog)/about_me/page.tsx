import React from 'react'
import s from './page.module.css'
import js from './../../../../../public/javascript-logo.svg'
import react from './../../../../../public/react.svg'
import Image from 'next/image'
import Link from 'next/link'
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
  const meta = (await getDictionary(locale)).blog.about_me.meta
  let languages: { [key: string]: string } = {}
  locales.forEach((locale) => languages[locale] = `/${locale}/about_me`)
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL('https://zhblog.ru'),
    alternates: {
      canonical: `/${locale}/about_me`,
      languages
    }
  }
}

export default async function page({
  params
}: Props) {
  const { locale } = await params
  const dict = (await getDictionary(locale)).blog.about_me
  console.log('about me: ')
  return (
    <div>
      <div className={s.main}>
        <h2>Чуть-чуть обо мне</h2>
      </div>
    </div>
  )
}
