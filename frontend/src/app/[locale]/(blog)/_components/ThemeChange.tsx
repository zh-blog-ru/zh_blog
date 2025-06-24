'use client'
import { useTheme } from 'next-themes'
import { FaRegMoon } from 'react-icons/fa'
import { MdLightMode } from 'react-icons/md'
import { useEffect, useState } from 'react';
import s from './ThemeChange.module.css'
export default function ThemeChange() {
    const { theme, setTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <>
                <MdLightMode className={s.light}/>
                <FaRegMoon className={s.moon}/>
            </>
        )
    }

    const renderThemeChanger = () => {
        const currentTheme = theme === "system" ? systemTheme : theme;

        if (currentTheme === "dark") {
            return (
                <MdLightMode onClick={() => setTheme('light')} />
            );
        } else {
            return (
                <FaRegMoon onClick={() => setTheme('dark')} />
            );
        }
    };

    return <>{renderThemeChanger()}</>;
}