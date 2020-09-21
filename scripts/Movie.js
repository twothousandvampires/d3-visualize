export function Movie(){
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json")
.then(res => res.json())
.then(function(res){
  
  const data = res
  const WIDTH = 960;
  const HEIGHT = 570;
  
    let l = 0

let info = d3.select("#container")
            .append("div")
            .html("<h1>Movie Sales</h1><h3>Top 100 Most Sold Movies Grouped by Genre</h3>")
            .style("padding-bottom","20px")
            .style("font-size","24px")

  let tooltip = d3.select("#container")
              .append("div")
              .style("position","absolute")
              .style("opacity",0)
              .attr("id","tooltip")
  
  
  let svg = d3.select("#container")
      .append("svg")
      .attr("width",WIDTH)
      .attr("height",HEIGHT)
  
 
   const color = d3.scaleOrdinal(d3.schemeCategory10);
  
   let root = d3.hierarchy(data)
      .sum((d)=> { return d.value })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
  
   
   let treemap = d3.treemap()
    .size([WIDTH, HEIGHT])
    .paddingInner(1)
    (root)
  
   
   
     
       svg.selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("id", function(d) { return d.data.id; })
      .attr("class", "tile")
      .attr("x",(d)=> { return d.x0})
      .attr("y",(d)=> { return d.y0 })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("data-name", function(d){
        return d.data.name;
      })
      .attr("data-category", function(d){
        return d.data.category;
      })
      .attr("data-value", function(d){
        return d.data.value 
      })
      .attr("fill",(d)=>{
        return color(d.data.category)
      })
      .on("mouseover",(d)=>{
         tooltip.style("opacity",0.9)
         tooltip.attr("data-value",d.data.value)
         tooltip.html("<p>ffff</p>")
         tooltip.style("left",(d3.event.pageX +10)+"px")
         tooltip.style("top",(d3.event.pageY +10)+"px")
         tooltip.html('Name: ' + d.data.name + 
          '<br>Category: ' + d.data.category + 
          '<br>Value: ' + d.data.value)
       })
      .on("mouseout",(e)=>{
         tooltip.style("opacity",0)
       })
      
     svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x",(d) => { return d.x0})
        .attr("y",(d)=> { return d.y0 + 15})
        .selectAll("tspan")
        .data(function(d){ return d.data.name.split(/(?=[A-Z][^A-Z])/g)})
        .enter()
        .append("tspan")
         .attr("class","words")
        .attr("x",(d) => {-20})
        .attr("y", function(d, i) { return d.y0;})
        .attr("dy",(d,i)=> { if (i != 0){ return "1em"}})
        .attr("dx",(d,i)=> {let r=''; if( i != 0 ){ r =`-${l *4.2}px`;l = d.length}else{l=d.length};return r})
        .text(function(d) { return d; });
  
    console.log(root.leaves()[1])
  
     
      let categories = root.leaves().map(function(d){
                                       return d.data.category
                                       })
      let legendCategory = [];
      
      for(let i =0;i<categories.length;i++){
        if(!legendCategory.includes(categories[i])){
          legendCategory.push(categories[i])
        }
      }
      
      let legendsvg = d3.select("#container")
                .append("svg")
                .attr("id","legend")
                .attr("width",1000)
                .attr("height",200)
      
      legendsvg.selectAll("rect")
               .data(legendCategory)
               .enter()
               .append("rect")
               .attr("class","legend-item")
               .attr("width",20)
               .attr("height",20)
               .attr("x",(d,i)=>{return 130 *i})
               .attr("fill",(d)=>{return color(d)})
      legendsvg.selectAll("text")
      .data(legendCategory)
      .enter()
      .append("text")
      .attr("x",(d,i)=>{return 130*i+22})
      .attr("y",15)
      .text((d)=> d)
})
}