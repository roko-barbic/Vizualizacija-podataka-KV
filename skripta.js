import data3 from './csvjson.json' assert { type: 'json' };
//console.log(data3);

// Step 3
var svg = d3.select("svg"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = 200;

const selectYears = document.getElementById("years");
const selectCountry = document.getElementById("countrys");
var arrayOfCountrys = [];
var flag = 0;

// Function to create the pie chart


window.createPieChart = function() {    
 //   function createPieChart(){
    var country = document.getElementById("countrys").value;
    var year = document.getElementById("years").value;
    //document.getElementById("demo").innerHTML = year + " " + country;

    //console.log(data3);
    console.log(year + " "+ country);

    // var filteredData = data3.filter(function(item) {
    //     return item["Country/Territory"] === country && item["Year"] === parseInt(year);
    // });
    var filteredData=[];

    for (let i = 0; i < data3.length; i++) {
        let item = data3[i];
        if (item["Country/Territory"] === country && item["Year"] === parseInt(year)) {
            filteredData = item;
            break;
        }
    }

        console.log(filteredData);
        var drowningValue = filteredData["Drowning"];
        const chartData = Object.entries(filteredData).map(([category, value]) => ({ name: category, value }));
        console.log(chartData);

        const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;
    const labelRadius = radius + 150;
    const colors = ['#ffd384','#94ebcd','#fbaccc','#d3e0ea','#fa7f72',
    '#23E1AE','#198064','#074E3B','#07474E','#0497A7',
    '#05C6DB','#48E7F9','#48F9E0','#0BD0B4','#05AC70',
    '#04DF91','#4C9009','#66C508','#95ED3D','#D2ED3D',
    '#9CB609','#6C7E08','#985D05','#D48A1D','#E9B262',
    '#EC5424','#8F2605','#986657','#3C1B93','#A546AB',
    '#8D1A55'];
    // Create the SVG element
    const svg = d3.select("svg")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Define the pie layout
    const pie = d3.pie()
      .value(d => d.value);

    // Define the arc shape
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Generate the pie slices
    const slices = svg.selectAll("path")
      .data(pie(chartData))
      .enter()
      .append("path")
      .attr("d", arc)
      .on("mouseover", handleMouseOver)
      .attr("fill", (d, i) => colors[i]); // Use different colors for each slice

    // Add labels to the slices
    const labels = svg.selectAll("text")
      .data(pie(chartData))
      .enter()
      .append("text")
      .attr("transform", d => {
        const centroid = arc.centroid(d);
        const x = centroid[0] * labelRadius / radius;
        const y = centroid[1] * labelRadius / radius;
        return `translate(${x}, ${y})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => d.data.name);
    
    function handleMouseOver(d,i){
        d3.select(this).attr("opacity",0.8);
        document.getElementById("name").innerHTML = d.data.name;
        document.getElementById("year").innerHTML = d.data.value;
    }
    /* var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Step 4
    var ordScale = d3.scaleOrdinal()
            .domain(data3)
            .range(['#ffd384','#94ebcd','#fbaccc','#d3e0ea','#fa7f72',
                    '#23E1AE','#198064','#074E3B','#07474E','#0497A7',
                    '#05C6DB','#48E7F9','#48F9E0','#0BD0B4','#05AC70',
                    '#04DF91','#4C9009','#66C508','#95ED3D','#D2ED3D',
                    '#9CB609','#6C7E08','#985D05','#D48A1D','#E9B262',
                    '#EC5424','#8F2605','#986657','#3C1B93','#A546AB',
                    '#8D1A55']);

    // Step 5
    var pie = d3.pie().value(function(d) { 
    return d.Malaria; 
    });

    var arc = g.selectAll("arc")
    .data(pie(data))
    .enter();

    // Step 6
    var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return ordScale(d.data.Malaria); });

    // Step 7
    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    arc.append("text")
    .attr("transform", function(d) { 
    return "translate(" + label.centroid(d) + ")"; 
    })
    .text(function(d) { return d.data.Malaria; })
    .style("font-family", "arial")
    .style("font-size", 15);
    */
    }



// Dohvacanje drzava za select drzave
data3.forEach(item => {
    flag = 0;
    arrayOfCountrys.forEach(country => {
        if (item["Country/Territory"] == country) {
            flag = 1;
        }
    });

    if (flag == 0) {
        arrayOfCountrys.push(item["Country/Territory"]);
        // Create a new option element
        const option = document.createElement("option");

        // Set the text of the option to the country/territory name
        option.text = item["Country/Territory"];

        // Set the value of the option to the country code
        option.value = item["Country/Territory"];

        // Append the option to the select element
        selectCountry.appendChild(option);
    }
});


// Dohvacanje godina za select godine
for (let year = 1990; year < 2020; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    selectYears.appendChild(option);
}



