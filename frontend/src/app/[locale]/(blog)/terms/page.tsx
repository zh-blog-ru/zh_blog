import { LocaleType } from '@/i18n/locales';
import s from '../../../../../file/politic/Politic.module.css';
import path from 'path';
import { readFile } from 'fs/promises';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';

type Props = {
  params: Promise<{ locale: LocaleType }>;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { locale } = await params
  const meta = (await getDictionary(locale)).blog.terms.meta
  return {
    title: meta.title,
    description: meta.description
  }
}


const PrivacyPolicy = async ({
  params
}: Props) => {
  const { locale } = await params
  const effectiveDate = "[Дата]"; // Замените на актуальную дату
  const blogName = "Zh Blog"; // Замените на название вашего блога
  const blogAddress = "[Адрес Блога]"; // Замените на адрес вашего блога
  const yourName = "[Ваше Имя]"; // Замените на ваш адрес, если необходимо
  console.log('term')

  const filePath = path.join(process.cwd(), `file/politic/terms`, `terms_${locale}.html`);
  let htmlContent = await readFile(filePath, 'utf8');
  htmlContent = htmlContent.replace(/\{effectiveDate\}/g, effectiveDate);
  htmlContent = htmlContent.replace(/\{blogName\}/g, blogName);
  htmlContent = htmlContent.replace(/\{blogAddress\}/g, blogAddress);
  htmlContent = htmlContent.replace(/\{yourName\}/g, yourName);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} className={s.container} />
  );
};

export default PrivacyPolicy;