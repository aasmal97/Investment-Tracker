//generate random pastel colors
function pastelColors(){
    var r = (Math.round(Math.random()* 100) + 100).toString(16);
    var g = (Math.round(Math.random()* 100) + 100).toString(16);
    var b = (Math.round(Math.random()* 100) + 100).toString(16);
    return '#' + r + g + b;
}
export default pastelColors