'use client'
import React, {  useCallback, useRef, useState } from 'react'
import { useSendCodeRegistrationMutation } from '@/_redux/api/Api'
import s from './form.module.css'
import Modal from './Modal'
import { DictionaryType } from '@/i18n/getDictionary'
import Email from '../../../../../../components/Email/Email'
import Username from '../../../../../../components/Username/Username'
import Password from '../../../../../../components/Password/Password'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import PrivacyCheckbox from './PrivacyCheckbox'
import YandexCaptcha, { CaptchaHandle } from '../../../../../../components/Captcha/YandexCaptcha'
import Captcha from '../../../../../../components/Captcha/Captcha'

declare global {
    interface Window {
        turnstile: any;
    }
}

interface FormProps {
    dict: DictionaryType['blog']['reg']
}

export default function Form({ dict }: FormProps) {
    // Form state
    const { errors, handleError, resetErrors } = useErrorHandler()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPolitics, setIsPolitics] = useState(false)
    // Captcha state
    const ref_captcha = useRef<CaptchaHandle | null>(null)

    const [captchaToken, setCaptchaToken] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [sendCode, { isLoading }] = useSendCodeRegistrationMutation()
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()

        if (!captchaToken) return

        resetErrors()

        sendCode({ email, username, password, confirmPassword, token: captchaToken, politic: isPolitics }).unwrap()
            .then(value => {
                setIsModalOpen(true)
            })
            .catch(err => {
                setCaptchaToken('')
                console.log('RESET_1')
                ref_captcha.current?.reset()
                handleError(err)
            })
    }, [captchaToken, sendCode, email, username, password, confirmPassword, isPolitics])

    return (
        <>

            {isModalOpen && (
                <Modal
                    setIsOpen={setIsModalOpen}
                    email={email}
                    arg={{ username, email, password, confirmPassword }}
                    dict={dict['modal']}
                />
            )}

            <form className={s.form} onSubmit={handleSubmit}>
                <Username username={username} setUsername={setUsername} label={dict.username} errors={errors['username']} />
                <Email label={dict.email} email={email} setEmail={setEmail} errors={errors['email']} />
                <Password label={dict.password} password={password} setPassword={setPassword} errors={errors['password']} />
                <Password label={dict.confirmPassword} password={confirmPassword} setPassword={setConfirmPassword} errors={errors['confirmPassword']} />

                <div className={s.captcha}>
                    <Captcha callback={setCaptchaToken} ref={ref_captcha} />
                </div>
                <PrivacyCheckbox onChange={setIsPolitics} dict={dict.politic} errors={errors['politic'] as string[]} />
                <button disabled={!captchaToken || isLoading || !isPolitics}>
                    {dict.button}
                </button>
            </form>

            <div className={s.metaData}>
                <p>
                    {dict.meta_p}
                    <span>
                        <LocalizedLink href={'/login'}>{dict.meta_a}</LocalizedLink>
                    </span>
                </p>

                {errors.error ? (
                    <p className={s.error}>{errors.error}</p>
                ) : null}
            </div>
        </>
    )
}