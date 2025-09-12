const apiKey = 'ok7ZFsc8aNh6eVAKsDc3';
const tipoLegenda = {
  "APP": "Área de Proteção Ambiental",
  "ELNC": "Espaço Livre Não Configurado",
  "EST": "Estacionamento",
  "GNP": "Gleba Não Parcelada",
  "LNE": "Não Edificado",
  "SEL": "Sistema de Espaço Livre",
  "SUB": "Subutilizado"
};

const tipoKeys = Object.keys(tipoLegenda).sort(); // ordem alfabética

const matoGrossoBounds =
[ [-56.75, -15.9], [-56.85, -15.23] ]; //limita a navegação do mapa

// Inicializa o mapa
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/0198f6a0-6eb4-727b-9907-9038979cc4e9/style.json?key='+apiKey,
  center: [-56.1,-15.6],
  zoom: 12,
  pitch: 60,
  bearing: 0,
   minZoom: 12,
  maxBounds: matoGrossoBounds
});

//carregamento mapa 
map.on('load', () => {
  //PEDRA 90
  map.addSource('pedra90', { 
    type:'geojson', 
    data:'data/PEDRA90.geojson' 
  });

  //layer de lotes
  map.addLayer({
    id:'pedra90-layer',
    type:'fill',
    source:'pedra90',
    paint:{
      'fill-color': [
        'match',['get','TIPO'], //funciona com switch case
        'LNE','#000000',
        'SUB','#ff7700',
        'SEL','#00ff23',
        'APP','#a47158',
        'EST','#e8718d',
        'GNP','#6053b7',
        'ELNC','#00660e',
        '#cccccc' //cor padrão
      ],
      'fill-opacity':0.5
    }
  });

  // contorno dos lotes
  map.addLayer({
    id:'pedra90-outline',
    type:'line',
    source:'pedra90',
    paint:{'line-color':'#000','line-width':0.8}
  });

  // clique no lote
  map.on('click','pedra90-layer', e => {
    const props = e.features[0].properties;
    let html = '';
    if(props.TIPO) html += `<b>Tipo:</b> ${tipoLegenda[props.TIPO] || props.TIPO}<br>`;
    if(props.inscricao) html += `<b>Inscrição:</b> ${props.inscricao}<br>`;
    if(props.AREA) html += `<b>Área:</b> ${props.AREA} m²`;
    document.getElementById('info').innerHTML = html || 'Sem informações';
  });

  // cursor pointer 
  map.on('mouseenter','pedra90-layer', ()=> map.getCanvas().style.cursor='pointer');
  map.on('mouseleave','pedra90-layer', ()=> map.getCanvas().style.cursor='');

  //COXIPÓ (SEM FILTRO, pois não há tipos)
  map.addSource('coxipo', { 
    type:'geojson', 
    data:'data/COXIPO_WGS84.geojson' 
  });

  //layer de lotes
  map.addLayer({
    id:'coxipo-layer',
    type:'fill',
    source:'coxipo',
    paint:{
      'fill-color': [
        'match',['get','TIPO'], //funciona com switch case
        'LNE','#000000',
        'SUB','#ff7700',
        'SEL','#00ff23',
        'APP','#a47158',
        'EST','#e8718d',
        'GNP','#6053b7',
        'ELNC','#00660e',
        '#cccccc' //cor padrão
      ],
      'fill-opacity':0.5
    }
  });

  // contorno dos lotes
  map.addLayer({
    id:'coxipo-outline',
    type:'line',
    source:'coxipo',
    paint:{'line-color':'#000','line-width':0.8}
  });

  // clique no lote
  map.on('click','coxipo-layer', e => {
    const props = e.features[0].properties;
    let html = '';
    if(props.TIPO) html += `<b>Tipo:</b> ${tipoLegenda[props.TIPO] || props.TIPO}<br>`;
    if(props.inscricao) html += `<b>Inscrição:</b> ${props.inscricao}<br>`;
    if(props.AREA) html += `<b>Área:</b> ${props.AREA} m²`;
    document.getElementById('info').innerHTML = html || 'Sem informações';
  });

  // cursor pointer 
  map.on('mouseenter','coxipo-layer', ()=> map.getCanvas().style.cursor='pointer');
  map.on('mouseleave','coxipo-layer', ()=> map.getCanvas().style.cursor='');  
});

// monta checkboxes de filtro
const container = document.getElementById('filtro-container');
tipoKeys.forEach(k=>{
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" class="filtro" value="${k}" checked>
   ${tipoLegenda[k]}`;
  container.appendChild(label);
});

// collapsible
const coll = document.querySelector('.collapsible');
coll.addEventListener('click', ()=>{
  const content = document.querySelector('.content');
  content.style.display = content.style.display==='block'?'none':'block';
});

// filtros
document.querySelectorAll('.filtro').forEach(cb=>{
  cb.addEventListener('change', ()=>{
    const ativos = [...document.querySelectorAll('.filtro:checked')].map(c=>c.value);

    if(ativos.length === 0){
    // Nenhum selecionado → esconde o layer
    map.setLayoutProperty('pedra90-layer', 'visibility', 'none'); // camada 
    map.setLayoutProperty('pedra90-outline', 'visibility', 'none'); // contorno
    } else {
    // Pelo menos um ativo → mostra e aplica filtro
    map.setLayoutProperty('pedra90-layer', 'visibility', 'visible');
    map.setLayoutProperty('pedra90-outline', 'visibility', 'visible');

    const condicoes = ativos.map(valor => ['==', ['get', 'TIPO'], valor]);
    const meuFiltro = ['any', ...condicoes];
    
    map.setFilter('pedra90-layer', meuFiltro);
    map.setFilter('pedra90-outline', meuFiltro);
    }
  });
});

// função zoom
function zoomMapa(center, zoom){
  map.flyTo({center, zoom});
}