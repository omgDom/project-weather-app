// Function to set day or night background image
// function setDayNightBackgroundImage(sunriseTimestamp, sunsetTimestamp) {
//     const currentTime = new Date().getTime() / 1000;
//     const isDaytime = currentTime > sunriseTimestamp && currentTime < sunsetTimestamp;
//     const weatherDisplay = document.getElementById('weather-display');

//     if (isDaytime) {
//         weatherDisplay.classList.remove('weather-night');
//         weatherDisplay.classList.add('weather-day');
//     } else {
//         weatherDisplay.classList.remove('weather-day');
//         weatherDisplay.classList.add('weather-night');
//     }
// }

// Function to format time to two digits
function formatTimeToTwoDigits(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Fetch weather data
function fetchWeatherData(city) {
    const apiKey = 'b1590a0f85e6cea1756b0a2fbefb5583';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            setDayNightBackgroundImage(data.city.sunrise, data.city.sunset);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Weather data
function displayWeatherData(data) {
    const locationName = document.getElementById('locationName');
    const currentTemperature = document.getElementById('currentTemperature');
    const conditions = document.getElementById('conditions');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');

    locationName.textContent = `${data.city.name}, ${data.city.country}`;

    currentTemperature.textContent = `${Math.round(data.list[0].main.temp)}°C`;
    conditions.textContent = data.list[0].weather[0].description;

    sunrise.textContent = `Sunrise: ${formatTimeToTwoDigits(data.city.sunrise)}`;
    sunset.textContent = `Sunset: ${formatTimeToTwoDigits(data.city.sunset)}`;

    // Display the 5-day forecast
    const forecastDays = document.getElementById('forecastDays');
    forecastDays.innerHTML = '';

    const uniqueDays = new Set();

    for (let i = 1; i < data.list.length; i++) {
        const forecast = data.list[i];
        const dayOfWeek = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });

        if (!uniqueDays.has(dayOfWeek)) {
            uniqueDays.add(dayOfWeek);

            const temperature = `${Math.round(forecast.main.temp)}°C`;
            const windSpeed = `${Math.round(forecast.wind.speed.toFixed(1))} m/s`;
            const weatherIcon = `<img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">`;

            const dayElement = document.createElement('div');
            dayElement.innerHTML = `
            <div>${dayOfWeek}</div>
            <div>${weatherIcon}</div>
            <div>${temperature}</div>
            <div>${windSpeed}</div>
            `;
            forecastDays.appendChild(dayElement);
        }
    }
}

// Function to search for weather
function searchWeather() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value;

    if (location) {
        fetchWeatherData(location);
    } else {
        alert('Please enter a location.');
    }
}

fetchWeatherData('Malmo, Sweden');

// Enter key event listener
locationInput.addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});