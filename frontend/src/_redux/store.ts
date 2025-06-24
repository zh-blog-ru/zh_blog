import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { Api } from './api/Api'
import { CurrentUserSlice } from './Slices/UserSlice'
import { LocaleSlice } from './Slices/LocaleSlice'
export const makeStore = () => configureStore({
    reducer: {
        [Api.reducerPath]: Api.reducer,
        [LocaleSlice.name]: LocaleSlice.reducer,
        [CurrentUserSlice.name]: CurrentUserSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(Api.middleware)
    },
})

export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()