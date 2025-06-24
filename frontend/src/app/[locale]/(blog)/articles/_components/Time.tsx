'use client'
import { useAppSelector } from '@/_redux/store';
import React, { useEffect, useState } from 'react'

export default function Time({date}: { date: Date }) {
    const locale = useAppSelector(state=>state.locale.locale)
    const [time, setTime] = useState<string>('');
    useEffect(() => {
        const formattedDate = date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setTime(formattedDate)
    }, [])
    return (
        <>
            {time}
        </>
    )
}
