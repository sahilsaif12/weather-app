let container = document.getElementsByClassName('container')[0]
let search = document.getElementsByClassName('search')[0]
let btn = document.getElementsByClassName('btn')[0]
let weatherUpdate = document.getElementsByClassName('weatherUpdate')[0]
let currentLocationUpdate = document.getElementsByClassName('currentLocation')[0]
let dateTime = document.getElementsByClassName('dateTime')[0]
let loader = '<div class="cssload-clock"></div>'
let closeBtn=document.createElement('button')
// let SearchWithDate=document.getElementsByClassName('Search-with-date')[0]

setInterval(() => {
    let date = new Date()
    let hours = date.getHours() > 12 ? date.getHours() % 12 : date.getHours()
    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    let ampm = date.getHours() > 12 ? "PM" : "AM"
    let fullDate = date.toLocaleDateString(undefined, { day: 'numeric', month: "short" })
    let day = date.toLocaleDateString(undefined, { weekday: "long" })
    dateTime.innerHTML = `${day}<br>${hours}:${minute} ${ampm}<br>${fullDate}`
});
search.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) {
        btn.click()
    }
})

btn.addEventListener('click', () => {

    
    searchCity()
    search.value = ""
    search.blur() // remove the focus from the search area

})

currentLocation()
function currentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position.coords.latitude,position.coords.longitude)
        let lonlat = {
            coord: {
                lat: position.coords.latitude,
                lon: `${position.coords.longitude}`
            }
        }
        searchWithLatLon(lonlat, 1)
    })
}

let API_KEY = "f88e244e011c53879e0065b60952bfb7"
function searchCity() {
    container.innerHTML = loader
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            searchWithLatLon(data, 2)
        })
        .catch((err) => {
            console.log(err)
            handleError()
        })

}

function searchWithLatLon(data, n) {
    let { lat, lon } = data.coord
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data2) => {
            console.log(data2)
            if (n == 1) {
                updateCurrentLocationWeather(data2)
                // currentLocationName(lat,lon)
            }
            else {
                updateCityLocationWeather(data, data2)
            }
        })
        .catch((err) => console.log(err))


}
function handleError() {
    container.classList.remove('container-expand')
    container.classList.add('container-error')
    container.innerHTML = "please enter a Correct city"
    setTimeout(() => {
        container.innerHTML = ""
        container.classList.remove('container-error')
    }, 3000);
}

async function updateCityLocationWeather(data, data2) {
    currentLocationUpdate.style.position = "absolute"
    if (window.outerWidth <= 1250 && window.outerWidth > 620) {
        document.querySelector('.search-city').style.position="absolute"
        document.querySelector('.search-city').style.top="4%"
    }
    container.innerHTML = ""
    container.classList.add('container-expand')
    let container_child_class = ["currentDay", "weather_boxes_container"]
    for (let i = 0; i < 2; i++) {
        let x = document.createElement('div')
        x.setAttribute('class', container_child_class[i])
        container.appendChild(x)
    }

    let { dt, feels_like, humidity, pressure, sunrise, sunset, temp, visibility, weather, wind_speed } = data2.current
    let currentDay = document.getElementsByClassName('currentDay')[0]
    var weather_boxes_container = document.getElementsByClassName('weather_boxes_container')[0]

    setTimeout(() => {
        currentDay.innerHTML = `
        <div class="placename">${data.name}</div>
            <div class="temp">${Math.round(temp)} &#176; C</div>
            <div class="weatherState">${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}</div>
            <img class="img" width="80px" height="80px" src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="">
            <div class="date">${window.moment(dt * 1000).format("ll")}</div>
            <div class="wind-speed">Wind speed: ${Math.round(wind_speed)} km/h </div>
            <div class="sunrise">sunrise: ${window.moment(sunrise * 1000).format('LT')}</div>
            <div class="sunset">sunset: ${window.moment(sunset * 1000).format('LT')}</div>
            <div class="humidity">Humidity: ${humidity}%</div>
            <div class="feelsLike">Feels Like: ${Math.round(feels_like)} &#176; C</div>
            <div class="visibility">Visibility: ${visibility / 1000} km</div>`


        let dailyData = data2.daily
        for (let i = 0; i < dailyData.length; i++) {
            var boxes = document.createElement('div')
            boxes.setAttribute('class', 'weather_boxes')
            weather_boxes_container.appendChild(boxes)
            boxes.innerHTML = `<p>${window.moment(dailyData[i].dt * 1000).format('dddd')}</p>
        <div class="weather_boxes_update">
            <div>
                <h3>${Math.round(dailyData[i].temp.max)}&#176; C</h3>
                <span>${Math.round(dailyData[i].temp.min)}&#176; C</span>
            </div>
            <img width="60px" height="60px"  src="http://openweathermap.org/img/wn/${dailyData[i].weather[0].icon}@2x.png" alt="">
        </div>
        <p class="desc">${dailyData[i].weather[0].description}</p>`
        }
        container.appendChild(closeBtn)
        closeBtn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="64" height="64" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="12" cy="12" r="9" />
        <path d="M10 10l4 4m0 -4l-4 4" />
      </svg>`
    }, 300);
}


function updateCurrentLocationWeather(data2) {
    let { dt, feels_like, humidity, pressure, sunrise, sunset, temp, visibility, weather, wind_speed } = data2.current

    weatherUpdate.innerHTML = `
            <div class="icon-and-heading">
                <div class="weatherUpdateHeading">
                    <div class="temp">${Math.round(temp)} &#176; C</div>
                    <div class="weatherState">${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}</div>
                </div>
                <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="">
                
            </div>
            <div class="otherWeatherUpdate">
                <div class="feelsLike">Feels Like: ${Math.round(feels_like)}&#176;C</div>
                <div class="sunrise">sunrise: ${window.moment(sunrise * 1000).format('LT')}</div>
                <div class="sunset">sunset: ${window.moment(sunset * 1000).format('LT')}</div>
                <div class="wind-speed">Wind speed: ${Math.round(wind_speed)} km/h</div>
                <div class="humidity">Humidity: ${humidity} %</div>
                <div class="visibility">Visibility: ${visibility / 1000} km</div>
            </div>
`
}

closeBtn.addEventListener('click',()=>{
    container.innerHTML=""
    container.classList.remove('container-expand')
})
// function currentLocationName(lat,lon){
//     fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyATBfydJvwxF60mLjwXUpxaMpx6VIKZ4U8`)
//     .then((res)=>res.json())
//     .then((data)=>{
//         console.log(data)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// }
