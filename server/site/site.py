meu-mapa/
├─ <!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Template OSPA-like — Map + Sidebar</title>
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="" crossorigin="" />
  <style>
    /* Estilos básicos para um layout estilo OSPA */
    :root{
      --accent: #2563eb; /* azul */
      --bg: #0f172a;
      --panel: #0b1220;
      --muted: #94a3b8;
    }
    html,body,#app{height:100%;margin:0;background:var(--bg);color:#e6eef8;font-family:Inter, system-ui, Arial}
    .app{display:flex;height:100vh;gap:0}
    .sidebar{width:360px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));padding:18px;box-sizing:border-box;overflow:auto}
    .mapwrap{flex:1;position:relative}
    #map{position:absolute;inset:0}
    .logo{font-weight:700;margin-bottom:12px}
    .search{display:flex;gap:8px;margin-bottom:12px}
    .input{flex:1;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02);color:inherit}
    .btn{padding:8px 12px;border-radius:8px;background:var(--accent);color:white;border:none}
    .layer-list{margin-top:12px}
    .feature-list{margin-top:12px}
    .card{background:rgba(255,255,255,0.02);padding:10px;border-radius:8px;margin-bottom:8px}
    .footer{font-size:12px;color:var(--muted);margin-top:16px}
    /* Popup custom */
    .leaflet-popup-content-wrapper{background:#071026;color:#e6eef8}
    /* Responsivo */
    @media(max-width:720px){.sidebar{width:100%;height:40vh;position:absolute;z-index:100;backdrop-filter:blur(6px)}.app{flex-direction:column}}
  </style>
</head>
<body>
  <div id="app" class="app">
    <aside class="sidebar">
      <div class="logo">OSPA‑like • Seu projeto</div>
      <div class="search">
        <input id="searchInput" class="input" placeholder="Buscar (ex: rua, bairro, id)" />
        <button id="btnSearch" class="btn">Buscar</button>
      </div>

      <div class="card">
        <strong>Camadas</strong>
        <div class="layer-list">
          <label><input type="checkbox" id="toggleGeojson" checked /> Vetores (GeoJSON)</label><br />
          <label><input type="checkbox" id="toggleRaster" checked /> Raster/Tile XYZ</label>
        </div>
      </div>

      <div class="card">
        <strong>Resultados</strong>
        <div id="results" class="feature-list">Nenhum resultado — selecione um recurso no mapa.</div>
      </div>

      <div class="footer">Substitua <code>data/dados.geojson</code> e a URL de tiles com seus dados exportados do QGIS.<br><br>GPKG → GeoJSON: <code>ogr2ogr -f GeoJSON dados.geojson camada.gpkg camada</code></div>
    </aside>

    <div class="mapwrap">
      <div id="map"></div>
    </div>
  </div>

  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    // CONFIGURAÇÕES --- Edite estes caminhos conforme seus arquivos
    const GEOJSON_URL = './data/dados.geojson'; // coloque seu .geojson aqui
    const XYZ_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; // substitua por seu tileserver ou TileServer GL

    // Cria o mapa
    const map = L.map('map', {zoomControl:true}).setView([-15.596, -56.0969], 13);

    // Base layer
    const base = L.tileLayer(XYZ_TILES, {maxZoom: 19, attribution: '© OpenStreetMap'}).addTo(map);

    // Layer group para vetores
    const geojsonLayer = L.geoJSON(null, {
      style: feature => ({color: '#ff7a18', weight: 2, fillOpacity: 0.1}),
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        const title = props.nome || props.id || 'Feature';
        layer.bindPopup(`<strong>${title}</strong><br/>${Object.keys(props).map(k=>`<b>${k}</b>: ${props[k]}`).join('<br/>')}`);
        layer.on('click', ()=> showFeatureDetails(props));
      }
    }).addTo(map);

    // Raster/Tile layer (ex: ortofoto)
    const rasterLayer = L.tileLayer(XYZ_TILES, {maxZoom: 19});
    rasterLayer.addTo(map);

    // Função para carregar GeoJSON
    async function loadGeoJSON(url){
      try{
        const r = await fetch(url);
        if(!r.ok) throw new Error('Falha ao carregar GeoJSON: '+r.status);
        const data = await r.json();
        geojsonLayer.addData(data);
        map.fitBounds(geojsonLayer.getBounds(), {padding:[20,20]});
      }catch(e){
        console.error(e);
        document.getElementById('results').innerText = 'Erro carregando GeoJSON. Veja console.';
      }
    }

    // Exibição do painel de detalhes
    function showFeatureDetails(props){
      const el = document.getElementById('results');
      el.innerHTML = Object.keys(props).map(k=>`<div><b>${k}</b>: ${props[k]}</div>`).join('');
    }

    // Search simples por atributo (string)
    function searchTerm(term){
      term = term && term.toLowerCase && term.toLowerCase();
      if(!term) return;
      let found = null;
      geojsonLayer.eachLayer(layer=>{
        const props = layer.feature && layer.feature.properties || {};
        const text = JSON.stringify(props).toLowerCase();
        if(text.indexOf(term) !== -1){
          found = layer;
        }
      });
      if(found){
        map.fitBounds(found.getBounds ? found.getBounds() : found.getLatLng(), {padding:[40,40]});
        found.openPopup();
        showFeatureDetails(found.feature.properties || {});
      } else {
        document.getElementById('results').innerText = 'Nenhum resultado para "'+term+'".';
      }
    }

    // Toggle layers
    document.getElementById('toggleGeojson').addEventListener('change', e=>{
      if(e.target.checked) map.addLayer(geojsonLayer); else map.removeLayer(geojsonLayer);
    });
    document.getElementById('toggleRaster').addEventListener('change', e=>{
      if(e.target.checked) map.addLayer(rasterLayer); else map.removeLayer(rasterLayer);
    });

    // Botão de busca
    document.getElementById('btnSearch').addEventListener('click', ()=>{
      const q = document.getElementById('searchInput').value.trim();
      searchTerm(q);
    });

    // Carrega dados
    loadGeoJSON(GEOJSON_URL);

    // DICAS RÁPIDAS para seus dados QGIS:
    // - Vetores: exporte para GeoJSON (ogr2ogr -f GeoJSON dados.geojson camada.gpkg camada)
    // - Raster/tiles: gere tiles XYZ com gdal2tiles ou exporte para MBTiles e sirva via TileServer-GL
    //   Ex: gdal2tiles.py -z 0-18 ortofoto.tif tiles/
    // - Se quiser exibir MBTILES localmente, use TileServer (https://tileserver.org) ou similar.

  </script>
</body>
</html>
.html        (cole aqui o conteúdo do template que eu fiz)
├─ data/
│  └─ dados.geojson  (seus dados exportados do QGIS)
