// all of the weather code data is fetched from the OpenMeteo API
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

function updateSlider(unit) {
  if (unit === "fahrenheit") {
    $(".switch input[type='checkbox']").prop("checked", true);
  } else {
    $(".switch input[type='checkbox']").prop("checked", false);
  }
}

// Conversion functions
function convertToFahrenheitBTN() {
  $(".minTemp, .maxTemp, .currntTemp, .aprtTemp").each(function() {
    var tempValue = $(this).find("span:first-child").text();
    if (!isNaN(tempValue)) {
      var fahrenheitValue = convertToFahrenheit(tempValue);
      $(this).find("span:first-child").text(fahrenheitValue.toFixed(1));
    }
  });
  $(".tempEmblm").text("F");

  // Convert seven-day forecast temperatures to Fahrenheit
  for (let i = 0; i < 7; i++) {
    $(`#dailyMax${i+1}`).text(convertToFahrenheit($(`#dailyMax${i+1}`).text()));
    $(`#dailyMin${i+1}`).text(convertToFahrenheit($(`#dailyMin${i+1}`).text()));
  }
}

function convertToCelsiusBTN() {
  $(".minTemp, .maxTemp, .currntTemp, .aprtTemp").each(function() {
    var tempValue = $(this).find("span:first-child").text();
    if (!isNaN(tempValue)) {
      var celsiusValue = convertToCelsius(tempValue);
      $(this).find("span:first-child").text(celsiusValue.toFixed(1));
    }
  });
  $(".tempEmblm").text("C");

  // Convert seven-day forecast temperatures to Celsius
  for (let i = 0; i < 7; i++) {
    $(`#dailyMax${i+1}`).text(convertToCelsius($(`#dailyMax${i+1}`).text()));
    $(`#dailyMin${i+1}`).text(convertToCelsius($(`#dailyMin${i+1}`).text()));
  }
}

function convertToFahrenheit(celsius) {
    return Math.round((celsius.toString() * 9/5) + 32);    
}

function convertToCelsius(fahrenheit) {
    return Math.round((fahrenheit.toString() - 32) * 5/9);
}

function kmToMiles(km) {
    return Math.round(km * 0.621371);
}

function mphToKmh(mph) {
    return Math.round(mph * 1.60934);
}

var dailyTemperatureData = [];

//Function to convert hourly temperature data into daily temperature data
function processHourlyData(hourlyData) {
  const HOURS_IN_DAY = 24;
  dailyTemperatureData = []; // Reset or initialize the storage
  
  // Iterate over the hourlyData array in 24-hour chunks
  for (let i = 0; i < hourlyData.length; i += HOURS_IN_DAY) {
      // Extract 24-hour chunks and store them in dailyTemperatureData
      let dailyData = hourlyData.slice(i, i + HOURS_IN_DAY);
      dailyTemperatureData.push(dailyData);
  }
}

// Function(s) to get the timezone for the given coordinates, then using the timezone to get the seven-day dates
function getTimezoneForCoordinates(latitude, longitude) {
  const url = `https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`;
  $.getJSON(url, function (whereisthisat) {
    console.log(whereisthisat.timezone_id);
    var timezone = whereisthisat.timezone_id;

    /// Function to get the seven-day dates for the given timezone
    function getSevenDayForecastForTimezone(timezone) {
      let datesFull = [];
      let dates = [];
      let daysOfWeek = [];
      let daysOfWeekFULL = [];
      for (let i = 0; i < 7; i++) {
          // Create a moment object for the current date in the specified timezone
          let date = moment().tz(timezone).add(i, 'days');
          // Format the date as you prefer, e.g., M/D (month day) or "dddd M/D(day & month day), ddd (day short), dddd (day full) "
          dates.push(date.format('M/D')) // 7/1, 7/2, 7/3, etc.;
          datesFull.push(date.format('dddd M/D')) // Monday 7/1, Tuesday 7/2, etc.;
          daysOfWeek.push(date.format('ddd')) // Mon, Tue, Wed, etc.;
          daysOfWeekFULL.push(date.format('dddd')) // Monday, Tuesday, Wednesday, etc.;
      }
      return {dates, datesFull, daysOfWeek, daysOfWeekFULL};
    }

    
    var sevenDayForecast = getSevenDayForecastForTimezone(timezone);
    console.log(sevenDayForecast.dates);
    console.log(sevenDayForecast.daysOfWeek);
    console.log(sevenDayForecast.datesFull);
    // Display the currnet day on the page
    $(".today").html(sevenDayForecast.daysOfWeekFULL[0]);
    
    for (let i = 0; i < 7; i++) {
      $(`#day${i+1}`).text(sevenDayForecast.daysOfWeek[i]);
    }

  });
}

// Function to get the weather data for the given coordinates
function getWeatherData(latitude, longitude, callback) {
  $.getJSON(`/api/weather?latitude=${latitude}&longitude=${longitude}`, function (openMeteo) {
    processHourlyData(openMeteo.hourly.temperature_2m);

    //converting the current time to the next hour or past hour and the feeding it to the hourly data to get the current weather
    console.log(openMeteo);
    var time = openMeteo.current.time;
    //console.log(`THIS IS TIME: ${time}`);

    var splt_time = time.split("");
    
    var hours = [];
    
    hours.push(splt_time[11], splt_time[12]);
    
    //console.log(`THIS IS THE HOURS: ${hours}`);
    
    if (parseInt(splt_time[14]) <= 3) {
      splt_time[14] = "0";
      splt_time[15] = "0";
    } else {
      console.log(hours.join(''));
    
      var hourChg = parseInt(hours.join('')) + 1;
    
      //console.log(`THIS IS THE NEW HOURS: ${hourChg}`);
      //console.log(typeof(hourChg));
    
      if (hourChg === 24) {
        splt_time[11] = "0";
        splt_time[12] = "0";
      } else {
        splt_time[12] = (hourChg % 10).toString();
        if (hourChg >= 10) {
          splt_time[11] = "1";
        }
      }
    
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
        var precipitation_probab = openMeteo.hourly.precipitation_probability[i];
        var windSpeed = openMeteo.hourly.wind_speed_10m[i];
        var humidity = openMeteo.hourly.relative_humidity_2m[i];
        
        // using the weather code to display the weather status and icon for the current weather
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
      // For Seven Day Forecast that displays the weather icon
      for (let i = 0; i < 7; i++) {
        const weatherCode = openMeteo.daily.weather_code[i];
    
        for (const [key, value] of Object.entries(weather_code)) {
          if (key == weatherCode) {
            if (key == 0) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}" src="assets/sun.svg" alt="clear-sky">`);
            } else if (key == 1 || key == 2 || key == 3) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/cloudy.svg" alt="cloudy">`);
            } else if (key == 45 || key == 48) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/fog.svg" alt="Fog">`);
            } else if (key == 51 || key == 53 || key == 55 || key == 56 || key == 57) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/drizzle.svg" alt="drizzle">`);
            } else if (key == 61 || key == 63 || key == 65 || key == 66 || key == 67) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/rain.svg" alt="rain">`);
            } else if (key == 71 || key == 73 || key == 75 || key == 77) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/snowy.svg" alt="snowy">`);
            } else if (key == 80 || key == 81 || key == 82 || key == 85 || key == 86) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/rainshowers.svg" alt="rain showers">`);
            } else if (key == 95 || key == 96 || key == 99) {
              $(`#wIcon${i+1}`).html(`<img class="weatherICON" id="dailyIcon${i+1}"  src="assets/thunderstorm.svg" alt="thunderstorm">`);
            }
          }
        }
      }
      
        $("#windValue").html(windSpeed);
        $("#precipValue").html(precipitation_probab);
        $("#aprtValue").html(apparentTemp);
        $("#humValue").html(humidity);
        $("#speedEmblm").html("km/h")
        //console.log("Current Temp [hourly]: " + currentTemp);
        //console.log("Apparent Temp: " + apparentTemp);
        //console.log("Weather Code: " + weatherCode);
        //console.log("Precipitation Probability: " + precipitation_probab);
        //console.log("Wind Speed: " + windSpeed);
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
    // This checks if the current temperature is in Fahrenheit or Celsius and converts it accordingly
    if ($("#convrt").hasClass("fahrenheit")) {
      $("#currntValue").html(convertToFahrenheit(currentTemp));
      $("#maxValue").html(convertToFahrenheit(maxTemp[0]));
      $("#minValue").html(convertToFahrenheit(minTemp[0]));
      $("#windValue").html(kmToMiles($("#windValue").text()));
      $("#speedEmblm").html("mph");
      $(".tempEmblm").html("&deg;F");
      for (let i = 0; i < 7; i++) {
        $(`#day${i+1}Temp`).html(`<span id="dailyMax${i+1}">${convertToFahrenheit(openMeteo.daily.temperature_2m_max[i])}</span>&deg; <span id="dailyMin${i+1}">${convertToFahrenheit(openMeteo.daily.temperature_2m_min[i])}</span>&deg;`);
      }
    } else{
      $("#currntValue").html(currentTemp);
      $("#maxValue").html(maxTemp[0]);
      $("#minValue").html(minTemp[0]);
      $("#windValue").html(mphToKmh($("#windValue").text()));
      $("#speedEmblm").html("km/h");
      $(".tempEmblm").html("&deg;C");
      for (let i = 0; i < 7; i++) {
        $(`#day${i+1}Temp`).html(`<span id="dailyMax${i+1}">${openMeteo.daily.temperature_2m_max[i]}</span>&deg; <span id="dailyMin${i+1}">${openMeteo.daily.temperature_2m_min[i]}</span>&deg;`);
      }
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
        //Taking the IP address and getting the location of the user
        $.getJSON("http://ip-api.com/json/"+ipIFY.ip,
          function (ipAPI) {
            var latitude = ipAPI.lat;
            var longitude = ipAPI.lon;
            $(".location").html(ipAPI.city+", "+ipAPI.regionName+", "+ipAPI.country);
            getTimezoneForCoordinates(latitude, longitude)
            //Sending the latitude and longitude to the getWeatherData function
            getWeatherData(latitude, longitude);
            getWeatherData(latitude, longitude, function() {
              let firstDayTemperatures = dailyTemperatureData[0];
                console.log(firstDayTemperatures)
                console.log(firstDayTemperatures[5]); // This will log the temperatures for the first day after the data is loaded
            });

          }
        )
      }
  )
});

//This is asking User request for their location can be used to get the latitude and longitude of the user

$(document).ready(()=>{
  //This is for the conversion of temperature from Celsius to Fahrenheit and vice versa on click of the button
  $("#fahrenheit").click(()=>{
    if ($("#convrt").hasClass("celsius")){
      $("#convrt").removeClass("celsius");
      $("#convrt").addClass("fahrenheit");
      updateSlider("fahrenheit");
      convertToFahrenheitBTN();
    } else {
      alert("Already in Fahrenheit");
    }
  });

  $("#celsius").click(()=>{
    if ($("#convrt").hasClass("fahrenheit")){
      $("#convrt").removeClass("fahrenheit");
      $("#convrt").addClass("celsius");
      updateSlider("celsius")
      convertToCelsiusBTN();
      } else {
        alert("Already in Celsius");
      }
  });
  //This is for the location button to get the location of the user
  $('#globe').click(()=>{
    alert("Please enable location services to get the weather of your location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getTimezoneForCoordinates(latitude, longitude);
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      $.getJSON(`/api/location?lat=${latitude}&lon=${longitude}`,
        function (locationIQ) {
          console.log(locationIQ)
          if(locationIQ.address.city == undefined || locationIQ.address.state == undefined){
            $("#locatCITY").hide();
            $("#locatSTATE").html(locationIQ.display_place);
            $('#locatCOUNTRY').html(locationIQ.address.country);
          } else {$(".location").html(locationIQ.address.city+", "+locationIQ.address.state+", "+locationIQ.address.country);}
        }
      )
        getWeatherData(latitude, longitude);
      });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
  });
});

//This is for the search box from locationIQ API
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
        console.log(suggestion.data);
        if(suggestion.data.address.city == undefined || suggestion.data.address.state == undefined){
          $(".location").html(suggestion.data.display_place);}
        else { $(".location").html(suggestion.data.address.city+", "+suggestion.data.address.state+", "+suggestion.data.address.country);}
        getWeatherData(latitude, longitude);
        getTimezoneForCoordinates(latitude, longitude);
        $('#search-box-input').val("")
    }
  });

  // For triggering reset
  $("#reset-autocomplete").click(function() {
    $('#search-box-input').val("");
  });

  function highlight(text, focus) {
    // Ensure text is a string to prevent errors
    if (!text) return ''; // Return an empty string if text is falsy (e.g., undefined, null)
    var r = RegExp('(' + escapeRegExp(focus) + ')', 'gi');
    return text.replace(r, '<strong>$1</strong>');
  }

  function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  } 

});
