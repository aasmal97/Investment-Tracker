import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from '../redux/features/userInfo/userInfoSlice';
import investDataReducer from './features/investData/investDataSlice';
import searchInvestReducer from './features/investData/searchInvestSlice';
export default configureStore({
    reducer: {
        userInfo: userInfoReducer,
        investmentData: investDataReducer,
        searchInvestments: searchInvestReducer
    },
})

