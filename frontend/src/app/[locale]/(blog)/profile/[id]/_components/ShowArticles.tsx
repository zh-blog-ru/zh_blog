'use client'
import React, { useState } from 'react'
import s from './ShowArticles.module.css'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'

export default function ShowArticles({
    children,
    interTitle
}: {
    children: React.ReactNode,
    interTitle: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div className={s.button}>
                <p>{interTitle}</p>
                {isOpen ?
                    <SlArrowUp onClick={() => setIsOpen(false)} />
                    :
                    <SlArrowDown onClick={() => setIsOpen(true)} />
                }

            </div>
            {isOpen ? children : null}
        </>
    )
}
