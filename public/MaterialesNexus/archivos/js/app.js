import { OpenStreetMapProvider } from "leaflet-geosearch";
import attendance from './attendance.js';
import deleteComments from './deleteComments.js'
import  './animation.js'; 
import './animations1.js';

const lat = document.querySelector('#lat').value || -33.45694;
const lng = document.querySelector('#lng').value ||  -70.64827;
const direccion= document.querySelector('#direccion').value || '';
// Crear el mapa
const map = L.map('mapa').setView([lat, lng], 15);

// Inicializar el grupo de markers
let markers = new L.FeatureGroup().addTo(map);
let marker;

if(lat && lng){
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    })
    .bindPopup(direccion)
    .openPopup();

    // Añadir el nuevo marcador al grupo 'markers'
    markers.addLayer(marker);
}

document.addEventListener('DOMContentLoaded', () => {
    // Añadir el tileLayer al mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Buscar dirección
    const buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input', searchDirection);

    function searchDirection(e) {
        if (e.target.value.length > 8) {
            // Limpiar los pins anteriores
            markers.clearLayers(); // Aquí se borran todos los pines existentes

            // Utilizar el provider y GeoCoder
            const provider = new OpenStreetMapProvider();
            provider.search({ query: e.target.value }).then((resultado) => {
                if (resultado && resultado.length > 0) {

                    llenarInputs(resultado);

                    // Mostrar mapa en la ubicación encontrada
                    map.setView(resultado[0].bounds[0], 15);
                    console.log(resultado)
                    // Crear y agregar un nuevo pin al grupo de markers
                    marker = new L.marker(resultado[0].bounds[0], {
                        draggable: true,
                        autoPan: true
                    })
                    .bindPopup(resultado[0].label)
                    .openPopup();

                    // Añadir el nuevo marcador al grupo 'markers'
                    markers.addLayer(marker);

                    // Mover el mapa cuando el marcador es arrastrado
                    marker.on('moveend', function(e) {
                        const posicion = e.target.getLatLng();
                        map.panTo(new L.LatLng(posicion.lat, posicion.lng));
                    });
                } else {
                    console.error("No se encontraron resultados.");
                }
            }).catch(err => {
                console.error("Error en la búsqueda de la dirección:", err);
            });
        }
    }
});

function llenarInputs(resultado){
document.querySelector('#direccion').value= resultado[0].label;
document.querySelector('#lng').value= resultado[0].x;
document.querySelector('#lat').value=resultado[0].y;
}
