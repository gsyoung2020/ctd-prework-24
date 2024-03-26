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
});

