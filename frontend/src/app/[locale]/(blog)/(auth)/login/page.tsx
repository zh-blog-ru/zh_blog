import s from './page.module.css'
import Form from './Form'
import { locales, LocaleType } from '@/i18n/locales'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/i18n/getDictionary'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: LocaleType }>;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { locale } = await params
  const meta = (await getDictionary(locale)).blog.login.meta
  let languages: { [key: string]: string } = {}
  locales.forEach((locale) => languages[locale] = `/${locale}/login`)
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL('https://zhblog.ru'),
    alternates: {
      canonical: `/${locale}/login`,
      languages
    }
  }
}

export default async function page({
  params
}: Props) {
  const { locale } = await params;
  if (!locales.includes(locale)) {
    notFound();
  }
  const dict = (await getDictionary(locale)).blog.login
  return (
    <div className={s.main}>
      <h3>
        {dict.h3}
      </h3>
      <Form dict={dict} />
    </div>
  )
}
