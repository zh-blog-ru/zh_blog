'use client'
import React, { useRef, useState } from 'react'
import s from './AddComment.module.css'
import { useSetCommetsMutation } from '@/_redux/api/Api'
import { usePathname } from 'next/navigation'
import useLocalizedRouter from '@/i18n/routes/LocalizedUseRouter'
import CommentForm from '../../../../../../../components/CommentForm/CommentForm'
import { useErrorHandler } from '../../../../../../../hooks/useErrorHandler'

export default function AddComment({
    article_id,
    button
}: {
    article_id: number,
    button: string
}) {
    const [setComments, { isLoading, isError }] = useSetCommetsMutation()
    const [text, setText] = useState<string>('')
    const [count, setCount] = useState<number>(0)
    const { errors, handleError, resetErrors } = useErrorHandler()
    const router = useLocalizedRouter()
    const pathname = usePathname()

    const handleSubmit = () => {
        resetErrors()
        setComments({
            article_id,
            comment: text
        })
            .unwrap()
            .then(() => {
                setText('')
                setCount(0)
            })
            .catch((err) => {
                if (err.status === 401) {
                    sessionStorage.setItem('redirect_url', pathname)
                    router.push(`/login`)
                } else {
                    handleError(err)
                }

            })
    }

    return (
        <div className={s.main}>
            <CommentForm text={text} setText={setText} setCount={setCount} errors={errors.comment} label={'Написать комментарий'} />
            <div className={s.meta}>
                <div>
                    <button onClick={handleSubmit}
                        disabled={isLoading}>
                        {button}
                    </button>
                    {errors.error ? (
                        <p className={s.error}>{errors.error}</p>
                    ) : null}
                </div>
                <span>{count} / 512</span>
            </div>
        </div >
    )
}
