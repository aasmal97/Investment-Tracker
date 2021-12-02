import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
// fetch data from database
export const getInvestData = createAsyncThunk("user/getInvestData", async(token) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    return await axios.get(backendAPI+"/user/"+token)
    .then((res) => res.data)
})

export const investDataSlice = createSlice({
    name: 'userInfo',
    initialState: {
        meta_data:{},
        monthly_time_series:{}
    },
    extraReducers: {
        [getInvestData.pending] : (state, action) =>{
            state.status = "loading"
        },
        [getInvestData.fulfilled]: (state, action) =>{
            state = action.payload
            state["status"] = "success";
            return state
        },
        [getInvestData.rejected]: (state, action) =>{
            state.status = "failed"
        }
    }
})

export default investDataSlice.reducer