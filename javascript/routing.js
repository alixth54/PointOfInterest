

function changelanguage () { 
    let languageSelection = document.querySelector('input[name=language]:checked').value; 
    return languageSelection;
}

function createItinerary() {  
    document.getElementsByClassName('leaflet-routing-container').innerHTML ='';
     
    L.Routing.control({
        waypoints: [
            L.latLng(),
            L.latLng()
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
        language : changelanguage()
    }).addTo(map);
    
    
}