import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        userData: {}
    },
    reducers: {
        setUser(state, action) {
            state.userData = action.payload || {}
            state.isAuthenticated = true
        },
        clearUser(state, action) {
            state.userData = {}
            state.isAuthenticated = false
        }
    }
})

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;