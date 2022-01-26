let currentWeatherEL = document.querySelector("#current-weather")

var apiKey = "2051c7ec479552cf808e5b1a91256542"
let cities = JSON.parse(localStorage.getItem("search")) || [];
async function getWeather(city) {
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2051c7ec479552cf808e5b1a91256542&units=imperial`)

  let res = await response.json()
  currentWeatherEL.innerHTML= ""
 
  let cardBodyEl = document.createElement("div")
  let titleEL = document.createElement("h3")
  let iconEl = document.createElement("img")
  let tempEl = document.createElement("p")
  let windEL = document.createElement("p")
  let humidityEl = document.createElement("p")
  let dateEl = document.createElement("h5")
  let uvEl = document.createElement("p")
  let weatherIcon = res.weather[0].icon
    iconEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");


 cardBodyEl.setAttribute("class", "card")

 dateEl.textContent = new Date(res.dt*1000).toLocaleDateString();
  titleEL.textContent = res.name
  tempEl.textContent = `Temp: ${res.main.temp}°`
  windEL.textContent = `Speed: ${res.wind.speed}`
  humidityEl.textContent = `Humi: ${res.main.humidity}%`

let lat = res.coord.lat
let lon = res.coord.lon
let uvresponse = await fetch ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=2051c7ec479552cf808e5b1a91256542")
let uvres = await uvresponse.json()
if (uvres.current.uvi < 4 ) {
 uvEl.style.backgroundColor = "green"
}
else if (uvres.current.uvi <= 8){
  uvEl.style.backgroundColor = "yellow"
}
else {
  uvEl.style.backgroundColor = "red"
}
uvEl.textContent = `UVI: ${uvres.current.uvi}`
  cardBodyEl.append(titleEL, dateEl, iconEl, tempEl, windEL, humidityEl, uvEl)
  currentWeatherEL.append(cardBodyEl)
}

let searchHistoryEl = document.getElementById("searchhistory")

function handleSearch() {
  let cityEl = document.querySelector(".search-bar")
  let cityName = cityEl.value
  cities.push(cityName)
  localStorage.setItem("search", JSON.stringify(cities));
  renderSearchHistory();
  getWeather(cityName)
 weekforecast(cityName)
}
function renderSearchHistory() {
  searchHistoryEl.innerHTML= ""
  for (let i = 0; i < cities.length; i++) {
 
    let savedCityEl = document.createElement("input");
    savedCityEl.setAttribute("type", "text");
    savedCityEl.setAttribute("readonly", true);
    savedCityEl.setAttribute("class", "form-control d-block bg-blue");
    savedCityEl.setAttribute("value", cities[i]);

  
    savedCityEl.addEventListener("click", function () {
      getWeather(savedCityEl.value);
      weekforecast(savedCityEl.value)
  
    })
    searchHistoryEl.append(savedCityEl);
  
  }
}

renderSearchHistory();
if (cities.length > 0) {
  getWeather(cities[cities.length - 1]);
}
let clearEl = document.getElementById("clear-button")
clearEl.addEventListener("click", function () {
  localStorage.clear();
  cities = [];
  renderSearchHistory();
})
let forecastEl = document.getElementById("forecast")
async function weekforecast(city){
 
  let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2051c7ec479552cf808e5b1a91256542&units=imperial`)
  forecastEl.innerHTML = ""
  let res = await response.json()
  for (let i = 0; i < 40; i += 8){
   let data = res.list[i]
   
  let cardBodyEl = document.createElement("div")
  let dateEl = document.createElement("h4")
  let iconEl = document.createElement("img")
  let tempEl = document.createElement("p")
  let windEL = document.createElement("p")
  let humidityEl = document.createElement("p")
  let weatherIcon = data.weather[0].icon;
  iconEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
  
 cardBodyEl.setAttribute("class", "card")


  dateEl.textContent = new Date(data.dt_txt).toLocaleDateString()
  tempEl.textContent = `Temp: ${data.main.temp}°`
  windEL.textContent = `Speed: ${data.wind.speed}`
  humidityEl.textContent = `Humi: ${data.main.humidity}%`
  
  cardBodyEl.append(dateEl, iconEl, tempEl, windEL, humidityEl)
 forecastEl.append(cardBodyEl)
  }
 
}

document.getElementById("search-button").addEventListener("click", handleSearch)
