import { createSlice } from '@reduxjs/toolkit'

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        _id: "", 
        email: "",
        metadata: {},
        firstName : "",
        lastName : "",
        verifiedEmail: false,
        connected_banks: [],
        tracked_investments: [],
        contact_settings: []
    },
    reducers: {
        // loadStore: (state, ) => {
        //     state[action.payload[0]] = action.payload[1]
        // }
    },
})

// Action creators are generated for each case reducer function
export const { loadStore } = userInfoSlice.actions

export default userInfoSlice.reducer