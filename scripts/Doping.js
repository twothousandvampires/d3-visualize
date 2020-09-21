export function Doping(){
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then(res => res.json())
        .then(res => {
        const data = res
        create(data)
        })


        function create(data){
        const width = 800;
        const height = 600;
        const padding = 50;
        
        const radius = 10;
        
        let tickLabels = ["39:45","39:30","39:15","39:00","38:45","38:30","38:15","38:00","37:45","37:30","37:15","37:00"]
        
        let tickLabels2 = [1994,1996,1998,2000,2002,2004,2006,2008,2010,2012,2014,2016]
            tickLabels.reverse()
        let minTime = d3.min(data, d => d["Time"])
            minTime = Number(((minTime.split(":")[0] * 60) + Number(minTime.split(":")[1])) *1000)
        let maxTime = d3.max(data, d => d["Time"])
            maxTime = Number(((maxTime.split(":")[0] * 60) + Number(maxTime.split(":")[1])) *1000)
        
        const yScale = d3.scaleTime()
                        .domain([new Date(minTime),new Date(maxTime)])
                        .range([padding,height - padding])
        
        const xScale =d3.scaleLinear()
                        .domain([Number(d3.min(data, d=> d["Year"]-1)),Number(d3.max(data, d=> d["Year"]+1))])
                        .range([padding,width-padding])
               
        let info = d3.select("#container")
                        .append("div")
                        .html("<h1>Doping in Professional Bicycle Racing</h1><h3>35 Fastest times up Alpe d'Huez</h3>")
                        .style("text-align","center")
                        .style("padding-bottom","20px")
                        .style("font-size","24px")

        const svg = d3.select("#container")
                        .append("svg")
                        .attr("width",width)
                        .attr("height",height)
                        .style("border","2px solid black;")
                        .style("background-color","pink")
              
        let legend = d3.select("#container")
                        .append("div")
                        .attr("id","tooltip")
                        .style("opacity","0")
                        .style("position","absolute")
                        .attr("data-year","")
             
        function mouseoverHandler(d){
            legend.attr("data-year",d["Year"])
            legend.style("opacity","0.9")
            legend.style("left",(d3.event.pageX + 15) +'px')
            legend.style("top",(d3.event.pageY -50) +'px')
            legend.html('<p> '+d["Name"]+':  '+d["Nationality"]+'</p></br>Year: '+d["Year"]+', Time '+d["Time"]+'</br>'+d["Doping"]+'')
            legend.style("background-color","gray")
        }    
        function mouseoutHandler(d){
            legend.style("opacity","0")
        }
             
                svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx",(d)=>{ return xScale(Number(d["Year"])) })
                .attr("cy",(d)=>{ return yScale(new Date(Number(((d["Time"].split(":")[0] * 60) + Number(d["Time"].split(":")[1])) *1000)))})
                .attr("r",radius)
                .attr("class","dot")
                .attr("data-xvalue",(d)=>{ return Number(d["Year"])})
                .attr("data-yvalue",(d)=>{ return new Date(Number(((d["Time"].split(":")[0] * 60) + Number(d["Time"].split(":")[1])) *1000)) }) 
                .style("stroke","blue")
                .attr("fill",(d)=> {
                    if(d["Doping"] !== ""){
                    return  "orange"
                    }
                    else{
                    return "blue"
                    }
                    })
                .on("mouseover",mouseoverHandler)
                .on("mouseout",mouseoutHandler)
                
        svg.append("rect")
            .attr("x",width-50)
            .attr("y",height/2-150)
            .attr("width",15)
            .attr("height",15)
            .attr("fill","orange")
        
            svg.append("rect")
            .attr("x",width-50)
            .attr("y",height/2-120)
            .attr("width",15)
            .attr("height",15)
            .attr("fill","blue")
        
            svg.append("text")
                .attr("x",width-185)
                .attr("y",height/2-137)
                .text("Riders with doping allegations")
                .style("font-size","10px")
        
            svg.append("text")
                .attr("x",width-148)
                .attr("y",height/2-107)
                .text("No doping allegations")
                .style("font-size","10px")
           
        const yAxis = d3.axisLeft(yScale)               
                        .tickFormat(function(d,i){ return tickLabels[i] });
        
        const xAxis  = d3.axisBottom(xScale)
                        .tickFormat(function(d,i){ return tickLabels2[i] });
            svg.append("g")
            .attr("transform",`translate(${padding},0)`)
            .attr("id","y-axis")
            .call(yAxis)
                               
            svg.append("g")
            .attr("transform",`translate(0,${height-padding})`)
            .attr("id","x-axis")
            .call(xAxis)    
        }
}