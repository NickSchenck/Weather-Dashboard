dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
let searchSection = document.querySelector("#search-section");
let fullForecastSection = document.getElementById("five-readout");

let time = moment(new Date()).format("MM/DD");
let currentDay = new Date().toLocaleString('en-us', {  weekday: 'long' });
let historyClicked = document.querySelector("#search-history");
let baseURL = "http://api.openweathermap.org/data/2.5/";
let apiKey = "88492f617957986cb392da3e78550452";
let searchCity = document.querySelector("#search-area");
let city = searchCity.value.trim();

function formSubmitHandler(event) {
  event.preventDefault();

  if (city === "") {
    alert("You must enter a valid city.")
  };
  let citySave = document.createElement("button");
  citySave.classList.add("d-flex", "flex-column", "align-items-stretch", "border-0", "bg-secondary", "w-100", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  document.getElementById("search-history").appendChild(citySave);
  document.getElementById("city-searched").innerText = `${city}, ${currentDay}, ${time}`;
  getWeather();
};

function getWeather(){

  fetch(`${baseURL}weather?appid=${apiKey}&q=${city}&units=imperial`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
      getFullForecast(data);
    });
};

function getFullForecast(weather){
  let lat = weather.coord.lat;
  let lon = weather.coord.lon;

  fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      determineFullForecast(data);
    });
};

function determineFullForecast(data){
  let fiveDayForecast = [];

  for(let i = 0; i < data.list.length; i++){
    if(data.list[i].dt_txt[12] === `5`){
      fiveDayForecast.push(data.list[i]);
    };
  };
  displayFullForecast(fiveDayForecast);
};

function displayFullForecast(weather){
  fullForecastSection.classList.remove("hide");
  fullForecastSection.classList.add("d-flex");
  for(let i = 0; i < 5; i++){
    let dateConversion = new Date(weather[i].dt*1000);
    let day = dateConversion.toDateString().slice(0, 3);
    let date = weather[i].dt_txt.slice(5, 11);
    let icon = weather[i].weather[0].icon;
    let iconEl = document.createElement("img");
    iconEl.src = `http://openweathermap.org/img/w/${icon}.png`;
    document.getElementById("date" + (i + 1)).innerHTML = `${day}, ${date}`;
    document.getElementById("icon" + (i + 1)).appendChild(iconEl);
    document.getElementById("temp" + (i + 1)).innerText = `Temp: ${weather[i].main.temp}°F`;
    document.getElementById("wind" + (i + 1)).innerText = `Wind: ${weather[i].wind.speed}MPH`;
    document.getElementById("humid" + (i + 1)).innerText = `Humidity: ${weather[i].main.humidity}%`;
  };
};

function displayWeather(weather) {
  document.getElementById("city-temp").innerText = "Temp: " + weather.main.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + weather.wind.speed + "MPH";
  document.getElementById("city-humid").innerText = "Humidity: " + weather.main.humidity + "%";
};

searchSection.addEventListener("submit", formSubmitHandler);
historyClicked.addEventListener("click", displayWeather);

/*TODO:

  Impliment results for our 5-day forecast
    -potentially add ability to change which forecast for a given block of time is being displayed(morning, afternoon, evening, night)
  
  Ability to search other cities without a page refresh
    -ability to delete saved cities upon button press
  
  Eliminate the duplication of previously searched cities as saved search terms

  Re-implimentation of the small weather-graphics that were previously used(cloudy symbol, sunny symbol, clear symbol)
    -vaguely remember there being a duplication issue with these
    -ensure they're being used in the main, current-day, forecast readout

  More user feedback
    -maybe a prompt/alert if city names are spelled incorrectly
    -label for the section containing previously searched cities
    -possibly display a button which would allow the user to see the 5-day forecast, rather than an empty chart(basic DOM manipulation)

  Likely some CSS touch-ups and changes
    -Will have to look at and refamiliarize myself with bootstrap, probably want to continue styling this app with it
    -considering combining the date and icon rows in 5-day forecast 
 */