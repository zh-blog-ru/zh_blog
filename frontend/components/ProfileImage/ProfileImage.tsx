'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'

export default function ProfileImage({
    size,
    profile_picture_url,
    profile_picture_blob
}: {
    size: number,
    profile_picture_url: string | null,
    profile_picture_blob?: string | null,
}) {
    const [isError, setIsError] = useState(false)
    return (
        <>
            {
                !isError && (profile_picture_url  || profile_picture_blob)?
                    <Image
                        src={profile_picture_blob || `https://zhblog.ru/api/v1/file/photo/public/${profile_picture_url}`}
                        alt="user photo"
                        width={size}
                        height={size}
                        style={{
                            objectFit: 'cover',
                            borderRadius: '50%',
                            objectPosition: 'center center'
                        }}
                        // Дополнительные параметры:
                        unoptimized
                        onError={()=>setIsError(true)}
                    />
                    : <FaUserCircle size={size} />
            }
        </>
    )
}
