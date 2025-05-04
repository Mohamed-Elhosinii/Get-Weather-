const findInput = document.getElementById("find");

findInput.addEventListener("input", function () {
  getWeather(findInput.value);
});

// Left Side
const date = document.querySelector(".left-side .date");
const city = document.querySelector(".left-side .city");
const mainDegree = document.querySelector(".left-side .main-degree");
const icon = document.querySelector(".left-side .icon");
const condition = document.querySelector(".left-side .condition");

// global Variables
let currentLocationName = "";

// Call API
async function getWeather(location) {
  let response = await fetch(
    ` https://api.weatherapi.com/v1/forecast.json?key=db37b3be0b6a48e6b17130405252904&q=${location}&days=3`
  );
  let allData = await response.json();
  city.innerHTML = allData.location.name;
  const DATE = new Date(allData.location.localtime);
  const options = { weekday: "long", day: "2-digit", month: "long" };
  const formatted = DATE.toLocaleDateString("en-US", options);

  let forecastdays = allData.forecast.forecastday;
  // left side
  date.innerHTML = formatted;
  mainDegree.innerHTML = forecastdays[0].day.avgtemp_c;
  icon.setAttribute(`src`, `https:${forecastdays[0].day.condition.icon}`);
  condition.innerHTML = forecastdays[0].day.condition.text;

  let container = ``;
  let color = null;
  for (let i = 1; i < forecastdays.length; i++) {
    if (i % 2 != 1) {
      color = "background-gray";
    } else {
      color = "background-dark";
    }
    const date = new Date(forecastdays[i].date);
    const options = { weekday: "long" };
    const formatted = date.toLocaleDateString("en-US", options);
    container += `
                                <div class="col-md-6 ${color}">
                                    <div class="date">${formatted}</div>
                                    <div class="content pt-5">
                                        <div class="icon"><img
                                                src='https:${forecastdays[i].day.condition.icon}'
                                                alt width="40px"></div>
                                        <div class="text-white my-3 mx-3 fs-1">
                                            <span
                                                class="high-degree fs-1">${forecastdays[i].day.maxtemp_c}</span>
                                            <sup>o</sup>C</div>
                                        <div class="text-white my-3 mx-3 fs-3">
                                            <span
                                                class="low-degree fs-3">${forecastdays[i].day.mintemp_c}</span>
                                            <sup>o</sup>C</div>
                                        <div
                                            class="my-3 mx-3 condition fs-4">${forecastdays[i].day.condition.text}</div>
                                    </div>
                                </div>
    `;
  }
  document.getElementById("row").innerHTML = container;
}
getWeather("cairo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=1630eaf49306442f97b751a522cc75d8`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        currentLocationName = data.results[0].formatted;
        getWeather(currentLocationName);
      }
    });
  }
}
getLocation();
