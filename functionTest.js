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

    startTime();
//come back to this later
    $(".slider").click(function() {
        if ($(this).is(":checked")) {
          // Toggle button is checked, convert to Celsius
          $("#far").css("color", "white");
          $("#cel").css("color", "yellow");
          $(".minTemp, .maxTemp, .currntTemp, .aprtTemp").each(function() {
            var tempValue = $(this).find("span:first-child").text();
            if (!isNaN(tempValue)) {
              var celsiusValue = ((parseFloat(tempValue) - 32) * 5) / 9;
              $(this).find("span:first-child").text(celsiusValue.toFixed(1));
            }
          });
          $(".tempEmblm").text("C");
        } else {
          // Toggle button is unchecked, convert to Fahrenheit
          $("#far").css("color", "yellow");
          $("#cel").css("color", "white");
          $(".minTemp, .maxTemp, .currntTemp, .aprtTemp").each(function() {
            var tempValue = $(this).find("span:first-child").text();
            if (!isNaN(tempValue)) {
              var fahrenheitValue = (parseFloat(tempValue) * 9) / 5 + 32;
              $(this).find("span:first-child").text(fahrenheitValue.toFixed(1));
            }
          });
          $(".tempEmblm").text("F");
        }
      });
});