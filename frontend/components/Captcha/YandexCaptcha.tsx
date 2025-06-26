'use client'
import Script from 'next/script'
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import s from './YandexCaptcha.module.css'
import { useAppSelector } from '@/_redux/store'
import { usePostErrosMutation } from '@/_redux/api/Api'

declare global {
    interface Window {
        smartCaptcha?: {
            render: (
                container: HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    hl?: string;
                }
            ) => string;
            reset: (widgetId: string) => void;
            destroy: (widgetId: string) => void;
        };
    }
}

export interface CaptchaHandle {
    reset: () => void;
    remove: () => void;
}

export default function YandexCaptcha({
    callback,
    ref,
    position
}: {
    callback: React.Dispatch<React.SetStateAction<string>>;
    ref: React.RefObject<CaptchaHandle | null>;
    position?: string;
}) {
    
    const [postErros, {}] = usePostErrosMutation()
    const captchaRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const locale = useAppSelector(state => state.locale.locale);

    useImperativeHandle(ref, () => ({
        reset: () => {
            if (widgetIdRef.current != null && window.smartCaptcha) {
                console.log('RESET_3')
                console.log(widgetIdRef.current)
                window.smartCaptcha.reset(widgetIdRef.current);
            }
        },
        remove: () => {
            if (widgetIdRef.current != null && window.smartCaptcha) {
                window.smartCaptcha.destroy(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        }
    }));

    const initCaptcha = useCallback(() => {
        postErros({ok: '1'})
        postErros({ok: window.smartCaptcha})
        if (captchaRef.current && window.smartCaptcha) {
            // Remove previous widget if exists
            postErros({ok: '2'})
            if (widgetIdRef.current != null) {
                postErros({ok: '3'})
                window.smartCaptcha.destroy(widgetIdRef.current);
            }
            postErros({ok: '4'})
            // Create new widget
            widgetIdRef.current = window.smartCaptcha.render(captchaRef.current, {
                sitekey: process.env.NEXT_PUBLIC_PUBLIC_CAPTCHA as string,
                callback: (token: string) => callback(token),
                hl: locale,
            });
            postErros({ok: '5'})
        }
    }, [locale, callback]);

    useEffect(() => {
        if (scriptLoaded || window.smartCaptcha) {
            initCaptcha();
        }
        return () => {
            if (widgetIdRef.current != null && window.smartCaptcha) {
                window.smartCaptcha.destroy(widgetIdRef.current);
                widgetIdRef.current = null;
                callback(''); // Reset token if needed
            }
        };
    }, [locale, scriptLoaded, initCaptcha, callback]);

    return (
        <>
            <Script
                src="https://smartcaptcha.yandexcloud.net/captcha.js"
                onLoad={() => {
                    setScriptLoaded(true);
                    postErros({ok: 'OK'})
                }}
                onError={(e)=>{
                    postErros(e)
                }}
                strategy="lazyOnload"
            />
            <div
                className={s.captchaContainer}
            >
                <div
                    ref={captchaRef}
                    id="yandex-captcha-container"
                >
                </div>
            </div>
        </>
    );
}