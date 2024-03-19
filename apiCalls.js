/*
New api url to use from oprn-meteo https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,apparent_temperature,precipitation,weather_code&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto
it has the following parameters:
Temperature
Apparent Temperature
Precipitation
Precipitation Probability
Weather Code
Relative Humidity
Wind Speed
Wind Direction
*/

let weather_code = {
  0: "Clear sky",
  1: "Mainly clear sky",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Frozen fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Heavy Drizzle",
  56: "Light Freezing Drizzle",
  57: "Moderate Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Slight Showers of Rain",
  81: "Moderate Showers of Rain",
  82: "Heavy Showers of Rain",
  85: "Slight Showers of Snow",
  86: "Moderate Showers of Snow",
  95: "Thunderstorm",
  96: "Light Hail Thunderstorm",
  99: "Heavy Hail Thunderstorm"
}


function convertToFahrenheit(celsius) {
    return Math.round((celsius.toString() * 9/5) + 32);    
}

function convertToCelsius(fahrenheit) {
    return Math.round((fahrenheit.toString() - 32) * 5/9);
}

var dailyTemperatureData = [];

function processHourlyData(hourlyData) {
  const HOURS_IN_DAY = 24;
  dailyTemperatureData = []; // Reset or initialize the storage
  
  for (let i = 0; i < hourlyData.length; i += HOURS_IN_DAY) {
      // Extract 24-hour chunks and store them
      let dailyData = hourlyData.slice(i, i + HOURS_IN_DAY);
      dailyTemperatureData.push(dailyData);
  }
}

function getWeatherData(latitude, longitude, callback) {
  $.getJSON(`/api/weather?latitude=${latitude}&longitude=${longitude}`, function (openMeteo) {
    processHourlyData(openMeteo.hourly.temperature_2m);
    var time = openMeteo.current.time;
    var splt_time = time.split("");
    if (parseInt(splt_time[14]) <= 3) {
      splt_time[14] = "0";
      splt_time[15] = "0";
    } else {
      var hourChg = parseInt(splt_time[12]) + 1;
      splt_time[12] = hourChg.toString();
      splt_time[14] = "0";
      splt_time[15] = "0";
    }
    var newTime = splt_time.join('');
    console.log(newTime);
    for (let i = 0; i < openMeteo.hourly.time.length; i++) {
      if (openMeteo.hourly.time[i] == newTime) {
        console.log(i);
        var currentTemp = openMeteo.hourly.temperature_2m[i];
        var apparentTemp = openMeteo.hourly.apparent_temperature[i];
        var weatherCode = openMeteo.hourly.weather_code[i];
        
        for (const [key, value] of Object.entries(weather_code)) {
          if (key == weatherCode) {
            $(".weatherStatus").html(value);
              if(key == 0){
                $("#wIcon").html(`<img class="weatherICON" src="assets/sun.svg" alt="clear-sky">`);
              } else if (key == 1 || key == 2 || key == 3){
                $("#wIcon").html(`<img class="weatherICON" src="assets/cloudy.svg" alt="cloudy">`);
              } else if (key == 45 || key == 48){
                $("#wIcon").html(`<img class="weatherICON" src="assets/fog.svg" alt="Fog">`);
              } else if (key == 51 || key == 53 || key == 55 || key == 56 || key == 57){
                $("#wIcon").html(`<img class="weatherICON" src="assets/drizzle.svg" alt="drizzle">`);
              }
              else if (key == 61 || key == 63 || key == 65 || key == 66 || key == 67){
                $("#wIcon").html(`<img class="weatherICON" src="assets/rain.svg" alt="rain">`);
              }
              else if (key == 71 || key == 73 || key == 75 || key == 77){
                $("#wIcon").html(`<img class="weatherICON" src="assets/snowy.svg" alt="snowy">`);
              }
              else if (key == 80 || key == 81 || key == 82 || key == 85 || key == 86){
                $("#wIcon").html(`<img class="weatherICON" src="assets/rainshowers.svg" alt="rain showers">`);
              }
              else if (key == 95 || key == 96 || key == 99){
                $("#wIcon").html(`<img  class="weatherICON" src="assets/thunderstorm.svg" alt="thunderstorm">`);
          }
        }
      }


        $("#aprtValue").html(apparentTemp);
        console.log("Current Temp [hourly]: " + currentTemp);
        console.log("Apparent Temp: " + apparentTemp);
      }
    }
    var currentTemp = openMeteo.current.temperature_2m;
    var apparentTemp = openMeteo.hourly.apparent_temperature;
    var maxTemp = openMeteo.daily.temperature_2m_max;
    var minTemp = openMeteo.daily.temperature_2m_min;
    var hourlyTemp = openMeteo.hourly.temperature_2m;
    var hourlyApparentTemp = openMeteo.hourly.apparent_temperature;
    console.log("Current Temp [current]: " + currentTemp);
    console.log("Max Temp: " + maxTemp[0]);
    console.log("Min Temp: " + minTemp[0]);
    console.log("Hourly Temp: " + hourlyTemp);
    console.log("Hourly Apparent Temp: " + hourlyApparentTemp);
    console.log(openMeteo);
    if ($("#convrt").hasClass("fahrenheit")) {
      $("#currntValue").html(convertToFahrenheit(currentTemp));
      $("#maxValue").html(convertToFahrenheit(maxTemp[0]));
      $("#minValue").html(convertToFahrenheit(minTemp[0]));
      $(".tempEmblm").html("&deg;F");

    } else{
      $("#currntValue").html(currentTemp);
      $("#maxValue").html(maxTemp[0]);
      $("#minValue").html(minTemp[0]);
      $(".tempEmblm").html("&deg;C");
    }
  
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
  
}



//This is for getting the IP Address of user on load
$(document).ready(()=>{
            $("#convrt").addClass("celsius");
            $.getJSON("https://api.ipify.org?format=json",
            function (ipIFY) {
 
                // Displayin IP address on screen
                //$("#gfg").html(data.ip);
                $.getJSON("http://ip-api.com/json/"+ipIFY.ip,
                
                    function (ipAPI) {
                        var latitude = ipAPI.lat;
                        var longitude = ipAPI.lon;
                        $(".location").html(ipAPI.city+", "+ipAPI.regionName+", "+ipAPI.country);
                        getWeatherData(latitude, longitude);
                        getWeatherData(latitude, longitude, function() {
                          let firstDayTemperatures = dailyTemperatureData[0];
                          console.log(firstDayTemperatures)
                          console.log(firstDayTemperatures[5]); // This will log the temperatures for the first day after the data is loaded
                        });

                    }
                )
            
            })
});

//This is asking User request for their location can be used to get the latitude and longitude of the user

$(document).ready(()=>{
    $("#fahrenheit").click(()=>{ 
        if ($("#convrt").hasClass("celsius")){
            $("#convrt").removeClass("celsius");
            $("#convrt").addClass("fahrenheit");
            var currntF = convertToFahrenheit($("#currntValue").text());
            var maxF = convertToFahrenheit($("#maxValue").text());
            var minF = convertToFahrenheit($("#minValue").text());
            var aprtF = convertToFahrenheit($("#aprtValue").text());
    
            $("#currntValue").html(currntF);
            $("#maxValue").html(maxF);
            $("#minValue").html(minF);
            $("#aprtValue").html(aprtF);
            $(".tempEmblm").html("&deg;F");
        } else {
            alert("Already in Fahrenheit");
        }
    });

    $("#celsius").click(()=>{
        if ($("#convrt").hasClass("fahrenheit")){
            $("#convrt").removeClass("fahrenheit");
            $("#convrt").addClass("celsius");
            var currntC = convertToCelsius($("#currntValue").text());
            var maxC = convertToCelsius($("#maxValue").text());
            var minC = convertToCelsius($("#minValue").text());
            var aprtC = convertToCelsius($("#aprtValue").text());
    
            $("#currntValue").html(currntC);
            $("#maxValue").html(maxC);
            $("#minValue").html(minC);
            $("#aprtValue").html(aprtC);
            $(".tempEmblm").html("&deg;C");
        } else {
            alert("Already in Celsius");
        }
    });

    $('#globe').click(()=>{
        alert("Please enable location services to get the weather of your location");
        if (navigator.geolocation) {
            $("#convrt").removeClass(["fahrenheit", "celsius"]);
            $("#convrt").addClass("celsius");
            navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            $.getJSON(`/api/location?lat=${latitude}&lon=${longitude}`,
            function (locationIQ) {
                console.log(locationIQ)
                $(".location").html(locationIQ.address.city+", "+locationIQ.address.state+", "+locationIQ.address.country);
            }
            )
            getWeatherData(latitude, longitude);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    });
        }
        
);


$(document).ready(()=>{

$('#search-box-input').autocomplete({
    minChars: 3,
    deferRequestBy: 250,
    serviceUrl: '/api/autocomplete',
    paramName: 'q',
    ajaxSettings: {
      dataType: 'json'
    },
    formatResult: function(suggestion, currentValue) {
      // Current value is the input query. We can use this to highlight the search phrase in the result
      var format = "<div class='autocomplete-suggestion-name'>" + highlight(suggestion.data.display_place, currentValue) + "</div>" +
        "<div class='autocomplete-suggestion-address'>" + highlight(suggestion.data.display_address, currentValue) + "</div>"
      return format;
    },
    transformResult: function(response) {
      var suggestions = $.map(response, function(dataItem) {
        return {
          value: dataItem.display_name,
          data: dataItem
        };
      })

      return {
        suggestions: suggestions
      };
    },
    onSelect: function(suggestion) {
      //displayLatLon(suggestion.data.display_name, suggestion.data.lat, suggestion.data.lon);
        var latitude = suggestion.data.lat;
        var longitude = suggestion.data.lon;
        $(".location").html(suggestion.data.address.city+", "+suggestion.data.address.state+", "+suggestion.data.address.country);
        getWeatherData(latitude, longitude);
    }
  });

  // For triggering reset
  $("#reset-autocomplete").click(function() {
    $('#search-box-input').val("");
  });

function highlight(text, focus) {
    var r = RegExp('(' + escapeRegExp(focus) + ')', 'gi');
    return text.replace(r, '<strong>$1</strong>');
  }

  function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  } 

});

