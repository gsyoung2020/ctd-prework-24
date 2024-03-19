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
function convertToFahrenheit(celsius) {
    return Math.round((celsius.toString() * 9/5) + 32);    
}

function convertToCelsius(fahrenheit) {
    return Math.round((fahrenheit.toString() - 32) * 5/9);
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

                            $.getJSON("https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&current=temperature_2m&hourly=temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto",
                            function (openMeteo) {

                                var time = openMeteo.current.time;
                                var splt_time = time.split("")
                                if (parseInt(splt_time[14] <= 3)){
                                  splt_time[14] = "0"
                                  splt_time[15] = "0"
                                } else {
                                  var hourChg = parseInt(splt_time[12]) + 1
                                  splt_time[12] = hourChg.toString()
                                  splt_time[14] = "0"
                                  splt_time[15] = "0"
                                }
                                var newTime = splt_time.join('')
                                console.log(newTime)
                                for (let i=0; i < openMeteo.hourly.time.length; i++){
                                    if (openMeteo.hourly.time[i] == newTime){
                                        //Dose not work for the first hour of the day as the time is 00:00:00
                                        console.log(i)
                                        var currentTemp = openMeteo.hourly.temperature_2m[i];
                                        var apparentTemp = openMeteo.hourly.apparent_temperature[i];
                                        $("#aprtValue").html(apparentTemp);
                                        console.log("Current Temp [hourly]: "+currentTemp);
                                        console.log("Apparent Temp: "+apparentTemp);
                                    }
                                }

                                var currentTemp = openMeteo.current.temperature_2m;
                                var apparentTemp = openMeteo.hourly.apparent_temperature;
                                var maxTemp = openMeteo.daily.temperature_2m_max;
                                var minTemp = openMeteo.daily.temperature_2m_min;
                                var hourlyTemp = openMeteo.hourly.temperature_2m;
                                var hourlyApparentTemp = openMeteo.hourly.apparent_temperature;
                                console.log("Current Temp [current]: "+currentTemp);
                                //console.log("Apparent Temp: "+apparentTemp);
                                console.log("Max Temp: "+maxTemp[0]); // Max Temp is an array of the next 7 days including today at index 0
                                console.log("Min Temp: "+minTemp[0]); // Min Temp is an array of the next 7 days including today at index 0
                                console.log("Hourly Temp: "+hourlyTemp);
                                console.log("Hourly Apparent Temp: "+hourlyApparentTemp);
                                console.log(openMeteo);

                                // Displaying the temperature on the screen
                                $("#currntValue").html(currentTemp);
                                $("#maxValue").html(maxTemp[0]);
                                $("#minValue").html(minTemp[0]);
                                $(".tempEmblm").html("&deg;C");
                            }
                            )

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

    $('.validator').click(()=>{
        alert("Please enable location services to get the weather of your location");
        if (navigator.geolocation) {
            $("#convrt").removeClass(["fahrenheit", "celsius"]);
            $("#convrt").addClass("celsius");
            navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            $.getJSON("https://us1.locationiq.com/v1/reverse?key=pk.30faa9b253d2b4d143740420e71450d9&lat="+latitude+"&lon="+longitude+"&format=json",
            function (locationIQ) {
                console.log(locationIQ)
                $(".location").html(locationIQ.address.city+", "+locationIQ.address.state+", "+locationIQ.address.country);
            }
            )
            $.getJSON("https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&current=temperature_2m&hourly=temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto",
            function (openMeteo) {

                var time = openMeteo.current.time;
                var splt_time = time.split("")
                if (parseInt(splt_time[14] <= 3)){
                  splt_time[14] = "0"
                  splt_time[15] = "0"
                } else {
                  var hourChg = parseInt(splt_time[12]) + 1
                  splt_time[12] = hourChg.toString()
                  splt_time[14] = "0"
                  splt_time[15] = "0"
                }
                var newTime = splt_time.join('')
                console.log(newTime)
                for (let i=0; i < openMeteo.hourly.time.length; i++){
                    if (openMeteo.hourly.time[i] == newTime){
                        console.log(i)
                        var currentTemp = openMeteo.hourly.temperature_2m[i];
                        var apparentTemp = openMeteo.hourly.apparent_temperature[i];
                        $("#aprtValue").html(apparentTemp);
                        console.log("Current Temp [hourly]: "+currentTemp);
                        console.log("Apparent Temp: "+apparentTemp);
                    }
                }

                var currentTemp = openMeteo.current.temperature_2m;
                var apparentTemp = openMeteo.hourly.apparent_temperature;
                var maxTemp = openMeteo.daily.temperature_2m_max;
                var minTemp = openMeteo.daily.temperature_2m_min;
                var hourlyTemp = openMeteo.hourly.temperature_2m;
                var hourlyApparentTemp = openMeteo.hourly.apparent_temperature;
                console.log("Current Temp [current]: "+currentTemp);
                //console.log("Apparent Temp: "+apparentTemp);
                console.log("Max Temp: "+maxTemp[0]); // Max Temp is an array of the next 7 days including today at index 0
                console.log("Min Temp: "+minTemp[0]); // Min Temp is an array of the next 7 days including today at index 0
                console.log("Hourly Temp: "+hourlyTemp);
                console.log("Hourly Apparent Temp: "+hourlyApparentTemp);
                console.log(openMeteo);

                // Displaying the temperature on the screen
                $("#currntValue").html(currentTemp);
                $("#maxValue").html(maxTemp[0]);
                $("#minValue").html(minTemp[0]);
                $(".tempEmblm").html("&deg;C");
            }
            )

            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    });
        }
        
);

$(document).ready(()=>{
    var locationiqKey = "pk.30faa9b253d2b4d143740420e71450d9"

$('#search-box-input').autocomplete({
    minChars: 3,
    deferRequestBy: 250,
    serviceUrl: 'https://api.locationiq.com/v1/autocomplete',
    paramName: 'q',
    params: {
      // The input parameters to the API goes here
      key: locationiqKey,
      format: "json",
      limit: 5
    },
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
        $.getJSON("https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&current=temperature_2m&hourly=temperature_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto",
        function (openMeteo) {

            var time = openMeteo.current.time;
            var splt_time = time.split("")
            if (parseInt(splt_time[14] <= 3)){
              splt_time[14] = "0"
              splt_time[15] = "0"
            } else {
              var hourChg = parseInt(splt_time[12]) + 1
              splt_time[12] = hourChg.toString()
              splt_time[14] = "0"
              splt_time[15] = "0"
            }
            var newTime = splt_time.join('')
            console.log(newTime)
            for (let i=0; i < openMeteo.hourly.time.length; i++){
                if (openMeteo.hourly.time[i] == newTime){
                    console.log(i)
                    var currentTemp = openMeteo.hourly.temperature_2m[i];
                    var apparentTemp = openMeteo.hourly.apparent_temperature[i];
                    $("#aprtValue").html(apparentTemp);
                    console.log("Current Temp [hourly]: "+currentTemp);
                    console.log("Apparent Temp: "+apparentTemp);
                }
            }

            var currentTemp = openMeteo.current.temperature_2m;
            var apparentTemp = openMeteo.hourly.apparent_temperature;
            var maxTemp = openMeteo.daily.temperature_2m_max;
            var minTemp = openMeteo.daily.temperature_2m_min;
            var hourlyTemp = openMeteo.hourly.temperature_2m;
            var hourlyApparentTemp = openMeteo.hourly.apparent_temperature;
            console.log("Current Temp [current]: "+currentTemp);
            //console.log("Apparent Temp: "+apparentTemp);
            console.log("Max Temp: "+maxTemp[0]); // Max Temp is an array of the next 7 days including today at index 0
            console.log("Min Temp: "+minTemp[0]); // Min Temp is an array of the next 7 days including today at index 0
            console.log("Hourly Temp: "+hourlyTemp);
            console.log("Hourly Apparent Temp: "+hourlyApparentTemp);
            console.log(openMeteo);

            // Displaying the temperature on the screen
            $("#currntValue").html(currentTemp);
            $("#maxValue").html(maxTemp[0]);
            $("#minValue").html(minTemp[0]);
            $(".tempEmblm").html("&deg;C");
        }
        )

    }
  });

  // For triggering reset
  $("#reset-autocomplete").click(function() {
    $('#search-box-input').val("");
  });

  /*
  //Displays the geocoding response in the "result" div
  function displayLatLon(display_name, lat, lng) {
    var resultString = "You have selected " + display_name + "<br/>Lat: " + lat + "<br/>Lon: " + lng;
    document.getElementById("result").innerHTML = resultString;
  }
*/
  function highlight(text, focus) {
    var r = RegExp('(' + escapeRegExp(focus) + ')', 'gi');
    return text.replace(r, '<strong>$1</strong>');
  }

  function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  } 

})