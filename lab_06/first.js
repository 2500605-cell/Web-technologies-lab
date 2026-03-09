const API_KEY = "72c6d20b08102def7ad614b8f8d1eb15";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput    = document.getElementById("cityInput");
const searchBtn    = document.getElementById("searchBtn");
const weatherCard  = document.getElementById("weatherCard");
const errorBox     = document.getElementById("errorBox");
const loadingBox   = document.getElementById("loadingBox");
const lastSearched = document.getElementById("lastSearched");
const lastCitySpan = document.getElementById("lastCity");
const reloadLast   = document.getElementById("reloadLast");

function getWeatherIcon(condition) {
  const c = condition.toLowerCase();
  if (c.includes("clear"))        return "☀️";
  if (c.includes("cloud"))        return "☁️";
  if (c.includes("rain"))         return "🌧️";
  if (c.includes("drizzle"))      return "🌦️";
  if (c.includes("thunderstorm")) return "⛈️";
  if (c.includes("snow"))         return "❄️";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "🌫️";
  if (c.includes("wind"))         return "💨";
  return "🌡️";
}

function showElement(el) { el.classList.remove("hidden"); }
function hideElement(el) { el.classList.add("hidden"); }

function loadLastCity() {
  const last = localStorage.getItem("lastCity");
  if (last) {
    lastCitySpan.textContent = last;
    showElement(lastSearched);
  }
}

function saveLastCity(city) {
  localStorage.setItem("lastCity", city);
  lastCitySpan.textContent = city;
  showElement(lastSearched);
}

async function getWeather(city) {
  if (!city.trim()) {
    cityInput.focus();
    return;
  }

  hideElement(weatherCard);
  hideElement(errorBox);
  showElement(loadingBox);

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    document.getElementById("cityName").textContent    = data.name + ", " + data.sys.country;
    document.getElementById("tempValue").textContent   = Math.round(data.main.temp) + "°C";
    document.getElementById("condition").textContent   = data.weather[0].description;
    document.getElementById("weatherIcon").textContent = getWeatherIcon(data.weather[0].main);
    document.getElementById("humidity").textContent    = data.main.humidity + "%";
    document.getElementById("wind").textContent        = data.wind.speed + " m/s";
    document.getElementById("feelsLike").textContent   = Math.round(data.main.feels_like) + "°C";

    saveLastCity(data.name);
    hideElement(loadingBox);
    showElement(weatherCard);

  } catch (error) {
    hideElement(loadingBox);
    showElement(errorBox);
  }
}

searchBtn.addEventListener("click", () => getWeather(cityInput.value));

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") getWeather(cityInput.value);
});

reloadLast.addEventListener("click", () => {
  const last = localStorage.getItem("lastCity");
  if (last) {
    cityInput.value = last;
    getWeather(last);
  }
});

loadLastCity();