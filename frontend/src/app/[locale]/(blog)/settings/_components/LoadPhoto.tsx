'use client'
import React, { ChangeEvent, useRef, useState } from 'react'
import s from './LoadPhoto.module.css'
import { useDeleteImageMutation, useUploadImageMutation } from '@/_redux/api/Api'
import { useErrorHandler } from '../../../../../../hooks/useErrorHandler'
import { CircularProgress } from '@mui/material';
import { DictionaryType } from '@/i18n/getDictionary'
import ProfileImage from '../../../../../../components/ProfileImage/ProfileImage'

export default function LoadPhoto({
    profile_picture_url,
    dict
}: {
    profile_picture_url: string | null,
    dict: DictionaryType['blog']['settings']['load_photo']
}) {
    const [baseImage, setBaseimage] = useState<string | null>(profile_picture_url);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const ref = useRef<HTMLInputElement>(null)

    const [uploadImage, { isLoading: isLoadingUpload }] = useUploadImageMutation();
    const [deleteImage, { isLoading: isLoadingDelete }] = useDeleteImageMutation();
    const { errors, handleError, resetErrors } = useErrorHandler()
    const sendFile = () => {
        if (ref.current) {
            ref.current.click()
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const maxSize = 2 * 1024 * 1024
        const allowedTypes = /^(image\/jpeg|image\/png|image\/webp)$/;

        const files = event.target.files;
        if (files && files.length == 1) {
            resetErrors()
            const reader = new FileReader();
            reader.onloadend = () => {
                if (files[0].size <= maxSize && allowedTypes.test(files[0].type)) {
                    setImageSrc(reader.result as string);
                }
            };
            reader.readAsDataURL(files[0]);
            const formData = new FormData();
            formData.append('image', files[0]);
            uploadImage(formData).unwrap()
                .catch(err => {
                    handleError(err)
                    setImageSrc(null);
                    if (ref.current) {
                        ref.current.value = '';
                    }
                })
        }
    };
    const handleFileDelete = () => {
        resetErrors()
        deleteImage().unwrap()
            .then(() => {
                setImageSrc(null)
                if (ref.current) {
                    ref.current.value = ''; // Очищаем input
                }
                setBaseimage(null)
            })
            .catch(err => {
                handleError(err)
            })
    }
    return (
        <div>
            <div className={s.main}>
                <div className={s.photo}>
                    {isLoadingUpload ? <CircularProgress className={s.loader} size={70} /> : null}
                    {
                        <ProfileImage size={70} profile_picture_url={baseImage} profile_picture_blob={ imageSrc}/>
                    }
                </div>
                <div className={s.metaData}>
                    <h3>{dict.h3}</h3>
                    <p
                    style={errors.image ? {color: 'var(--ColorError)'} : undefined}
                    >{dict.p}</p>
                    <div className={s.loadFile}>
                        <button
                            type='button'
                            className={s.button}
                            disabled={isLoadingUpload}
                            onClick={sendFile}>{dict.load}</button>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={ref}
                        />
                        {
                            (imageSrc || baseImage) ?
                                <button
                                    className={s.button}
                                    onClick={handleFileDelete}
                                    type='button'
                                    disabled={isLoadingDelete}
                                >{dict.delete}</button>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
            {errors.error || errors.image ? (
                <p className={s.error}>{errors.error || errors.image}</p>
            ) : null}
        </div>
    )
}
