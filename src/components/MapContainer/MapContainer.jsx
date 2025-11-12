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

function addGeoJsonLayer(map, id, geojsonPath, tipoLegenda, setInfoLote, setShowInitialMessage) {
  const sourceId = id;
  const fillLayerId = `${id}-layer`;
  const outlineLayerId = `${id}-outline`;
  map.addSource(sourceId, { 
    type:'geojson', 
    data: geojsonPath
  });
  map.addLayer({
    id: fillLayerId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': [
        'match', ['get', 'TIPO'],
        'LNE', '#000000',
        'SUB', '#ff7700',
        'SEL', '#00ff23',
        'APP', '#a47158',
        'EST', '#e8718d',
        'GNP', '#6053b7',
        'ELNC', '#00660e',
        '#cccccc' // cor padrão
      ],
      'fill-opacity': 0.5
    }
  });

  map.addLayer({
    id: outlineLayerId,
    type: 'line',
    source: sourceId,
    paint: { 'line-color': '#000', 'line-width': 0.8 }
  });
  map.on('click', fillLayerId, e => {
    const props = e.features[0].properties;
    setInfoLote(props); // Envia o objeto de dados para o App.jsx
    setShowInitialMessage(false); // Esconde a mensagem da sidebar (Request 2)
  });

  map.on('mouseenter', fillLayerId, () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', fillLayerId, () => map.getCanvas().style.cursor = '');
}

function MapContainer({ filtrosAtivos, setInfoLote, setZoomMapa, setShowInitialMessage }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const filterableLayerIds = ['pedra90'];

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
      // --- CARREGA PEDRA 90 ---
      addGeoJsonLayer(
        mapRef.current,
        'pedra90',
        '/data/PEDRA90.geojson',
        tipoLegenda,          
        setInfoLote, 
        setShowInitialMessage         
      );

      // --- CARREGA COXIPÓ ---
      addGeoJsonLayer(
        mapRef.current,
        'coxipo',
        '/data/COXIPO.geojson',
        tipoLegenda,
        setInfoLote,
        setShowInitialMessage
      );

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
    if (!mapRef.current || !filterableLayerIds.length || !mapRef.current.getLayer(`${filterableLayerIds[0]}-layer`)) {
      return;
    }
    
    let filterConditions = null;
    let visibility = 'visible';

    if (filtrosAtivos.length === 0) {
      visibility = 'none';
    } else {
      const condicoes = filtrosAtivos.map(valor => ['==', ['get', 'TIPO'], valor]);
      filterConditions = ['any', ...condicoes];
    }

    filterableLayerIds.forEach(id => {
      const layerId = `${id}-layer`;
      const outlineId = `${id}-outline`;
      
      mapRef.current.setLayoutProperty(layerId, 'visibility', visibility);
      mapRef.current.setLayoutProperty(outlineId, 'visibility', visibility);

      mapRef.current.setFilter(layerId, filterConditions);
      mapRef.current.setFilter(outlineId, filterConditions);
    });
    
  }, [filtrosAtivos]);

  return (
    <div className="map-wrapper" ref={mapContainerRef}>

    </div>
  );
}

export default MapContainer;