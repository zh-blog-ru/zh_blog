'use client'
import React, { CSSProperties, useState } from 'react'
import { GrLanguage } from 'react-icons/gr'
import s from './ChangeLocale.module.css'
import { useAppSelector } from '@/_redux/store'
import { useChangeLocale } from '@/i18n/routes/useChangeLocale'
import { locales } from '@/i18n/locales'
import { IoCheckmarkSharp } from "react-icons/io5";

export default function ChangeLocale({
    text,
    style
}: {
    text?: string,
    style: CSSProperties
}) {
    const [isChangeLocale, setChangeLocale] = useState<boolean>(false)
    const locale = useAppSelector((state) => state.locale.locale)
    const changeLocale = useChangeLocale()
    return (
        <div className={s.main}>
            {isChangeLocale ?
                <ul
                    className={s.list}
                    style={style}
                >
                    {locales.map((lang, index) => {
                        return (
                            <li
                                key={index}
                                onClick={() => {
                                    changeLocale(lang)
                                    setChangeLocale(false)
                                }}
                            >
                                <div
                                    className={`${s.locale}
                                 ${lang == locale ? s.localeCurrent : null}`}>
                                    <p>
                                        {lang}
                                    </p>
                                    {lang == locale ? <IoCheckmarkSharp /> : null}
                                </div>
                            </li>
                        )
                    })}
                </ul>
                : null}
            <p className={s.locales} onClick={() => setChangeLocale(a => !a)}>
                {text} <GrLanguage />
            </p>
        </div>

    )
}
