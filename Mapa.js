var map = L.map('map', {
  center: [5.577716982024754, -72.94509887695314],
  zoom: 11,
});

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

//Locaciones
var loc = [
  ['LTota', 3.015, -72.928843, 5.545912],
  ['Cuitiva', 2.750, -72.966388, 5.580495],
  ['Aquitania', 3.030, -72.883104, 5.518368],
  ['Iza', 2.560, -72.979950, 5.612626],
  ['Pesca', 2.540, -73.051082, 5.558392],
  ['Firavitoba', 2.500, -72.993698, 5.668974],
  ['Sogamoso', 2.569, -72.932884, 5.717212],
  ['Mongui', 2.900, -72.849400, 5.723430],
  ['Tibasosa', 2.538, -73.000041, 5.733341],
  ['Nobza', 2.550, -72.939919, 5.770666],
  ['Chameza', 1.100, -72.877449, 5.217579],
  ['Paipa', 2.525, -73.119059, 5.779557],
  ['Duitama', 2.550, -73.032443, 5.825565],
  ["Tota", 2.870, -72.986218, 5.560332]
];

//Colocar los puntos de loc
for (var i = 0; i < loc.length; i++) {
  L.marker([loc[i][3], loc[i][2]]).addTo(map);
  var loc1 = [(loc[i][3]), (loc[i][2])];
  //Datos del punto
  var marker = L.marker(loc1);
  marker.bindPopup('<p>Lugar:' + loc[i][0] + '</p><p>punto:' + i + '</p><p>Altitud:' + loc[i][1] + '</p><p>Latitud:' + loc[i][2] + '</p><p>Longitud:' + loc[i][3]);
  marker.addTo(map);
}

//Boton calcular
document.getElementById("button_calcular").addEventListener("click", function() {
  Calcular();
});


var puntos = new Array();
var puntosF = new Array();

//Convierte cordenadas polares en cartesianas
function haversine(lat1, long1, lat2, long2) {
  var d = 0;
  d = (2 * 6371) * Math.asin(Math.sqrt((Math.pow(Math.sin((lat2 - lat1) / 2), 2)) + (Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((long2 - long1) / 2), 2))));
  return d;
}


function Rad(angulo) {
  var g = angulo;
  angulo = (angulo * Math.PI) / 180;

  return angulo;
}

//Array con las distancias respecto a la altura
var dist_puntos2 = new Array();
var geoJsonLayer;
var linestring;


//Calcular la distancia _____________________________________________
function Calcular() {
  //Añadir coordenadas a coords
  var coords = [];
  for (var i = 0; i < loc.length; i++) {
    coords.push([loc[i][2], loc[i][3]]);
  }

  //Convierte las cordenadas de los marcadores a radianes y las almacena en el array puntos
  puntos = new Array();
  for (var i = 0; i < loc.length; i++) {
    puntos.push({
      latitud: Rad(loc[i][2]),
      longitud: Rad(loc[i][3])
    });
  }

  puntosF = new Array();

  //En vez de calcular haversine para la hipotenusa calcular los catetos
  //convierte las coordenadas polares en planas y las almacena en puntosF
  for (var i = 0; i < puntos.length; i++) {
    puntosF.push({
      x: haversine(0, 0, 0, puntos[i].longitud),
      y: haversine(0, 0, puntos[i].latitud, 0)
    });
  }

  //Calcular todas las distancias entre los putos.
  for (var i = 0; i < puntosF.length - 1; i++) {
    for (var j = i + 1; j < puntosF.length; j++) {
      var dist_base = (Math.sqrt(Math.pow((puntosF[i].x - puntosF[j].x), 2) + Math.pow((puntosF[i].y - puntosF[j].y), 2))); //Calcula la distancia en puntos cartesianos
      var dif_altura = Math.abs(loc[i][1] - loc[j][1]); //Calcula la diferencia de altura
      var distancia = (Math.sqrt(Math.pow((dist_base), 2) + Math.pow((dif_altura), 2))); //Calcula la distancia total
      dist_puntos2.push([i, j, distancia]); //Alamacena la distancia y los puntos
    }
  }

  //Algoritmo Kruskal
  dist_puntos = dist_puntos2.slice();
  kruskal();

  //Dibujar lineas
  for (var i = 0; i < array_prov.length; i++) {
    geoJsonLayer = L.geoJson().addTo(map);
    // 	Creamos una linea entre los dos puntos
    linestring = turf.lineString([coords[array_prov[i][0]], coords[array_prov[i][1]]]);
    L.geoJson(linestring, {
      color: "red"
    }).addTo(map);

  }
}



var bandera = 0;

function clearMap() {
  for (i in map._layers) {
    if (map._layers[i]._path != undefined) {
      try {
        map.removeLayer(map._layers[i]);
      } catch (e) {
        console.log("problem with " + e + m._layers[i]);
      }
    }
  }
}

map.on('click', function(e) {
  //Resetear Mapa
  clearMap();
  //añadimos marcadores
  L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  var location = [e.latlng.lat, e.latlng.lng];
  var altura = prompt("¿Cuál es la altura del lugar?", "");
  var nombre = prompt("¿Cuál es el nombre del lugar?", "");
  loc.push([nombre, (parseFloat(altura)/1000), e.latlng.lng, e.latlng.lat])
  var loc1 = [(e.latlng.lat), (e.latlng.lng)];
  var marker = L.marker(loc1);
  marker.bindPopup('<p>Lugar:' + loc[loc.length-1][0] + '</p><p>punto:' + (loc.length-1) + '</p><p>Altitud:' + loc[loc.length-1][1] + '</p><p>Latitud:' + loc[loc.length-1][2] + '</p><p>Longitud:' + loc[loc.length-1][3]);
  marker.addTo(map);

});
