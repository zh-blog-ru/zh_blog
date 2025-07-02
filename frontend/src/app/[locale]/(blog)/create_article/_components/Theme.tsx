'use client'

import React, { useState, useEffect } from 'react'
import s from './Theme.module.css'

export default function Theme({
    maxThemes = 3,
    name = 'themes' // Добавляем проп name для имени поля в FormData
}: {
    initialThemes?: string[]
    maxThemes?: number
    name?: string // Имя поля, под которым темы будут отправляться на сервер
}) {
    const [themes, setThemes] = useState<string[]>([])
    const [newTheme, setNewTheme] = useState('')
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editValue, setEditValue] = useState('')

    const handleAddTheme = () => {
        if (newTheme.trim() && themes.length < maxThemes) {
            setThemes([...themes, newTheme.trim()])
            setNewTheme('')
        }
    }

    const handleRemoveTheme = (index: number) => {
        setThemes(themes.filter((_, i) => i !== index))
        if (editingIndex === index) {
            setEditingIndex(null)
        }
    }

    const startEditing = (index: number) => {
        setEditingIndex(index)
        setEditValue(themes[index])
    }

    const saveEditing = () => {
        if (editingIndex !== null && editValue.trim()) {
            const updatedThemes = [...themes]
            updatedThemes[editingIndex] = editValue.trim()
            setThemes(updatedThemes)
            setEditingIndex(null)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTheme()
        }
    }

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEditing()
        } else if (e.key === 'Escape') {
            setEditingIndex(null)
        }
    }

    return (
        <div className={s.metaItem}>
            <label htmlFor="themes">Темы ({themes.length}/{maxThemes}):</label>
            <div className={s.themesContainer}>
                {/* Скрытые инпуты для каждой темы, которые будут включены в FormData */}
                {themes.map((theme, index) => (
                    <input
                        key={index}
                        type="hidden"
                        name={`${name}`} // Используем синтаксис массивов для FormData
                        value={theme}
                    />
                ))}

                <div className={s.themesList}>
                    {themes.map((theme, index) => (
                        <div key={index} className={s.themeItem}>
                            {editingIndex === index ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={saveEditing}
                                    onKeyDown={handleEditKeyDown}
                                    autoFocus
                                    className={s.themeInputEdit}
                                />
                            ) : (
                                <span
                                    className={s.themeTag}
                                    onClick={() => startEditing(index)}
                                >
                                    {theme}
                                </span>
                            )}
                            <button
                                type="button" // Указываем type="button" чтобы не отправлял форму
                                className={s.removeTheme}
                                onClick={() => handleRemoveTheme(index)}
                                title="Удалить тему"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                {themes.length < maxThemes && (
                    <div className={s.addTheme}>
                        <input
                            type="text"
                            value={newTheme}
                            onChange={(e) => setNewTheme(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Добавить тему"
                            className={s.themeInput}
                            disabled={themes.length >= maxThemes}
                        />
                        <button
                            type="button" // Указываем type="button" чтобы не отправлял форму
                            className={s.addThemeButton}
                            onClick={handleAddTheme}
                            disabled={!newTheme.trim() || themes.length >= maxThemes}
                            title="Добавить тему"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}