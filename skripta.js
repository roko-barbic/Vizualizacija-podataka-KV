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
            //createPieChartbyName(countryName);
            createBarChartbyName(countryName);
          });
          layer.on('mouseout', function(event) {
            var layer = event.target;
            var opacity = getOpacity(feature.properties.name);
            var fillColor = opacity <= 0.8 ? 'red' : 'black';
            layer.setStyle({
              fillOpacity: getOpacity(feature.properties.name),
              fillColor: fillColor
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
            var opacity = getOpacity(feature.properties.name);
            var fillColor = opacity <= 0.8 ? 'red' : 'black';
            layer.setStyle({
                color: 'black', 
                weight: 0.5, 
                fill: true,
                fillColor: fillColor,
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
/*ZA PIE CHART pomocu selecta
window.createPieChart = function() {
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

 */   
/* Za kreiranje pie charta uz pomoc imena
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
    .attr("fill", (d, i) => colors[i]) 
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .each(function(d, i) {
      const slice = d3.select(this);
      slice.transition() 
        .delay(i * 200) 
        .duration(500) 
        .attrTween("d", function() {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
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

*/


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
        const option = document.createElement("option");
        option.text = item["Country/Territory"];
        option.value = item["Country/Territory"];
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
    option.text = key;
    option.value = key;
    selectDisease.appendChild(option);
  }



  window.createBarChart = function() {
    var data33 = data3;
    const svg2 = d3.select("#pie");
    svg2.selectAll("*").remove();
  
    var country = document.getElementById("countrys").value;
    var year = document.getElementById("years").value;
    document.getElementById("country").innerHTML = country;
    document.getElementById("name").innerHTML = "";
  
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
  
    const margin = { top: 20, right: 20, bottom: 150, left: 105 };
    const width = 760 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
  
    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear().range([height, 0]);
  
    const svg = d3
      .select("#pie")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    x.domain(chartData.map((d) => d.name));
    y.domain([0, d3.max(chartData, (d) => d.value)]);
  
    svg
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("width", 0) // Start with width as 0
      .attr("y", height) // Start from the bottom of the chart
      .attr("height", 0) // Start with height as 0
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .transition() // Apply animation
      .duration(800) // Animation duration
      .delay((d, i) => i * 100) // Delay each bar's animation
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));
  
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("dx", "-0.8em") // Adjust the label position
      .attr("dy", "0.15em") // Adjust the label position
      .style("text-anchor", "end");
  
    svg.append("g").call(d3.axisLeft(y));
  
    function handleMouseOver(d) {
      d3.select(this).attr("opacity", 0.8);
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

    
      console.log("d.value:", d.value);
      console.log("counter:", counter);
    
      document.getElementById("name").innerHTML =
        "In " +
        country +
        " in " +
        year +
        ", " +
        d.value +
        " people died from " +
        d.name +
        ", which accounted for roughly " +
        ((d.value / counter) * 100).toFixed(4).toString() +
        "% of all deaths that year";
    }
  
    function handleMouseOut(d) {
      d3.select(this).attr("opacity", 1);
    }
  };


  //za ime bar char koristi se za kartu
  window.createBarChartbyName = function(name) {
    var data33 = data3;
    const svg2 = d3.select("#pie");
    svg2.selectAll("*").remove();
  
    document.getElementById("countrys").value = name;
    var year = document.getElementById("years").value;
    var country = name;
  
  
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
  
    const margin = { top: 20, right: 20, bottom: 150, left: 105 };
    const width = 760 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
  
    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear().range([height, 0]);
  
    const svg = d3
      .select("#pie")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    x.domain(chartData.map((d) => d.name));
    y.domain([0, d3.max(chartData, (d) => d.value)]);
  
    svg
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("width", 0) // Start with width as 0
      .attr("y", height) // Start from the bottom of the chart
      .attr("height", 0) // Start with height as 0
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .transition() // Apply animation
      .duration(800) // Animation duration
      .delay((d, i) => i * 100) // Delay each bar's animation
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));
  
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("dx", "-0.8em") // Adjust the label position
      .attr("dy", "0.15em") // Adjust the label position
      .style("text-anchor", "end");
  
    svg.append("g").call(d3.axisLeft(y));
  
    function handleMouseOver(d) {
      d3.select(this).attr("opacity", 0.8);
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

    
      console.log("d.value:", d.value);
      console.log("counter:", counter);
    
      document.getElementById("name").innerHTML =
        "In " +
        country +
        " in " +
        year +
        ", " +
        d.value +
        " people died from " +
        d.name +
        ", which accounted for roughly " +
        ((d.value / counter) * 100).toFixed(4).toString() +
        "% of all deaths that year";
    }
  
    function handleMouseOut(d) {
      d3.select(this).attr("opacity", 1);
    }
  };
  
  

 
  var currentYearIndex = 0;
  var years = Array.from({ length: 30 }, (_, i) => 1990 + i); // Generate an array of years from 1990 to 2019
  var isPlaying = false; // Flag to track the play/pause state
  var timeoutId;

  function playAnimation() {
    if (currentYearIndex >= years.length) {
      currentYearIndex = 0;
      var year = years[currentYearIndex];
      document.getElementById("years").value = year;
      document.getElementById("playButton").textContent = "Play";
      isPlaying = false;
      changeStyleOfMap(); 
      return;
    }
  
    var year = years[currentYearIndex];
    document.getElementById("years").value = year;
    changeStyleOfMap(); 
  
    currentYearIndex++;
  
    if (isPlaying) {
      timeoutId = setTimeout(playAnimation, 500);
    }
  }
  
  function togglePlay() {
    if (isPlaying) {
      document.getElementById("playButton").textContent = "Continue";
      isPlaying = false;
      clearTimeout(timeoutId);
    } else {
      document.getElementById("playButton").textContent = "Stop";
      isPlaying = true;
      playAnimation();
    }
  }
  document.getElementById("playButton").addEventListener("click", togglePlay);
  
  
  
