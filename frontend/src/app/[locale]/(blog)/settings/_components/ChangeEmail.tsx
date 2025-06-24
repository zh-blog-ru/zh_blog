'use client'
import React, { useState,useRef, useCallback } from 'react'
import { MdEmail } from 'react-icons/md'
import { IoMdClose } from 'react-icons/io'
import { PiNumberCircleOneFill, PiNumberCircleThreeFill, PiNumberCircleTwoFill } from "react-icons/pi"
import { FaCheck } from 'react-icons/fa'
import {
    useChangeEmailMutation,
    useCheckCodeNewEmailMutation,
    useCheckCodeOldEmailMutation,
    useSendCodeNewEmailMutation,
    useSendCodeOldEmailMutation
} from '@/_redux/api/Api'
import s from './changeEmail.module.css'
import i from './styleByInput.module.css'
import useLocalizedRouter from '@/i18n/routes/LocalizedUseRouter'
import { DictionaryType } from '@/i18n/getDictionary'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import Code from '../../../../../../components/Code/Code'
import Email from '../../../../../../components/Email/Email'
import YandexCaptcha, { CaptchaHandle } from '../../../../../../components/Captcha/YandexCaptcha'

declare global {
    interface Window {
        turnstile: any
    }
}

interface ChangeEmailProps {
    user_email: string,
    dict: DictionaryType['blog']['settings']['change_email']
}

export const StepIcon = ({ step, currentStep }: { step: number; currentStep: number }) => {
    if (currentStep > step) {
        return <FaCheck style={{ color: 'rgb(48, 155, 48)' }} />
    }

    const icons = {
        1: <PiNumberCircleOneFill />,
        2: <PiNumberCircleTwoFill />,
        3: <PiNumberCircleThreeFill />
    }

    return icons[step as keyof typeof icons]
}

export default function ChangeEmail({ user_email, dict }: ChangeEmailProps) {

    const [baseEmail, setBaseEmail] = useState<string>(user_email)
    const [newEmail, setNewEmail] = useState('')
    const [isChange, setIsChange] = useState(false)
    const [code, setCode] = useState('')
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [captchaToken, setCaptchaToken] = useState('')
    const ref = useRef<CaptchaHandle>(null)
    const { errors, handleError, resetErrors } = useErrorHandler()

    const [
        sendCodeOldEmail,
    ] = useSendCodeOldEmailMutation()

    const [
        checkCodeOldEmail, {isLoading: IsCheckOldCode}
    ] = useCheckCodeOldEmailMutation()

    const [
        sendCodeNewEmail, { isLoading }
    ] = useSendCodeNewEmailMutation()

    const [
        checkCodeNewEmail, {isLoading: IsCheckNewCode}
    ] = useCheckCodeNewEmailMutation()

    const [changeEmail, { data }] = useChangeEmailMutation()

    const router = useLocalizedRouter()

    const handleStartChange = useCallback(async () => {
        resetErrors()
        sendCodeOldEmail().unwrap()
            .then(() => {
                setIsChange(true)
            })
            .catch(err => {
                handleError(err)
            })
    }, [sendCodeOldEmail])


    const onChangeFuncOne = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCode(value)

        if (value.length === 6) {
            resetErrors()
            checkCodeOldEmail({ code: value }).unwrap()
                .then(() => {
                    setStep(2)
                    setCode('')
                })
                .catch(err => {
                    handleError(err)
                })
        }
    }, [checkCodeOldEmail])

    const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!captchaToken) return
        resetErrors()
        sendCodeNewEmail({ email: newEmail, token: captchaToken }).unwrap()
            .then(() => {
                setStep(3)
                setCode('')
            })
            .catch(err => {
                setCaptchaToken('')
                ref.current?.reset()
                handleError(err)
            })
    }, [captchaToken, newEmail, sendCodeNewEmail])

    const onChangeFuncTwo = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCode(value)

        if (value.length === 6) {
            resetErrors()
            checkCodeNewEmail({ code: value, email: newEmail }).unwrap()
                .then(() => {
                    changeEmail().unwrap()
                        .then(() => {
                            // router.refresh()
                            handleCloseModal()
                            setBaseEmail(newEmail)
                        })
                        .catch(err => {
                            handleError(err)
                        })
                })
                .catch(err => {
                    handleError(err)
                })

        }
    }, [newEmail, checkCodeNewEmail, changeEmail])

    const handleCloseModal = useCallback(() => {
        setIsChange(false)
        setStep(1)
        setCode('')
        setNewEmail('')
        setCaptchaToken('')
        resetErrors()
        ref.current?.remove()
    }, [])



    return (
        <div className={`${s.email} ${i.inputs}`}>
            <div className={s.label}>
                <label>{dict.label}</label>
                {data && <p className={s.ok}>{data.text}</p>}
                {errors.error ? (
                    <p className={s.error}>{errors.error}</p>
                ) : null}
            </div>
            <div>
                <MdEmail />
                <input type="email" value={baseEmail} disabled />
                <button onClick={handleStartChange} type='button' >{dict.change}</button>
            </div>

            {isChange && (
                <>
                    <div className={s.filter} />
                    <div className={s.modal}>
                        <IoMdClose className={s.close} onClick={handleCloseModal} />
                        <h2>{dict.h2}</h2>
                        <div className={s.steps}>
                            {/* Step 1 */}
                            <div>
                                {step === 1 ? (
                                    <>
                                        <PiNumberCircleOneFill />
                                        <Code label={dict.code} code={code} email={baseEmail} errors={errors['code']} setCode={onChangeFuncOne} disabled={IsCheckNewCode || IsCheckOldCode}/>
                                    </>
                                ) : (
                                    <>
                                        <FaCheck style={{ color: 'rgb(48, 155, 48)' }} />
                                        <p>{dict.enter_code}</p>

                                    </>
                                )}
                            </div>

                            {/* Step 2 */}
                            <div>
                                {step === 2 ? (
                                    <>
                                        <PiNumberCircleTwoFill />
                                        <div className={s.stepTwo}>
                                            <Email email={newEmail} setEmail={setNewEmail} errors={errors['email']} label={dict.enter_new_email} />
                                            <YandexCaptcha callback={setCaptchaToken} ref={ref} />
                                            <button type="button" disabled={!captchaToken && isLoading} onClick={handleSubmit}>
                                                {dict.submit}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <StepIcon step={2} currentStep={step} />
                                        <p>{dict.enter_new_email}</p>
                                    </>
                                )}
                            </div>

                            {/* Step 3 */}
                            <div>
                                {step === 3 ? (
                                    <>
                                        <PiNumberCircleThreeFill />
                                        <Code label={dict.code} code={code} email={newEmail} errors={errors['code']} setCode={onChangeFuncTwo} disabled={IsCheckNewCode || IsCheckOldCode}/>
                                    </>
                                ) : (
                                    <>
                                        <StepIcon step={3} currentStep={step} />
                                        <p>{dict.enter_code}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}