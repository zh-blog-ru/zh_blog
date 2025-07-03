'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import s from './ChangeImage.module.css'

export default function ChangeImage() {
    const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1555421689-491a97ff2040')
    const [editMode, setEditMode] = useState(false)
    const [inputUrl, setInputUrl] = useState('')

    const handleEditClick = () => {
        setInputUrl(imageUrl)
        setEditMode(true)
    }

    const handleSaveClick = () => {
        if (inputUrl.trim()) {
            setImageUrl(inputUrl)
        }
        setEditMode(false)
    }

    const handleCancelClick = () => {
        setEditMode(false)
    }

    return (
        <div className={s.imageContainer}>
            <input
                name='img'
                hidden
                value={imageUrl}
                readOnly
            />
            <Image
                src={imageUrl}
                alt="Article cover"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(min-width: 768px) 100vw, 50vw"
            />

            {!editMode ? (
                <button className={s.editButton} onClick={handleEditClick}>
                    Изменить изображение
                </button>
            ) : (
                <div className={s.urlInputContainer}>
                    <input
                        name='img'
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Введите URL изображения"
                        className={s.urlInput}
                    />
                    <div className={s.buttonGroup}>
                        <button
                            onClick={handleSaveClick}
                            className={s.saveButton}
                            disabled={!inputUrl.trim()}
                        >
                            Сохранить
                        </button>
                        <button onClick={handleCancelClick} className={s.cancelButton}>
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}