dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
let searchSection = document.querySelector("#search-section");
let fullForecastSection = document.getElementById("five-readout");
//let deleteButtonContainer = document.getElementById("delete-buttons");
let forecastTimes = document.querySelectorAll(".forecast-times");

let time = moment(new Date()).format("MM/DD");
let timeForForecast = `5`;
let currentDay = new Date().toLocaleString('en-us', {  weekday: 'long' });
let historySection = document.querySelector("#search-history");
let baseURL = "http://api.openweathermap.org/data/2.5/";
let apiKey = "88492f617957986cb392da3e78550452";
let searchCity = document.querySelector("#search-area");
let allSearchedCities = [];

function formSubmitHandler() {
  let city = searchCity.value.trim();
  event.preventDefault();

  if (city === "") {
    alert("You must enter a valid city.")
  };
  let citySave = document.createElement("button");
  //let deleteButton = document.createElement("button");
  citySave.classList.add("d-flex", "justify-content-center", "align-items-stretch", "border-0", "w-75", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  //deleteButton.classList.add("w-25", "justify-content-end");
  //deleteButton.innerText = `Del`;
  // citySave.appendChild(deleteButton);

  if(allSearchedCities.includes(city)){
    console.log(`Saved`);
  }else{
    historySection.appendChild(citySave);
    //deleteButtonContainer.appendChild(deleteButton);
  };
  allSearchedCities.push(city);
  
  getWeather(city);

  citySave.addEventListener("click", (event)=>{
    let cityToSearch = event.target.innerText;
    getWeather(cityToSearch);
  });
};

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

function getFullForecast(weather){
  // console.log(weather)
  let lat = weather.coord.lat;
  let lon = weather.coord.lon;

  fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      determineFullForecast(data); //This is where I should try targeting a global variable for saving data to
    });
};

function determineFullForecast(data){
  // console.log(data);
  let fiveDayForecast = [];

  for(let i = 0; i < data.list.length; i++){
    if(data.list[i].dt_txt[12] === timeForForecast){ //This is targeting a block-of-time within our returned object
      fiveDayForecast.push(data.list[i]);
    };
  };
  displayFullForecast(fiveDayForecast);
  /*Techincally working, but has a major issue with repeating exponentially. This noticably slows down the page after a handful of clicks */
  for(let i = 0; i < forecastTimes.length; i++){
    forecastTimes[i].addEventListener("click", (event)=>{
      let timeToForecast = event.target.innerText;
      console.log(timeToForecast); //forecastTimes is being repeated exponentially whenever a time-selecting button is pressed
      if(timeToForecast === "Morning"){
        determineFullForecast(data, `5`);
      }else if(timeToForecast === "Afternoon"){
        determineFullForecast(data, `1`);
      }else if(timeToForecast === "Evening"){
        determineFullForecast(data, `3`)
      }else if(timeToForecast === "Night"){
        determineFullForecast(data, `6`);
      };
    });
  }; ////answerButtons.removeChild(answerButtons.firstChild); forecastTimes.removeChild(forecastTimes.firstChild);
};
//let buttons = document.querySelectorAll(".next");
// for(let i = 0; i < buttons.length; i++) {
//   buttons[i].addEventListener("click", yourFunction);
// }

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
  document.getElementById("city-temp").innerText = "Temp: " + weather.main.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + weather.wind.speed + "MPH";
  document.getElementById("city-humid").innerText = "Humidity: " + weather.main.humidity + "%";
};

searchSection.addEventListener("submit", formSubmitHandler);

/*This implimentation of time-selecting buttons for the 5-day forecast would likely need a global variable, to which our data-containing
object that determineFullForecast usually uses could be saved. */
// for(let i = 0; i < forecastTimes.length; i++){
//   forecastTimes[i].addEventListener("click", (event)=>{
//     let timeToForecast = event.target.innerText;
//     console.log(timeToForecast); //forecastTimes is being repeated exponentially whenever a time-selecting button is pressed
//     if(timeToForecast === "Morning"){
//       timeForForecast = `5`;
//       determineFullForecast();
//     }else if(timeToForecast === "Afternoon"){
//       timeForForecast = `1`;
//       determineFullForecast();
//     }else if(timeToForecast === "Evening"){
//       timeForForecast = `3`;
//       determineFullForecast()
//     }else if(timeToForecast === "Night"){
//       timeForForecast = `6`;
//       determineFullForecast();
//     };
//   });
// };
/*TODO:

  Impliment results for our 5-day forecast
    -potentially add ability to change which forecast for a given block of time is being displayed(morning, afternoon, evening, night)
    -we would need to add some buttons for this, probably somewhere near the 5-day forecast
  
  Ability to search other cities without a page refresh
    -ability to delete saved cities upon button press, will need to add aditional button element for this

  Re-implimentation of the small weather-graphics that were previously used(cloudy symbol, sunny symbol, clear symbol)
    -ensure they're being used in the main, current-day, forecast readout

  More user feedback
    -maybe a prompt/alert if city names are spelled incorrectly
    -possibly display a button which would allow the user to see the 5-day forecast, rather than an empty/hidden chart

  Likely some CSS touch-ups and changes
    -Will have to look at and refamiliarize myself with bootstrap, probably want to continue styling this app with it
    -considering combining the date and icon rows in 5-day forecast 
 */