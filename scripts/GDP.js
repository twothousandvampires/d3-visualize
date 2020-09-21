export function GDP(){
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then(res => res.json())
.then(res => {
  const { data } = res;
  
  create(data)
})


function create(data){
  
  const width = 800;
  const height = 600;
  const padding = 50;
  
  const yScale = d3.scaleLinear()
              .domain([0,d3.max(data, d => d[1])])
              .range([height-padding,padding])
  
 
      
  const barWidth = width / data.length
  
  
const minYear = d3.min(data, (d) => d[0]);
const maxYear = d3.max(data, (d) => d[0]);
const xScale = d3.scaleTime()
            .domain([new Date(minYear), new Date(maxYear)])
            .range([padding, width - padding]);
  
  
  let info = d3.select("#container")
                .append("div")
                .html("<h1>United States GDP</h>")
                .style("text-align","center")
                .style("padding-bottom","20px")
                .style("font-size","24px")
  
  const svg = d3.select("#container")
                .append("svg")
                .attr("width",width)
                .attr("height",height)
                .style("border","2px solid black")
                .style("box-shadow","4px 4px 6px rgba(0,0,0,0.4)")
  
  
  
  let tooltip = d3.select("#container")
    .append("div")
    .attr("id","tooltip")
    .style("opacity","0")
    .style("position","absolute")
    .style("background-color","gray")
    .attr("data-date","")
  
  function mouseoverHandler(d){
    tooltip.attr("data-date",d[0])
    tooltip.style("opacity","0.7")
    tooltip.style("left",(d3.event.pageX + 10) +'px')
    tooltip.style("top",(d3.event.pageY - 10) +'px')
    tooltip.html('<p>'+d[0]+'</p></br><p> '+d[1]+' </p>')
  }
  
  function mouseoutHandler(d){
        tooltip.style("opacity","0")
  }
  
        svg.selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
           .attr("class","bar")
           .attr("data-date",d=>d[0])
           .attr("data-gdp",d=>d[1])
           .attr("x",(d,i) => { return xScale(new Date(d[0]))})
           .attr("y",(d) => { return yScale(d[1])})
           .attr("width",barWidth)
           .attr("height",(d)=> {return height - yScale(d[1])-padding})
           .attr("fill","blue")
           .on("mouseover",mouseoverHandler)
           .on("mouseout",mouseoutHandler)
  
        const xAxis = d3.axisBottom(xScale)
        
        const yAxis = d3.axisLeft(yScale)
        
        svg.append("g")
          .attr("id","x-axis")
          .attr("transform",`translate(0,${height -padding })`)
          .call(xAxis)
        
         svg.append("g")
          .attr("id","y-axis")
          .attr("transform",`translate(${padding},0)`)
          .call(yAxis)
}
}