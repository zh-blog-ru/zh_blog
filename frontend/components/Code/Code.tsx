'use client'

import React, { useState, useEffect } from 'react'
import s from './Code.module.css'
import { useResetCodeMutation } from '@/_redux/api/Api'

export default function Code({
    label,
    code,
    setCode,
    errors,
    email,
    disabled
}: {
    label: string,
    code: string,
    setCode: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
    errors: string[] | undefined,
    email: string,
    disabled: boolean
}) {
    const [resetCode, { isLoading }] = useResetCodeMutation()
    const [countdown, setCountdown] = useState(0)

    const handleResendCode = async () => {
        try {
            await resetCode().unwrap()
            setCountdown(30) // Устанавливаем таймер на 30 секунд после успешной отправки
        } catch (error) {
            console.error('Failed to resend code:', error)
        }
    }

    useEffect(() => {
        // Запускаем таймер при монтировании компонента
        setCountdown(30)
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [countdown])

    return (
        <div>
            <label
                htmlFor="code"
                className={s.label}
                style={errors ? { color: 'var(--ColorError)' } : undefined}
            >{label} <span>{email}</span></label>
            <div className={s.container}>
                <input
                    style={errors ? { border: '1.5px solid var(--ColorError)' } : undefined}
                    type="text"
                    name='code'
                    required
                    value={code}
                    maxLength={6}
                    minLength={6}
                    onChange={(e) => setCode(e)}
                    className={s.input}
                    autoFocus
                    disabled={disabled}
                />
                <ul className={s.errors}>
                    {errors ?
                        errors.map((error, index) => (
                            <li key={index}>
                                {error}
                            </li>
                        ))
                        : null}
                </ul>
            </div>
            <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading || countdown > 0}
                className={s.resendButton}
            >
                {isLoading
                    ? 'Отправка...'
                    : countdown > 0
                        ? `Повторная отправка через ${countdown} сек.`
                        : 'Отправить код повторно'}
            </button>
        </div>
    )
}