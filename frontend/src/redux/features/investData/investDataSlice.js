import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
// fetch data from database
export const getInvestData = createAsyncThunk("user/getInvestData", async(investData) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    switch(investData.actionType){
        case "addInvestment":
            const response = await axios.get(backendAPI+"/getInvestmentData/"+investData.token+"/"+investData.selectedInvestments)
            .then((res) => res.data).catch((e) => {return {errorMessage: e, error: true}})
            if(response.error) throw new Error("Updating Investment Data Failed") 
            const newData = {
                token: investData.token,
                trackedInvestments: investData.trackedInvestments,
                cashTransactions: investData.cashTransactions,
            }
            for(let key of investData.selectedInvestments){
                let trackedInvestments = newData.trackedInvestments
                //update newData
                trackedInvestments.push({
                    ...key,
                    dateAdded:{
                        date: key.dateAdded.date,
                        value: response.averageValue
                    }
                })
                //delete unneeded keys
                delete trackedInvestments[trackedInvestments.length-1].investedAmount
                delete trackedInvestments[trackedInvestments.length-1].prevBalance
                //update cashTransactions data
                newData.cashTransactions.push({changeBy: key.investedAmount, prevBalance: key.prevBalance})
            }
            //update userInfo state
            investData.updateUserData(newData)
            return response
        default:
            return console.error("No action type matched")
    }
})

export const investDataSlice = createSlice({
    name: 'userInfo',
    initialState: {
        meta_data:{},
        monthly_time_series:{},
        status: null
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