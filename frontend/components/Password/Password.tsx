import React, { useState } from 'react'
import s from './Password.module.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Password({
    label,
    password,
    setPassword,
    errors
}: {
    label: string,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>
    errors: string[] | undefined
}) {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    return (
        <div>
            <label
                htmlFor="password"
                className={s.label}
                style={errors ? { color: 'var(--ColorError)' } : undefined}
            >{label}</label>
            <div className={s.container}>
                <div>
                    {showPassword ? (
                        <FaEyeSlash onClick={() => setShowPassword(false)} />
                    ) : (
                        <FaEye onClick={() => setShowPassword(true)} />
                    )}
                    <input
                        className={s.input}
                        style={errors ? { border: '1.5px solid var(--ColorError)' } : undefined}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        required
                        minLength={8}
                        maxLength={128}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
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
