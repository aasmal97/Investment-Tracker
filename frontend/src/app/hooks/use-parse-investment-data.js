import { unstable_batchedUpdates } from "react-dom";
import { useEffect, useState} from "react";
import {useWorker} from "./use-worker"
/**
 * Our hook that performs the calculation on the worker
 */
 export function useParseInvestmentHistory({
    investmentData,
    trackedInvestments
 }) {
    // We'll want to expose a wrapping object so we know when a calculation is in progress
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false)

    // acquire our worker
    const { workerApi } = useWorker();
  
    useEffect(() => {
      let isMounted = true
      // We're starting the calculation here
      if(!isMounted) return
      setLoading(true)
      workerApi
        .parseData({
            trackedInvestments: trackedInvestments,
            data: investmentData
        })
        .then(newData => {
            if(!isMounted) return
            unstable_batchedUpdates(()=>{
                setLoading(false)
                setData(newData)
            })
        }); // We receive the result here
        return () => {isMounted = false}
    }, [workerApi, investmentData, trackedInvestments]);
  
    return [data, isLoading];
  }
  