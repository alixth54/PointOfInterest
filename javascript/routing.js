
let routing;
let divParent;
let resetButton;
let check = 0; 

function changelanguage () { 
    let languageSelection = document.querySelector('input[name=language]:checked').value; 
    return languageSelection;
}




function createItinerary() {  
    if (check === 0) { 
    routing = L.Routing.control({
        
        waypoints: [
            L.latLng(),
            L.latLng()
           
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
        language : changelanguage(),
        showAlternatives: true,
        altLineOptions: {
            styles: [
                {color: 'gray', opacity: 0.8, weight: 6}
                
            ]
        },
        lineOptions: {
            styles: [
                {color: 'blue', opacity: 0.8, weight: 6}
                
            ]
        }
         
        
    })
    .on('routesfound', function(e) {
        var routes = e.routes;
        
        // alert('Found ' + routes.length + ' route(s).');
    })
    .on('routeselected', function(e) {
        var route = e.route;

    })
        .addTo(map);
        divParent = document.querySelector('.leaflet-routing-container');
        resetButton = document.createElement('span');
        resetButton.classList.add('leaflet-routing-collapse-btn')
        resetButton.addEventListener('click', () => {resetRoute()});
        divParent.classList.add('leaflet-routing-collapsible');
        divParent.append(resetButton);
        check = 1;// permet de passer en else au premier click et au second cela efface la fenetre
    }else{
        routing.remove();  // permet en cliquant a nouveau sur anglais ou francais de supprimer la fenetre itineraire
        check =0; //permet de retourner a nouveau dans la boucle en cliquant à nouveau

    }
}

function resetRoute () { //cette fonction agit sur la croix en haut a droite de la fenetre itineraire et de supprimer celle ci
    // routing.spliceWaypoints(0, 2);
    routing.remove();
}
