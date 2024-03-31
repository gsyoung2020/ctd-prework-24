# Ctd Adv Pre-Work
## Weather App

### To Get It Working
1. In terminal: npm install for all the node modules
2. please contact me via email for the .env file or create a free account at [LocationIQ](https://locationiq.com/) for thier Api Access Token and add it to the .env file as LOCATIONIQ_KEY=KEY_GOES_HERE
3. In terminal: node server.js
4. once you are on the website use it like any other weather website, type in location, click the globe for current location

### How Dose It Work
1. **Automatic Location Detection:** Upon loading, the site immediately identifies your current location to display the current local weather. This is achieved through a two-step process:
- An IP address is obtained using the ipify API.
- This IP address is then used with the ip-api to retrieve the user’s geographical location, including longitude and latitude and then sends that to Open-Metro for the weather data.

2. **Weather Data Retrieval:** With the longitude and latitude data, the Open-Metro API fetchs the current weather conditions. The site uses als the wheretheiss.at API and the moments node module to accurately determine the timezone, ensuring that the seven-day weather forecast is correctly aligned with the local date and time.

3. **Search Functionality:** Users can search for weather forecasts in other locations using a search bar powered by LocationIQ’s reverse geocoding. This feature allows users to input a location name and obtain its longitude and latitude, which then undergoes the same Open-Metro API fetchs for the forecasting.

4. **Manual Location Submission:** My globe icon prompts the web browser to ask for their current location. This option uses the browser's geolocation feature to directly provide longitude and latitude data.

### Things That I Learned
- Nested JSON Requests
- Function Callbacks
- Responsive and Adaptive Design
- Flexbox and Grid Layouts
- Design Research and Mockup Creation
