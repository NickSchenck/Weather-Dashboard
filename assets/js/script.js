dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
let searchSection = document.getElementById("search-section");
let fullForecastSection = document.getElementById("five-readout");
let forecastTimes = document.querySelectorAll(".forecast-times");
let availableStates = document.querySelectorAll(".available-states");
let cityDeleteButton = document.getElementById("delete-button");
let userSelection = document.getElementById("user-selection");
// let stateConfirmation = document.getElementById("state-confirm");

let time = moment(new Date()).format("MM/DD");
let timeForForecast = `5`;
let currentDay = new Date().toLocaleString('en-us', {  weekday: 'long' });
let historySection = document.getElementById("search-history");
let baseURL = "http://api.openweathermap.org/data/2.5/";
let apiKey = "88492f617957986cb392da3e78550452";
let searchCity = document.getElementById("search-area");
let allSearchedCities = [];
let globalData;

function formSubmitHandler() {
  let city = searchCity.value.trim();
  event.preventDefault();

  if (city === "") {
    alert("You must enter a valid city.")
  };
  let cityCell = document.createElement("div");
  let citySave = document.createElement("button");
  let deleteButton = document.createElement("button");
  citySave.classList.add("d-flex", "justify-content-center", "align-items-stretch", "w-75", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  deleteButton.classList.add("rounded", "delete-button");
  deleteButton.innerText = `Del`;
  

  if(allSearchedCities.includes(city)){
    window.alert(`City is saved`);
  }else{
    allSearchedCities.push(city);
    historySection.appendChild(cityCell);
    cityCell.appendChild(deleteButton);
    cityCell.appendChild(citySave);
  };
  getWeather(city);
  getUserChoice(city);

  citySave.addEventListener("click", (event)=>{
    let cityToSearch = event.target.innerText;
    getWeather(cityToSearch);
  });

  deleteButton.addEventListener("click", (event)=>{
    let parentElement = event.target.parentElement;
    parentElement.remove();
    allSearchedCities = allSearchedCities.filter((city) => city !== parentElement.children[1].innerText);
  });
};
/*http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key} 
  
  shuffle(array.answers).forEach((answer) => {
    let button = document.createElement("button");
    button.innerText = answer.option;
    answerButtons.appendChild(button);
    button.classList.add("btn", "disableBtn");
    button.addEventListener("click", answerSelected);
    button.addEventListener("click", isCorrect);
  });*/

function getUserChoice(city){
  userSelection.classList.remove("hide");

  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      userSelection.innerText = `Which state is ${city} located in?`
      console.log(data);
      data.forEach((entry) =>{
        let button = document.createElement("button");
        button.classList.add("available-states");
        button.innerText = entry.state;
        
        userSelection.appendChild(button);
      });
      /*Need to determine the city the user selects, THEN ensure that only the information related to that selection is passed to a
      function that makes an API call w/ lat&lon of the selected city*/
      
    });
};

console.log(availableStates)
for(let i = 0; i < availableStates.length; i++){
  availableStates[i].addEventListener("click", (event)=>{
    let chosenState = event.target.innerText;
    console.log(chosenState);
  })
}
/*data.forEach((entry) =>{
        let button = document.createElement("button");
        button.classList.add("available-states");
        button.innerText = entry.state;
        
        userSelection.appendChild(button);
      }); */

function getWeather(city){
  document.getElementById("city-searched").innerText = `${city}, ${currentDay}, ${time}`;

  fetch(`${baseURL}weather?appid=${apiKey}&q=${city}&units=imperial`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
      getFullForecast(data);
    });
};
/*function getWeather(city){
  document.getElementById("city-searched").innerText = `${city}, ${currentDay}, ${time}`;

  fetch(`${baseURL}weather?appid=${apiKey}&q=${city}&units=imperial`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
      getFullForecast(data);
    });
}; */

function getFullForecast(weather){
  let lat = weather.coord.lat;
  let lon = weather.coord.lon;
/*https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key} */
  fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      globalData = data;
      determineFullForecast();
    });
};

function determineFullForecast(){
  let fiveDayForecast = [];

  for(let i = 0; i < globalData.list.length; i++){
    if(globalData.list[i].dt_txt[12] === timeForForecast){
      fiveDayForecast.push(globalData.list[i]);
    };
  };
  displayFullForecast(fiveDayForecast);
};

function displayFullForecast(weather){
  fullForecastSection.classList.remove("hide");
  fullForecastSection.classList.add("d-flex", "flex-wrap");
  for(let i = 0; i < 5; i++){
    let dateConversion = new Date(weather[i].dt*1000);
    let day = dateConversion.toDateString().slice(0, 3);
    let date = weather[i].dt_txt.slice(5, 11);
    let icon = weather[i].weather[0].icon;
    document.getElementById("date" + (i + 1)).innerHTML = `${day}, ${date}`;
    document.getElementById("icon" + (i + 1)).src = `http://openweathermap.org/img/w/${icon}.png`;
    document.getElementById("temp" + (i + 1)).innerText = `Temp: ${weather[i].main.temp}°F`;
    document.getElementById("wind" + (i + 1)).innerText = `Wind: ${weather[i].wind.speed}MPH`;
    document.getElementById("humid" + (i + 1)).innerText = `Humidity: ${weather[i].main.humidity}%`;
  };
};

function displayWeather(weather) {
  let icon = weather.weather[0].icon;
  document.getElementById("main-icon").src = `http://openweathermap.org/img/w/${icon}.png`;
  document.getElementById("city-temp").innerText = "Temp: " + weather.main.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + weather.wind.speed + "MPH";
  document.getElementById("city-humid").innerText = "Humidity: " + weather.main.humidity + "%";
};

searchSection.addEventListener("submit", formSubmitHandler);

console.log(forecastTimes)
for(let i = 0; i < forecastTimes.length; i++){
  forecastTimes[i].addEventListener("click", (event)=>{
    let clickedTime = event.target.innerText;
    console.log(clickedTime)
    if(clickedTime === "Morning"){
      timeForForecast = `5`;
      determineFullForecast();
    }else if(clickedTime === "Afternoon"){
      timeForForecast = `1`;
      determineFullForecast();
    }else if(clickedTime === "Evening"){
      timeForForecast = `3`;
      determineFullForecast()
    }else if(clickedTime === "Night"){
      timeForForecast = `6`;
      determineFullForecast();
    };
  });
};



/*TODO:
  Implimentation of user-selection of cities, to ensure they're getting weather for area's they intend
    -changes have been made to how functions are being called, will have to revert those changes to test certain things

  Likely some CSS touch-ups and changes
    -Will have to look at and refamiliarize myself with bootstrap, probably want to continue styling this app with it
    -considering combining the date and icon rows in 5-day forecast 
 */