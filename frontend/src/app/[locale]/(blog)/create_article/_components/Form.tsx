// Form.tsx (клиентский компонент)
'use client'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import React from 'react'
import s from './Form.module.css'
import { useAddArticlesMutation, useChangeArticleMutation } from '@/_redux/api/Api'
import { redirectTo } from '../../../../../../serverAction/RedirectTo'
import useLocalizedRouter from '@/i18n/routes/LocalizedUseRouter'
interface FormProps {
    className?: string
    children: React.ReactNode,
}

export default function Form({ className, children }: FormProps) {
    const [ChangeArticle, { }] = useAddArticlesMutation()
    const router = useLocalizedRouter()
    const onSubmit = async (data: FormData) => {
        const formData = {
            theme: data.getAll('themes') as string[],
            time_to_read: Number(data.get('time_to_read')),
            img: data.get('img') as string
        }
        console.log(formData.time_to_read)
        ChangeArticle({
            theme: formData.theme,
            time_to_read: formData.time_to_read,
            img: formData.img,
        }).unwrap()
        .then(()=>{
            router.push('/change_articles')
        })
        
    }

    return (
        <form className={className} action={onSubmit}>
            {children}
            <div className={s.actions}>
                <button type="submit" className={s.saveButton}>Создать статью</button>
                <LocalizedLink href={`/articles`} className={s.cancelButton}>
                    Отмена
                </LocalizedLink>
            </div>
        </form>
    )
}