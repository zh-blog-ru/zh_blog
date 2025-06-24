'use client'
import { invalidateTags, useDeleteLikesMutation, useGetLikesByIdQuery, useSetLikesMutation } from '@/_redux/api/Api'
import React, { useState } from 'react'
import s from './Likes.module.css'
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { usePathname, useRouter } from 'next/navigation';
import useLocalizedRouter from '@/i18n/routes/LocalizedUseRouter';

export default function Likes({
    article_id,
    error_message
}: {
    article_id: number,
    error_message: string
}) {
    const { data, isError } = useGetLikesByIdQuery({ article_id })
    const [setLikes, { isLoading: isLoadingLikes }] = useSetLikesMutation()
    const [deleteLikes, { isLoading: isLoadingDelete }] = useDeleteLikesMutation()
    const [error, setError] = useState<string | null>(null)
    const router = useLocalizedRouter()
    const pathname = usePathname()
    if (!data) {
        return (
            <div className={s.likes}>
                <button>
                    <BiLike />
                    0
                </button>
                <button>
                    <BiDislike />
                    0
                </button>
            </div>
        )
    }
    const likes = data[0]
    const disLikes = data[1]
    const setLikesFunc = (article_id: number, isLike: boolean) => {
        setLikes({ article_id, isLike })
            .unwrap()
            .catch((e) => {
                if (e.status === 401) {
                    sessionStorage.setItem('redirect_url', pathname)
                    router.push(`/login`)
                } else {
                    setError(error_message)
                    setTimeout(() => {
                        setError(null);
                    }, 3000);
                }
            })
    }
    const deleteLikesFunc = (article_id: number) => {
        deleteLikes({ article_id })
            .unwrap()
            .catch((e) => {
                if (e.status === 401) {
                    sessionStorage.setItem('redirect_url', pathname)
                    router.push(`/login`)

                } else {
                    setError(error_message)
                    setTimeout(() => {
                        setError(null);
                    }, 3000);
                }
            })
    }

    return (
        <>
            {error || isError ? <p className={s.error}>
                error
            </p> : null}
            <div className={s.likes}>
                <button
                    onClick={() => {
                        likes.is_current_user ?
                            deleteLikesFunc(article_id) :
                            setLikesFunc(article_id, true)
                    }}
                    disabled={isLoadingLikes || isLoadingDelete}
                >
                    {
                        likes.is_current_user ?
                            <BiSolidLike />
                            :
                            <BiLike />
                    }
                    {likes.count}
                </button>
                <button
                    onClick={() => {
                        disLikes.is_current_user ?
                            deleteLikesFunc(article_id) :
                            setLikesFunc(article_id, false)
                    }}
                    disabled={isLoadingLikes || isLoadingDelete}
                >
                    {
                        disLikes.is_current_user ?
                            <BiSolidDislike />
                            :
                            <BiDislike />
                    }
                    {disLikes.count}
                </button>
            </div>
        </>
    )
}
