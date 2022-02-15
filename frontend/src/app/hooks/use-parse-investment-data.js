import { unstable_batchedUpdates } from "react-dom";
import { useEffect, useState} from "react";
import {useWorker} from "./use-worker"
/**
 * Our hook that performs the calculation on the worker
 */
 export function useParseInvestmentHistory({
    initialData = [],
    investmentData,
    trackedInvestments
 }) {
    // We'll want to expose a wrapping object so we know when a calculation is in progress
    const [data, setData] = useState(initialData);
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
            data: investmentData,
            //we pass old data, to improve the parsing algo speed
            oldData: data,
        })
        .then(newData => {
            unstable_batchedUpdates(()=>{
                if(!isMounted) return
                setLoading(false)
                setData(newData)
            })
        }); // We receive the result here
        return () => {isMounted = false}
    
    /*we disable linter since we dont want to add data
    * to the dependency array. This would cause an infinite loop.
    * in addition, passing an accurate data array isn't 
    * essential, because it is used for perfomance optimizations
    * and without it, the parser would run fine, albeit slower
    */

    // eslint-disable-next-line
    }, [workerApi, investmentData, trackedInvestments]);
  
    return [data, isLoading];
  }
  