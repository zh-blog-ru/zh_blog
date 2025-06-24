import React, { ChangeEvent, useCallback } from 'react'
import s from './Username.module.css'

export default function Username({
    label,
    username,
    setUsername,
    errors
}: {
    label: string,
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>
    errors: string[] | undefined
}) {
    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (!/^[a-zA-Z0-9_]*$/.test(e.target.value)) {
                return
            }
            setUsername(e.target.value)
        }, [])
    return (
        <div>
            <label
                htmlFor="username"
                className={s.label}
                style={errors ? { color: 'var(--ColorError)' } : undefined}
            >{label}<span>(a-z, A-Z, 0-9, _)</span></label>
            <div className={s.container}>
                <input
                    style={errors ? { border: '1.5px solid var(--ColorError)' } : undefined}
                    type="text"
                    name="username"
                    value={username}
                    maxLength={32}
                    minLength={5}
                    required
                    onChange={handleInputChange}
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
