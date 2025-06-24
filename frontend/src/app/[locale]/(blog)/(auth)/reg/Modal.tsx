import React, { useCallback, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useCheckCodeRegistrationMutation, useCreateUserMutation } from '@/_redux/api/Api'
import { CreateUserDto } from '@/_redux/api/dto/CreateUserDto.dto'
import s from './Modal.module.css'
import { redirectTo } from '../../../../../../serverAction/RedirectTo'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import { DictionaryType } from '@/i18n/getDictionary'
import Code from '../../../../../../components/Code/Code'


interface ModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    email: string
    arg: CreateUserDto
    dict: DictionaryType['blog']['reg']['modal']
}


export default function Modal({ setIsOpen, email, arg, dict }: ModalProps) {
    const [code, setCode] = useState('')
    const [checkCode, { isLoading: IsCheckCode }] = useCheckCodeRegistrationMutation()
    const [createUser] = useCreateUserMutation()
    const { errors, handleError, resetErrors } = useErrorHandler()
    const [isDisable, setIsDisable] = useState(false)
    const handleCodeChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCode = e.target.value
        setCode(newCode)

        if (newCode.length === 6) {
            resetErrors()
            await checkCode({ email, code: newCode }).unwrap()
                .then((value) => {
                    createUser(arg).unwrap().then(({ id }) => {
                        setIsDisable(true)
                        const redirect_url = sessionStorage.getItem('redirect_url')
                        sessionStorage.removeItem('redirect_url')
                        if (redirect_url) {
                            redirectTo(redirect_url, true)
                        } else {
                            redirectTo('/profile/' + id)
                        }
                    })
                })
                .catch(err => {
                    handleError(err)
                })
        }
    }, [email, arg, checkCode, createUser])

    const closeModal = useCallback(() => {
        setIsOpen(false)
        setCode('')
    }, [setIsOpen])
    return (
        <>
            <div className={s.filter} onClick={closeModal} />
            <div className={s.modal}>
                <IoMdClose
                    className={s.close}
                    onClick={closeModal}
                    aria-label="Close modal"
                />
                <h2>Change email address</h2>
                <Code label={dict['code']} code={code} setCode={handleCodeChange} errors={errors.code} email={email} disabled={IsCheckCode || isDisable} />
                {errors.error ? (
                    <p className={s.error}>{errors.error}</p>
                ) : null}
            </div>
        </>
    )
}