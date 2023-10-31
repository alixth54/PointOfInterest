//48.693463, 6.183167
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
            createMarker(databaseJson.incidents[i]);
            
        }
      
        
    });
});
const southWest = L.latLng(48.599861, 6.080953),
    northEast = L.latLng(48.739119, 6.348551),
    bounds = new L.latLngBounds(southWest, northEast);
    // .setView([48.693463, 6.183167], 14)

let map = L.map('map');
map.setView([48.693463, 6.193167], 15);
map.fitBounds(bounds);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);





function createMarker (coordinates){
 
    let arrayCoordinates = coordinates.location.polyline.split(" ", 2);
    let lat = arrayCoordinates[0];
    let long =arrayCoordinates[1];
    let arrayOrange =['gêne','réduction','alternée'];
    let arrayRed =['barrée','suppression','suppression'];
    let arrayBlue =['stationnement interdit','stationement difficile','stationement difficile'];
    let redIcon = L.icon({
        iconUrl: '../media/stop.png',
        shadowUrl: '#',
        iconSize:     [38, 38], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let orangeIcon = L.icon({
        iconUrl: '../media/traffic-jam.png',
        shadowUrl: '#',
        iconSize:     [38, 38], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let blueIcon = L.icon({
        iconUrl: '../media/no-parking.png',
        shadowUrl: '#',
        iconSize:     [38, 38], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        // // iconAnchor:   [, 94], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let details = coordinates.description;
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

    
            for(let j=0; j<arrayRed.length;j++){
                if(details.toUpperCase().indexOf(arrayRed[j].toUpperCase()) !=-1 ){
                    let markerRed = L.marker([lat, long],{icon:redIcon}).addTo(map);
                    markerRed.bindPopup("<strong>CIRCULATION INTERDITE</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><button>En savoir plus</button>");
                    j = arrayRed.length;

                }else if(details.toUpperCase().indexOf(arrayOrange[j].toUpperCase()) !=-1 ){
                let markerOrange = L.marker([lat, long],{icon:orangeIcon}).addTo(map);
                markerOrange.bindPopup("<strong>CIRCULATION LENTE</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><button>En savoir plus</button>");
                    j=arrayRed.length;
                }else if
                (details.toUpperCase().indexOf(arrayBlue[j].toUpperCase()) !=-1 )
                {
                    let markerBlue = L.marker([lat, long],{icon:blueIcon}).addTo(map);
                    markerBlue.bindPopup("<strong>PROBLEME STATIONNEMENT</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><button>En savoir plus</button>");
                    j=arrayRed.length;
                }
        }
       
        
    }
   

