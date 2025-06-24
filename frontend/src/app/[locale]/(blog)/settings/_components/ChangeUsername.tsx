'use client'
import React, { ChangeEvent, useState } from 'react'
import s from './changeUsername.module.css'
import i from './styleByInput.module.css'
import { LuUserRound } from "react-icons/lu";
import { useLazyValidationUsernameQuery} from '@/_redux/api/Api';
import { FaCheck } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler';
import { useDebouncedCallback } from 'use-debounce';
import { DictionaryType } from '@/i18n/getDictionary';
export default function ChangeUsername({
    user_username,
    dict
}: {
    user_username: string,
    dict: DictionaryType['blog']['settings']['change_username']
}) {
    const [username, setUsername] = useState<string>(user_username)
    const [isOk, setIsOk] = useState<boolean>(false)
    const [trigger, { isSuccess, isLoading }] = useLazyValidationUsernameQuery({
    })
    const { errors, handleError, resetErrors } = useErrorHandler()
    const handleInputChange = useDebouncedCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            resetErrors()
            setIsOk(false)
            if (user_username !== e.target.value) {
                trigger({ username: e.target.value }).unwrap()
                    .then(() => {
                        setIsOk(true)
                    })
                    .catch(err => {
                        handleError(err)
                    })
            }
        }, 500)

    return (
        <div>
            <div className={`${s.username} ${i.inputs}`}>
                <div className={s.label}>
                    <label>{dict.label}</label>
                    {errors.username || errors.error ? (
                        <IoClose style={{ color: 'red' }} />
                    ) : null}

                    {isOk && !isLoading ? <FaCheck style={{ color: 'rgb(48, 155, 48)' }} /> : null}
                </div>
                <div>
                    <LuUserRound />
                    <input
                        style={errors.username || errors.error ? { border: '1.5px solid var(--ColorError)' } : undefined}
                        type="text"
                        name="username"
                        value={username}
                        maxLength={32}
                        minLength={5}
                        required
                        onChange={(e) => {
                            if (!/^[a-zA-Z0-9_]*$/.test(e.target.value)) {
                                return
                            }
                            setUsername(e.target.value)
                            handleInputChange(e)
                        }}
                        className={s.input}
                    />
                </div>
            </div>
            {errors.username || errors.error ? (
                <p className={s.error}>{errors.username || errors.error}</p>
            ) : null}
        </div>
    )
}
