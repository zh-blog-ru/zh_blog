import React from 'react'
import s from './layout.module.css'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={s.blogAuthLayout}>
            {children}
        </div>
    )
}
