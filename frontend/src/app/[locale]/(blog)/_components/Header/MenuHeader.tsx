'use client'
import React, { useEffect, useState } from 'react'
import { IoIosMenu, IoMdClose } from 'react-icons/io'
import s from './MenuHeader.module.css'
import { usePathname } from 'next/navigation'
import ChangeLocale from '../ChangeLocale'
import { DictionaryType } from '@/i18n/getDictionary'
import ThemeChange from '../ThemeChange'
import { PrivateUserInterfaces } from '../../../../../../serverAction/getCurrentUser'
import LocalizedLink from '@/i18n/routes/LocalizedLink'
import ProfileImage from '../../../../../../components/ProfileImage/ProfileImage'
import { useLogoutUserMutation } from '@/_redux/api/Api'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import { redirectTo } from '../../../../../../serverAction/RedirectTo'

export default function MenuHeaderAuth({
  current_user,
  dict
}: {
  current_user?: PrivateUserInterfaces,
  dict: DictionaryType['blog']['blogLayout']['header']['menu']
}) {
  const [menuIsActive, setMenuIsActive] = useState<boolean>(false)
  const [logout, { isLoading }] = useLogoutUserMutation()
  const { errors, handleError, resetErrors } = useErrorHandler()
  const handleLogout = () => {
    resetErrors()
    logout().unwrap()
      .then(() => {
        redirectTo('/articles', false)
      })
      .catch(err => {
        handleError(err)
      })
  }
  const url = usePathname()
  useEffect(() => {
    setMenuIsActive(false)
  }, [url])
  return (
    <>
      {
        menuIsActive ?
          <>
            <div className={s.filter}>
            </div>
            <div className={s.sidebar}>
              <div className={`${s.iconOFF}`}>
                <IoMdClose onClick={() => setMenuIsActive(false)} />
              </div>
              <div className={s.menu}>
                <div className={s.links}>
                  <div className={s.ProfileLinks}>
                    <p>{dict.account}</p>
                    {
                      current_user ?
                        <>
                          <div className={s.user}>
                            <ProfileImage size={60} profile_picture_url={current_user.profile_picture_url} />
                            <div>
                              <p>{current_user.username}</p>
                              <p>{current_user.email}</p>
                            </div>
                          </div>
                          <nav className={s.nav}>
                            <LocalizedLink href={'/profile/' + current_user.id}>{dict.profile}</LocalizedLink>
                            <LocalizedLink href={'/settings'}>{dict.settings}</LocalizedLink>
                          </nav>
                        </>
                        :
                        <LocalizedLink href={'/login'}>{dict.login}</LocalizedLink>
                    }

                  </div>
                  <div className={s.NavigationLinks}>
                    <p>{dict.links}</p>
                    <nav className={s.nav}>
                      <LocalizedLink href={'/articles'}>{dict.articles}</LocalizedLink>
                      <LocalizedLink href={'/about_me'}>{dict['about me']}</LocalizedLink>
                      {current_user?.role === 'admin' ?
                        <>
                          <LocalizedLink href={'/create_article'}>Создать статью</LocalizedLink>
                          <LocalizedLink href={'/change_articles'}>Изменить статьи</LocalizedLink>
                        </>
                        : null}
                    </nav>
                  </div>
                </div>
                <div className={s.actions}>
                  <ChangeLocale text={dict.language} style={{
                    bottom: '110%',
                    left: '0',
                    right: '0',
                  }} />
                  <p className={s.theme}>{dict.thema} <ThemeChange /> </p>
                  {
                    current_user ?
                      <button className={s.logout} disabled={isLoading} onClick={handleLogout}>
                        {dict.logout}
                      </button>
                      : null
                  }
                  {errors.error && <p className={s.error}>{errors.error}</p>}
                </div>
              </div>
            </div>
          </> :
          <IoIosMenu onClick={() => setMenuIsActive(true)} className={s.iconON} />
      }
    </>
  )
}
