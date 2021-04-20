function updateWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
}

function searchCity(city) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearch(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#city-input").value;
  searchCity(searchedCity);
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function formatDate(date) {
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[dayIndex];

  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }

  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  return `${currentDay} ${currentHours}:${currentMinutes}`;
}

function convertFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector(".temperature");
  let tempCelc = tempElement.innerHTML;
  tempCelc = Number(tempCelc);
  let tempFahr = Math.round(tempCelc * (9 / 5) + 32);
  tempElement.innerHTML = `${tempFahr}`;
  let tempScale = document.querySelector(".scale");
  tempScale.innerHTML = `°F`;
}

// function convertCelcius(event) {
//   event.preventDefault();
//   let tempElement = document.querySelector(".temperature");
//   let tempFahr = tempElement.innerHTML;
//   tempFahr = Number(tempFahr);
//   let tempCelc = Math.round((tempFahr - 32) * (5 / 9));
//   tempElement.innerHTML = `${tempCelc}`;
//   let tempScale = document.querySelector(".scale");
//   tempScale.innerHTML = `°C`;
// }

// Feature #1a: handleSearch - activated by searching for a city via the search form
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearch);

//Feature #1b: searchLocation - activated by searching via current location
let locationSearch = document.querySelector("#current-location");
locationSearch.addEventListener("click", getCurrentLocation);

// Feature #2: formatDate
let currentTime = document.querySelector("#now-time");
let currentDate = new Date();
currentTime.innerHTML = formatDate(currentDate);

// Feature #3: switchTemperature

// let fahrenheitButton = document.querySelector("#tempF");
// fahrenheitButton.addEventListener("click", convertFahrenheit);

// let celciusButton = document.querySelector("#tempC");
// celciusButton.addEventListener("click", convertCelcius);

//default searchvalue
searchCity("Zürich");
