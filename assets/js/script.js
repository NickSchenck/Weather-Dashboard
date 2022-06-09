/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city */
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

var searchSection = document.querySelector("#search-section");
var searchCity = document.querySelector("#search-area");
var time = moment(new Date()).format("MM/DD/YYYY");

// console.log(time);

var formSubmitHandler = function (event) {
  event.preventDefault();
  // console.log(event);
  var city = searchCity.value.trim();
  // console.log(city)
  if (city === "") {
    alert("You must enter a valid city")
  }
  var citySave = document.createElement("button");
  citySave.classList.add("d-flex", "flex-column", "align-items-stretch", "border-0", "bg-secondary", "w-100", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  document.getElementById("search-history").appendChild(citySave);
  document.getElementById("city-searched").innerText = city + " " + time;
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=88492f617957986cb392da3e78550452&units=imperial")
    .then(response =>
      response.json()
    )
    .then(data =>
      displayWeather(data)//This is what allows data to be defined outside the scope its in
    );

};

displayWeather = function (data) {
  var cityLat = data.coord.lat;
  var cityLon = data.coord.lon;
  // console.log(cityLon);
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=88492f617957986cb392da3e78550452&units=imperial")
    .then(response =>
      response.json()
    )
    .then(data =>
      (data));
  // console.log(UVI);
  document.getElementById("city-temp").innerText = "Temp: " + data.main.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + data.wind.speed + "MPH";
  document.getElementById("city-humid").innerText = "Humidity: " + data.main.humidity + "%";
  document.getElementById("city-uv").innerText = "UV Index: " + data.current.uvi;
};

// historyClick = function(){
  
// };

searchSection.addEventListener("submit", formSubmitHandler);

//API call on 47 isn't wanting to be put into an array like the one on 33
//Unsure how to populate appropriate fields when a history item is clicked
//unsure how to iterate the date in order to write to the 5-day forecast
//unsure of how to get info from the API which is a day or more ahead of current call, in order to write to 5-day forecast
