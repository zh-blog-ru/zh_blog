'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import Time from '../../_components/Time';
import s from './ListComments.module.css'
import { useGetCommentsByArticleIdQuery } from '@/_redux/api/Api';
import ProfileImage from '../../../../../../../components/ProfileImage/ProfileImage';
import Comment from './Comment';

export default function ListComments({
    article_id,
    no_comments
}: {
    article_id: number,
    no_comments: string
}) {
    const [page, setPage] = useState<number>(1);
    const { data: comments, isLoading, isFetching } = useGetCommentsByArticleIdQuery({ article_id, page });
    const [hasMore, setHasMore] = useState(true); // Добавим состояние для отслеживания, есть ли еще комментарии
    const lastCommentRef = useRef<HTMLDivElement>(null); // Ref для последнего комментария

    // Функция для подгрузки новых комментариев
    const loadMoreComments = useCallback(() => {
        if (!isLoading && !isFetching && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isLoading, isFetching, hasMore]);

    useEffect(() => {
        if (comments && comments.count && comments.count < 10) {
            setHasMore(false);
        }
    }, [comments]);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading && !isFetching) {
                    loadMoreComments();
                }
            },
            {
                root: null, // viewport
                rootMargin: '100px', // Начнем загрузку за 200px до появления последнего элемента
                threshold: 0.1 // 10% элемента должно быть видно
            }
        );

        if (lastCommentRef.current) {
            observer.observe(lastCommentRef.current);
        }

        return () => {
            if (lastCommentRef.current) {
                observer.unobserve(lastCommentRef.current);
            }
        };
    }, [isLoading, isFetching, hasMore, loadMoreComments]);

    if (isLoading && page === 1) { // Пока идет первая загрузка, показываем лоадер
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div className={s.main}>
            {comments && comments.comments.length > 0 ?
                <>
                    {comments.comments.map((comment, index) => {
                        const isLastComment = index === comments.comments.length - 1; // Проверяем, является ли комментарий последним
                        return (
                            <Comment
                                article_id={article_id}
                                key={comment.id}
                                comment={comment}
                                ref={isLastComment ? lastCommentRef : null} // Назначаем ref только последнему комментарию
                            />
                        );
                    })}
                    {hasMore && isFetching && (
                        <div className={s.loading}>
                            Loading...
                        </div>
                    )}
                </>
                :
                <div>
                    {no_comments}
                </div>
            }
        </div>
    );
}
