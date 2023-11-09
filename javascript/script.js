// déclaration des variables pour les utiliser dans les differentes fonction
let databaseJson;  //acces api open data nancy
let startDay, startMonth, startYear;
let endDate, endDay, endMonth, endYear;
let majDate, majDay, majMonth, majYear;
const currentDate = new Date(); //date du jour
let markerGroup; // variable pour creation layer sur leaflet
let jj, mm, yyyy;

//fetch open data nancy ajout event onload et recuperartion fichier json
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://carto.g-ny.org/data/cifs/cifs_waze_v2.json')
    .then((response) => {
        return response.json();
    }) 
    .then((json) => {
        databaseJson = json;
        //chargement du json lent et pour que les marqueurs soient creer à l'ouverture du site on recupere les donnée du json directement
        for (let i = 0; i<databaseJson.incidents.length;i++) { 
            createMarker(i,databaseJson.incidents[i]);// fonction appeler au demarrage et deja incrementée
            futureEvents(i);
            
        }
         jj=currentDate.getDate();
         mm = currentDate.getMonth()+1;
         yyyy=currentDate.getFullYear();
        document.getElementById('date').innerText ='Nous sommes le '+jj+'/'+mm+'/'+yyyy+'.';
        console.log(currentDate);
    });

});

//recuperation lattitude et longitude maximum et minimum pour gerer limite de la carte
let latLongMin = L.latLng(48.677675, 6.158160),
    latLongMax = L.latLng(48.701081, 6.206054),
    bounds = new L.latLngBounds(latLongMin, latLongMax);
    

    //info leaflet pour creation de la map avec coordonnées sur nancy
let map = L.map('map');
map.setView([48.693463, 6.193167], 14);

// info leaflet pour creation de la map avec element zoom 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//creation d'un layer pour les markers (point sur la carte) reutiliser dans la fonction createMarker
markerGroup = L.layerGroup().addTo(map);

//creation de card en cliquant sur le bouton detail du popup. fonction appelée par event onclick
function createCard(index) {  //le parametre index est le meme que createMarker ce qui correspond au i dans la boucle for dans le fetch au dessus
    let cardArea = document.getElementById('cardArea');  //creation variable qui va se situer dans element html id='cardArea'
    cardArea.innerHTML = '';                            //on vide le la variable soit l'element html a chaque appel afin d'eviter de se retrouver avec de nombreuses cartes appelées
    let article = document.createElement('article');       //on creer une balise html article 
    article.classList.add('cardArticle');                  //on donne une class a cette balise
    article.setAttribute('id', index);                      //on lui donne un id avec le numero de l'index pour chaque card
    let title = document.createElement('h3');               //on creer in titre pour la card
    title.classList.add('cardTitle');                         //class='cardTitle' pour le titre
    let pStart = document.createElement('p');                   //creation paragraphe
    let startTime = new Date(databaseJson.incidents[index].starttime);  //on recupere la date de debut de chantier puis on utilise la fonction Date() pour prendre la partie date qui nous interesse et on meme cette info dans une variable
    let correctStartMonth = startTime.getMonth() +1;                    // la date n'est pas au format europeen donc on recupere la valeur du mois getMonth() janvier commence a 0 donc on doit ajouter 1, du jour getDate() et de l'année getFullYear() pour apres les mettre dans l'ordre dans notre card
    pStart.innerText ='Début chantier : ' +startTime.getDate()+' / ' + correctStartMonth + ' / ' + startTime.getFullYear();
    let pEnd = document.createElement('p');
    let endTime = new Date(databaseJson.incidents[index].endtime);
    let correctEndMonth = endTime.getMonth() +1;
    pEnd.innerText ='Fin chantier : ' +endTime.getDate()+' / ' + correctEndMonth + ' / ' + endTime.getFullYear();
    let Description = document.createElement('p');
    Description.innerText = 'Description : '+ databaseJson.incidents[index].description;    
    let pUpdate = document.createElement('p');
    let upDate = new Date(databaseJson.incidents[index].updatetime);
    let correctUpdate = upDate.getMonth();
    pUpdate.innerText ='Dernière mise à jour : ' +upDate.getDate()+' / ' + correctUpdate + ' / ' + upDate.getFullYear(); 
    let buttonSignal = document.createElement('button');  // on creer un bouton en bas de la card pour appeler un formulaire de contact
    buttonSignal.classList.add('cardButton');           //ajout class='cardButton' au bouton
    buttonSignal.innerText = 'Signaler un problème'; //text visible sur le bouton
    buttonSignal.addEventListener('click', () => {sendEmail()});
    article.append(title,pStart,pEnd,Description,pUpdate,buttonSignal); //creation de l'element html qui contient les differents elelements creer soit l'article contient le titre le paragraphe, les dates et le bouton

    title.innerText ='CHANTIER '+ databaseJson.incidents[index].location.location_description; //insertion text du json dans le titre de la card
    cardArea.append(article); // creation de l'article (append precedent) dans la variable cardArea qui est declarée au début soit l'element html id=cardArea

}

// parametre fonction = index: i incrementation fetch et coordinates = i,databaseJson.incidents[i] deja incrémenté pas besoin de boucle for
function createMarker (index,coordinates){
 
    //dans le json les coordonnées sont données dans un meme objet pour les utiliser il nous faut les couper (usage fonction split())
    let arrayCoordinates = coordinates.location.polyline.split(" ", 2);
    let lat = arrayCoordinates[0]; //on obtient un tableau avec 1er element split soit latitude
    let long =arrayCoordinates[1];//on obtient un autre tableau avec 2eme element split soit longitude
    boundMapMaxMin(lat,long);  // appel de la fonction boundMapMaxMin ligne 151(avec recuperation valeur variable lat et long au dessus)
   
 // en etudiant le json nous avons trouver 3 axes de travail, soit on ne peut pas circuler; soit la circulation est ralentie et soit il s'agit d'un probleme de stationnement
    
 //on va donc chercher 3 mots qui correspondent à nos cas et que l'on va rechercher dans le json. 
 let arrayOrange =['gêne','réduction','alternée'];
    let arrayRed =['barrée','suppression','suppression'];
    let arrayBlue =['stationnement interdit','stationement difficile','stationement difficile'];
    // creation de 3 icones soit une pour chaque cas (information sur leaflet) 
    let redIcon = L.icon({
        iconUrl: 'media/stop.png', //chemin acces image telechargée
        iconSize:     [38, 38], // size of the icon

    });
    let orangeIcon = L.icon({
        iconUrl: 'media/traffic-jam.png',
        iconSize:     [38, 38], // size of the icon

    });
    let blueIcon = L.icon({
        iconUrl: 'media/no-parking.png',
        iconSize:     [38, 38], // size of the icon
    });
     // pour simplifier l'ecriture on creer une variable 'details' = databaseJson.incidents[index].description
    let details = coordinates.description;
    // recuperation date a nouveau
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
    
//creation des markers 1ere condition la date du jour doit etre comprise entre date debut et fin (comparaison dans fonction compareDate() ligne 167)
    if(compareDates(startDate, currentDate, endDate)){    
            for(let j=0; j<arrayRed.length;j++){   //on parcours les tableaux de mot ci-dessus
                    if(details.toUpperCase().indexOf(arrayRed[j].toUpperCase()) !=-1 ){// on trouve dans le json un mot qui ressemble aux mot du tableau arrayRed alors
                        let markerRed = L.marker([lat, long],{icon:redIcon}).addTo(markerGroup); // on créé le marker rouge et on l'ajout au layer creer ligne44.
                        //creation, sur chaque marker, d'un popup 
                        markerRed.bindPopup("<strong>CIRCULATION INTERDITE</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><a href='#"+index+"' ><button onclick=createCard("+index+")> En savoir plus</button></a>");
                        j = arrayRed.length; //pour eviter la creation d'un double marker car parfois la route peut etre barrée et le stationnement interdit donc on arrete la boucle une fois le mot trouvé

                    }else if(details.toUpperCase().indexOf(arrayOrange[j].toUpperCase()) !=-1 ){
                    let markerOrange = L.marker([lat, long],{icon:orangeIcon}).addTo(markerGroup);
                    markerOrange.bindPopup("<strong>CIRCULATION LENTE</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><a href='#"+index+"' ><button onclick=createCard("+index+")> En savoir plus</button></a>");
                        j=arrayRed.length;
                    }else if
                    (details.toUpperCase().indexOf(arrayBlue[j].toUpperCase()) !=-1 )
                    {
                        let markerBlue = L.marker([lat, long],{icon:blueIcon}).addTo(markerGroup);
                        markerBlue.bindPopup("<strong>PROBLEME STATIONNEMENT</strong><br> Début chantier: " + startDay + "/" + startMonth + "/" + startYear + "<br> Fin chantier: " + endDay + "/" + endMonth + "/" + endYear + "<br><a href='#"+index+"' ><button onclick=createCard("+index+")> En savoir plus</button></a>");
                        j=arrayRed.length;
                    }
            }
        } 
   
       
    }
   
//les données du json sont evolutives donc on met a jour les limites de la cartes on prend la latitude max et la longitude max du json, on fait de meme avec les coordonnées minimales
//ainsi les limites de la cartes sont réactualisées en fonctions des evenements en cours
function boundMapMaxMin(lat,long){ //lat et long sont des parametres decla
   if(latLongMin.lat > lat) {//on compare la latitude min par rapport a la lat 
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
   markerGroup.clearLayers();
    let elementInput= document.getElementById('searchBar').value;  // récupération donnée taper dans barre recherche
    document.getElementById('listSearch').innerHTML = '';
    
    for (let i = 0; i<databaseJson.incidents.length;i++) {
        let elementList=databaseJson.incidents[i].location.location_description;
        if(elementList.indexOf(elementInput.toUpperCase()) !=-1 ){   
        let List= document.createElement('option');
           List.classList.add('dropList');
           List.value = databaseJson.incidents[i].location.location_description;
           let createList = document.getElementById('listSearch');
           createList.append(List);
           createMarker (i,databaseJson.incidents[i]);

        }
   
       
    }   
   }
function clearSearch(){
    document.getElementById('searchBar').value= document.getElementById('searchBar').defaultValue;
}

function reset() {
    document.getElementById('listSearch').innerHTML = '';
}   

function futureEvents(index){
    if (!(compareDates (startDate, currentDate, endDate,))){
        document.getElementById('titleFuture').innerText = "Projets futurs";
        let futureProjects = document.getElementById('futureProjects');
        let article = document.createElement('article'); 
        article.classList.add('futureTask');  
        let title = document.createElement('h3');
        title.classList.add('projectTitle');
        title.innerText ='CHANTIER '+ databaseJson.incidents[index].location.location_description;
        let pStart = document.createElement('p');
        let startTime = new Date(databaseJson.incidents[index].starttime);
        let correctStartMonth = startTime.getMonth() +1; 
        pStart.innerText ='Début chantier : ' +startTime.getDate()+' / ' + correctStartMonth + ' / ' + startTime.getFullYear();
        let pEnd = document.createElement('p');
        let endTime = new Date(databaseJson.incidents[index].endtime);
        let correctEndMonth = endTime.getMonth() +1;
        pEnd.innerText ='Fin chantier : ' +endTime.getDate()+' / ' + correctEndMonth  + ' / ' + endTime.getFullYear();
        let pUpdate = document.createElement('p');
    let upDate = new Date(databaseJson.incidents[index].updatetime);
    let correctUpdate = upDate.getMonth();
    pUpdate.innerText ='Dernière mise à jour : ' +upDate.getDate()+' / ' + correctUpdate + ' / ' + upDate.getFullYear(); 
        let Description = document.createElement('p');
        Description.innerText = 'Description : '+ databaseJson.incidents[index].description;    
        article.append(title,pStart,pEnd,Description,pUpdate);
        
        futureProjects.append(article);
        
    }

}

function sendEmail(){
let email = "thesealix@yahoo.fr";
let subject = "Nous signaler un problème";
let content = "Vous avez une remarque, ou autre, à faire sur les travaux, dites-nous tout.";
window.open(`mailto:${email}?subject=${subject}&body=${content}`);
}