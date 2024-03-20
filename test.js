console.log(moment().tz("America/Los_Angeles").format());



// Function to get an array of 7 days for a given timezone
function getSevenDayForecastForTimezone(timezone) {
    let dates = [];
    for (let i = 0; i < 7; i++) {
        // Create a moment object for the current date in the specified timezone
        let date = moment().tz(timezone).add(i, 'days');
        // Format the date as you prefer, e.g., "YYYY-MM-DD"
        dates.push(date.format('YYYY-MM-DD'));
    }
    return dates;
}

// Example usage
const timezone = 'Asia/Tokyo'; // For Japan
const sevenDayForecast = getSevenDayForecastForTimezone(timezone);
console.log(sevenDayForecast);