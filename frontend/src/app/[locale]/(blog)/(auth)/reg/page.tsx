import s from './page.module.css'
import Form from './Form'
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
  const meta = (await getDictionary(locale)).blog.reg.meta
  return {
    title: meta.title,
    description: meta.description
  }
}

export default async function page({
  params
}: Props) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)).blog.reg
  return (
    <div className={s.main}>
      <h3>
        {dict.h3}
      </h3>
        <Form dict={dict} />
    </div>
  )
}
