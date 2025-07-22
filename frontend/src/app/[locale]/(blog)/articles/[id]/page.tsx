import { locales, LocaleType } from '@/i18n/locales';
import React from 'react'
import { ArticleInterface } from '../../../../../../Interfaces/ArticleInterface';
import Image from 'next/image';
import s from './page.module.css'
import { Marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import { markedHighlight } from 'marked-highlight';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import ListComments from './_components/ListComments';
import Likes from './_components/Likes';
import { getDictionary } from '@/i18n/getDictionary';
import { getArticle } from '../../../../../../serverAction/getArticle';
import AddComment from './_components/AddComment';
import { getArticles } from '../../../../../../serverAction/getArticles';
import { Metadata } from 'next';
import Syntax from './Syntax';

type Props = {
    params: Promise<{ id: number, locale: LocaleType }>;
}
export const dynamicParams = true
export async function generateStaticParams() {
    const articles = await getArticles()
    const paths = []
    for (const article of articles) {
        paths.push({
            locale: article.locale,
            id: article.id.toString(), // Убедитесь, что id - строка
        });
    }
    return paths
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
    const { locale, id } = await params

    // fetch data
    const meta = await getArticle(id, locale)

    let languages: { [key: string]: string } = {}
    locales.forEach((locale) => languages[locale] = `/${locale}/articles/${id}`)
    // optionally access and extend (rather than replace) parent metadata

    return {
        title: meta.title,
        description: meta.resume,
        metadataBase: new URL('https://zhblog.ru'),
        alternates: {
            canonical: `/articles/${id}`,
            languages
        }
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
                hljs.registerLanguage('typescript', typescript);
                hljs.registerLanguage('shell', bash);
                hljs.registerLanguage('bash', bash);
                hljs.registerLanguage('json', json);
                hljs.registerLanguage('plaintext', plaintext);
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                const formanCode = hljs.highlight(code, { language }).value;
                return formanCode;
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
                    <Syntax>
                        <div dangerouslySetInnerHTML={{ __html: html }} className={s.markdown}>
                        </div>
                    </Syntax>

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