import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
// fetch data from database
export const getUserData = createAsyncThunk("user/getUserData", async(requestData) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    return await axios.get(backendAPI+"/user/"+requestData.token)
    .then((res) => {
        //check if we need to update investment data too
        if(requestData.investmentData) {
            requestData.investmentData({
                resetInvestHistoryStatus: requestData.resetInvestHistoryStatus,
                token: requestData.token, 
                trackedInvestments: res.data.trackedInvestments,
                actionType: requestData.actionType
            }) 
        }
        if(requestData.resetUserDataStatus) setTimeout(() => requestData.resetUserDataStatus(), 4500)
        return res.data
    }).catch((e) =>{
        setTimeout(() => requestData.resetUserDataStatus(), 4500)
        throw new Error("Updating your profile failed")
    })
})
export const updateUserData = createAsyncThunk("user/updateUserData", async(userData) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    return await axios.put(backendAPI+"/user/"+userData.token, userData)
    .then((res) =>  res.data)
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
        cashTransactions:[{}],
        trackedInvestments: [],
        contactSettings: [],
        status: null,
        updateStatus: "success"
    },
    extraReducers: {
        [getUserData.pending] : (state, action) =>{
            state.status = "loading"
        },
        [getUserData.fulfilled]: (state, action) =>{
            state = action.payload
            state["status"] = "success";
            state["updateStatus"] = "success"
            return state
        },
        [getUserData.rejected]: (state, action) =>{
            state.status = "failed"
        },
        [updateUserData.pending] : (state,action) =>{
            state.updateStatus = "loading"
        },
        [updateUserData.fulfilled] : (state, action) =>{
            state = {...state, ...action.payload} 
            state["status"] = "success"
            state["updateStatus"] = "success"
            return state
        },
        [updateUserData.rejected]: (state, action) =>[
            state.updateStatus = "failed"
        ]
    },
    reducers:{
        resetUserDataStatus: (state) => {
            state["status"] = null
            return state
        }
    }
})
export const { resetUserDataStatus } = userInfoSlice.actions

export default userInfoSlice.reducer
