const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';
// Get the current time, day, and date
const getCurrentDateTime = () => {
    const now = new Date();

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    const locale = navigator.language || 'en-US'; // Use browser's language or default to 'en-US'
    const dateTimeString = now.toLocaleDateString(locale, options);

    const [day, date, time] = dateTimeString.split(', ');

    return {
        day,
        date,
        time
    };
};



// Update the current time, day, and date in the DOM
const updateCurrentDateTime = () => {
    const currentTimeElement = document.getElementById('current-time');
    const currentDateElement = document.getElementById('current-date');

    const { day, date, time } = getCurrentDateTime();

    currentTimeElement.textContent = time;
    currentDateElement.textContent = `${day}, ${date}`;
};

// Call the function to initially set the current time and date
updateCurrentDateTime();

// Set up an interval to update the current time every minute
setInterval(updateCurrentDateTime, 60000);

// Existing code...

const createWeatherCard = (cityName, weatherItem, index, sunrise, sunset) => {
    if(index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    <h6>Sunrise: ${new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h6>
                    <h6>Sunset: ${new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h6>
                </div>
                <div class="icon">
                    <!-- Include other weather-related icons or data here -->
                </div>`;
    } else if (index <= 5) {
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    <!-- Include other weather-related data here -->
                </li>`;
    }
};

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            const { sunrise, sunset } = data.city;

            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            data.list.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index, sunrise, sunset);
                if (html && index <= 5) {
                    if (index === 0) {
                        currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                    } else {
                        weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                    }
                }
            });        
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};

// Existing code...



const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

searchButton.addEventListener("click", getCityCoordinates);
