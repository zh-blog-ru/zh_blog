import { locales, LocaleType } from '@/i18n/locales';
import React from 'react'
import { ArticleInterface } from '../../../../../../Interfaces/ArticleInterface';
import Image from 'next/image';
import s from './page.module.css'
import { Marked } from 'marked';
import hljs from 'highlight.js'
import { markedHighlight } from 'marked-highlight';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import ListComments from './_components/ListComments';
import Likes from './_components/Likes';
import { getDictionary } from '@/i18n/getDictionary';
import { getArticle } from '../../../../../../serverAction/getArticle';
import Link from 'next/link';
import AddComment from './_components/AddComment';
import { getArticles } from '../../../../../../serverAction/getArticles';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: number, locale: LocaleType }>;
}
export const revalidate = 3600
export const dynamicParams = true
export async function generateStaticParams() {
    const articles: Omit<ArticleInterface, 'content'>[] = await getArticles('ru')
    const paths = []
    for (const locale of locales) {
        for (const article of articles) {
            paths.push({
                locale: locale,
                id: article.id.toString(), // Убедитесь, что id - строка
            });
        }
    }
    return paths
    // return [{ locale: 'en', id: '1' }, { locale: 'ru', id: '1' }]
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
    const { locale, id } = await params

    // fetch data
    const meta = await getArticle(id, locale)


    // optionally access and extend (rather than replace) parent metadata

    return {
        title: meta.title,
        description: meta.resume
    }
}

export default async function page({
    params
}: Props) {
    const { id, locale } = await params;
    console.log('articles_id ', id)
    const dict = (await getDictionary(locale)).blog.articles.id
    const article = await getArticle(id, locale)
    const marked = new Marked(
        markedHighlight({
            emptyLangClass: 'hljs',
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        })
    );
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const html = purify.sanitize(await marked.parse(article.content));
    return (
        <div className={s.page}>
            <div className={s.img_container}>
                <Image src={article.img} fill alt='' priority style={{ objectFit: 'cover', objectPosition: '50% 25%' }} />
            </div>
            <div className={s.main}>
                <main className={s.text}>
                    <h1>
                        {article.title}
                    </h1>
                    <div dangerouslySetInnerHTML={{ __html: html }} className={s.markdown}>
                    </div>
                </main>
                <Likes article_id={id} error_message={dict.error_message} />
                <div className={s.comments}>
                    <h2>
                        {dict.h2}
                    </h2>
                    <AddComment article_id={id} button={dict.button} />
                    <ListComments article_id={id} no_comments={dict.no_comments} />
                </div>
            </div>
        </div>
    )
}


// layout, i18n 