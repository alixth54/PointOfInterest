
let databaseJson;
let startDay, startMonth, startYear;
let endDate, endDay, endMonth, endYear;
let majDate, majDay, majMonth, majYear;

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://carto.g-ny.org/data/cifs/cifs_waze_v2.json')
    .then((response) => {
        return response.json();
    }) 
    .then((json) => {
        databaseJson = json;
        for (let i = 0; i<databaseJson.incidents.length;i++) {
            createMarker(i,databaseJson.incidents[i]);

        }
        
        
    });

});
let latLongMin = L.latLng(48.677675, 6.158160),
    latLongMax = L.latLng(48.701081, 6.206054),
    bounds = new L.latLngBounds(latLongMin, latLongMax);
    // .setView([48.693463, 6.183167], 14)

let map = L.map('map');
map.setView([48.693463, 6.193167], 14);
// map.fitBounds(bounds);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


function createCard(index) {

    let cardArea = document.getElementById('cardArea');
    cardArea.innerHTML = '';
    let article = document.createElement('article'); 
    article.classList.add('cardArticle');  
    let title = document.createElement('h3');
    title.classList.add('cardTitle');
    let pStart = document.createElement('p');
    let startTime = new Date(databaseJson.incidents[index].starttime);
    let correctStartMonth = startTime.getMonth() +1; 
    pStart.innerText ='Début chantier : ' +startTime.getDate()+' / ' + correctStartMonth + ' / ' + startTime.getFullYear();
    let pEnd = document.createElement('p');
    let endTime = new Date(databaseJson.incidents[index].endtime);
    let correctEndMonth = endTime.getMonth() +1;
    pEnd.innerText ='Fin chantier : ' +endTime.getDate()+' / ' + correctEndMonth + ' / ' + endTime.getFullYear();
    let pUpdate = document.createElement('p');
    let upDate = new Date(databaseJson.incidents[index].updatetime);
    let correctUpdate = upDate.getMonth();
    pUpdate.innerText ='Dernière mise à jour : ' +upDate.getDate()+' / ' + correctUpdate + ' / ' + upDate.getFullYear(); 
    let buttonSignal = document.createElement('button');
    buttonSignal.classList.add('cardButton');
    buttonSignal.innerText = 'Signaler un problème';
    article.append(title,pStart,pEnd,pUpdate,buttonSignal);

    title.innerText = databaseJson.incidents[index].description;
    cardArea.append(article);

}


function createMarker (index,coordinates){
 
    let arrayCoordinates = coordinates.location.polyline.split(" ", 2);
    let lat = arrayCoordinates[0];
    let long =arrayCoordinates[1];
    boundMapMaxMin(lat,long);
   
 
    let arrayOrange =['gêne','réduction','alternée'];
    let arrayRed =['barrée','suppression','suppression'];
    let arrayBlue =['stationnement interdit','stationement difficile','stationement difficile'];
    let redIcon = L.icon({
        iconUrl: '../media/stop.png',
        shadowUrl: '#',
        iconSize:     [38, 38], // size of the icon

    });
    let orangeIcon = L.icon({
        iconUrl: '../media/traffic-jam.png',
        shadowUrl: '#',
        iconSize:     [38, 38], // size of the icon

    });
    let blueIcon = L.icon({
        iconUrl: '../media/no-parking.png',
        shadowUrl: '#',
        iconSize:     [38, 38], // size of the icon
    });
     
    let details = coordinates.description;
    const currentDate = new Date();
    startDate = new Date(coordinates.starttime); 
    startDay = startDate.getDate();
    startMonth = startDate.getMonth() + 1;
    startYear = startDate.getFullYear();
    endDate = new Date(coordinates.endtime);
    endDay = endDate.getDate();
    endMonth = endDate.getMonth() + 1;
    endYear = endDate.getFullYear();
    majDate = new Date(coordinates.updatetime);
    majDay = majDate.getDate();
    majMonth = majDate.getMonth() + 1;
    majYear = majDate.getFullYear();
    
    if(compareDates(startDate, currentDate, endDate)){    
            for(let j=0; j<arrayRed.length;j++){   
                    if(details.toUpperCase().indexOf(arrayRed[j].toUpperCase()) !=-1 ){
                        let markerRed = L.marker([lat, long],{icon:redIcon}).addTo(map);
                        markerRed.bindPopup("<strong>CIRCULATION INTERDITE</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><button onclick=createCard("+index+")> En savoir plus</button>");
                        j = arrayRed.length;

                    }else if(details.toUpperCase().indexOf(arrayOrange[j].toUpperCase()) !=-1 ){
                    let markerOrange = L.marker([lat, long],{icon:orangeIcon}).addTo(map);
                    markerOrange.bindPopup("<strong>CIRCULATION LENTE</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><button onclick=createCard("+index+")> En savoir plus</button>");
                        j=arrayRed.length;
                    }else if
                    (details.toUpperCase().indexOf(arrayBlue[j].toUpperCase()) !=-1 )
                    {
                        let markerBlue = L.marker([lat, long],{icon:blueIcon}).addTo(map);
                        markerBlue.bindPopup("<strong>PROBLEME STATIONNEMENT</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><button onclick=createCard("+index+")> En savoir plus</button>");
                        j=arrayRed.length;
                    }
            }
        } else {
        let marker = L.marker([lat, long]).addTo(map);
        
        let futureProjects = document.getElementById('futureProjects');
        let article = document.createElement('article'); 
        article.classList.add('futureTask');  
        let title = document.createElement('h3');
        title.classList.add('projectTitle');
        let pStart = document.createElement('p');
        let startTime = new Date(databaseJson.incidents[index].starttime);
        let correctStartMonth = startTime.getMonth() +1; 
        pStart.innerText ='Début chantier : ' +startTime.getDate()+' / ' + correctStartMonth + ' / ' + startTime.getFullYear();
        let pEnd = document.createElement('p');
        let endTime = new Date(databaseJson.incidents[index].endtime);
        let correctEndMonth = endTime.getMonth() +1;
        pEnd.innerText ='Fin chantier : ' +endTime.getDate()+' / ' + correctEndMonth  + ' / ' + endTime.getFullYear();
        let pUpdate = document.createElement('p');
        article.append(title,pStart,pEnd);
    
        title.innerText = databaseJson.incidents[index].description;
        futureProjects.append(article);
        console.log(article);
            
            
        }   
    }
   

function boundMapMaxMin(lat,long){
   if(latLongMin.lat > lat) {
    latLongMin.lat = lat;
   }
   if(latLongMax.lat < lat) {
    latLongMax.lat = lat;
   }
   if(latLongMin.lng > long) {
    latLongMin.lng = long;
   }
   if(latLongMax.lng < long) {
    latLongMax.lng = long;
   }
   bounds = new L.latLngBounds(latLongMin, latLongMax);
map.fitBounds(bounds);
   map.setMaxBounds(bounds);
}

function compareDates (startDate, currentDate, endDate){
    let date1 = startDate.getTime();
    let date2 = currentDate.getTime();
    let date3 = endDate.getTime();
  
    if (date1 <= date2 && date2 <= date3) {
      return 1;
    }else return 0;
  };
  


// recherche par nom de rue


    
function searching(){
    let elementInput= document.getElementById('searchBar').value;  // recuperation donnée taper dans barre recherche
    document.getElementById('listSearch').innerHTML = '';
    
    for (let i = 0; i<databaseJson.incidents.length;i++) {
        let elementList=databaseJson.incidents[i].location.location_description;

    
        if(elementList.indexOf(elementInput.toUpperCase()) !=-1 ){ 
           let List= document.createElement('option');
           List.classList.add('dropList');
           List.value = databaseJson.incidents[i].location.location_description;
           let createList = document.getElementById('listSearch');
           createList.append(List);
        }
   
       
    }   
   }

function reset() {
    document.getElementById('listSearch').innerHTML = '';
}   
   