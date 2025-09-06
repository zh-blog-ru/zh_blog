'use client'
import React, { ChangeEvent, useRef, useState } from 'react'
import s from './AddImages.module.css'
import { useDeleteImageToArtileMutation, useUploadImageToArtileMutation } from '@/_redux/api/Api'
import { CircularProgress, IconButton } from '@mui/material';
import { useErrorHandler } from '../../../../../../../../hooks/useErrorHandler';
import Image from 'next/image';

export default function LoadPhoto({
    article_id,
    images_list
}: {
    article_id: number,
    images_list: string[]
}) {
    const [images, setImages] = useState<string[]>(images_list || []);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const ref = useRef<HTMLInputElement>(null)

    const [uploadImage, { isLoading: isLoadingUpload }] = useUploadImageToArtileMutation();
    const [deleteImage, { isLoading: isLoadingDelete }] = useDeleteImageToArtileMutation();
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
                } else {
                    handleError({
                        message: files[0].size > maxSize
                            ? 'Размер файла не должен превышать 2MB'
                            : 'Недопустимый формат файла'
                    });
                }
            };
            reader.readAsDataURL(files[0]);

            if (files[0].size <= maxSize && allowedTypes.test(files[0].type)) {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('image', files[0]);
                uploadImage({ body: formData, article_id }).unwrap()
                    .then(filename => {
                        setImages([...images, filename.filename]);
                        setImageSrc(null);
                        setIsUploading(false);
                        if (ref.current) {
                            ref.current.value = '';
                        }
                    })
                    .catch(err => {
                        handleError(err);
                        setImageSrc(null);
                        setIsUploading(false);
                        if (ref.current) {
                            ref.current.value = '';
                        }
                    })
            }
        }
    };

    const handleDeleteImage = (filename: string) => {
        deleteImage({ article_id, filename }).unwrap()
            .then(() => {
                setImages(prev => prev.filter(img => img !== filename));
            })
            .catch(err => {
                handleError(err);
            });
    };

    return (
        <div>
            <div className={s.main}>
                {/* Секция с добавленными изображениями */}
                <div className={s.imagesSection}>
                    <h3 className={s.sectionTitle}>Добавленные изображения</h3>
                    {images.length > 0 ? (
                        <div className={s.articles}>
                            {images.map((item, index) => (
                                <div key={index} className={s.article}>
                                    <div className={s.imageContainer}>
                                        <Image
                                            src={`https://zhblog.ru/api/v1/file/photo/public/${item}`}
                                            alt='article image'
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '10px'
                                            }}
                                            sizes="(min-width: 768px) 200px, 100px"
                                        />
                                        <IconButton
                                            className={s.deleteButton}
                                            onClick={() => handleDeleteImage(item)}
                                            disabled={isLoadingDelete}
                                            size="small"
                                        >
                                            D
                                        </IconButton>
                                    </div>
                                    <p className={s.imageName}>{item}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className={s.placeholder}>ПУСТО</span>
                    )
                    }
                </div>

                {/* Секция загрузки нового изображения */}
                <div className={s.uploadSection}>
                    <div className={s.metaData}>
                        <div className={s.loadFile}>
                            <button
                                type='button'
                                className={s.button}
                                disabled={isLoadingUpload || isUploading}
                                onClick={sendFile}>
                                Добавить изображение
                            </button>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={ref}
                                hidden
                            />
                        </div>
                    </div>
                </div>
            </div>
            {errors.error || errors.image ? (
                <p className={s.error}>{errors.error || errors.image}</p>
            ) : null}
        </div>
    )
}