document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const cityName = document.getElementById('city-name');
  const currentDate = document.getElementById('current-date');
  const currentTemp = document.getElementById('current-temp');
  const weatherIcon = document.getElementById('weather-icon');
  const windSpeed = document.getElementById('wind-speed');
  const humidity = document.getElementById('humidity');
  const precipitation = document.getElementById('precipitation');
  const forecastContainer = document.getElementById('forecast-container');
  const loader = document.querySelector('.loader');

  // API Configuration
  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Initialize with default city
  fetchWeatherData('New York');

  // Event Listeners
  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeatherData(city);
    }
  });

  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = cityInput.value.trim();
      if (city) {
        fetchWeatherData(city);
      }
    }
  });

  // Fetch Weather Data
  async function fetchWeatherData(city) {
    try {
      showLoader();
      
      // Fetch current weather
      const currentWeatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentWeatherResponse.ok) {
        throw new Error('City not found');
      }
      
      const currentWeatherData = await currentWeatherResponse.json();
      
      // Fetch forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();
      
      updateCurrentWeather(currentWeatherData);
      updateForecast(forecastData);
      
      hideLoader();
    } catch (error) {
      hideLoader();
      alert(error.message);
      console.error('Error fetching weather data:', error);
    }
  }

  // Update Current Weather
  function updateCurrentWeather(data) {
    cityName.textContent = data.name;
    currentTemp.textContent = Math.round(data.main.temp);
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    
    // Set precipitation (rain or snow)
    if (data.rain) {
      precipitation.textContent = `${data.rain['1h'] || 0}%`;
    } else if (data.snow) {
      precipitation.textContent = `${data.snow['1h'] || 0}%`;
    } else {
      precipitation.textContent = '0%';
    }
    
    // Update weather icon
    updateWeatherIcon(data.weather[0].id, data.weather[0].icon);
    
    // Update date
    updateCurrentDate();
  }

  // Update Forecast
  function updateForecast(data) {
    forecastContainer.innerHTML = '';
    
    // Filter to get one forecast per day (every 24 hours)
    const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0);
    
    dailyForecasts.slice(0, 5).forEach(forecast => {
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      forecastItem.innerHTML = `
        <div class="forecast-day">${day}</div>
        <div class="forecast-icon">
          <i class="${getWeatherIconClass(forecast.weather[0].id, forecast.weather[0].icon)}"></i>
        </div>
        <div class="forecast-temp">
          <span class="max-temp">${Math.round(forecast.main.temp_max)}°</span>
          <span class="min-temp">${Math.round(forecast.main.temp_min)}°</span>
        </div>
      `;
      
      forecastContainer.appendChild(forecastItem);
    });
  }

  // Update Weather Icon
  function updateWeatherIcon(weatherId, iconCode) {
    const iconClass = getWeatherIconClass(weatherId, iconCode);
    weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
  }

  // Get Weather Icon Class
  function getWeatherIconClass(weatherId, iconCode) {
    // Weather codes from OpenWeatherMap
    if (weatherId >= 200 && weatherId < 300) {
      return 'fas fa-bolt'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
      return 'fas fa-cloud-rain'; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
      return iconCode.includes('d') ? 'fas fa-cloud-sun-rain' : 'fas fa-cloud-moon-rain'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'fas fa-snowflake'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      return 'fas fa-smog'; // Atmosphere (fog, haze, etc.)
    } else if (weatherId === 800) {
      return iconCode.includes('d') ? 'fas fa-sun' : 'fas fa-moon'; // Clear
    } else if (weatherId > 800) {
      return iconCode.includes('d') ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon'; // Clouds
    } else {
      return 'fas fa-cloud'; // Default
    }
  }

  // Update Current Date
  function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // Loader Functions
  function showLoader() {
    loader.style.display = 'flex';
  }

  function hideLoader() {
    loader.style.display = 'none';
  }
});