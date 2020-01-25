var cities = [];
var isSwitched = false;
var temp = 0;

$("#searchBtn").on("click", function () {
    var cityInput = $("#city-input").val();
    cities.push(cityInput);
    searchCity(cityInput);
    renderCities();

});

$("body").on("click",".switcher", function(){
    console.log(  isSwitched, temp)
      if(!isSwitched){
          tempF = ((temp - 273.15) * 1.80 + 32).toFixed(2);
          $("#temperature").html("Temperature: " + tempF + " °F" + "<button id ='switcher'class=' switcher btn btn-color'> switch to °C</button>");
          isSwitched = true;
      } else {
          tempF=(( temp - 273.15)).toFixed(0); 
          $("#temperature").html("Temperature: " + tempF + " °C" + "<button id ='switcher'class='switcher btn btn-color'> switch to °F</button>");
          isSwitched=false;
      }
 });

function searchCity(cityInput) {

    // GET CITY INFO  

    var myApi = "a3b7974d1c92aeb51799206f2819a5fa";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&APPID=" + myApi;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(queryURL)
        $("#city").html("<span class='cityFont'>" + response.name + "</span>");
   
        $("#date").html("<span class='cityFont'>" +(moment().format('L')) + "</span>");

        var icon = $("<img>");
        var iconImg = response.weather[0].icon;
        icon.attr("src", "https://openweathermap.org/img/wn/" + iconImg + "@2x.png");
        icon.attr("width",120);
        $("#icon").html(icon);

        var tempF = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2);
        $("#temperature").html("Temperature: " + tempF + " °F" + "<button id ='switcher'class='switcher btn btn-color'> switch to °C</button>");
        temp = response.main.temp;
      
        console.log(tempF);
        typeof(tempF);
        if (tempF>= 50){
            $("body").css("backgroundImage", "url(./assets/shallow-focus-of-yellow-flowers-946290.jpg)");
            $("body").css("backgroundSize","cover");
        } else if(tempF<=30){
            $("body").css("backgroundImage", "url(./assets/photography-of-mountain-range-during-winter-772476.jpg)");
            $("body").css("backgroundSize","cover");
        } else{
        $("body").css("backgroundImage", "url(./assets/forest-pathways-photo-1996051.jpg)");
        $("body").css("backgroundSize","cover");
        }
    
        var humidity = response.main.humidity;
        $("#humidity").text("Humidity: " + humidity);
        $("#wind-speed").text("Wind Speed: " + response.wind.speed);

        var coordLon = response.coord.lon;
        var coordLat = response.coord.lat;

        // GET UV INDEXX API 
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coordLat + "&lon=" + coordLon + "&APPID=a3b7974d1c92aeb51799206f2819a5fa";

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {

            var colorUV = $("<span>").text(response.value);

             if (response.value<=2.99) {
                 colorUV.addClass("green");
             } else if (response.value >= 3 && response.value <=5.99){
                colorUV.addClass("yellow");
             } else if (response.value >= 6 && response.value <=7.99){
                colorUV.addClass("orange");
             } else if (response.value >= 8 && response.value <=9.99){
                colorUV.addClass("red");
             } else {
                colorUV.addClass("violet");
             }
            $("#uv-index").text("UV Index: ");
            $("#uv-index").append(colorUV);

        });

    });

    // GET 5 DAY FORECAST 
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + myApi;

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
      console.log(queryURL2)
        $("#cardsHolder").empty();

        for (j = 5; j < 40; j += 8) {
            var cardBlock = $("<div>").addClass("card card-color");
            var dataForecast = $("<h7>").text(moment.unix(response.list[j].dt).format('MM/DD/YYYY'));
            var iconForecast = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[j].weather[0].icon + "@2x.png");
            iconForecast.attr("width",100);               
            var tempFixed = ((response.list[j].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            var tempForecast = $("<h7>").text("Temp: " + tempFixed + " °F");
            var humidityForecast = $("<h7>").text("Humidity: " + response.list[j].main.humidity);
          
             // APEND ELEMENTS TO HTML
            cardBlock.append(dataForecast, iconForecast, tempForecast, humidityForecast)
            $("#cardsHolder").append(cardBlock);
        }
    });

}
// CREATE A LIST OF SEARCHED CITIES 
function renderCities() {
    $("#savedCities").empty();

    for (i = 0; i < cities.length; i++) {
        var list = $("<li>");
        list.addClass("list-group-item city");
        list.attr("data-city", cities[i]);
        list.text(cities[i]);
        $("#savedCities").append(list);

        // SAVE TO LOCAL STORAGE
        localStorage.setItem("city-name", JSON.stringify(cities));

    }
}
//GET INFO FROM SEARCH LIST 
$(document).on("click", ".city", function(){
    var cityInput = $(this).attr("data-city");
    searchCity(cityInput);
});
// SEE SAVED LIST 
$(document).ready(function(){
cities  =  JSON.parse(localStorage.getItem("city-name")) ;
if ( cities === null){
    cities = [];
 }  
 renderCities();


});
