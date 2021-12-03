import { useState, useEffect, useRef } from "react"
const generateDefaultKeys = (arr) =>{
    let newObj = {}
    for (let i of arr) newObj[i] = true
    return newObj
}

const DashboardGraph = (props) =>{
    const [graphKeys, setGraphKeys] = useState(generateDefaultKeys(props.investments))
    
    return (
        <>
        <div className={`d-flex ${props.className}`}>
            <div className={props.className+"-data"}>
            </div>
            {props.graphKey && 
                <div className={props.className+"-key"}>

                </div>
            }
        </div>
        
        </>
    )
}
export default DashboardGraph