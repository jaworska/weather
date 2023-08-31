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
    this.sunrise = document.querySelector(".sun-rise"),
    this.sunset = document.querySelector(".sun-set"),
    this.humidity = document.querySelector(".humidity"),
    this.feelsLike = document.querySelector(".feels-like"),
    this.tempUnits = document.querySelectorAll(".temp-unit"),
    this.weatherCards = document.querySelector("#weather-cards");
    this.search = document.querySelector("#search");
    this.searchBtn = document.querySelector("#search button");
    this.tempUnitDefault = "c";
    this.timeSpan = "week";
    this.city = "";

    this.date.innerText = this._getDate();

    setInterval(() => {
      this.date.innerText = this._getDate();
    }, 1000);
    
    this.getLocation();
    this.changeUnit();
    this.changeTimeSpan();

    this.searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.searchCity();
    });
  }

  getLocation() {
    fetch("https://geolocation-db.com/json/", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((data) => {
          this.city = `${data.latitude},${data.longitude}`;
          this.getWeatherData(this.city, this.tempUnitDefault, this.timeSpan);
      })
      .catch((err) => {
          console.error(err);
      });
  };

  searchCity() {
    let citySearch = this.search.querySelector("input").value;
    const letters     = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];
    const replacement = ['a', 'c', 'e', 'l', 'n', 'o', 's', 'z', 'z'];

    for (let i = 0; i < letters.length; ++i) {
      citySearch = citySearch.replaceAll(letters[i], replacement[i]);
    }

    if(citySearch) {
      this.getWeatherData(citySearch, this.tempUnitDefault, this.timeSpan);
    }
  };

  getWeatherData(city, unit, timeSpan) {
    if(this.timeSpan == 'week') {
      this.days = 7;
    } else {
      this.days = 1;
    }
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=35afcbf15da24c579f064913231808&q=${city}&days=${this.days}&aqi=no&alerts=no`, {
        method: "GET",
        headers: {},
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.weatherData = data.current;
        this.weatherDataForecast = data.forecast;
        this.weatherDataLocation = data.location;
        this.weatherDataCondition = this.weatherData.condition;

        if (unit === "c") {
          this.temp.innerText = this.weatherData.temp_c;
          this.feelsLike.innerText = this.weatherData.feelslike_c;
        } else {
          this.temp.innerText = this.weatherData.temp_f;
          this.feelsLike.innerText = this.weatherData.feelslike_f;
        }

        this.pressure.innerText = this.weatherData.pressure_mb;
        this.location.innerText = `${this.weatherDataLocation.name}, ${this.weatherDataLocation.country}`;
        this.condition.innerText = this.weatherDataCondition.text;
        this.uvIndex.innerText = this.weatherData.uv;
        this.mainIcon.src = this.weatherDataCondition.icon;
        this.humidity.innerText = `${this.weatherData.humidity} %`;
        this.sunriseTime = this.weatherDataForecast.forecastday[0].astro.sunrise.split(" ")
        this.sunrise.innerText = this.sunriseTime[0];
        this.sunriseFormat = this.sunrise.nextElementSibling;
        this.sunriseFormat.innerText = this.sunriseTime[1];
        this.sunsetTime = this.weatherDataForecast.forecastday[0].astro.sunset.split(" ")
        this.sunset.innerText = this.sunsetTime[0];
        this.sunsetFormat = this.sunset.nextElementSibling;
        this.sunsetFormat.innerText =  this.sunsetTime[1];

        if (timeSpan === "hours") {
          this.updateForecast(this.weatherDataForecast.forecastday[0].hour, unit, "day");
        } else {
          this.updateForecast(this.weatherDataForecast.forecastday, unit, "week");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateForecast(data, unit, type) {
    this.weatherCards.innerHTML = "";
    this.cardsNum = 0;

    if (type === "day") {
      this.cardsNum = 24;
    } else {
      this.cardsNum = 7;
    }

    for (let i = 0; i < this.cardsNum; i++) {
      this.card = document.createElement("div");
      this.card.classList.add("card");

      if (type === "week") {
        this.dayName = this._getDate(data[i].date);
        this.iconCondition = data[i].day.condition.text;
        this.iconSrc = data[i].day.condition.icon;
        if (unit === "f") {
          this.dayTemp = data[i].day.maxtemp_f;
          this.tempUnit = "°F";
        } else {
          this.dayTemp = data[i].day.maxtemp_c;
          this.tempUnit = "°C";
        }
      } else {
        this.dayName = data[i].time.split(" ")[1];
        this.iconCondition = data[i].condition.text;
        this.iconSrc = data[i].condition.icon;
        if (unit === "f") {
          this.dayTemp = data[i].temp_f;
          this.tempUnit = "°F";
        } else {
          this.dayTemp = data[i].temp_c;
          this.tempUnit = "°C";
        }
      }

      this.card.innerHTML = `
        <h2 class="day-name">${this.dayName}</h2>
        <div class="card-icon">
          <img src="${this.iconSrc}" class="day-icon" alt="" />
        </div>
        <div class="day-temp">
          <h2 class="temp">${this.dayTemp}</h2>
          <span class="temp-unit">${this.tempUnit}</span>
        </div>
      `;
      this.weatherCards.append(this.card);
    }
  };

  changeUnit() {
    this.celciusBtn = document.querySelector(".celcius");
    this.fahrenheitBtn = document.querySelector(".fahrenheit");
    this.fahrenheitBtn.addEventListener("click", () => {
      this.updateUnit("f");
    });
    this.celciusBtn.addEventListener("click", () => {
      this.updateUnit("c");
    });
  }

  updateUnit(unit) {
    if (this.tempUnitDefault !== unit) {
      this.tempUnitDefault = unit;
      this.tempUnits.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;
      });

      if (unit === "c") {
        this.celciusBtn.classList.add("active");
        this.fahrenheitBtn.classList.remove("active");
      } else {
        this.celciusBtn.classList.remove("active");
        this.fahrenheitBtn.classList.add("active");
      }

      this.getWeatherData(this.city, this.tempUnitDefault, this.timeSpan);
    }
  };

  changeTimeSpan() {
    this.hoursBtn = document.querySelector(".hours");
    this.weekBtn = document.querySelector(".week");
    this.hoursBtn.addEventListener("click", () => {
      this.updateTimeSpan("hours");
    });
    this.weekBtn.addEventListener("click", () => {
      this.updateTimeSpan("week");
    });
  }

  updateTimeSpan(unit) {
    if (this.timeSpan !== unit) {
      this.timeSpan = unit;

      if (unit === "hours") {
        this.hoursBtn.classList.add("active");
        this.weekBtn.classList.remove("active");
      } else {
        this.hoursBtn.classList.remove("active");
        this.weekBtn.classList.add("active");
      }

      this.getWeatherData(this.city, this.tempUnitDefault, this.timeSpan);
    }
  };

  _getDate(date) {
    this.now = new Date();
    this.hour = this.now.getHours();
    this.minute = (this.now.getMinutes() < 10 ? "0" : "") + this.now.getMinutes();
    this.days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    this.day = this.days[this.now.getDay()];
    this.timeFormat = this.hour >= 12 ? 'pm' : 'am';
    this.hour = this.hour % 12;
    this.hour = this.hour ? this.hour : 12;

    if(date) {
      this.day = new Date(date);
      return this.days[this.day.getDay()];
    } else {
      return `${this.day}, ${this.hour}:${this.minute} ${this.timeFormat}`;
    }
  };
}

const weather = new Weather("#weather-app");