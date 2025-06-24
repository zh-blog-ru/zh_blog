import { DictionaryType } from '@/i18n/getDictionary'
import React, { useState } from 'react'
import s from './DeleteAcc.module.css'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import { redirectTo } from '../../../../../../serverAction/RedirectTo'
import { useDeleteAccountMutation } from '@/_redux/api/Api'
export default function DeleteAcc({
    dict
}: {
    dict: DictionaryType['blog']['settings']
}) {
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const { errors, handleError, resetErrors } = useErrorHandler()
    const [deleteAcc, { isLoading }] = useDeleteAccountMutation()

    const handleDelete = () => {
        resetErrors()
        deleteAcc().unwrap()
            .then(() => {
                redirectTo('/articles', false)
            })
            .catch(err => {
                handleError(err)
            })
    }
    const handleCancel = () => {
        resetErrors()
        setIsDelete(true)
    }
    return (
        <>
            {isDelete ? (
                <>
                    <div className={s.filter} />
                    <div className={s.modal}>
                        <div className={s.deleteModal}>
                            <p>{dict.delete_text}</p>
                            <p>{dict.delete_warn}</p>
                            <div>
                                <button className={s.deleteButton} onClick={handleDelete} disabled={isLoading}>
                                    {dict.delete}
                                </button>
                                <button className={s.button}
                                    onClick={() => setIsDelete(false)}
                                >
                                    {dict.not_delete}
                                </button>
                            </div>
                            {errors.error ? (
                                <p className={s.error}>{errors.error}</p>
                            ) : null}
                        </div>
                    </div>
                </>
            ) : (
                <button className={s.deleteButton} type='button' onClick={handleCancel}>
                    {dict.delete}
                </button>
            )}
        </>
    )
}
