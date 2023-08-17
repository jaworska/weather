class Weather {
  constructor(query) {
    this.weather = document.querySelector(query); 
    this.temp = document.querySelector("#temp");
    this.date = document.querySelector("#date-time"),
    this.condition = document.querySelector("#condition"),
    this.mainIcon = document.querySelector("#icon"),
    this.location = document.querySelector("#location"),
    this.uvIndex = document.querySelector(".uv-index"),
    this.pressure = document.querySelector(".pressure"),
    this.sunRise = document.querySelector(".sun-rise"),
    this.sunSet = document.querySelector(".sun-set"),
    this.humidity = document.querySelector(".humidity"),
    this.airQuality = document.querySelector(".air-quality"),
    this.tempUnits = document.querySelectorAll(".temp-unit"),
    this.weatherCards = document.querySelector("#weather-cards");
    this.tempUnitDefault = "c";
    this.timeSpan = "week";
    this.city = "";
  }


}

const weather = new Weather("#weather-app");