import { LocaleType } from "@/i18n/locales";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialStateType = {
    locale: LocaleType | ''
}
const initialState: InitialStateType = { locale: '' }

export const LocaleSlice = createSlice({
    name: 'locale',
    initialState,
    reducers: {
        updateLocale(state: InitialStateType, action: PayloadAction<LocaleType | "">):any {
            state.locale = action.payload
        }
    },
})

// Extract and export each action creator by name
export const { updateLocale } = LocaleSlice.actions
// Export the reducer, either as a default or named export