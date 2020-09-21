export function Education(){
    async function getData(){
        const data1 =  await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
        const dataedu = await data1.json()
        const data2 = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
        const datacou = await data2.json()
        const data = [dataedu,datacou]
        return data;
    }
    getData().then(res => {
  
    let tooltip = d3.select("#container").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position","absolute")

    const education = res[0];
    const countries = res[1];
    
    const width = 1000;
    const height = 1000;
    
    let info = d3.select("#container")
            .append("div")
            .html("<h1>United States Educational Attainment</h1><h3>Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h3>")
            .style("text-align","center")
            .style("padding-bottom","20px")
            .style("font-size","24px")

    let svg = d3.select("#container")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
    
    
    const colors = [
        '#00008B',
        '#0000FF',
        '#4169E1',
        '#6495ED',
        '#98FB98'
    ]
    
    const minEdu = d3.min(education,e => e.bachelorsOrHigher)
    const maxEdu = d3.max(education, e=> e.bachelorsOrHigher)  
  
    let colorScale = d3.scaleThreshold()
    .domain(d3.range(minEdu, maxEdu, (maxEdu-minEdu)/5))
    .range(colors);
  
    let xScale = d3.scaleLinear()
            .domain([minEdu,maxEdu])
            .range([600,800])
 
  
    let g = svg.append("g")
          .attr("id","legend")
          .selectAll("rect")          
          .data(colorScale.range().map(function(d){
               const data = colorScale.invertExtent(d);
               if(data[0] == null) {data[0] = xScale.domain()[0]}
               if(data[1] == null) {data[0] = xScale.domain()[1]}
               console.log(data)
               return data
               
          }))
          .enter()
          .append("rect")
          .attr("x",(d)=>{ return xScale(d[0])})
          .attr("y", 0)
          .attr("height",9)
          .attr("width",(d)=> { return xScale(d[1]) - xScale(d[0])})
          .attr("fill",(d)=> {
               return colorScale(d[0])
          })
  
    const g2 = svg.append("g")
          g2.call(d3.axisBottom(xScale).tickValues(colorScale.domain()))
            

  
    let datajson = topojson.feature(countries, countries.objects.counties).features
  
    let path = d3.geoPath();
  
  
  
  
     svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(datajson)
      .enter().append("path")
      .attr("class", "county")
      .attr("data-fips", function(d) {
        return d.id
       })
      .attr("data-education", function(d) {
        var result = education.filter(function( obj ) {
          return obj.fips == d.id;
        });
        if(result[0]){
          return result[0].bachelorsOrHigher
        }
       
        return 0
       })
      .attr("fill", function(d) { 
        var result = education.filter(function( obj ) {
          return obj.fips == d.id;
        });
        if(result[0]){
          return colorScale(result[0].bachelorsOrHigher)
        }
        
        return colorScale(0)
       })
      .attr("d", path)
      .on("mouseover", function(d) {      
        tooltip.style("opacity", .9); 
        tooltip.html(function() {
          var result = education.filter(function( obj ) {
            return obj.fips == d.id;
          });
          if(result[0]){
            return result[0]['area_name'] + ', ' + result[0]['state'] + ': ' + result[0].bachelorsOrHigher + '%'
          }
          
          return 0
        })
      .attr("data-education", function() {
        var result = education.filter(function( obj ) {
          return obj.fips == d.id;
        });
        if(result[0]){
          return result[0].bachelorsOrHigher
        }
        
        return 0
       })
          .style("left", (d3.event.pageX + 10) + "px") 
          .style("top", (d3.event.pageY - 28) + "px"); }) 
          .on("mouseout", function(d) { 
            tooltip.style("opacity", 0); 
          });
  
})
}