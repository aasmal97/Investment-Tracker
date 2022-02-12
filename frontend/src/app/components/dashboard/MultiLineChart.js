import { 
    useEffect, 
    useRef, 
} from "react"
import {
    min,
    max,
    select,
    scaleLinear,
    scaleTime,
    extent,
    axisBottom,
    axisLeft,
    line
  } from 'd3';
  
const MultiLineChart = ({
    data, 
    dimensions,
    className
}) =>{
    const { width, height, margin } = dimensions;
    const svgRef = useRef()
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    useEffect(()=>{
        //all d3 code goes here.
        //that way we re-render when data changes
        const parseTime = (d) =>{
            return new Date(d.time * 1000)
        }
        const xScale = scaleTime()
            .domain(extent(data[0].values, parseTime))
            .range([0, width])

        const yScale = scaleLinear()
            .domain([
               min(data, (d) => d.dataMin) / 1.5,
               max(data, (d) => d.dataMax) * 1.5
            ])
            .range([height, 0])
        
        //root container
        const svgEl = select(svgRef.current)
        //remove all previous content
        //before adding new ones. 
        svgEl.selectAll("*").remove();

        //start adding new elements
        const svg = svgEl.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            
        //add x grid lines with labels
        const xAxis = axisBottom(xScale)
            .ticks(5)
            .tickSize(-height + margin.bottom)
        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
        
        //add y grid lines with labels
        const yAxis = axisLeft(yScale)
            .ticks(5)
            .tickSize(-width + margin.left)
            .tickFormat((val) => `$${val}`);
        const yAxisGroup = svg.append("g").call(yAxis);
        yAxisGroup.select(".domain").remove();
        yAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");

        
        // Draw the lines
        const singleLine = line()
            .x((d) => xScale(new Date(d.time * 1000)))
            .y((d) => yScale(d.close));

        
        svg.selectAll(".line")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", (d) => d.color? d.color : "#6bc76b")
            .attr("stroke-width", 3)
            .attr("d", (d) => singleLine(d.values));
    }, [data, width, height, margin])
    return (
        <svg 
            ref={svgRef}
            className={className}
            viewBox = {`0 0 ${svgWidth} ${svgHeight}`}
        >
        </svg>
    )
}
export default MultiLineChart
