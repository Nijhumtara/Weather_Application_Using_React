// Displays wind speed, humidity, sunrise, and sunset info from the current weather data
export default function WindHumidity({weatherData}) {
  return (
    <>
      <div id="WHSS-Container">

        {/* Wind Speed card */}
        <div className="container">
          <i id="icon1" class="fa-solid fa-wind"></i>
          <p>Wind Speed</p>
          <span>{weatherData ? weatherData.wind.speed : "--"} Km/h</span>
        </div>

        {/* Humidity card */}
        <div className="container">
          <i id="icon2" class="fa-solid fa-droplet"></i>
          <p>Humidity</p>
          <span>{weatherData ? weatherData.main.humidity : "--"}%</span>
        </div>

        {/* Sunrise card — converts Unix timestamp (seconds) to a readable HH:MM time */}
        <div className="container">
          <i id="icon3" class="fa-solid fa-cloud-sun"></i>
          <p>Sunrise</p>
          <span>
            {weatherData
              ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" },
                )
              : "--"}
          </span>
        </div>

        {/* Sunset card — same Unix timestamp conversion as sunrise */}
        <div className="container">
          <i id="icon4" class="fa-solid fa-mountain-sun"></i>
          <p>Sunset</p>
          <span>
            {weatherData
              ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--"}
          </span>
        </div>
      </div>
    </>
  );
}
