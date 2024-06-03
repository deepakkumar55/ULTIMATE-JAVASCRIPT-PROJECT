const apiKey = '04e6eadefb196fce9bf51eb29f053749'; // Replace with your actual API key

async function getWeather() {
    const city = document.getElementById('city').value;
    if (city === '') {
        alert('Please enter a city name');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found');
            return;
        }

        displayWeather(data);
    } catch (error) {
        alert('Failed to fetch weather data');
    }
}

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                alert('Failed to fetch weather data');
            }
        }, () => {
            alert('Geolocation not supported or permission denied');
        });
    } else {
        alert('Geolocation not supported by this browser');
    }
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temp').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} M/S`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
}
