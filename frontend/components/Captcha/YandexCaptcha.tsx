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
    const [postErros] = usePostErrosMutation()
    const captchaRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
    const locale = useAppSelector(state => state.locale.locale);

    const log = useCallback((data: any) => {
        try {
            postErros({
                ...data,
                timestamp: new Date().toISOString(),
                widgetId: widgetIdRef.current,
                scriptLoaded,
                captchaReady: !!window.smartCaptcha
            })
        } catch (error) {
            console.error('Failed to send error log:', error)
        }
    }, [postErros, scriptLoaded])

    useImperativeHandle(ref, () => ({
        reset: () => {
            log({ action: 'reset_captcha_start' })
            if (widgetIdRef.current != null && window.smartCaptcha) {
                try {
                    window.smartCaptcha.reset(widgetIdRef.current);
                    log({ action: 'reset_captcha_success', widgetId: widgetIdRef.current })
                } catch (error) {
                    log({ action: 'reset_captcha_error', error: error instanceof Error ? error.message : String(error) })
                }
            } else {
                log({ action: 'reset_captcha_skip', reason: !widgetIdRef.current ? 'no_widget_id' : 'no_smart_captcha' })
            }
        },
        remove: () => {
            log({ action: 'remove_captcha_start' })
            if (widgetIdRef.current != null && window.smartCaptcha) {
                try {
                    window.smartCaptcha.destroy(widgetIdRef.current);
                    widgetIdRef.current = null;
                    log({ action: 'remove_captcha_success' })
                } catch (error) {
                    log({ action: 'remove_captcha_error', error: error instanceof Error ? error.message : String(error) })
                }
            } else {
                log({ action: 'remove_captcha_skip', reason: !widgetIdRef.current ? 'no_widget_id' : 'no_smart_captcha' })
            }
        }
    }));

    const initCaptcha = useCallback(() => {
        log({ action: 'init_captcha_start' })
        
        if (!captchaRef.current) {
            log({ action: 'init_captcha_failed', reason: 'no_container_element' })
            return
        }

        if (!window.smartCaptcha) {
            log({ action: 'init_captcha_failed', reason: 'smart_captcha_not_loaded' })
            return
        }

        try {
            // Remove previous widget if exists
            if (widgetIdRef.current != null) {
                log({ action: 'destroy_previous_captcha', widgetId: widgetIdRef.current })
                window.smartCaptcha.destroy(widgetIdRef.current)
            }

            // Create new widget
            const sitekey = process.env.NEXT_PUBLIC_PUBLIC_CAPTCHA
            if (!sitekey) {
                log({ action: 'init_captcha_failed', reason: 'no_sitekey' })
                return
            }

            widgetIdRef.current = window.smartCaptcha.render(captchaRef.current, {
                sitekey,
                callback: (token: string) => {
                    log({ action: 'captcha_callback', token: token ? 'received' : 'empty' })
                    callback(token)
                },
                hl: locale,
            })

            log({ 
                action: 'init_captcha_success', 
                widgetId: widgetIdRef.current,
                locale,
                sitekey: sitekey ? 'present' : 'missing'
            })
        } catch (error) {
            log({ 
                action: 'init_captcha_error', 
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined
            })
        }
    }, [locale, callback, log])

    useEffect(() => {
        log({ action: 'effect_run', scriptLoaded, smartCaptcha: !!window.smartCaptcha })
        
        if (scriptLoaded || window.smartCaptcha) {
            initCaptcha()
        }

        return () => {
            log({ action: 'cleanup_start' })
            if (widgetIdRef.current != null && window.smartCaptcha) {
                try {
                    window.smartCaptcha.destroy(widgetIdRef.current)
                    widgetIdRef.current = null
                    callback('')
                    log({ action: 'cleanup_success' })
                } catch (error) {
                    log({ action: 'cleanup_error', error: error instanceof Error ? error.message : String(error) })
                }
            }
        }
    }, [locale, scriptLoaded, initCaptcha, callback, log])

    return (
        <>
            <Script
                src="https://smartcaptcha.yandexcloud.net/captcha.js"
                onLoad={() => {
                    log({ action: 'script_load_success' })
                    setScriptLoaded(true)
                }}
                onError={(e) => {
                    log({ 
                        action: 'script_load_error',
                        error: e instanceof Error ? e.message : String(e)
                    })
                }}
                strategy="lazyOnload"
            />
            <div className={s.captchaContainer}>
                <div
                    ref={captchaRef}
                    id="yandex-captcha-container"
                    data-testid="captcha-container"
                />
            </div>
        </>
    )
}