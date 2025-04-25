document.addEventListener('DOMContentLoaded', () => {
  // API Key
  const apiKey = '04e6eadefb196fce9bf51eb29f053749';
  
  // DOM Elements
  const cityInput = document.getElementById('city');
  const searchBtn = document.getElementById('search-btn');
  const locationBtn = document.getElementById('location-btn');
  const cityName = document.getElementById('city-name');
  const currentDate = document.getElementById('current-date');
  const weatherIconMain = document.getElementById('weather-icon-main');
  const temperature = document.getElementById('temperature');
  const weatherDescription = document.getElementById('weather-description');
  const feelsLike = document.getElementById('feels-like');
  const wind = document.getElementById('wind');
  const humidity = document.getElementById('humidity');
  const pressure = document.getElementById('pressure');
  const visibility = document.getElementById('visibility');
  const forecastItems = document.getElementById('forecast-items');
  const loading = document.getElementById('loading');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const weatherData = document.getElementById('weather-data');
  const weatherApp = document.getElementById('weather-app');
  const themeToggle = document.getElementById('theme-toggle');
  const historyItems = document.getElementById('history-items');
  
  // App State
  let state = {
    weatherHistory: JSON.parse(localStorage.getItem('weatherHistory')) || [],
    isDarkMode: localStorage.getItem('weatherDarkMode') === 'true'
  };
  
  // Initialize theme
  if (state.isDarkMode) {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format day
  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Get weather icon class based on weather condition
  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
      return '<i class="fas fa-bolt"></i>'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
      return '<i class="fas fa-cloud-rain"></i>'; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
      return '<i class="fas fa-cloud-showers-heavy"></i>'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return '<i class="fas fa-snowflake"></i>'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      return '<i class="fas fa-smog"></i>'; // Atmosphere
    } else if (weatherId === 800) {
      return '<i class="fas fa-sun"></i>'; // Clear
    } else {
      return '<i class="fas fa-cloud"></i>'; // Clouds
    }
  };
  
  // Get weather theme class based on weather condition
  const getWeatherTheme = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
      return 'weather-theme-thunderstorm';
    } else if (weatherId >= 500 && weatherId < 600) {
      return 'weather-theme-rain';
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'weather-theme-snow';
    } else if (weatherId === 800) {
      return 'weather-theme-clear';
    } else if (weatherId > 800) {
      return 'weather-theme-clouds';
    }
    return '';
  };
  
  // Show loading indicator
  const showLoading = () => {
    loading.style.display = 'flex';
    errorContainer.style.display = 'none';
    weatherData.style.display = 'none';
  };
  
  // Show error message
  const showError = (message) => {
    loading.style.display = 'none';
    errorContainer.style.display = 'flex';
    weatherData.style.display = 'none';
    errorMessage.textContent = message;
  };
  
  // Show weather data
  const showWeatherData = () => {
    loading.style.display = 'none';
    errorContainer.style.display = 'none';
    weatherData.style.display = 'block';
  };
  
  // Update search history UI
  const updateSearchHistory = () => {
    historyItems.innerHTML = '';
    
    state.weatherHistory.slice(0, 5).forEach(city => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.textContent = city;
      historyItem.addEventListener('click', () => {
        cityInput.value = city;
        getWeather(city);
      });
      
      historyItems.appendChild(historyItem);
    });
  };
  
  // Add city to search history
  const addToSearchHistory = (city) => {
    // Remove city if it already exists in history
    state.weatherHistory = state.weatherHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add city to the beginning of the history array
    state.weatherHistory.unshift(city);
    
    // Limit history to 5 items
    if (state.weatherHistory.length > 5) {
      state.weatherHistory.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('weatherHistory', JSON.stringify(state.weatherHistory));
    
    // Update UI
    updateSearchHistory();
  };
  
  // Get current weather data
  async function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod === '404') {
        throw new Error('City not found');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Get 5-day forecast data
  async function getForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Display current weather and forecast
  async function getWeather(city) {
    showLoading();
    
    try {
      // Get current weather
      const currentData = await getCurrentWeather(city);
      
      // Add to search history
      addToSearchHistory(currentData.name);
      
      // Get forecast using coordinates from current weather
      const forecastData = await getForecast(currentData.coord.lat, currentData.coord.lon);
      
      // Process and display the data
      displayWeather(currentData, forecastData);
    } catch (error) {
      showError(error.message || 'Failed to fetch weather data');
    }
  }
  
  // Get weather by geolocation
  async function getWeatherByLocation() {
    showLoading();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // Get city name from coordinates
          const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
          const data = await response.json();
          
          if (data.length > 0) {
            const city = data[0].name;
            cityInput.value = city;
            getWeather(city);
          } else {
            throw new Error('Location not found');
          }
        } catch (error) {
          showError(error.message || 'Failed to get location');
        }
      }, () => {
        showError('Geolocation permission denied. Please search manually.');
      });
    } else {
      showError('Geolocation not supported by this browser');
    }
  }
  
  // Process and display the weather data
  function displayWeather(currentData, forecastData) {
    // Display current weather
    cityName.textContent = `${currentData.name}, ${currentData.sys.country}`;
    currentDate.textContent = formatDate(currentData.dt);
    weatherIconMain.innerHTML = getWeatherIcon(currentData.weather[0].id);
    temperature.textContent = `${Math.round(currentData.main.temp)}°C`;
    weatherDescription.textContent = currentData.weather[0].description;
    feelsLike.textContent = `${Math.round(currentData.main.feels_like)}°C`;
    wind.textContent = `${currentData.wind.speed} m/s`;
    humidity.textContent = `${currentData.main.humidity}%`;
    pressure.textContent = `${currentData.main.pressure} hPa`;
    visibility.textContent = `${(currentData.visibility / 1000).toFixed(1)} km`;
    
    // Apply weather theme
    const themeClass = getWeatherTheme(currentData.weather[0].id);
    const currentWeatherElement = document.querySelector('.current-weather');
    currentWeatherElement.className = 'current-weather';
    if (themeClass) {
      currentWeatherElement.classList.add(themeClass);
    }
    
    // Display 5-day forecast
    displayForecast(forecastData);
    
    // Show the weather data section
    showWeatherData();
  }
  
  // Display the 5-day forecast
  function displayForecast(forecastData) {
    forecastItems.innerHTML = '';
    
    // Process forecast data (one forecast per day)
    const dailyForecasts = {};
    
    forecastData.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toDateString();
      
      // Skip today
      if (!dailyForecasts[day] && date.getDate() !== new Date().getDate()) {
        dailyForecasts[day] = forecast;
      }
    });
    
    // Display up to 5 forecasts
    Object.values(dailyForecasts).slice(0, 5).forEach(forecast => {
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      
      const forecastDate = new Date(forecast.dt * 1000);
      const day = formatDay(forecast.dt);
      const date = forecastDate.getDate() + '/' + (forecastDate.getMonth() + 1);
      
      forecastItem.innerHTML = `
        <div class="forecast-day">${day}</div>
        <div class="forecast-date">${date}</div>
        <div class="forecast-icon">${getWeatherIcon(forecast.weather[0].id)}</div>
        <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
        <div class="forecast-description">${forecast.weather[0].description}</div>
      `;
      
      forecastItems.appendChild(forecastItem);
    });
  }
  
  // Toggle dark/light theme
  function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-theme', state.isDarkMode);
    themeToggle.innerHTML = state.isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('weatherDarkMode', state.isDarkMode);
  }
  
  // Event Listeners
  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
    }
  });
  
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = cityInput.value.trim();
      if (city) {
        getWeather(city);
      }
    }
  });
  
  locationBtn.addEventListener('click', getWeatherByLocation);
  
  themeToggle.addEventListener('click', toggleTheme);
  
  // Initialize app
  updateSearchHistory();
});
