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

    this.date.innerText = this.getDate();

    setInterval(() => {
      this.date.innerText = this.getDate();
    }, 1000);
    
    this.getLocation();
    this.changeUnit();
    this.changeTimeSpan();
  }

  getDate(date) {
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

    if(date) {
      this.day = new Date(date);
      return this.days[this.day.getDay()];
    } else {
      return `${this.day}, ${this.hour}:${this.minute}`;
    }
  };

  getLocation() {
    fetch("https://geolocation-db.com/json/", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((data) => {
          this.city = data.city;
          this.getWeatherData(data.city, this.tempUnitDefault, this.timeSpan);
      })
      .catch((err) => {
          console.error(err);
      });
  };

  getWeatherData(city, unit, timeSpan) {
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
      {
        method: "GET",
        headers: {},
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.weatherData = data.currentConditions;

        if (unit === "c") {
          this.temp.innerText = this.weatherData.temp;
        } else {
          this.temp.innerText = this.celciusToFahrenheit(this.weatherData.temp);
        }

        this.pressure.innerText = this.weatherData.pressure;
        this.address = data.resolvedAddress.split(", ");
        this.location.innerText = `${this.address[0]}, ${this.address[2]}`;
        this.condition.innerText = this.weatherData.conditions;
        this.uvIndex.innerText = this.weatherData.uvindex;
        this.mainIcon.src = this.getIcon(this.weatherData.icon);
        this.humidity.innerText = `${this.weatherData.humidity} %`;
        this.airQuality.innerText = this.weatherData.winddir;

        if (timeSpan === "hours") {
          this.updateForecast(data.days[0].hours, unit, "day");
        } else {
          this.updateForecast(data.days, unit, "week");
        }

        this.sunRise.innerText = this.getHour(this.weatherData.sunrise);
        this.sunSet.innerText = this.getHour(this.weatherData.sunset);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getIcon(condition) {
    if (condition === "partly-cloudy-day" || condition === "cloudy") {
      return "img/cloudy.png";
    } else if (condition === "partly-cloudy-night") {
      return "img/cloud.png";
    } else if (condition === "rain") {
      return "img/rainy.png";
    } else if (condition === "clear-day") {
      return "img/sun.png";
    } else if (condition === "clear-night") {
      return "img/night.png";
    } else {
      return "img/sun.png";
    }
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
      this.dayName = this.getHour(data[i].datetime);
      this.dayTemp = data[i].tempmax ? data[i].tempmax : data[i].temp;

      if (type === "week") {
        this.dayName = this.getDate(data[i].datetime);
      }
      if (unit === "f") {
        this.dayTemp = this.celciusToFahrenheit(data[i].temp);
      }

      this.iconCondition = data[i].icon;
      this.iconSrc = this.getIcon(this.iconCondition);
      this.tempUnit = "°C";

      if (unit === "f") {
        this.tempUnit = "°F";
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

  getHour(time) {
    this.hour = time.split(":")[0];
    this.min = time.split(":")[1];
    return `${this.hour}:${this.min}`;
  };

  celciusToFahrenheit = (temp) => {
    return ((temp * 9) / 5 + 32).toFixed(1);
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
}

const weather = new Weather("#weather-app");