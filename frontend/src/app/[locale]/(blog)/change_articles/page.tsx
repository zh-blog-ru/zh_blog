import { LocaleType } from '@/i18n/locales';
import React from 'react'
import { getInfoArticles } from '../../../../../serverAction/getInfoArticles';
import Image from 'next/image';
import LocalizedLink from '@/i18n/routes/LocalizedLink';
import Time from '../articles/_components/Time';
import s from './page.module.css'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IsAdmin } from '../../../../../serverAction/IsAdmin';

type Props = {
  params: Promise<{ locale: LocaleType }>
}

export default async function Page({
  params
}: Props) {
  await IsAdmin()
  const { locale } = await params;
  const articles = await getInfoArticles()
  if (!articles) {
    redirect('/' + locale + ('/articles'))
  }
  return (
    <div className={s.main}>
      <h2>
        Изменить статьи
      </h2>
      {articles.length !== 0 ?
        <div className={s.articles}>
          {articles.map((item, index) => (
            <div
              key={index}
              className={s.article}
              style={item.is_active ? undefined : {border: '3px solid red'}}
            >
              <LocalizedLink href={`/change_articles/${item.locale}/${item.id}`} prefetch={false}>
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
                      // <Link href={'/theme/' + theme} key={index}>
                      <span key={index}>
                        {theme}
                      </span>
                      // </Link>
                    ))}
                  </div>
                  <div className={s.time_info}>
                    <span>{item.time_to_read} min</span>
                    <span>
                      <Time date={new Date(item.update_at)} />
                    </span>
                  </div>
                </div>
              </div>
              <div className={s.change}>
                <LocalizedLink href={`/change_articles/${item.locale}/${item.id}`}>
                  ИЗМЕНИТЬ СТАТЬЮ {item.locale}
                </LocalizedLink>
              </div>
            </div>
          ))}
        </div>
        : <p>
          Статей нема
        </p>}
    </div>
  )
}
