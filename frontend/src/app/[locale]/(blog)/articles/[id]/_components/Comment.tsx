import React, { useState } from 'react'
import ProfileImage from '../../../../../../../components/ProfileImage/ProfileImage'
import { CommentsInterfaces } from '../../../../../../../Interfaces/CommentsInterface'
import Time from '../../_components/Time'
import s from './Comment.module.css'
import CommentForm from '../../../../../../../components/CommentForm/CommentForm'
import { useErrorHandler } from '../../../../../../../hooks/useErrorHandler'
import { useUpdateCommetsMutation } from '@/_redux/api/Api'

type Props = {
    comment: CommentsInterfaces,
    ref: React.RefObject<HTMLDivElement | null> | null,
    article_id: number
}

export default React.memo(function Comment({
    comment,
    ref,
    article_id
}: Props) {
    console.log(comment)
    const [isChange, setIsChange] = useState<boolean>(false)
    const [text, setText] = useState<string>(comment.data)
    const [count, setCount] = useState<number>(comment.data.length)
    const [updateComment, { }] = useUpdateCommetsMutation()
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
                <ProfileImage size={50} profile_picture_url={comment.profile_picture_url} />
            </div>
            <div className={s.data}>
                <div>
                    <p>{comment.username}</p>
                    <span><Time date={new Date(comment.create_at)} /></span>
                </div>
                {comment.isOwner ?
                    <button onClick={() => setIsChange(a => !a)}>
                        изменить
                    </button>
                    : null
                }
            </div>

            <div className={s.text}>
                {
                    isChange ?
                        <>
                            <CommentForm text={text} setText={setText} setCount={setCount} errors={errors.comment} label={'Написать комментарий'} />
                            <div className={s.action}>
                                <div>
                                    <button onClick={handleChange}>
                                        Изменить
                                    </button>
                                    <button onClick={resetChange}>
                                        Отменить
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
        </div>
    )
})