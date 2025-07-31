import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        userData: {}
    },
    reducers: {
        setUser(state, action) {
            state.userData = action.payload
            state.isAuthenticated = true
        }
    }
})



export const { setUser } = authSlice.actions;
export default authSlice.reducer;