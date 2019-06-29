var dist_puntos = [[]];
var array_prov = [];
var trazar = true;



function kruskal(){
  //ordenar las distancias de menor a mayor
  var izq = 0;
  var der = dist_puntos.length-1;
  ordenar_quick_sort(izq,der);
  //redibujar las lineas
  var trazos = 0;
  array_prov = [];
  for (var i = 0; i < dist_puntos.length; i++) {
    if (trazos < 2) {

        //Redibujar en el mapa en test()
        array_prov.push(dist_puntos[i]);
        trazos++;
        console.log(array_prov);
    }else{
      //console.log(array_prov);
      var inicio = dist_puntos[i][0];
      var cierre = dist_puntos[i][1];
      trazar = true;

      dividir(inicio, cierre, array_prov);
      if(trazar){
        array_prov.push(dist_puntos[i]);
        trazos++;
      }
    }
  }
}


function dividir(inicio, cierre, array){
  //console.log(array);
  if(array.length != 0){
    for (var i = 0; i < array.length; i++) {
      if(inicio == array[i][0]){
        if(cierre == array[i][1]){
          trazar = false;
        } else{
          var arrayP1 = [];
          arrayP1 = array.slice();
          arrayP1.splice(i,1);
          dividir(array[i][1], cierre, arrayP1);
        }
      } else {
        if(inicio == array[i][1]){
          if(cierre == array[i][0]){
            trazar = false;
          } else{
            var arrayP2 = [];
            arrayP2 = array.slice();
            arrayP2.splice(i,1);
            dividir(array[i][0], cierre, arrayP2);
          }
        }
      }
    }
  }
}


function ordenar_quick_sort(izq, der){
  var pivote = dist_puntos[izq][2];
  var piv_res = dist_puntos[izq];
  var i = izq;
  var j = der;
  var aux;

  while (i < j) {
    while (dist_puntos[i][2] <= pivote && i < j) {
      i++;
    }
    while (dist_puntos[j][2] > pivote) {
      j--;
    }
    if (i < j) {
      aux = dist_puntos[i];
      dist_puntos[i] = dist_puntos[j];
      dist_puntos[j] = aux;
    }
  }

  dist_puntos[izq] = dist_puntos[j];
  dist_puntos[j] = piv_res;
  if (izq < j - 1) {
    ordenar_quick_sort(izq,j-1);
  }
  if(j+1 < der){
    ordenar_quick_sort(j+1, der);
  }
}
