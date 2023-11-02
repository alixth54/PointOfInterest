
let routing;
let divParent;
let resetButton;

function changelanguage () { 
    let languageSelection = document.querySelector('input[name=language]:checked').value; 
    return languageSelection;
}




function createItinerary() {  
    
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
        console.log(route);

    })
        .addTo(map);
        divParent = document.querySelector('.leaflet-routing-container');
        resetButton = document.createElement('span');
        resetButton.classList.add('leaflet-routing-collapse-btn')
        resetButton.addEventListener('click', () => {resetRoute()});
        divParent.classList.add('leaflet-routing-collapsible');
        divParent.append(resetButton);
}

function resetRoute () {
    routing.spliceWaypoints(0, 2);
}
