import React, { useCallback, useRef, useState } from 'react'
import s from './Modal.module.css'
import { FaCheck } from 'react-icons/fa'
import { StepIcon } from '../../settings/_components/ChangeEmail'
import { IoMdClose } from 'react-icons/io'
import { PiNumberCircleOneFill, PiNumberCircleThreeFill, PiNumberCircleTwoFill } from 'react-icons/pi'
import { useCheckCodeResetPasswordMutation, useResetPasswordMutation, useSendCodeResetPasswordMutation } from '@/_redux/api/Api'
import { DictionaryType } from '@/i18n/getDictionary'
import Email from '../../../../../../components/Email/Email'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import Code from '../../../../../../components/Code/Code'
import Password from '../../../../../../components/Password/Password'
import YandexCaptcha, { CaptchaHandle } from '../../../../../../components/Captcha/YandexCaptcha'
import Captcha from '../../../../../../components/Captcha/Captcha'

export default function Modal({
    dict
}: {
    dict: DictionaryType['blog']['login']['modal']
}) {
    const [email, setEmail] = useState('')
    const [captchaToken, setCaptchaToken] = useState('')
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [step, setStep] = useState<1 | 2 | 3>(1)

    const [resetPassword, { }] = useResetPasswordMutation()
    const { errors, handleError, resetErrors } = useErrorHandler()

    const ref_captcha = useRef<CaptchaHandle>(null)

    const [sendCode] = useSendCodeResetPasswordMutation()
    const [checkCode, { isLoading: IsCheckCode }] = useCheckCodeResetPasswordMutation()



    const handleCloseModal = useCallback(() => {
        setPassword('')
        setConfirmPassword('')
        setEmail('')
        setIsModalOpen(false)
        setStep(1)
        setCode('')
        setCaptchaToken('')
        ref_captcha.current?.remove()
        resetErrors()
    }, [])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (!captchaToken) return
        resetErrors()
        sendCode({ email, token: captchaToken }).unwrap()
            .then(() => {
                setStep(2)
            })
            .catch((err) => {
                setCaptchaToken('')
                ref_captcha.current?.reset()
                handleError(err)
            })
    }, [captchaToken, email, sendCode])

    const onChangeFunc = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCode(value)

        if (value.length === 6) {
            resetErrors()
            checkCode({ email, code: value }).unwrap()
                .then((val) => {
                    setStep(3)
                })
                .catch(err => {
                    handleError(err)
                })
        }
    }, [step, email, checkCode])

    const resetPasswordFunc = () => {
        resetErrors()
        resetPassword({ password, confirmPassword }).unwrap()
            .then(() => {
                handleCloseModal()
            })
            .catch(err => {
                handleError(err)
            })
    }
    return (
        <div>
            <p className={s.resetPassword}>{dict.forget_the_password} <span>
                <button onClick={() => { setIsModalOpen(true) }}>{dict.button}</button>
            </span></p>

            {isModalOpen && (
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
                                        <form onSubmit={handleSubmit} className={s.form}>
                                            <Email label={dict.enter_email} email={email} setEmail={setEmail} errors={errors['email']} />
                                            <Captcha callback={setCaptchaToken} ref={ref_captcha} />
                                            <button>Send</button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <FaCheck style={{ color: 'rgb(48, 155, 48)' }} />
                                        <p>{dict.enter_email}</p>
                                    </>
                                )}
                            </div>

                            {/* Step 2 */}
                            <div>
                                {step === 2 ? (
                                    <>
                                        <PiNumberCircleTwoFill />
                                        <Code label={dict.code} code={code} setCode={onChangeFunc} errors={errors['code']} email={email} disabled={IsCheckCode} />
                                    </>
                                ) : (
                                    <>
                                        <StepIcon step={2} currentStep={step} />
                                        <p>{dict.enter_code}</p>
                                    </>
                                )}
                            </div>

                            {/* Step 3 */}
                            <div>
                                {step === 3 ? (
                                    <>
                                        <PiNumberCircleThreeFill />
                                        <div className={s.form}>
                                            <p>{dict.enter_new_password}</p>
                                            <Password label={dict.new_password}
                                                password={password} setPassword={setPassword} errors={errors['password']} />

                                            <Password label={dict.confirm_password}
                                                password={confirmPassword} setPassword={setConfirmPassword} errors={errors['confirmPassword']} />

                                            <button onClick={resetPasswordFunc}>Send</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <StepIcon step={3} currentStep={step} />
                                        <p>{dict.enter_new_password}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        {errors.error ? (
                            <p className={s.error}>{errors.error}</p>
                        ) : null}
                    </div>
                </>
            )}
        </div>
    )
}