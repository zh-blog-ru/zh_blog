'use client'
import React, { useState } from 'react'
import { useLoginUserMutation } from '@/_redux/api/Api'
import s from './form.module.css'
import { redirectTo } from '../../../../../../serverAction/RedirectTo'
import { LoginUserDto } from '@/_redux/api/dto/LoginUserDto.dto'
import { DictionaryType } from '@/i18n/getDictionary'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import Modal from './Modal'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import Username from '../../../../../../components/Username/Username'
import Password from '../../../../../../components/Password/Password'


export default function Form({
    dict
}: {
    dict: DictionaryType['blog']['login']
}) {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { errors, handleError, resetErrors } = useErrorHandler()
    const [loginUser, {
        isLoading
    }] = useLoginUserMutation()

    const LoginAction = (e: FormData) => {
        resetErrors()
        const body: LoginUserDto = {
            username,
            password,
        }
        loginUser(body)
            .unwrap()
            .then(
                ({ id }) => {
                    const redirect_url = sessionStorage.getItem('redirect_url')
                    sessionStorage.removeItem('redirect_url')
                    if (redirect_url) {
                        redirectTo(redirect_url, true)
                    } else {
                        redirectTo('/profile/' + id)
                    }
                }
            )
            .catch(
                (err) => {
                    handleError(err)
                }
            )
    }
    return (
        <>
            <form className={s.form} action={LoginAction}>
                <Username label={dict.username} username={username} setUsername={setUsername} errors={errors['username']}/>
                <Password label={dict.password} password={password} setPassword={setPassword} errors={errors['password']}/>
                <button disabled={isLoading}>
                    {dict.button}
                </button>
            </form>
            <div className={s.metaData}>
                <p>{dict.meta_p}<span>
                    <LocalizedLink href={'/reg'}>{dict.meta_a}</LocalizedLink>
                </span></p>
                <Modal dict={dict.modal} />
                {errors.error ? (
                    <p className={s.error}>{errors.error}</p>
                ) : null}
            </div>
        </>
    )
}