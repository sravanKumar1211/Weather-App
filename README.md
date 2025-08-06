# Weather-App
A responsive and elegant weather web application built using HTML, CSS, Tailwind CSS, and JavaScript. This project uses the OpenWeatherMap API to fetch and display real-time weather information based on user input. It features current weather, 3-hourly forecasts for today, and a 5-day weather forecast.

    PROJECT-Weather Dashboard Web App


A clean and interactive weather dashboard built using HTML, CSS (Tailwind), and JavaScript. This application allows users to search for any city's weather, view current conditions, and get updates using a weather API.

=>Project Overview

This project is a simple but powerful weather dashboard that uses live weather data from a third-party API. API integration, dynamic DOM manipulation, and localStorage handling.

=> Technologies Used

- HTML5: Structure and layout of the web app.
- CSS3 + Tailwind CSS: Styling with utility-first classes and responsive design.
- JavaScript (Vanilla): Core logic, event handling, DOM manipulation, and API integration.
- OpenWeatherMap API: Fetches real-time weather data.
- localStorage: Stores recent cities searched by the user for quick access.

=> Key Features

- Search Weather by City 
  Type any city name and instantly get the weather details.

- 📍 Get Weather by Current Location  
  Click the "Current Location" button to automatically get weather based on your device's location.

- Real-Time Weather Info
  Displays temperature, humidity, wind speed, and weather description in real time.

- Recent Searches 
  Saves your previously searched cities using `localStorage` and lets you quickly recheck them.

- Interactive UI 
  Responsive and clean design using Tailwind CSS, with visual feedback for user interactions.

=>Core Logic and Implementation

     🔄 API Integration

  - Uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch:
  - City weather data based on input
  - Weather by coordinates (from `navigator.geolocation`)

=> Data Flow and Logic

1. User Input:
   - The city name is taken from the input bar.
   - A `fetch()` call is made to the API with this city name.

2. Current Location:
   - Uses `navigator.geolocation` to get coordinates.
   - Fetches weather data using latitude and longitude.

3. DOM Manipulation:
   - Dynamically updates weather details using `textContent`.
   - Displays city name, temperature, humidity, and weather condition.

4. LocalStorage Logic:
   - Maintains a unique list of recent cities.
   - Prevents duplicates.
   - Loads recent cities on app reload.

=> Additional JS Techniques

- Destructuring API response for cleaner code.
- Event delegation to handle clicks on dynamically created elements.
- Error handling for invalid input or network failure.

=> Project Structure
├──  index.html (Main HTML file)
├──  script.js  (JavaScript for logic)
├──  style.css  (Custom styles (optional))
├──  Project documentation

