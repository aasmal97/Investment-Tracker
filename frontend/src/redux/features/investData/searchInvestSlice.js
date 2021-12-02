import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
// fetch data from database
export const getSearchData = createAsyncThunk("user/searchInvest", async(keywords) =>{
    const backendAPI = process.env.REACT_APP_BACKEND_API
    return await axios.get(backendAPI+`/searchInvestments/${keywords.token}/${keywords.type}/${keywords.keywords}`)
    .then((res) => res.data)
})

export const searchInvestSlice = createSlice({
    name: 'searchInvestmests',
    initialState: {
        status: null
    },
    extraReducers: {
        [getSearchData.pending] : (state, action) =>{
            state.status = "loading"
        },
        [getSearchData.fulfilled]: (state, action) =>{
            state = action.payload
            state["status"] = "success";
            return state
        },
        [getSearchData.rejected]: (state, action) =>{
            state.status = "failed"
        }
    },
    reducers: {
        resetSearch: () => {}
    },
})
export const { resetSearch } = searchInvestSlice.actions
export default searchInvestSlice.reducer