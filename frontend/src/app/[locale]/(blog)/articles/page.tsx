import React from 'react'
import s from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { LocaleType } from '@/i18n/locales'
import { getDictionary } from '@/i18n/getDictionary'
import Time from './_components/Time'
import { getArticles } from '../../../../../serverAction/getArticles'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ locale: LocaleType }>
}
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { locale } = await params
  const meta = (await getDictionary(locale)).blog.articles.meta
  return {
    title: meta.title,
    description: meta.description
  }
}

export const revalidate = 3600

export default async function BlogArticlesPage({
  params
}: Props) {
  const { locale } = await params;
  console.log('articles')

  const dict = (await getDictionary(locale)).blog.articles
  let articles = await getArticles(locale)
  return (
    <div className={s.main}>
      <h2>
        {dict.h2}
      </h2>
      {articles.length !== 0 ?
        <div className={s.articles}>
          {articles.map((item, index) => (
            <div key={index} className={s.article}>
              <LocalizedLink href={'/articles/' + item.id}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                  <Image src={item.img} alt='photo' fill
                    style={{ objectFit: 'cover' }} sizes="(min-width: 768px) 100vw, 50vw" priority />
                </div>
              </LocalizedLink>
              <div className={s.data}>
                <div>
                  <h3>
                    {item.title}
                  </h3>
                  <p>
                    {item.resume}
                  </p>
                </div>
                <div className={s.metaData}>
                  <div className={s.themes}>
                    {item.theme.map((theme, index) => (
                      <Link href={'/theme/' + theme} key={index}>
                        {theme}
                      </Link>
                    ))}
                  </div>
                  <div className={s.time_info}>
                    <span>{item.time_to_read} min</span>
                    <span>
                      <Time date={new Date(item.create_at)} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        : <p>
          {dict.not_articles}
        </p>}
    </div>
  )
}