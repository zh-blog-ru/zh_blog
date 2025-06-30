import { BaseQueryFn, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article } from "./dto/article.dto";
import { CreateUserDto, } from "./dto/CreateUserDto.dto";
import { LoginUserDto } from "./dto/LoginUserDto.dto";
import { CommentsInterfaces } from "../../../Interfaces/CommentsInterface";
import { LikesInterfaces } from "../../../Interfaces/LikesInterfaces";
import { PrivateUserInterfaces } from "../../../serverAction/getCurrentUser";
import Cookies from 'js-cookie'

const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers) => {
            const csrfToken = Cookies.get('XSRF-TOKEN');
            if (csrfToken) {
                headers.set('X-XSRF-TOKEN', csrfToken);
            }
            return headers;
        },
    })(args, api, extraOptions);
    if (result.error) {
        return {
            error: result.error.data
        };
    }
    return result;
};

export const Api = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    tagTypes: ['Comments', 'Likes', 'User'],
    endpoints: builder => ({
        setArticles: builder.mutation<Article, Omit<Article, 'id'>>({
            query: (arg) => ({
                url: 'articles',
                method: 'POST',
                body: arg
            }),
        }),
        createUser: builder.mutation<{ id: number }, CreateUserDto>({
            query: (body: CreateUserDto) => {
                return {
                    url: 'registration',
                    method: "POST",
                    body
                }
            }
        }),
        loginUser: builder.mutation<any, LoginUserDto>({
            query: (body: LoginUserDto) => {
                return {
                    url: 'auth/login',
                    method: "POST",
                    body
                }
            }
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => {
                return {
                    url: 'auth/logout',
                    method: "POST",
                    credentials: 'include'
                }
            }
        }),
        deleteAccount: builder.mutation<void, void>({
            query: () => {
                return {
                    url: 'users/me/delete',
                    method: "POST",
                    credentials: 'include'
                }
            }
        }),
        setCommets: builder.mutation<CommentsInterfaces | null, { article_id: number, comment: string }>({
            query: ({ article_id, comment }) => {
                return {
                    method: 'POST',
                    url: `articles/${article_id}/comments`,
                    body: { comment },
                    credentials: 'include'
                }
            },
            async onQueryStarted({ article_id, comment }, { dispatch, queryFulfilled }) {
                try {
                    const { data: setComments } = await queryFulfilled
                    const patchResult = dispatch(
                        Api.util.updateQueryData('getCommentsByArticleId', { article_id }, (draft) => {
                            if (setComments) {
                                draft.comments.unshift(setComments)
                            }
                        })
                    )
                } catch {

                }
            },
        }),
        updateCommets: builder.mutation<Pick<CommentsInterfaces, 'data' | 'update_at'> | null, { article_id: number, comment: string, comment_id: number }>({
            query: ({ article_id, comment, comment_id }) => {
                return {
                    method: 'PATCH',
                    url: `articles/${article_id}/comments/${comment_id}`,
                    body: { comment },
                    credentials: 'include'
                }
            },
            async onQueryStarted({ article_id, comment, comment_id }, { dispatch, queryFulfilled }) {
                try {
                    const { data: updateComment, } = await queryFulfilled
                    const patchResult = dispatch(
                        Api.util.updateQueryData('getCommentsByArticleId', { article_id }, (draft) => {
                            if (updateComment) {
                                draft.comments.forEach((comment) => {
                                    if (comment.id == comment_id) {
                                        comment.data = updateComment.data
                                        comment.update_at = updateComment.update_at
                                    }
                                })
                            }
                        })
                    )
                } catch {

                }
            },
        }),
        getCommentsByArticleId: builder.query<{ count: number, comments: CommentsInterfaces[] }, { article_id: number, page?: number }>({
            query: ({ article_id, page }) => {
                return {
                    method: "GET",
                    url: `articles/${article_id}/comments?page=${page}`
                }
            },
            providesTags: (result) =>
                result
                    ?
                    [
                        ...result.comments.map(({ id }) => ({ type: 'Comments', id } as const)),
                        { type: 'Comments', id: 'LIST' },
                    ]
                    :
                    [{ type: 'Comments', id: 'LIST' }],
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return { endpointName, article_id: queryArgs.article_id }
            },
            merge: (currentCache, newItems) => {
                const existingIds = new Set(currentCache.comments.map((comment) => comment.id));

                const uniqueNewComments = newItems.comments.filter(
                    (comment) => !existingIds.has(comment.id)
                );

                const mergedComments = [...currentCache.comments, ...uniqueNewComments];
                return {
                    count: newItems.count,
                    comments: mergedComments,
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page
            },
        }),
        getLikesById: builder.query<LikesInterfaces[] | [], { article_id: number }>({
            query: ({ article_id }) => {
                return {
                    method: 'GET',
                    url: `articles/${article_id}/likes`
                }
            },
            providesTags: [{ type: 'Likes', id: 'LIST' }]
        }),
        setLikes: builder.mutation<null, { article_id: number, isLike: boolean }>({
            query: ({ article_id, isLike }) => {
                return {
                    method: 'POST',
                    url: `articles/${article_id}/likes`,
                    body: { isLike },
                    credentials: 'include'
                }
            },
            invalidatesTags: [{ type: 'Likes', id: 'LIST' }]
        }),
        deleteLikes: builder.mutation<null, { article_id: number }>({
            query: ({ article_id }) => {
                return {
                    method: 'DELETE',
                    url: `articles/${article_id}/likes`,
                    credentials: 'include'
                }
            },
            invalidatesTags: [{ type: 'Likes', id: 'LIST' }]
        }),
        getCurrentUser: builder.query<PrivateUserInterfaces, void>({
            query: () => ({
                method: 'GET',
                url: '/users/me',
                credentials: 'include'
            }),
            providesTags: [{ type: 'User' }]
        }),
        validationUsername: builder.query<boolean, { username: string }>({
            query: ({ username }) => ({
                method: "GET",
                url: 'validation/username/' + username,
            })
        }),
        sendCodeOldEmail: builder.mutation<any, void>({
            query() {
                return ({
                    method: 'POST',
                    url: 'code/send/old_email',
                    credentials: 'include'
                })
            },
        }),
        checkCodeOldEmail: builder.mutation<any, { code: string }>({
            query({ code }) {
                return ({
                    method: 'POST',
                    url: 'code/check/old_email',
                    body: { code },
                    credentials: 'include'
                })
            },
        }),
        sendCodeNewEmail: builder.mutation<any, { token: string, email: string }>({
            query({ token, email }) {
                return ({
                    method: 'POST',
                    url: 'code/send/new_email',
                    body: { token, email },
                    credentials: 'include'
                })
            },
        }),
        checkCodeNewEmail: builder.mutation<any, { code: string, email: string }>({
            query({ code, email }) {
                return ({
                    method: 'POST',
                    url: 'code/check/new_email',
                    body: { code, email },
                    credentials: 'include'
                })
            },
        }),
        changeEmail: builder.mutation<any, void>({
            query: () => ({
                method: 'PATCH',
                url: 'users/me/change_email',
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'User' }]
        }),
        changeProfile: builder.mutation<void, { about_me: string, username: string }>({
            query: (body) => ({
                method: 'PATCH',
                body,
                url: 'users/me',
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'User' }]
        }),
        sendCodeRegistration: builder.mutation<any, CreateUserDto & { token: string, politic: boolean }>({
            query(body) {
                return ({
                    method: 'POST',
                    url: 'code/send/registration',
                    body,
                    credentials: 'include'
                })
            },
        }),
        checkCodeRegistration: builder.mutation<any, { email: string, code: string }>({
            query(body) {
                return ({
                    method: 'POST',
                    url: 'code/check/registration',
                    body,
                    credentials: 'include'
                })
            },
        }),
        sendCodeResetPassword: builder.mutation<any, { email: string, token: string }>({
            query(body) {
                return ({
                    method: 'POST',
                    url: 'code/send/reset_password',
                    body,
                    credentials: 'include'
                })
            },
        }),
        checkCodeResetPassword: builder.mutation<any, { email: string, code: string }>({
            query(body) {
                return ({
                    method: 'POST',
                    url: 'code/check/reset_password',
                    body,
                    credentials: 'include'
                })
            },
        }),
        resetPassword: builder.mutation<any, { password: string; confirmPassword: string }>({
            query: (body) => ({
                url: 'users/me/reset_password',
                method: 'PATCH',
                body,
                credentials: 'include'
            }),
        }),
        changePassword: builder.mutation<any, { password: string, newPassword: string; confirmPassword: string }>({
            query: (body) => ({
                url: 'users/me/change_password',
                method: 'PATCH',
                credentials: 'include',
                body
            }),
        }),
        uploadImage: builder.mutation<void, FormData>({
            query: (body) => ({
                url: 'users/me/photo',
                method: 'PATCH',
                body,
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'User' }]
        }),
        deleteImage: builder.mutation<void, void>({
            query: (body) => ({
                url: 'users/me/photo',
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: [{ type: 'User' }]
        }),
        PostErros: builder.mutation<void, any>({
            query: (body) => ({
                url: 'errors',
                method: 'POST',
                credentials: 'include',
                body
            }),
        }),
        ResetCode: builder.mutation<void, void>({
            query: () => ({
                url: 'code/reset_code',
                method: 'POST',
                credentials: 'include',
            }),
        }),
    })
})

export const {
    useResetCodeMutation,
    usePostErrosMutation,
    useGetCommentsByArticleIdQuery,
    useSetArticlesMutation,
    useCreateUserMutation,
    useLoginUserMutation,
    useSetCommetsMutation,
    useGetLikesByIdQuery,
    useSetLikesMutation,
    useDeleteLikesMutation,
    useGetCurrentUserQuery,
    useLazyValidationUsernameQuery,
    useValidationUsernameQuery,
    useChangeEmailMutation,
    useChangeProfileMutation,
    useSendCodeOldEmailMutation,
    useCheckCodeOldEmailMutation,
    useSendCodeNewEmailMutation,
    useCheckCodeNewEmailMutation,
    useSendCodeRegistrationMutation,
    useCheckCodeRegistrationMutation,
    useSendCodeResetPasswordMutation,
    useCheckCodeResetPasswordMutation,
    useUploadImageMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useDeleteImageMutation,
    useUpdateCommetsMutation,
    useLogoutUserMutation,
    useDeleteAccountMutation
} = Api

export const {
    invalidateTags
} = Api.util