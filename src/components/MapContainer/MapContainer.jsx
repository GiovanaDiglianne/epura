import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapContainer.css';

const apiKey = 'ok7ZFsc8aNh6eVAKsDc3';
const matoGrossoBounds = [ [-56.75, -15.9], [-56.85, -15.23] ];
const tipoLegenda = {
  "APP": "Área de Proteção Ambiental",
  "ELNC": "Espaço Livre Não Configurado",
  "EST": "Estacionamento",
  "GNP": "Gleba Não Parcelada",
  "LNE": "Não Edificado",
  "SEL": "Sistema de Espaço Livre",
  "SUB": "Subutilizado"
};


function MapContainer() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://api.maptiler.com/maps/0198f6a0-6eb4-727b-9907-9038979cc4e9/style.json?key='+apiKey,
      center: [-56.1,-15.6],
      zoom: 12,
      pitch: 60,
      bearing: 0,
      minZoom: 12,
      maxBounds: matoGrossoBounds
    });

    mapRef.current.on('load', () => {
      
      mapRef.current.addSource('pedra90', { 
        type:'geojson', 
        data:'/data/PEDRA90.geojson'
      });

      mapRef.current.addLayer({
        id:'pedra90-layer',
        type:'fill',
        source:'pedra90',
        paint:{
          'fill-color': [
            'match',['get','TIPO'],
            'LNE','#000000', 
            'SUB','#ff7700', 
            'SEL','#00ff23',
            'APP','#a47158', 
            'EST','#e8718d', 
            'GNP','#6053b7',
            'ELNC','#00660e', 
            '#cccccc'
          ],
          'fill-opacity':0.5
        }
      });

      mapRef.current.addLayer({
        id:'pedra90-outline',
        type:'line',
        source:'pedra90',
        paint:{'line-color':'#000','line-width':0.8}
      });

      mapRef.current.on('click','pedra90-layer', e => {
        const props = e.features[0].properties;
        let html = '';
        if(props.TIPO) html += `<b>Tipo:</b> <br> ${tipoLegenda[props.TIPO] || props.TIPO}<br><br>`;
        if(props.inscricao) html += `<b>Inscrição:</b> <br> ${props.inscricao}<br><br>`;
        if(props.AREA) html += `<b>Área:</b> <br> ${props.AREA} m²`;
        
        document.getElementById('info').innerHTML = html || 'Sem informações';
      });

      mapRef.current.on('mouseenter','pedra90-layer', () => mapRef.current.getCanvas().style.cursor='pointer');
      mapRef.current.on('mouseleave','pedra90-layer', () => mapRef.current.getCanvas().style.cursor='');

      mapRef.current.addSource('coxipo', { 
        type:'geojson', 
        data:'/data/COXIPO.geojson'
      });

      mapRef.current.addLayer({
        id:'coxipo-layer',
        type:'fill',
        source:'coxipo',
        paint:{
          'fill-color': [
            'match',['get','TIPO'],
            'LNE','#000000', 
            'SUB','#ff7700', 
            'SEL','#00ff23',
            'APP','#a47158', 
            'EST','#e8718d', 
            'GNP','#6053b7',
            'ELNC','#00660e', 
            '#cccccc'
          ],
          'fill-opacity':0.5
        }
      });

      mapRef.current.addLayer({
        id:'coxipo-outline',
        type:'line',
        source:'coxipo',
        paint:{'line-color':'#000','line-width':0.8}
      });

      mapRef.current.on('click','coxipo-layer', e => {
        const props = e.features[0].properties;
        let html = '';
        if(props.TIPO) html += `<b>Tipo:</b> ${tipoLegenda[props.TIPO] || props.TIPO}<br>`;
        if(props.inscricao) html += `<b>Inscrição:</b> ${props.inscricao}<br>`;
        if(props.AREA) html += `<b>Área:</b> ${props.AREA} m²`;
        
        document.getElementById('info').innerHTML = html || 'Sem informações';
      });

      mapRef.current.on('mouseenter','coxipo-layer', () => mapRef.current.getCanvas().style.cursor='pointer');
      mapRef.current.on('mouseleave','coxipo-layer', () => mapRef.current.getCanvas().style.cursor='');  

    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };

  }, []);

  return (
    <div className="map-wrapper" ref={mapContainerRef}>
      {/* O MapLibre usa esta div para se desenhar */}
    </div>
  );
}

export default MapContainer;