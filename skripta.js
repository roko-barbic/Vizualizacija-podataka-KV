import data3 from './csvjson.json' assert { type: 'json' };
//console.log(data3);

var myGeoJSONPath = './custom.geo.json';
var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: '#fff',
    fillOpacity: getOpacity()
}

var geojsonLayer;

$.getJSON(myGeoJSONPath,function(data){
    var map = L.map('map').setView([32.74739, 0], 1.2);
  
    L.geoJson(data, {
        //style: myCustomSyle
        style: function(feature){
            return {
                color: 'black', 
                weight: 0.5, 
                fill: true,
                fillColor: '#fff',
                //fillOpacity: getOpacity(feature.properties.name)
                fillOpacity: 1
            }
        },
        onEachFeature: function(feature, layer) {
          layer.on('mouseover', function(event) {
            var layer = event.target;
            layer.setStyle({
              fillOpacity: 0.55,
              fillColor: 'red'
            });
            var countryName = feature.properties.name;
            // var selectCountry = document.getElementById("countrys");
            // selectCountry.value = countryName;
            //createPieChartbyName(countryName);
          });
          layer.on('click', function(event) {
            var layer = event.target;
            layer.setStyle({
              fillOpacity: 0.85,
              fillColor: 'green'
            });
            var countryName = feature.properties.name;
            var selectCountry = document.getElementById("countrys");
            selectCountry.value = countryName;
            document.getElementById("country").innerHTML = countryName;
            document.getElementById("name").innerHTML ="";
            createPieChartbyName(countryName);
          });
          layer.on('mouseout', function(event) {
            var layer = event.target;
            layer.setStyle({
              fillOpacity: getOpacity(feature.properties.name),
              fillColor: 'red'
            });
        
          });
        }
    }).addTo(map);

    geojsonLayer = map._layers[Object.keys(map._layers)[1]];
})

window.changeStyleOfMap= function(){
       
    if (geojsonLayer) {
        geojsonLayer.eachLayer(function(layer) {
            var feature = layer.feature;
            layer.setStyle({
                color: 'black', 
                weight: 0.5, 
                fill: true,
                fillColor: 'red',
                fillOpacity: getOpacity(feature.properties.name)
            });
        });
    }

}


// Step 3
var svg = d3.select("#pie"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    radius = 200;

const selectYears = document.getElementById("years");
const selectCountry = document.getElementById("countrys");
const selectDisease = document.getElementById("diseases");
var arrayOfCountrys = [];
var arrayOfDiseases = [];
var flag = 0;

// Function to create the pie chart



function getOpacity(name){
    var disease = document.getElementById("diseases").value;
    var year = document.getElementById("years").value;

    var filteredData=[];

    for (let i = 0; i < data3.length; i++) {
        let item = data3[i];
        if (item["Country/Territory"] === name && item["Year"] === parseInt(year)) {
            
            filteredData = Object.assign({}, item);
            delete filteredData["Year"];
            delete filteredData["Country/Territory"];
            delete filteredData["Code"];

            break;
        }
    }
    var counter =0;
    for (let key in filteredData) {
        
        counter += filteredData[key];
    }
    let percentValue =filteredData[disease]/counter;
    /* if(percentValue<=0.1){
        return filteredData[disease]/counter + 0.15;
        s ovim bi rijesio problem sto se nikad nis ne vidi
    } */
    return filteredData[disease]/counter;
}
/* 

window.createPieChart = function() { 
    var data33 = data3;
    const svg2 = d3.select("#pie");   
    svg2.selectAll("*").remove();
 //   function createPieChart(){
    var country = document.getElementById("countrys").value;
    var year = document.getElementById("years").value;
    document.getElementById("country").innerHTML=country;
    //document.getElementById("demo").innerHTML = year + " " + country;
    
    //console.log(data3);

    // var filteredData = data3.filter(function(item) {
    //     return item["Country/Territory"] === country && item["Year"] === parseInt(year);
    // });
    var filteredData=[];

    for (let i = 0; i < data33.length; i++) {
        let item = data33[i];
        if (item["Country/Territory"] === country && item["Year"] === parseInt(year)) {
            
            filteredData = Object.assign({}, item);
            delete filteredData["Year"];
            break;
        }
    }

       // var drowningValue = filteredData["Drowning"];
        const chartData = Object.entries(filteredData).map(([category, value]) => ({ name: category, value }));

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
    

    const svg = d3.select("#pie")
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
      .on("mouseout", handleMouseOut)
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
    
      function getPercent(d){
        var country = document.getElementById("countrys").value;
        var year = document.getElementById("years").value;

        var filteredData=[];
        console.log(d.data.name);
        for (let i = 0; i < data3.length; i++) {
            let item = data3[i];
            if (item["Country/Territory"] === country && item["Year"] === parseInt(year)) {
                
                filteredData = Object.assign({}, item);
                delete filteredData["Year"];
                delete filteredData["Country/Territory"];
                delete filteredData["Code"];
    
                break;
            }
        }
        console.log(country);
        console.log(filteredData);
        var counter =0;
        for (let key in filteredData) {
            
            counter += filteredData[key];
        }
        console.log(counter+ " "+ d.data.value);
        console.log((d.data.value/counter)*100);
        return (d.data.value/counter)*100;
    }

    function handleMouseOver(d){
        d3.select(this).attr("opacity",0.8);
        document.getElementById("name").innerHTML = "In "+ country + " in " + year + ", " + d.data.value + " people died from " + d.data.name + ", which accounted for roughly " + getPercent(d).toFixed(4).toString() +"% of all deaths that year";
    }
    function handleMouseOut(d) {
        d3.select(this).attr("opacity", 1); 
    }
      

    }

 */window.createPieChart = function() {
  var data33 = data3;
  const svg2 = d3.select("#pie");
  svg2.selectAll("*").remove();

  var country = document.getElementById("countrys").value;
  var year = document.getElementById("years").value;
  document.getElementById("country").innerHTML = country;
  document.getElementById("name").innerHTML="";

  var filteredData = [];

  for (let i = 0; i < data33.length; i++) {
    let item = data33[i];
    if (item["Country/Territory"] === country && item["Year"] === parseInt(year)) {
      filteredData = Object.assign({}, item);
      delete filteredData["Year"];
      delete filteredData["Country/Territory"];
      delete filteredData["Code"];
      break;
    }
  }

  const chartData = Object.entries(filteredData).map(([category, value]) => ({ name: category, value }));

  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;
  const labelRadius = radius + 150 +40;
  const outerRadius = radius + 50;
  const colors = ['#ffd384', '#94ebcd', '#fbaccc', '#d3e0ea', '#fa7f72', '#23E1AE', '#198064', '#074E3B', '#07474E', '#0497A7', '#05C6DB', '#48E7F9', '#48F9E0', '#0BD0B4', '#05AC70', '#04DF91', '#4C9009', '#66C508', '#95ED3D', '#D2ED3D', '#9CB609', '#6C7E08', '#985D05', '#D48A1D', '#E9B262', '#EC5424', '#8F2605', '#986657', '#3C1B93', '#A546AB', '#8D1A55'];

  const svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie()
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const slices = svg.selectAll("path")
    .data(pie(chartData))
    .enter()
    .append("path")
    .attr("fill", (d, i) => colors[i]) // Use different colors for each slice
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .each(function(d, i) {
      const slice = d3.select(this);
      slice.transition() // Add transition
        .delay(i * 200) // Delay creation of each slice
        .duration(500) // Set animation duration
        .attrTween("d", function() {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d); // Start from 0 angle
          return function(t) {
            return arc(interpolate(t));
          };
        });
    });

    const labels = svg.selectAll("text")
    .data(pie(chartData))
    .enter()
    .append("text")
    .attr("transform", d => {
      const centroid = arc.centroid(d);
      const x = centroid[0] * labelRadius / radius;
      const y = centroid[1] * labelRadius / radius;
      const angle = Math.atan2(centroid[1], centroid[0]);
      const angleDegrees = angle * (180 / Math.PI);
      let labelRotation = angleDegrees; 
      let labelDistance = labelRadius; 
  
      if (angleDegrees > 90 && angleDegrees <= 180) {
        labelRotation += 180; 
        labelDistance += 20; 
      } else if (angleDegrees > -180 && angleDegrees <= -90) {
        labelRotation -= 180; 
      } else if (angleDegrees >=-90 && angleDegrees<=90) {
        labelDistance -= 50; 
      } else {
        labelDistance -= 10; 
      }
      if (angleDegrees >=-90 && angleDegrees<=90) {
        labelDistance -= 200; 
      }
      const xAdjusted = x * labelDistance / labelRadius;
      const yAdjusted = y * labelDistance / labelRadius;
  
      return `translate(${xAdjusted}, ${yAdjusted}) rotate(${labelRotation})`; 
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", d => {
      const angle = Math.atan2(d.data.y, d.data.x);
      if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        return "end"; 
      }
      return "start"; 
    })
    .text(d => d.data.name)
    .style("opacity", 0) 
    .each(function(d, i) {
      const label = d3.select(this);
      label.transition() 
        .delay(i * 200) 
        .duration(500) 
        .style("opacity", 1); 
    });
    function getPercent(d){
      var country = document.getElementById("countrys").value;
      var year = document.getElementById("years").value;

      var filteredData=[];
      console.log(d.data.name);
      for (let i = 0; i < data3.length; i++) {
          let item = data3[i];
          if (item["Country/Territory"] === country && item["Year"] === parseInt(year)) {
              
              filteredData = Object.assign({}, item);
              delete filteredData["Year"];
              delete filteredData["Country/Territory"];
              delete filteredData["Code"];
  
              break;
          }
      }
      console.log(country);
      console.log(filteredData);
      var counter =0;
      for (let key in filteredData) {
          
          counter += filteredData[key];
      }
      console.log(counter+ " "+ d.data.value);
      console.log((d.data.value/counter)*100);
      return (d.data.value/counter)*100;
  }

  function handleMouseOver(d){
      d3.select(this).attr("opacity",0.8);
      document.getElementById("name").innerHTML = "In "+ country + " in " + year + ", " + d.data.value + " people died from " + d.data.name + ", which accounted for roughly " + getPercent(d).toFixed(4).toString() +"% of all deaths that year";
  }
  function handleMouseOut(d) {
      d3.select(this).attr("opacity", 1); 
  }
    
};

    

window.createPieChartbyName = function(name) {
  var data33 = data3;
  const svg2 = d3.select("#pie");
  svg2.selectAll("*").remove();
  var year = document.getElementById("years").value;
  document.getElementById("countrys").value = name;
  var country = name;

  var filteredData = [];

  for (let i = 0; i < data33.length; i++) {
    let item = data33[i];
    if (item["Country/Territory"] === name && item["Year"] === parseInt(year)) {

      filteredData = Object.assign({}, item);;
      delete filteredData["Year"];
      delete filteredData["Country/Territory"];
      delete filteredData["Code"];
      break;
    }
  }
  const chartData = Object.entries(filteredData).map(([category, value]) => ({ name: category, value }));

  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;
  const labelRadius = radius + 150 + 40;
  const colors = ['#ffd384', '#94ebcd', '#fbaccc', '#d3e0ea', '#fa7f72', '#23E1AE', '#198064', '#074E3B', '#07474E', '#0497A7', '#05C6DB', '#48E7F9', '#48F9E0', '#0BD0B4', '#05AC70', '#04DF91', '#4C9009', '#66C508', '#95ED3D', '#D2ED3D', '#9CB609', '#6C7E08', '#985D05', '#D48A1D', '#E9B262', '#EC5424', '#8F2605', '#986657', '#3C1B93', '#A546AB', '#8D1A55'];

  const svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie()
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const slices = svg.selectAll("path")
    .data(pie(chartData))
    .enter()
    .append("path")
    .attr("fill", (d, i) => colors[i]) // Use different colors for each slice
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .each(function(d, i) {
      const slice = d3.select(this);
      slice.transition() // Add transition
        .delay(i * 200) // Delay creation of each slice
        .duration(500) // Set animation duration
        .attrTween("d", function() {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d); // Start from 0 angle
          return function(t) {
            return arc(interpolate(t));
          };
        });
    });

    const labels = svg.selectAll("text")
    .data(pie(chartData))
    .enter()
    .append("text")
    .attr("transform", d => {
      const centroid = arc.centroid(d);
      const x = centroid[0] * labelRadius / radius;
      const y = centroid[1] * labelRadius / radius;
      const angle = Math.atan2(centroid[1], centroid[0]);
      const angleDegrees = angle * (180 / Math.PI);
      let labelRotation = angleDegrees; 
      let labelDistance = labelRadius; 
  
      if (angleDegrees > 90 && angleDegrees <= 180) {
        labelRotation += 180; 
        labelDistance += 20; 
      } else if (angleDegrees > -180 && angleDegrees <= -90) {
        labelRotation -= 180; 
      } else if (angleDegrees >=-90 && angleDegrees<=90) {
        labelDistance -= 50; 
      } else {
        labelDistance -= 10; 
      }
      if (angleDegrees >=-90 && angleDegrees<=90) {
        labelDistance -= 200; 
      }
      const xAdjusted = x * labelDistance / labelRadius;
      const yAdjusted = y * labelDistance / labelRadius;
  
      return `translate(${xAdjusted}, ${yAdjusted}) rotate(${labelRotation})`; 
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", d => {
      const angle = Math.atan2(d.data.y, d.data.x);
      if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        return "end"; 
      }
      return "start"; 
    })
    .text(d => d.data.name)
    .style("opacity", 0) 
    .each(function(d, i) {
      const label = d3.select(this);
      label.transition() 
        .delay(i * 200) 
        .duration(500) 
        .style("opacity", 1); 
    });

  function getPercent(d) {
    var country = document.getElementById("countrys").value;
    var year = document.getElementById("years").value;

    var filteredData = [];
    for (let i = 0; i < data3.length; i++) {
      let item = data3[i];
      if (item["Country/Territory"] === country && item["Year"] === parseInt(year)) {
        filteredData = Object.assign({}, item);
        delete filteredData["Year"];
        delete filteredData["Country/Territory"];
        delete filteredData["Code"];
        break;
      }
    }

    var counter = 0;
    for (let key in filteredData) {
      counter += filteredData[key];
    }

    return (d.data.value / counter) * 100;
  }

  function handleMouseOver(d) {
    d3.select(this).attr("opacity", 0.8);
    document.getElementById("name").innerHTML = "In " + country + " in " + year + ", " + d.data.value + " people died from " + d.data.name + ", which accounted for roughly " + getPercent(d).toFixed(4).toString() + "% of all deaths that year";
  }

  function handleMouseOut(d) {
    d3.select(this).attr("opacity", 1);
  }
};




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

arrayOfDiseases = Object.assign({}, data3[0]);
delete arrayOfDiseases["Year"];
delete arrayOfDiseases["Country/Territory"];
delete arrayOfDiseases["Code"];
for (let key in arrayOfDiseases) {
    const option = document.createElement("option");
  
    // Set the text of the option to the attribute name
    option.text = key;
  
    // Set the value of the option to the attribute name
    option.value = key;
  
    // Append the option to the select element
    selectDisease.appendChild(option);
  }


