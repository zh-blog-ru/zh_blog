import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PrivateUserInterfaces } from "../../../serverAction/getCurrentUser";

type InitialStateType = {
    user: PrivateUserInterfaces | false
}
const initialState: InitialStateType = {
    user: false
}

export const CurrentUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state: InitialStateType, action: PayloadAction<PrivateUserInterfaces | false>): any {
            state.user = action.payload
        }
    },
})

// Extract and export each action creator by name
export const { setCurrentUser } = CurrentUserSlice.actions
// Export the reducer, either as a default or named export