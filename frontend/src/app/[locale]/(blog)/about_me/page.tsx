import React from 'react'
import s from './page.module.css'
import js from './../../../../../public/javascript-logo.svg'
import react from './../../../../../public/react.svg'
import Image from 'next/image'
import Link from 'next/link'
import { LocaleType } from '@/i18n/locales'
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
  return {
    title: meta.title,
    description: meta.description
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
        <h1>Чуть-чуть обо мне</h1>
      </div>
    </div>
  )
}
