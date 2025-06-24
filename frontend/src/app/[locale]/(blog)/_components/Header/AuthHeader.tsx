'use client'
import MenuHeader from './MenuHeader';
import { FaUserCircle } from 'react-icons/fa';
import { DictionaryType } from '@/i18n/getDictionary';
import s from './Auth.module.css'
import ls from './loading.module.css'
import ChangeLocale from '../ChangeLocale';
import ThemeChange from '../ThemeChange';
import { useGetCurrentUserQuery } from '@/_redux/api/Api';
import LocalizedLink from '@/i18n/routes/LocalizedLink';

export default function AuthHeader(
    {
        dict,
    }: {
        dict: DictionaryType['blog']['blogLayout']['header'],

    }) {
    const { data: current_user, isLoading } = useGetCurrentUserQuery()
    if (isLoading) {
        return (
            <div className={`${ls.loading} ${s.options}`}></div>
        )
    }
    return (
        <>
            {
                current_user ?
                    <div className={s.options}>
                        <div className={s.username}>
                            <LocalizedLink href={'/profile/' + current_user.id}>
                                <FaUserCircle />
                                <p>
                                    {current_user.username}
                                </p>
                            </LocalizedLink>
                        </div>
                        <div className={s.burgerAuth}>
                            <MenuHeader current_user={current_user} dict={dict.menu} />
                        </div>
                    </div>
                    :
                    <div className={s.options}>
                        <div className={s.auth}>
                            <LocalizedLink href={'/login'}>{dict.auth.login}</LocalizedLink>
                            <LocalizedLink href={'/reg'}>{dict.auth.reg}</LocalizedLink>
                        </div>
                        <div className={s.theme}>
                            <ThemeChange />
                        </div>
                        <div className={s.locale}>
                            <ChangeLocale style={{
                                top: '115%',
                                right: '0'
                            }} />
                        </div>
                        <div className={s.burger}>
                            <MenuHeader dict={dict.menu} />
                        </div>
                    </div>
            }
        </>
    )
}
