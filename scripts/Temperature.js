export function Temperature(){
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
        .then(res => res.json())
        .then(res => {
        const data = res
        create(data)
        })

        function create(data){
        const width = 1200;
        const height = 500;
        const padding = 100;
        
        const baseTemp = data["baseTemperature"]
        const tempArr = data['monthlyVariance']
        
        const months = ['January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November','December']
        
        const legendCells = [
            "#00008B",
            "#0000FF",
            "#4169E1",
            "#6495ED",
            "#B0C4DE",
            "#98FB98",
            "#DAA520",
            "#B8860B",
            "#A0522D",
            "#8B4513",
            "#800000"
        ]
        
        const legendTemp =[2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8]
        
        const years = [1760,1770,1780,1790,1800,1810,1820,1830,1840,1850,1860,1870,1880,1890,1900,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010]
        
        const barWidth = (width -padding * 2) / tempArr.length
        const barHeight= (height - 2 * padding)/12
        

        const xScale =d3.scaleTime()
                        .domain([new Date(d3.min(tempArr,d => d['year'])),new Date(d3.max(tempArr,d=>d['year']))])
                        .range([padding,width-padding])
        
                        
        const yScale = d3.scaleLinear()    
            .domain([d3.min(tempArr, d=> d["month"]-1.5),d3.max(tempArr, d=> d["month"]-0.5)])
            .range([padding,height-padding])
        
        let info = d3.select("#container")
            .append("div")
            .html("<h1>Monthly Global Land-Surface Temperature</h1><h3>1753 - 2015: base temperature 8.66℃</h3>")
            .style("text-align","center")
            .style("padding-bottom","20px")
            .style("font-size","24px")

        const svg = d3.select("#container")
            .append("svg")
            .attr("width",width)
            .attr("height",height)
            
        const legend = d3.select("#container")
                .append("svg")
                .attr("id","legend")
                .attr("width", width)
                .attr("heigth",30)
                       
        legend.selectAll("rect")
                .data(legendCells)
                .enter()
                .append("rect")
                .attr("x",(d,i)=> { return i*40 +padding})
                .attr("y",10)
                .attr("width",40)
                .attr('height',35)
                .attr("fill",(d,i) => { return d})
                .attr("class","legendcell")
                .style("stroke", "black")     	
                .style("stroke-width",1);
               
        const xlegendScale = d3.scaleLinear()                                           .domain([1,10])
                    .range([padding,459])
        
        svg.selectAll("rect")
            .data(tempArr)
            .enter()
            .append("rect")
            .attr("x", (d) => { return xScale(new Date(d["year"]))})
            .attr("y", (d) => { return yScale(d["month"]-1.5)})
            .attr("width",barWidth*12)
            .attr("height",barHeight)
            .attr("class","cell")
            .attr("data-temp",(d)=>{ return baseTemp + d[ "variance"]})
            .attr("data-month",(d)=> {return d['month']-1})
            .attr("data-year",(d)=> {return Number(d['year'])})  
            .attr("fill",(d)=>{
            if(baseTemp + d["variance"] < 2.8){
            return '#00008B'
            }
            else if(baseTemp + d[ "variance"] < 3.9){
            return '#0000FF'
            }
            else if(baseTemp + d[ "variance"] < 5.0){
            return '#4169E1'
            }
            else if(baseTemp + d[ "variance"] < 6.1){
            return '#6495ED'
            }
            else if(baseTemp + d[ "variance"] < 7.2){
            return '#B0C4DE'
            }
            else if(baseTemp + d[ "variance"] < 8.3){
            return '#98FB98'
            }
            else if(baseTemp + d[ "variance"] < 9.5){
            return '#DAA520'
            }
            else if(baseTemp + d[ "variance"] < 10.6){
            return '#B8860B'
            }
            else if(baseTemp + d[ "variance"] < 11.7){
            return '#A0522D'
            }
            else if(baseTemp + d[ "variance"] < 12.8){
            return '#8B4513'
            }
            else{
            return '#800000'
            }
        })
            .on("mouseover",mouseoverHandler)
            .on("mouseout",mouseoutHandler)
        
        
        let tooltip = d3.select("#container")
                        .append("div")
                        .attr("id","tooltip")
                        .style("opacity","0")
                        .style("position","absolute")
                        .attr("data-year","")
                
        function mouseoverHandler(d){
            tooltip.attr("data-year",d["year"])
            tooltip.style("background-color","rgba(255,255,255,0.7)")
            tooltip.style("opacity","1")
            tooltip.style("left",(d3.event.pageX + 15) +'px')
            tooltip.style("top",(d3.event.pageY -50) +'px')
            tooltip.html('<p>'+d['year']+' - '+months[d['month']-1]+'</p></br><p>'+(baseTemp+d["variance"]).toFixed(1)+'℃</p></br><p>'+d["variance"].toFixed(1)+'</p>')
        
        }    
        function mouseoutHandler(d){
            tooltip.style("opacity","0")
        }
        
        const xAxis = d3.axisBottom(xScale)
                        .ticks(26)
                        .tickFormat(function(d,i){ return years[i] });
                
        const xLegendAsix = d3.axisBottom(xlegendScale)
                            
                            .tickFormat(function(d,i){ return legendTemp[i] });
        
        legend.append("g")
            .attr("transform",`translate(40,44)`)
            .call(xLegendAsix)
        
        svg.append("g") 
            .attr("transform",`translate(0,${height - padding })`)
            .attr("id","x-axis")
        .call(xAxis)
        
        svg.append("text")
            
            .attr("y",`${height-padding/2+10}`)
            .attr("x",`${width/2}`)
            .style("text-anchor", "middle")
            .text("Years")
        
        svg.append("text")
            
            .attr("y", height/2)
            .attr("x", padding/2)
        .attr("dx", "-15em")
                    .attr("dy", "-14em")
        .attr("transform", function(d) {
                        return "rotate(-90)" 
                        })
            .style("text-anchor", "end")
            .text("Months")
        
        const yAxis = d3.axisLeft(yScale) 
                        .tickFormat(function(d,i){ return months[i] });
        
        svg.append("g")
            .attr("id","y-axis")                        .attr("transform",`translate(${padding},0)`)
            .call(yAxis)
        }
    }