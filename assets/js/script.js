$(document).ready(function () {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=99dc7628aa4e751e74c77818315ae595";
  defaultCity(apiUrl);
});

$(".search-btn").on("click", function (event) {
  event.preventDefault();
  var userInput = $(".search-input").val();
  if (userInput === "") {
    var apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=99dc7628aa4e751e74c77818315ae595";
  } else {
    var apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      userInput +
      "&appid=99dc7628aa4e751e74c77818315ae595";
  }

  defaultCity(apiUrl);
});

var defaultCity = function (apiUrl) {
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayCurrentCity(data);
        displayForecast(data.name);
      });
    } else {
      alert("Error");
    }
  });
};

var displayCurrentCity = function (data) {
  var tempF = (((data.main.temp - 273.15) * 9) / 5 + 32).toFixed(2);
  var iconInfo = data.weather[0].icon;
  $(".current-day").text(data.name + " (" + moment().format("MM/D/YYYY") + ")");
  $(".current-icon").attr(
    "src",
    "https://openweathermap.org/img/wn/" + iconInfo + ".png"
  );
  $(".currentTemp").text(tempF + " °F");
  $(".currentHumidity").text(data.main.humidity);
  $(".currentWindSpeed").text(data.wind.speed);

  getUVIndex(data.coord.lat, data.coord.lon);
};

var getUVIndex = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=99dc7628aa4e751e74c77818315ae595";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        $(".currentUV").text(data.value);
        if (data.value < 2 || data.value === 2) {
          $(".currentUV").addClass("badge-sucess");
        } else if (data.value > 2 && data.value < 5) {
          $(".currentUV").addClass("badge-warning");
        } else if (data.value === 5) {
          $(".currentUV").addClass("badge-warning");
        } else if (data.value > 5 && data.value < 7) {
          $(".currentUV").addClass("badge-high");
        } else if (data.value === 7) {
          $(".currentUV").addClass("badge-high");
        } else if (data.value > 7 && data.value < 10) {
          $(".currentUV").addClass("badge-danger");
        } else if (data.value === 10) {
          $(".currentUV").addClass("badge-danger");
        } else if (data.value > 11) {
          $(".currentUV").addClass("badge-extreme");
        } else if (data.value === 11) {
          $(".currentUV").addClass("badge-extreme");
        }
      });
    }
  });
};

var displayForecast = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=99dc7628aa4e751e74c77818315ae595";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        for (let i = 1; i < 6; i++) {
          var forecastDay = moment(data.list[i].dt_tx).format("MM/D/YYYY");

          var iconInfo = data.list[i].weather[0].icon;
          var tempF = (
            ((data.list[i].main.temp - 273.15) * 9) / 5 +
            32
          ).toFixed(2);

          $(".forecastDay" + i).text(forecastDay);
          $(".current-icon" + i).attr(
            "src",
            "https://openweathermap.org/img/wn/" + iconInfo + ".png"
          );
          $(".forecastTemp" + i).text(tempF + " °F");
          $(".forecastWind" + i).text(" " + data.list[i].wind.speed);
          $(".forecastHumidity" + i).text(" " + data.list[i].main.humidity);
        }
      });
    }
  });
};
