'use client'
import React, { useRef } from 'react'
import s from './CommentForm.module.css'

export default function CommentForm({
    setText,
    setCount,
    errors,
    text,
    label
}: {
    setText: React.Dispatch<React.SetStateAction<string>>,
    setCount: React.Dispatch<React.SetStateAction<number>>,
    errors: string[] | undefined,
    text: string,
    label: string
}) {
    const ref = useRef<HTMLTextAreaElement>(null)
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = ref.current as HTMLTextAreaElement
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        setText(e.target.value)
        setCount(e.target.value.length)
    }
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto'
        }}>
            <label
                htmlFor="email"
                className={s.label}
                style={errors ? { color: 'var(--ColorError)' } : undefined}
            >{label}</label>
            <textarea
                style={errors ? { border: '1.5px solid var(--ColorError)' } : undefined}
                value={text}
                onChange={onChange}
                maxLength={512}
                ref={ref}
                className={s.textarea}
            />
            <ul className={s.errors}>
                {errors ?
                    errors.map((error, index) => (
                        <li key={index}>
                            {error}
                        </li>
                    ))
                    : null}
            </ul>
        </div >
    )
}
