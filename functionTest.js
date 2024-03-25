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

$(document).ready(function() {
    function startTime() {
        // Look into what Brian K sent in Teams, toLocaleTimeString()
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        m = checkTime(m);
        console.log(h);
        
        if (h > 12) {
            var pm = h - 12;
            document.getElementById('timetxt').innerHTML = pm + ":" + m + " PM";
        } else if (h === 0) {
            var midNight = 12;
            document.getElementById('timetxt').innerHTML = midNight + ":" + m + " AM";
        } else {
            var am = h;
            document.getElementById('timetxt').innerHTML = am + ":" + m + " AM";
        }
        setTimeout(startTime, 60000);
    }
    
    function checkTime(i) {
        if (i < 10) {i = "0" + i;}  // add zero in front of numbers < 10
        return i;
    }

    $("#prev").click(function() {
    $("#first12").show()
    $("#second12").hide()  
    })

    $("#next").click(function() {
    $("#first12").hide()
    $("#second12").show()
    })

    startTime();
    $(".switch input[type='checkbox']").click(function() {
      if ($(this).is(":checked")) {
        $("#convrt").removeClass("celsius").addClass("fahrenheit");
        convertToFahrenheitBTN();
      } else {
        $("#convrt").removeClass("fahrenheit").addClass("celsius");
        convertToCelsiusBTN();
      }
    });
});

