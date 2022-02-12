
import {unstable_batchedUpdates} from "react-dom"
import LoadingIcon from "../loadingIcon/LoadingIcon"
import { 
    useState, 
    useEffect, 
} from "react"
import MultiLineChart from "./MultiLineChart"
import { useSelector } from "react-redux"
import {
    instance, 
    //terminateWorker
} from "../../../app/workers/index"

// Create new instance
const DashboardGraph = ({

    //investments,
    investmentData,
    className,
    graphKey
}) =>{
    const [isLoading, setLoading] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const trackedInvestments = useSelector((state)=> state.userInfo.trackedInvestments)
    // useEffect(() => {
    //     return () => terminateWorker()
    // }, [])
    

    useEffect(()=>{
        let isMounted = true
        const parseGraphData = async() =>{
            if(!isMounted) return
            setLoading(true)
            const newData = await instance.processDataWithWebWorker({
                data: investmentData,
                trackedInvestments: trackedInvestments
            })
            if(!isMounted) return
            unstable_batchedUpdates(()=>{
                if(!isMounted) return
                setFilteredData(newData)
                setLoading(false)
            })
        }
        if(isMounted){
            parseGraphData()
            .catch(console.error)
        }
        return () => {
            isMounted = false
        }
    }, [investmentData, trackedInvestments])
    const dimensions = {
        width: 600, 
        height: 400, 
        margin: {
            top: 12,
            left: 50,
            bottom: 15,
            right: 0,        
        }
    }
    return (
        <>
        <div className={`d-flex ${className}`}>
            {isLoading && <LoadingIcon 
                bgColor={"rgba(0, 0, 0, 0.198)"}
            />}
            {filteredData.length !== 0 && 
                <MultiLineChart 
                    data = {filteredData}
                    dimensions = {dimensions}
                    className = {"dashboard-all-investments-graph-data"}
                />
            }
            
            {graphKey && 
                <div className={className+"-key"}>

                </div>
            }
        </div>
        
        </>
    )
}
export default DashboardGraph