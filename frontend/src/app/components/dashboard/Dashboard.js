import { useEffect, useState } from "react"
import {useDispatch, useSelector } from "react-redux";
import axios from "axios";
//import updated from "../../../redux/features/userInfo/userInfoSlice"
import { useAuth } from '../../contexts/AuthContext';
const Dashboard = (props) =>{
    const reduxData = useSelector((state) => state.userInfo)
    const dispatch = useDispatch()
    const {currentUser} = useAuth()
    useEffect(async()=>{
        if(currentUser && reduxData._id !== "") return
        const backendAPI = process.env.REACT_APP_BACKEND_API
        console.log(currentUser.accessToken)
        const backendData = await axios.get(backendAPI+"/user/"+currentUser.accessToken)
        console.log(backendData)
        //dispatch(updated(backendData.data))
    }, [])
    return(
        <div className="dashboard-container">

        </div>
    )
}
export default Dashboard