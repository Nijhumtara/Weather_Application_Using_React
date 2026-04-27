// Displays a 5-day weather forecast using forecast data passed from the parent component
export default function GetForecast({ forecastData }) {

  // Converts a datetime string (e.g. "2024-01-15 12:00:00") to a short day name (e.g. "Mon")
  const getForecastDay = (dt_txt) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[new Date(dt_txt).getDay()];
  };

  // Returns the appropriate Font Awesome icon class based on weather condition
  const getForecastIcon = (weather) => {
    switch (weather) {
      case "Rain":
        return "fa-cloud-rain";
      case "Clouds":
        return "fa-cloud";
      case "Clear":
        return "fa-sun";
      case "Snow":
        return "fa-snowflake";
      case "Thunderstorm":
        return "fa-bolt";
      default:
        return "fa-cloud"; // Fallback for any unhandled weather type
    }
  };
  return (
    <>
      <div id="forcastContainer" className="dashboardContainer">
        {/* Section header */}
        <div id="day-forecast">
          <i class="fa-solid fa-cloud"></i>
          <span>5-Day Forecast</span>
        </div>
        {/* Render one forecast card per day */}
        {forecastData.map((item, index) => (
          <div className="box" key={index}>
            <p className="day">{getForecastDay(item.dt_txt)}</p>
            {/* Weather icon — dynamically chosen based on condition */}
            <i
              className={`fa-solid ${getForecastIcon(item.weather[0].main)}`}
            ></i>
            <div>
              <p className="forecastTemp">{Math.round(item.main.temp)}&deg;C</p>
              <p className="weathType">{item.weather[0].main}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
