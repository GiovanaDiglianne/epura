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

function MapContainer({ filtrosAtivos, setInfoLote, setZoomMapa }) {
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
        if(props.TIPO) html += `<b>Tipo:</b> ${tipoLegenda[props.TIPO] || props.TIPO}<br>`;
        if(props.inscricao) html += `<b>Inscrição:</b> ${props.inscricao}<br>`;
        if(props.AREA) html += `<b>Área:</b> ${props.AREA} m²`;
        
        setInfoLote(html || 'Sem informações');
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
        if(props.TIPO) html += `<b>Tipo:</b> ${tipoLegenda[props.TIPO] || props.TIPO} <br>`;
        if(props.inscricao) html += `<b>Inscrição:</b> ${props.inscricao}<br>`;
        if(props.AREA) html += `<b>Área:</b> ${props.AREA} m²`;
        
        setInfoLote(html || 'Sem informações');
      });

      mapRef.current.on('mouseenter','coxipo-layer', () => mapRef.current.getCanvas().style.cursor='pointer');
      mapRef.current.on('mouseleave','coxipo-layer', () => mapRef.current.getCanvas().style.cursor='');  

      const localZoomMapa = (center, zoom) => {
        mapRef.current.flyTo({ center, zoom });
      };
      setZoomMapa(() => localZoomMapa);

    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
    };
  }, []); 

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.getLayer('pedra90-layer')) {
      return;
    }
    
    if (filtrosAtivos.length === 0) {
      mapRef.current.setLayoutProperty('pedra90-layer', 'visibility', 'none');
      mapRef.current.setLayoutProperty('pedra90-outline', 'visibility', 'none');
    } else {
      mapRef.current.setLayoutProperty('pedra90-layer', 'visibility', 'visible');
      mapRef.current.setLayoutProperty('pedra90-outline', 'visibility', 'visible');

      const condicoes = filtrosAtivos.map(valor => ['==', ['get', 'TIPO'], valor]);
      const meuFiltro = ['any', ...condicoes];
      
      mapRef.current.setFilter('pedra90-layer', meuFiltro);
      mapRef.current.setFilter('pedra90-outline', meuFiltro);
    }
    
  }, [filtrosAtivos]);

  return (
    <div className="map-wrapper" ref={mapContainerRef}>

    </div>
  );
}

export default MapContainer;