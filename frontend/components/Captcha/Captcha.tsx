'use client'
import Script from 'next/script'
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import s from './Captcha.module.css'
import { useAppSelector } from '@/_redux/store'

declare global {
    interface Window {
        turnstile: any;
    }
}

export interface CaptchaHandle {
    reset: () => void;
    remove: () => void
}


export default function Captcha({
    callback,
    ref,
}: {
    callback: React.Dispatch<React.SetStateAction<string>>,
    ref: React.RefObject<CaptchaHandle | null>,
}) {
    const captchaRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)
    const locale = useAppSelector(state => state.locale.locale)

    useImperativeHandle(ref, () => ({
        reset: () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current)
            }
        },
        remove: () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current)
                widgetIdRef.current = null
            }
        }
    }))

    const initCaptcha = useCallback(() => {
        if (captchaRef.current && window.turnstile) {
            // Remove previous widget if exists

            if (widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current)
            }

            // Create new widget
            widgetIdRef.current = window.turnstile.render(captchaRef.current, {
                sitekey: process.env.NEXT_PUBLIC_PUBLIC_CAPTCHA_CLOUD,
                callback,
                language: locale,
            })
        }
    }, [locale])

    useEffect(() => {
        if (scriptLoaded || window.turnstile) {
            initCaptcha()
        }
        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
                callback(''); // Сбросьте токен, если нужно
            }
        };
    }, [locale, scriptLoaded, initCaptcha, callback])
    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                onLoad={() => {
                    setScriptLoaded(true)
                }}
                strategy="lazyOnload"
            />
            <div
                style={{
                    // transformOrigin: position
                }}
                ref={captchaRef}
                id="captcha-container"
                className={s.captchaContainer}
                data-size="normal"
            />
        </>
    )
}
