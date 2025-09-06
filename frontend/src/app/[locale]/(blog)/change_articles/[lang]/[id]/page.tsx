// page.tsx (серверный компонент)
import { LocaleType } from '@/i18n/locales'
import React from 'react'
import { IsAdmin } from '../../../../../../../serverAction/IsAdmin'
import s from './page.module.css'
import Time from '../../../articles/_components/Time'
import ChangeImage from './_components/ChangeImage'
import Theme from './_components/Theme'
import Form from './_components/Form'
import { getInfoArticle } from '../../../../../../../serverAction/getInfoArticle'
import AddImages from './_components/AddImages'
import Image from 'next/image'

type Props = {
    params: Promise<{ locale: LocaleType, lang: LocaleType, id: number }>
}

export default async function Page({
    params
}: Props) {
    await IsAdmin()
    const { lang, id } = await params
    const article = await getInfoArticle(id, lang)

    return (
        <div className={s.main}>
            <h2>Редактирование статьи {lang.toUpperCase()}</h2>

            <Form
                lang={lang}
                id={id}
                className={s.articleContainer}
                initialData={{
                    title: article.title,
                    resume: article.resume,
                    content: article.content,
                    themes: article.theme,
                    time_to_read: article.time_to_read,
                    img: article.img,
                    is_active: article.is_active // Добавляем начальное состояние активности
                }}
            >
                <div className={s.formGroup}>
                    <label htmlFor="is_active">Статья активна:</label>
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        defaultChecked={article.is_active}
                        className={s.toggle}
                    />
                </div>

                <ChangeImage default_url={article.img} />

                <div className={s.formGroup}>
                    <label htmlFor="title">Заголовок</label>
                    <input
                        name='title'
                        type="text"
                        id="title"
                        defaultValue={article.title}
                        className={s.inputField}
                    />
                </div>

                <div className={s.formGroup}>
                    <label htmlFor="resume">Краткое описание</label>
                    <textarea
                        name='resume'
                        id="resume"
                        defaultValue={article.resume}
                        className={s.textareaField}
                        rows={3}
                    />
                </div>

                <div className={s.formGroup}>
                    <label htmlFor="content">Содержание</label>
                    <textarea
                        name='content'
                        id="content"
                        defaultValue={article.content}
                        className={s.textareaField}
                        rows={10}
                    />
                </div>

                <div className={s.metaData}>
                    <Theme initialThemes={article.theme} />

                    <div className={s.metaItem}>
                        <label>Время чтения:</label>
                        <div className={s.timeInputContainer}>
                            <input
                                name='time_to_read'
                                type="number"
                                defaultValue={article.time_to_read}
                                className={s.timeInput}
                            />
                            <span>мин</span>
                        </div>
                    </div>

                    <div className={s.metaItem}>
                        <span>Обновлено:</span>
                        <Time date={new Date(article.update_at)} />
                    </div>
                </div>
            </Form>

            <AddImages article_id={id} images_list={article.images}/>
        </div>
    )
}