const form = document.querySelector("form");
const input = document.querySelector("input");
const apiKey="668e3d39d52a645e064391881ef3df01";
let cityArea;

function DateNow() {
    let currentDay = new Date();
    let day = String(currentDay.getDate()).padStart(2, '0');
    let month = String(currentDay.getMonth() + 1).padStart(2, '0');
    let year = currentDay.getFullYear();

    return "(" + month + "/" + day + "/" + year + ")";
}

function degree(value) {
    return ((value - 273.15) * 1.8) + 32;
}

var arr = [];

function setLocalStorage(data) {
    if(data) {
        //if the value of the search exists  (data that's been turned to lower case) the run the func
        let myData = data.toLowerCase();
        arr.push(myData);
        //console.log(arr);
        
    }
}

var counter = 0;
function getLocalStorage() {
    const value = JSON.parse(localStorage.getItem('weatherData'));
    if(value) {
        $('#listed-data').show();
        $('#noHistory').hide();
        value.map((item)=> {
            $('#listed-ul').append(`<li class="list-group-item listed-item" >${item}</li>`);
            counter++;
        });
        
    }
    else {
        $('#listed-data').hide();
        $('#noHistory').show();
    }
}



window.onload = function() {
    getLocalStorage();
   $('#forcast-text').hide();
   $('#card-top').hide();
}

function otherDate(date) {
    let newDate = date.slice(0, 10);
    let day = newDate.slice(8, 10);
    let month = newDate.slice(5, 7);
    let year = newDate.slice(0, 4);

    return `${month}/${day}/${year}`;
}

async function forcasting(cityArea) {
    const values = [4, 12, 20, 28, 36];
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityArea}&appid=${apiKey}`;
    await fetch(url)
    .then(res=>res.json())
    .then(data=> {
        const setData = data.list.filter((item, i)=>values.includes(i));
        setData.map((item)=>{
            $("#forecastDays").append(`  
              <div class="col ">
                <div class="card bg-primary">
                  <div class="card-body text-white">
                     <h2 style="font-size: 1.8rem;">${otherDate(item.dt_txt)}</h2>
                     <img height="70" width="70" src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="icon">
                     <p>Temp: ${degree(item.main.temp).toFixed(3).replace(/\.(\d\d)\d?$/, '.$1')}°F</p>
                     <p>Humidity: ${item.main.humidity}%</p>
                  </div>
                </div>
               </div> `
            );
        });    
         
    });
}


form.addEventListener("submit", e => {
    cityArea = input.value;
    submitFunc(); 
    e.preventDefault();
});

function submitFunc() {
    $('#cityName').empty();
    $('#forecastDays').empty();
    $('#forcast-text').show();
    $('#card-top').show();
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${cityArea}&appid=${apiKey}`;
    setLocalStorage(cityArea);//this is where function above is called
    fetch(url)
    .then(response => {
        localStorage.setItem('weatherData', JSON.stringify(arr));
        if (response.ok) {
            return response.json();
        }
        else {
            $('#forcast-text').hide();
            $('#card-top').hide();
            alert("Invalid City/State. Please use the correct city/state!")
        }
    })
    .then(data => {
        $("#cityName").append(
            `<h1 id="cityName">${data.name} ${DateNow()} <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon"> </h1>
            <p>Temperature: ${degree(data.main.temp).toFixed(3).replace(/\.(\d\d)\d?$/, '.$1')} °F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} MPH</p>`
        );
        uvIndex(data.coord.lat, data.coord.lon);
        forcasting(cityArea);
    }).catch((error) => {
        console.log(error);
    });
}


async function uvIndex(lat, lon) {
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        await fetch(uvUrl)
        .then(response=>response.json())
        .then(data=>{
            $("#cityName").append(`<div class="d-flex"><div>UV Index: </div><div class="ml-1 uv">${data.value}</div></div> `);
        });
}


$(document).ready(function(){
    $(".listed-item").click(function(event){
        var historyClick = event.target;
        if(event.target.matches('li')) {
            cityArea = historyClick.textContent.trim();
            submitFunc();
            
        }
        
    });
    
    
  });
