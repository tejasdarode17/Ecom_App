import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: {}
    },
    reducers: {

        setUser(state, action) {
                

        }

    }
})



export const { setUser } = authSlice.actions;
export default authSlice;