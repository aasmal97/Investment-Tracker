import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
const addInvestments = async (backendAPI, investData, investments) =>{
    const response = await axios.get(backendAPI+"/investmentData/"+investData.token+"/"+JSON.stringify(investData[investments]))
    .then((res) => res.data).catch((e) => {return {errorMessage: e, error: true}})
    if(response.error) throw new Error("Updating Investment Data Failed")
    const newData = {
        token: investData.token,
        trackedInvestments: investData.trackedInvestments,
        cashTransactions: investData.cashTransactions,
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
        //update cashTransactions data
        newData.cashTransactions.push({changeBy: key.investedAmount, prevBalance: key.prevBalance})
    }
    //update userInfo state
    investData.updateUserData(newData)
    return response
}

// fetch data from database
export const getInvestData = createAsyncThunk("user/getInvestData", async(investData) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    switch(investData.actionType){
        case "addInvestment":
            return addInvestments(backendAPI, investData, "selectedInvestments")
        case "initialLoad":
            const response = await axios.get(`${backendAPI}/investmentData/${investData.token}/${JSON.stringify(investData.trackedInvestments)}/${investData.actionType}`)
            .then((res) => res.data).catch((e) => {return {errorMessage: e, error: true}})
            if(response.error) throw new Error("Updating Investment Data Failed")
            return response
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
        }
    }
})

export default investDataSlice.reducer