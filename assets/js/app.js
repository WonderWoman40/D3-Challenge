// @TODO: YOUR CODE HERE!
// Create the scatterPlot.
// set the dimensions and margins of the graph
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("#scatter").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("assets/data/data.csv").then(function(healthData) {

    //console.log(healthData);
      
      // parse data
        healthData.forEach(function(data) {
          data.smokes = +data.smokes;
          data.age = +data.age;
        });

      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d.age))
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

      // create axes
      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);

      // append circles
      var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("class", "stateCircle")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

       // append text in circles
      var circleText = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .attr("class", "stateText")
        .attr("font-size", "8px")
        .attr("fill", "red")
        .style("font-weight", "bold");


        // Add X axis label
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .text("Age(Median)");

        // Y axis label
        chartGroup.append("text")
        .attr("y", 0 - (margin.left / 2 +10))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .text("Smoke(%)");

    })    

};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
