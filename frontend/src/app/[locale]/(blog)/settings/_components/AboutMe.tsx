import React, { useRef, useState, useEffect } from 'react'
import s from './AboutMe.module.css'
import { DictionaryType } from '@/i18n/getDictionary'

export default function AboutMe({
    status,
    dict
}: {
    status: string | null,
    dict: DictionaryType['blog']['settings']['about_me']
}) {
    const [text, setText] = useState<string>(status ?? '')
    const [count, setCount] = useState<number>(status?.length ?? 0)
    const ref_status = useRef<HTMLTextAreaElement>(null)
    // Эффект для начального расчета высоты
    useEffect(() => {
        if (ref_status.current) {
            ref_status.current.style.height = 'auto';
            ref_status.current.style.height = `${ref_status.current.scrollHeight}px`;
        }
    }, [status, ref_status]); // Зависимость от status

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = ref_status.current as HTMLTextAreaElement
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        setText(e.target.value)
        setCount(e.target.value.length)
    }

    return (
        <div className={s.main}>
            <label>{dict.label}</label>
            <div>
                <textarea
                    value={text}
                    onChange={onChange}
                    maxLength={512}
                    ref={ref_status}
                    id='about_me'
                    name='about_me'
                />
                <span>{count} / 512</span>
            </div>
        </div>
    )
}