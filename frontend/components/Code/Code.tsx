import React from 'react'
import s from './Code.module.css'

export default function Code({
    label,
    code,
    setCode,
    errors,
    email,
    disabled
}: {
    label: string,
    code: string,
    setCode: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
    errors: string[] | undefined,
    email: string,
    disabled: boolean
}) {

    return (
        <div>
            <label
                htmlFor="code"
                className={s.label}
                style={errors ? { color: 'var(--ColorError)' } : undefined}
            >{label} <span>{email}</span></label>
            <div className={s.container}>
                <input
                    style={errors ? { border: '1.5px solid var(--ColorError)' } : undefined}
                    type="text"
                    name='code'
                    required
                    value={code}
                    maxLength={6}
                    minLength={6}
                    onChange={(e) => setCode(e)}
                    className={s.input}
                    autoFocus
                    disabled={disabled}
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
            </div>
        </div>
    )
}
