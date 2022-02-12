import * as Comlink from "comlink";

// eslint-disable-next-line
import Worker from 'comlink-loader!./worker'; // inline loader
const instance = new Worker("./worker");
// const obj = Comlink.wrap(instance);
// console.log(obj)
// const terminateWorker = () =>{
//     instance.terminate()
// }
export {
    instance, 
    //terminateWorker
};