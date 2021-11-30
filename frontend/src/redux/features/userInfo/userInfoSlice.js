import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
// fetch data from database
export const getUserData = createAsyncThunk("user/getUserData", async(token) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    return await axios.get(backendAPI+"/user/"+token)
    .then((res) => res.data)
})

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
        contact_settings: [],
        status: null,
    },
    extraReducers: {
        [getUserData.pending] : (state, action) =>{
            state.status = "loading"
        },
        [getUserData.fulfilled]: (state, action) =>{
            state = action.payload
            state["status"] = "success";
            return state
        },
        [getUserData.rejected]: (state, action) =>{
            state.status = "failed"
        }
    }
})

export default userInfoSlice.reducer