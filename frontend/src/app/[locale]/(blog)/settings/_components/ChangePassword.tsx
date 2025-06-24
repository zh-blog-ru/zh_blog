'use client'
import React, { useCallback, useState } from 'react'
import s from './ChangePassword.module.css'
import i from './styleByInput.module.css'
import { MdKey } from 'react-icons/md'
import { useChangePasswordMutation } from '@/_redux/api/Api'
import { IoMdClose } from 'react-icons/io'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import { DictionaryType } from '@/i18n/getDictionary'
import Password from '../../../../../../components/Password/Password'


export default function ChangePassword({
  dict
}: {
  dict: DictionaryType['blog']['settings']['change_password']
}) {
  const [isChange, setIsChange] = useState<boolean>(false)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { errors, handleError, resetErrors } = useErrorHandler()

  const [ChangePassword, { data, isLoading }] = useChangePasswordMutation()

  const handleSubmit = useCallback((e: React.MouseEvent) => {
    resetErrors()
    ChangePassword({ password, newPassword, confirmPassword }).unwrap()
      .then((value) => {
        handleCloseModal()
      })
      .catch(err => {
        handleError(err)
      })
  }, [password, newPassword, confirmPassword, resetErrors])
  const handleCloseModal = useCallback(() => {
    setIsChange(false)
    setPassword('')
    setNewPassword('')
    setConfirmPassword('')
    resetErrors()
  }, [])
  return (
    <div className={`${s.password} ${i.inputs}`}>
      <div className={s.label}>
        <label>{dict.label}</label>
        {data && <p className={s.ok}>{data.text}</p>}
        {errors.error && <p className={s.error}>{errors.error}</p>}
      </div>
      <div>
        <MdKey />
        <input type='password' value={'123123123'} disabled />
        <button onClick={() => setIsChange(true)}>{dict.change}</button>
      </div>
      {
        isChange ? (
          <>
            <div className={s.filter}></div>
            <div className={s.modal}>
              <IoMdClose className={s.close} onClick={handleCloseModal} />
              <h2>{dict.h2}</h2>
              <div className={s.form}>
                <div>
                  <Password label={dict.password} password={password} setPassword={setPassword} errors={errors.password} />
                  <Password label={dict.new_password} password={newPassword} setPassword={setNewPassword} errors={errors.newPassword as string[]} />
                  <Password label={dict.confirm_password} password={confirmPassword} setPassword={setConfirmPassword} errors={errors.confirmPassword} />
                </div>
                <button disabled={isLoading} onClick={(e) => handleSubmit(e)}>
                  {dict.submit}
                </button>
              </div>
            </div>
          </>
        ) : null
      }
    </div>
  )
}
