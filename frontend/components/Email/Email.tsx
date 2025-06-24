import React from 'react'
import s from './Email.module.css'

export default function Email({
    label,
    email,
    setEmail,
    errors
}: {
    label: string,
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>
    errors: string[] | undefined
}) {
    return (
        <div>
            <label
                htmlFor="email"
                className={s.label}
                style={errors ? { color: 'var(--ColorError)' } : undefined}
            >{label}</label>
            <div className={s.container}>
                <input
                    style={errors ? { border: '1.5px solid var(--ColorError)' } : undefined}
                    type="email"
                    name="email"
                    value={email}
                    maxLength={64}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className={s.input}
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
