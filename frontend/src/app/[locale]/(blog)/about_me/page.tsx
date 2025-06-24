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
        <p>
          Всем привет, на этой странице я расскажу о себе, и о пути, который прошел,
          чтобы иметь знания для написание чего-то, что хоть чуть-чуть похоже на сайт.
        </p>
        <div className={s.paths}>
          <div>
            <p>
              Я начал свой путь с фронтенда, многие начинающие фронтенд разработчики
              начинаюти с html и css, но я, не обладая нужным iq, решил, что мне это не надо
              и начал свою путь с JavaScript. <br />
              Два с половиной месяца чтения
              <Link href='https://learn.javascript.ru/'> learn.javascript.ru </Link>
              и я уже мнил себя гением, миллиардером, плейбоем, филантропом, и думал, что
              скоро выкуплю Google. <br />
              Но как это часто бывает - при изучении чего-то нового, мы понимаем
              насколько мир разнообразен и насколько мы глупы.
            </p>
            <Image src={js} alt="js" width={35} />
          </div>
          <div>
            <p>
              После JavaScript я, точно не помню как, но я начал изучение React.
              Вначале я смотрел видео
            </p>
            <Image src={react} alt="react" width={35} />
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}
