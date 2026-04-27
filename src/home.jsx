import { useState, useEffect } from "react";
import WindHumidity from "./windHumidity";
import GetForecast from "./getForecastData";

export default function Home() {
  const weather_api_key = "a156fa16b746fc1f2fa795709e77cddc";

  // State for search input, currently displayed city, weather/forecast data, and autocomplete suggestions
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("Sylhet");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Build current date and time values for display
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayName = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const time = now.toLocaleTimeString();

  // Fetch city name suggestions from OpenWeatherMap Geocoding API as the user types
  const fetchSuggestions = (query) => {
    if (query.length < 2) { setSuggestions([]); return; }
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${weather_api_key}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => console.log(err));
  };

  // Fetch 5-day forecast and filter to one entry per day (12:00:00 noon)
  const fetchForecast = (cityName) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weather_api_key}&units=metric`)
      .then((res) => res.json())
      .then((data) => {
        const daily = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
        setForecastData(daily);
      })
      .catch((err) => console.log(err));
  };

  // Fetch current weather using lat/lon coordinates, then also fetch the forecast
  const fetchWeather = (lat, lon, name) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=metric`)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setSearchedCity(name);
      })
      .catch((err) => console.log(err));

    fetchForecast(name);
  };

 // On initial render, fetch coordinates for the default city (Sylhet) and load its weather
  useEffect(() => {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=Sylhet&limit=1&appid=${weather_api_key}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          fetchWeather(data[0].lat, data[0].lon, data[0].name);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Handle manual search: geocode the typed city name, then fetch its weather
  const handleSearch = () => {
    if (!city.trim()) return;
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weather_api_key}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSuggestions([]);
          fetchWeather(data[0].lat, data[0].lon, data[0].name);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {/* Search bar with autocomplete suggestions */}
      <div id="searchBar">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search any city in the world"
          value={city}
          onChange={(e) => { setCity(e.target.value); fetchSuggestions(e.target.value); }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} id="searchButton">Search</button>

        {/* Dropdown suggestion list — only shown when suggestions exist */}
        {suggestions.length > 0 && (
          <ul id="suggestions">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => {
                setCity(item.name);
                setSuggestions([]);
                fetchWeather(item.lat, item.lon, item.name);
              }}>
                {item.name}, {item.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main weather dashboard */}
      <section id="dashboard">
        <div className="dashboardContainer">
          {/* City name and current date */}
          <div id="location">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <p id="city">{searchedCity}</p>
              <span id="date">{month} {date}, {year}</span>
            </div>
          </div>
          {/* Current day and time */}
          <span id="dayTime">{dayName}, {time}</span>
          {/* Temperature display — shows "--" while data is loading */}
          <div id="tempContainer">
            <span id="temperature">{weatherData ? Math.round(weatherData.main.temp) : "--"}</span>
            <p className="deg">&deg;C</p>
          </div>

          {/* Weather condition and "feels like" temperature */}
          <div id="weatherTypeContainer">
            <i class="fa-solid fa-cloud-sun"></i>
            <div>
              <p id="weatherType">{weatherData ? weatherData.weather[0].main : "--"}</p>
              <span id="weatherFeels">
                Feels like {weatherData ? Math.round(weatherData.main.feels_like) : "--"}&deg;C
              </span>
            </div>
          </div>
        </div>
        
        {/* 5-day forecast component */}
        <GetForecast forecastData={forecastData} />
      </section>
      {/* Wind speed and humidity info component */}
      <WindHumidity weatherData={weatherData} />
    </>
  );
}