import path from 'path';
import { readFileSync } from 'fs';
import { LocaleType } from '@/i18n/locales';
import s from '../../../../../file/politic/Politic.module.css';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';


type Props = {
  params: Promise<{ locale: LocaleType }>;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { locale } = await params
  const meta = (await getDictionary(locale)).blog.privacy.meta
  return {
    title: meta.title,
    description: meta.description
  }
}


const Name = {
  ru: 'Жуков Вадим',
  en: 'Zhukov Vadim'
}

const PrivacyPolicy = async ({
  params
}: Props) => {
  const { locale } = await params
  console.log('privacy')
  const effectiveDate = "25.06.2025"; // Замените на актуальную дату
  const blogName = "Zh Blog"; // Замените на название вашего блога
  const blogAddress = "zhblog.ru"; // Замените на адрес вашего блога
  const yourName = Name[locale]; // Замените на ваш адрес, если необходимо
  const yourEmail = "zhblog.ru@yandex.ru"; // Замените на ваш адрес, если необходимо


  const filePath = path.join(process.cwd(), `file/politic/privacy`, `privacy_${locale}.html`);
  let htmlContent = readFileSync(filePath, 'utf8');
  htmlContent = htmlContent.replace(/\{effectiveDate\}/g, effectiveDate);
  htmlContent = htmlContent.replace(/\{blogName\}/g, blogName);
  htmlContent = htmlContent.replace(/\{blogAddress\}/g, blogAddress);
  htmlContent = htmlContent.replace(/\{yourName\}/g, yourName);
  htmlContent = htmlContent.replace(/\{yourEmail\}/g, yourEmail);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} className={s.container} />
  );
};

export default PrivacyPolicy;