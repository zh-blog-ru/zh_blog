import React, { useState } from 'react'
import ProfileImage from '../../../../../../../components/ProfileImage/ProfileImage'
import { CommentsInterfaces } from '../../../../../../../Interfaces/CommentsInterface'
import Time from '../../_components/Time'
import s from './Comment.module.css'
import CommentForm from '../../../../../../../components/CommentForm/CommentForm'
import { useErrorHandler } from '../../../../../../../hooks/useErrorHandler'
import { useDeleteCommetsMutation, useUpdateCommetsMutation } from '@/_redux/api/Api'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import { DictionaryType } from '@/i18n/getDictionary'

type Props = {
    comment: CommentsInterfaces,
    ref: React.RefObject<HTMLDivElement | null> | null,
    article_id: number,
    dict: DictionaryType['blog']['articles']['id']['buttons']
}

export default React.memo(function Comment({
    comment,
    ref,
    article_id,
    dict
}: Props) {
    const [isChange, setIsChange] = useState<boolean>(false)
    const [text, setText] = useState<string>(comment.data)
    const [count, setCount] = useState<number>(comment.data.length)
    const [updateComment, { }] = useUpdateCommetsMutation()
    const [deleteComment, { }] = useDeleteCommetsMutation()
    const { errors, handleError, resetErrors } = useErrorHandler()
    const resetChange = () => {
        setIsChange(false)
        resetErrors()
        setText(comment.data)
    }
    const handleChange = () => {
        updateComment({
            comment: text,
            comment_id: comment.id,
            article_id
        }).unwrap()
            .then(() => {
                resetChange()
            })
            .catch(err => {
                handleError(err)
            })
    }
    return (
        <div className={s.comment} ref={ref}>
            <div>
                <LocalizedLink href={`/profile/${comment.user_id}`} style={{ color: 'unset' }}>
                    <ProfileImage size={50} profile_picture_url={comment.profile_picture_url} />
                </LocalizedLink>
            </div>
            <div className={s.data}>
                <div>
                    <p>{comment.username}</p>
                    <span><Time date={new Date(comment.create_at)} /></span>
                </div>
                <div>
                    {comment.isOwner ?
                        <>
                            {isChange ?
                                <button onClick={() => deleteComment({ article_id, comment_id: comment.id })}>
                                    {dict.delete.toLowerCase()}
                                </button>
                                : null
                            }
                            <button onClick={() => setIsChange(a => !a)}>
                                {dict.update.toLowerCase()}
                            </button>
                        </>
                        : null
                    }
                </div>
            </div>

            <div className={s.text}>
                {
                    isChange ?
                        <>
                            <CommentForm text={text} setText={setText} setCount={setCount} errors={errors.comment} label={dict.label} />
                            <div className={s.action}>
                                <div>
                                    <button onClick={handleChange}>
                                        {dict.update}
                                    </button>
                                    <button onClick={resetChange}>
                                        {dict.cancel}
                                    </button>
                                    {errors.error ? (
                                        <p className={s.error}>{errors.error}</p>
                                    ) : null}
                                </div>
                                <span>{count} / 512</span>
                            </div>
                        </>
                        :
                        <p>
                            {comment.data}
                        </p>
                }


            </div>
        </div >
    )
})