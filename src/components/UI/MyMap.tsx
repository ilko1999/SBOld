import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createMemo, createResource, onMount } from 'solid-js';
import { client } from '../../App';
import { GET_SPECIFIC_LOCATION } from '../../gql/events';

function Map(props: any) {
  function buildMap(div: HTMLDivElement) {
    const geoJson = () => props.geoJson.split(',');
    const map = L.map(div).setView(
      [Number(geoJson()[1]), Number(geoJson()[2])],
      15
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([Number(geoJson()[1]), Number(geoJson()[2])])
      .addTo(map)
      .bindPopup(geoJson()[3])
      .openPopup();
  }
  let mapDiv: any;
  onMount(() => buildMap(mapDiv));
  return <div class="w-full h-full rounded-xl" ref={mapDiv} id="main-map" />;
}

export default Map;
