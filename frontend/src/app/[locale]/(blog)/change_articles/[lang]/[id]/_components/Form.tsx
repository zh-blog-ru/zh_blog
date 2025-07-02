// Form.tsx (клиентский компонент)
'use client'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import React from 'react'
import s from './Form.module.css'
import { useChangeArticleMutation } from '@/_redux/api/Api'
import { LocaleType } from '@/i18n/locales'
import { redirectTo } from '../../../../../../../../serverAction/RedirectTo'
import useLocalizedRouter from '@/i18n/routes/LocalizedUseRouter'
interface FormProps {
    className?: string
    children: React.ReactNode,
    lang: LocaleType,
    id: number,
    initialData: {
        title: string
        resume: string
        content: string
        themes: string[]
        time_to_read: number
        img?: string,
        is_active: boolean
    }
}

export default function Form({ className, children, initialData, lang, id }: FormProps) {
    const [ChangeArticle, { }] = useChangeArticleMutation()
    const router = useLocalizedRouter()
    const onSubmit = async (data: FormData) => {
        const formData = {
            theme: data.getAll('themes') as string[],
            content: data.get('content') as string,
            is_active: (data.get('is_active') !== null) as boolean,
            title: data.get('title') as string,
            resume: data.get('resume') as string,
            time_to_read: Number(data.get('time_to_read')),
            img: data.get('img') as string | undefined
        }
        // Сравниваем с исходными данными
        const changes: Partial<typeof formData> = {}

        if (JSON.stringify(formData.theme) !== JSON.stringify(initialData.themes)) {
            changes.theme = formData.theme
        }
        if (formData.content !== initialData.content) {
            changes.content = formData.content
        }
        if (formData.title !== initialData.title) {
            changes.title = formData.title
        }
        if (formData.is_active !== initialData.is_active) {
            changes.is_active = formData.is_active
        }
        if (formData.resume !== initialData.resume) {
            changes.resume = formData.resume
        }
        if (formData.time_to_read !== initialData.time_to_read) {
            changes.time_to_read = formData.time_to_read
        }
        if (formData.img && formData.img !== initialData.img) {
            changes.img = formData.img
        }

        if (Object.keys(changes).length > 0) {
            ChangeArticle({
                ...changes, id, locale: lang,
            }).unwrap()
                .then(() => {
                    // redirectTo(`/change_articles/${lang}/${id}`, false)
                    router.refresh()
                })
            console.log('Измененные данные:', changes)
            // Здесь можно отправить changes на сервер
        } else {
            console.log('Нет изменений')
        }
    }

    return (
        <form className={className} action={onSubmit}>
            {children}
            <div className={s.actions}>
                <button type="submit" className={s.saveButton}>Сохранить изменения</button>
                <LocalizedLink href={`/change_articles`} className={s.cancelButton}>
                    Отмена
                </LocalizedLink>
            </div>
        </form>
    )
}