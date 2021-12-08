import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const addInvestments = async (backendAPI, investData, investments) =>{
    const response = await axios.post(`${backendAPI}/investmentData/${investData.token}/${investData.actionType}`, investData[investments])
    .then((res) => res.data).catch((e) => {return {errorMessage: e, error: true}})
    if(response.error) {
        console.error(response)
        setTimeout(() => investData.resetInvestHistoryStatus(), 4500)
        throw new Error("-"+response.investmentCause)
    }
    const newData = {
        token: investData.token,
        trackedInvestments: investData.trackedInvestments,
    }
    for(let key of investData.selectedInvestments){
        let currInvest = newData.trackedInvestments
        let investHistoryArr = response[key.investmentType][key.symbol]
        //update newData, with proper value
        currInvest.push({
            ...key,
            dateAdded:{
                date: key.dateAdded.date,
                value: investHistoryArr[investHistoryArr.length-1].close
            }
        })
        //delete unneeded keys
        delete currInvest[currInvest.length-1].investedAmount
        delete currInvest[currInvest.length-1].prevBalance
        
    }
    //update userInfo state
    investData.updateUserData(newData)
    //reset status
    setTimeout(() => investData.resetInvestHistoryStatus(), 4500)
    return response
}
const initialLoad = async (backendAPI, investData) => {
    const response = await axios.post(`${backendAPI}/investmentData/${investData.token}/${investData.actionType}`, investData.trackedInvestments)
    .then((res) => res.data).catch((e) => {return {errorMessage: e, error: true}})
    if(response.error) {
        setTimeout(() => investData.resetInvestHistoryStatus(), 4500)
        console.error(response)
        throw new Error("-"+response.investmentCause)
    }
    setTimeout(() => investData.resetInvestHistoryStatus(), 4500)
    return response
}
// fetch data from database
export const getInvestData = createAsyncThunk("user/getInvestData", async(investData) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    switch(investData.actionType){
        case "addInvestment":
            return addInvestments(backendAPI, investData, "selectedInvestments")
        case "initialLoad":
            return initialLoad(backendAPI, investData)
        default:
            return console.error("No action type matched")
    }
})

export const investDataSlice = createSlice({
    name: 'investData',
    initialState: {
        _id: "",
        userId:"",
        crypto:{},
        stock:{},
        status: null
    },
    extraReducers: {
        [getInvestData.pending] : (state, action) =>{
            state.status = "loading"
        },
        [getInvestData.fulfilled]: (state, action) =>{
            state = {
                ...action.payload,
                crypto:{
                    ...state.crypto,
                    ...action.payload.crypto,
                },
                stock:{
                    ...state.stock,
                    ...action.payload.stock
                }
            }
            state["status"] = "success";
            
            return state
        },
        [getInvestData.rejected]: (state, action) =>{
            state["status"] = "failed"
            if(/[-]+/.test(!action.error.message)) return state
            state["errorSymbolCause"] = action.error.message.substring(1)
        }
    },
    reducers:{
        resetInvestHistoryStatus: (state) => {
            state["status"] = null
            return state
        }
    }
})
export const { resetInvestHistoryStatus } = investDataSlice.actions

export default investDataSlice.reducer