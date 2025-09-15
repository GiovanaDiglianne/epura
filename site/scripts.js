// limita a navegação do mapa a Cuiaba
const matoGrossoBounds = [[-56.75, -15.9], [-56.85, -15.23]];

// PUXA A API DO MAPTILER
const apiKey = 'ok7ZFsc8aNh6eVAKsDc3';

// DEBUG: captura erros globais e loga para console
window.addEventListener('error', (e) => {
  console.error('Erro global capturado:', e.error || e.message || e);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rejeitada não tratada:', e.reason);
});

// Tenta inicializar o mapa e loga problemas
let map;
try {
  map = new maplibregl.Map({
    container: 'map',
    style:
        'https://api.maptiler.com/maps/0198f6a0-6eb4-727b-9907-9038979cc4e9/style.json?key=' +
        apiKey,
    center: [-56.065147, -15.607951],
    zoom: 15,
    pitch: 60,
    bearing: 0,
    minZoom: 12,
    // maxBounds: matoGrossoBounds
  });

  map.on('error', (err) => console.error('MapLibre erro:', err));
} catch (err) {
  console.error('Falha ao criar o mapa:', err);
}


// ====================================================================
// FUNÇÃO CENTRALIZADA PARA CRIAR O POPUP DO CONTORNO
// ====================================================================
function showContornoPopup(e) {
  // Remove popups existentes para evitar duplicação
  document.querySelectorAll('.maplibregl-popup').forEach(el => el.remove());

  const coord = e.lngLat;

  // Valores que você solicitou
  const tipo = 'Resumo Expandido';
  const ano = '2024';
  const evento = 'XVIII Colóquio Quapa Sel';
  const resumo =
      'Análise da Inserção Urbana do Contorno Leste - Relação entre Espaços Livres e Edificados e Conflitos Socioambientais.';
  const link =
      'https://drive.google.com/file/d/18KLABAMPlvdhuyk53H_qS9RRECY9v7Ye/view?usp=sharing';

  // ID único para o conteúdo colapsável para evitar conflitos
  const targetId = `contorno-destaques-content-${Date.now()}`;

  const html = `
    <div class="contorno-popup-content" style="width:280px; box-sizing:border-box; font-family:Arial, sans-serif; color:#222; overflow-wrap:anywhere; word-break:break-word;">
      <div style="text-align:center; margin-bottom:10px;">
        <img src="design/CONTORNO.png" alt="Contorno" style="max-width:100px; width:100%; height:auto; display:block; margin:0 auto; border-radius:4px;">
      </div>

      <div class="popup-collapsible" role="button" aria-expanded="false" data-target="#${
      targetId}" style="font-weight:600; padding:.4rem .25rem; border-radius:6px; background:transparent; cursor:pointer;">
        <span>Destaques</span>
      </div>

      <div id="${
      targetId}" class="popup-content" style="display:none; padding:0.5rem 0.25rem;">
        <div style="padding:0 .25rem; color:#222; font-size:0.9rem; line-height:1.25;">
          <strong>Tipo de produção:</strong> ${tipo}<br>
          <strong>Ano:</strong> ${ano}<br>
          <strong>Evento:</strong> ${evento}
          <hr style="border:none; border-top:1px solid #eee; margin:8px 0">
          <strong>Resumo:</strong>
          <div style="margin-top:6px; font-size:0.9rem; line-height:1.25;">
            ${resumo}
          </div>
          <div style="margin-top:12px;">
            <a href="${
      link}" target="_blank" rel="noopener noreferrer" style="color:#007bff; text-decoration:none;">Ver completo (PDF)</a>
          </div>
        </div>
      </div>
    </div>
  `;

  new maplibregl
      .Popup({
        offset: 12,
        closeButton: true,
        closeOnClick: true,
        className: 'contorno-popup'
      })
      .setLngLat(coord)
      .setHTML(html)
      .addTo(map);
}

// ====================================================================
// INCLUIR MANUALMENTE AS INFORMAÇÕES D AQUI
// ====================================================================
const popupMetadata = {
  'CONTORNO': {
    img: 'design/CONTORNO.png',
    tipo: 'Resumo Expandido',
    ano: '2024',
    evento: 'XVIII Colóquio Quapa Sel',
    resumo: 'Análise da Inserção Urbana do Contorno Leste - Relação entre Espaços Livres e Edificados e Conflitos Socioambientais.',
    link: 'https://drive.google.com/file/d/18KLABAMPlvdhuyk53H_qS9RRECY9v7Ye/view?usp=sharing'
  },
  'RIBEIRAO': {
    img: 'design/ribeirao.png',
    tipo: 'Artigo',
    ano: '2023',
    evento: 'XVII Colóquio Quapa Sel',
    resumo: 'Este artigo discute a configuração do Sistema de Espaços Livres (SEL) e possível estruturação de Corredor Ecológico na Sub-bacia do Córrego Ribeirão do Lipa em Cuiabá/MT.',
    link: 'https://drive.google.com/file/d/1zl1Ze0tweliKhVaRl3lejdSGwkE2Z0Kr/view?usp=sharing'
  }
  // adicionar outros objetos aqui seguindo o mesmo padrão
};


map.on('load', () => {
  // === CAMADAS PEDRA 90 ===
  map.addSource('pedra90', {type: 'geojson', data: 'data/PEDRA90.geojson'});
  map.addLayer({
    id: 'pedra90-layer',
    type: 'fill',
    source: 'pedra90',
    paint: {
      'fill-color': [
        'match', ['get', 'TIPO'], 'LNE', '#000000', 'SUB', '#ff7700', 'SEL',
        '#00ff23', 'APP', '#a47158', 'EST', '#e8718d', 'GNP', '#6053b7', 'ELNC',
        '#00660e', '#cccccc'
      ],
      'fill-opacity': 0.5
    }
  });
  map.addLayer({
    id: 'pedra90-outline',
    type: 'line',
    source: 'pedra90',
    paint: {'line-color': '#000', 'line-width': 0.8}
  });

  // === CAMADA PERIMETRO ===
  map.addSource('PERIMETRO', {type: 'geojson', data: 'data/PERIMETRO.geojson'});
  map.addLayer({
    id: 'PERIMETRO-outline',
    type: 'line',
    source: 'PERIMETRO',
    paint: { 'line-color': '#dbaeecff', 'line-width': 2, 'line-dasharray': [2, 2] }
  });

  // === CAMADAS RIBEIRAO ===
  map.addSource('RIBEIRAO', {type: 'geojson', data: 'data/RIBEIRAO.geojson'});
  map.addLayer({
    id: 'RIBEIRAO-hover-area',
    type: 'line',
    source: 'RIBEIRAO',
    paint: {
      'line-color': 'transparent',
      'line-width': 50,
      'line-translate': [0, -20],
      'line-translate-anchor': 'viewport'
    }
  });
  map.addLayer({
    id: 'RIBEIRAO-outline',
    type: 'line',
    source: 'RIBEIRAO',
    paint: {
      'line-color': '#37c0ffff',
      'line-width': 2,
      'line-translate': [0, -20],
      'line-translate-anchor': 'viewport'
    }
  });

  // === CAMADAS CONTORNO ===
  map.addSource('CONTORNO', {type: 'geojson', data: 'data/CONTORNO.geojson'});
  map.addLayer({
    id: 'CONTORNO-outline',
    type: 'line',
    source: 'CONTORNO',
    paint: {'line-color': '#ff7a7aff', 'line-width': 2}
  });
  map.addLayer({
    id: 'CONTORNO-hover-area',
    type: 'line',
    source: 'CONTORNO',
    paint: {'line-color': 'transparent', 'line-width': 50}
  });

  // ====================================================================
  // EVENTOS DO MAPA (dentro de map.on('load') - substitui registradores duplicados)
  // ====================================================================

  // --- Eventos do RIBEIRAO ---
  map.on('mouseenter', 'RIBEIRAO-hover-area', () => {
    map.setPaintProperty('RIBEIRAO-outline', 'line-translate', [0, -60]);
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'RIBEIRAO-hover-area', () => {
    map.setPaintProperty('RIBEIRAO-outline', 'line-translate', [0, -20]);
    map.getCanvas().style.cursor = '';
  });

  // --- Eventos do CONTORNO (área de captura já criada acima) ---
  map.on('mouseenter', 'CONTORNO-hover-area', () => {
    map.setPaintProperty('CONTORNO-outline', 'line-translate', [0, -10]);
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'CONTORNO-hover-area', () => {
    map.setPaintProperty('CONTORNO-outline', 'line-translate', [0, 0]);
    map.getCanvas().style.cursor = '';
  });

  // REGISTRAÇÃO ÚNICA E SEQUENCIAL DE CLIQUES (usa a função genérica)
  // evita múltiplos handlers chamando popups diferentes
  map.off && map.off('click', 'CONTORNO-outline');
  map.off && map.off('click', 'CONTORNO-hover-area');
  map.off && map.off('click', 'RIBEIRAO-outline');
  map.off && map.off('click', 'RIBEIRAO-hover-area');

  map.on('click', 'CONTORNO-outline', e => showGenericPopup('CONTORNO', e));
  map.on('click', 'CONTORNO-hover-area', e => showGenericPopup('CONTORNO', e));
  map.on('click', 'RIBEIRAO-outline', e => showGenericPopup('RIBEIRAO', e));
  map.on('click', 'RIBEIRAO-hover-area', e => showGenericPopup('RIBEIRAO', e));

  // ...existing code... (restante dos handlers da load)
});

// NOME DAS CATEGORIAS (escopo global)
const tipoLegenda = {
  'APP': 'Área de Proteção Ambiental',
  'ELNC': 'Espaço Livre Não Configurado',
  'EST': 'Estacionamento',
  'GNP': 'Gleba Não Parcelada',
  'LNE': 'Não Edificado',
  'SEL': 'Sistema de Espaço Livre',
  'SUB': 'Subutilizado'
};
const tipoKeys = Object.keys(tipoLegenda).sort();

// Função de montar filtros
function montarFiltros(container) {
  container.innerHTML = '';
  tipoKeys.forEach(k => {
    const id = `filtro-${k}`;
    const label = document.createElement('label');
    label.className = 'filtro-label';
    label.htmlFor = id;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.value = k;
    input.className = 'filtro';
    const span = document.createElement('span');
    span.textContent = ` ${tipoLegenda[k] || k}`;
    label.appendChild(input);
    label.appendChild(span);
    container.appendChild(label);
  });
}

// Aplica filtro no mapa
function aplicarFiltros() {
  const ativos =
      [...document.querySelectorAll('.filtro:checked')].map(c => c.value);
  const visibilidade = ativos.length === 0 ? 'none' : 'visible';
  map.setLayoutProperty('pedra90-layer', 'visibility', visibilidade);
  map.setLayoutProperty('pedra90-outline', 'visibility', visibilidade);
  if (ativos.length > 0) {
    const condicoes = ativos.map(valor => ['==', ['get', 'TIPO'], valor]);
    const meuFiltro = ['any', ...condicoes];
    map.setFilter('pedra90-layer', meuFiltro);
    map.setFilter('pedra90-outline', meuFiltro);
  }
}

// Função de zoom utilizada no HTML
function zoomMapa(center, zoom) {
  map.flyTo({center, zoom});
}


// --- INICIALIZAÇÃO DA INTERFACE (SIDEBAR, POPUPS, ETC.) ---
function initUI() {
  // ... (seu código de UI continua aqui, sem alterações)
}

// ... (o resto do seu código continua aqui)

// DOM ready — monta filtros, listeners de collapsible e popup (um único
// handler)
function initUI() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) setTimeout(() => sidebar.classList.add('visible'), 600);

  const sidebarEl = document.getElementById('sidebar');
  const mapEl = document.getElementById('map');

  function positionPopup(popupEl) {
    const sidebarRect = sidebarEl.getBoundingClientRect();
    const popupWidth = popupEl.getBoundingClientRect().width || 320;
    const left = Math.min(
        Math.round(sidebarRect.right),
        Math.max(8, window.innerWidth - popupWidth - 8));
    popupEl.style.left = `${left}px`;
  }

  function openPopup(title, popupEl) {
    positionPopup(popupEl);
    popupEl.classList.remove('hidden');
    requestAnimationFrame(() => popupEl.classList.add('open'));
    popupEl.setAttribute('aria-hidden', 'false');
    const header = popupEl.querySelector('.popup-header h2');
    if (header && title) header.textContent = title;

    // garante que os filtros "Vazios" sejam montados quando o popup PESQUISAS
    // abrir
    try {
      const vaziosContainer = popupEl.querySelector('#filtro-vazios-pesq');
      if (vaziosContainer && typeof montarFiltros === 'function' &&
          vaziosContainer.children.length === 0) {
        montarFiltros(vaziosContainer);
        // liga os checkboxes gerados para aplicar filtros ao mapa
        vaziosContainer.querySelectorAll('.filtro').forEach(cb => {
          cb.addEventListener('change', aplicarFiltros);
        });
      }
    } catch (e) {
      console.error('Erro ao montar filtros ao abrir popup:', e);
    }
  }

  function closePopup(popupEl) {
    popupEl.classList.remove('open');
    popupEl.setAttribute('aria-hidden', 'true');
    setTimeout(() => popupEl.classList.add('hidden'), 260);
  }

  // popup triggers (pesquisas / artigos) - use data-popup and optional
  // data-popup-title
  document.querySelectorAll('.popup-trigger').forEach(btn => {
    const popupSelector = btn.dataset.popup;
    if (!popupSelector) return;
    const popupEl = document.querySelector(popupSelector);
    if (!popupEl) return;
    const title = btn.dataset.popupTitle || btn.getAttribute('title') ||
        (btn.querySelector('.icon-label') &&
         btn.querySelector('.icon-label').textContent.trim()) ||
        '';

    btn.addEventListener('click', () => {
      // fechar qualquer popup aberto que não seja o alvo
      document.querySelectorAll('.popup-sidebar.open').forEach(openP => {
        if (openP !== popupEl) {
          closePopup(openP);
          // atualizar o trigger associado (se existir)
          const trigger = document.querySelector(
              `.popup-trigger[data-popup="#${openP.id}"]`);
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });

      // toggle do popup alvo
      if (popupEl.classList.contains('open')) {
        closePopup(popupEl);
        btn.setAttribute('aria-expanded', 'false');
      } else {
        openPopup(title, popupEl);
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // close buttons inside popups
  document.querySelectorAll('.popup-sidebar').forEach(popupEl => {
    const closeBtn = popupEl.querySelector('.popup-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closePopup(popupEl));
  });

  // monta filtros nos containers de cada popup (usa a função montarFiltros já
  // existente)
  const containerPesq = document.getElementById('filtro-vazios-pesq');
  if (typeof montarFiltros === 'function' && containerPesq) {
    try {
      montarFiltros(containerPesq);
    } catch (e) {
      console.error('montarFiltros falhou:', e);
    }
  }

  // Inicializa
}

// call initUI immediately if DOM already ready, otherwise wait for
// DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}

(function initCollapsiblesAndControls() {
  // garante execução mesmo se o script rodou após DOMReady
  function setup() {
    // inicializa targets escondidos
    document.querySelectorAll('.popup-collapsible').forEach(btn => {
      const sel = btn.getAttribute('data-target');
      if (!sel) return;
      const tgt = document.querySelector(sel);
      if (tgt && getComputedStyle(tgt).display !== 'none') {
        tgt.style.display = 'none';
      }
      btn.setAttribute('aria-expanded', 'false');
    });

    // handler do checkbox que controla camada RIBEIRAO (se existir o map e as
    // camadas)
    const cb = document.getElementById('toggle-ribeirao');
    if (cb) {
      cb.addEventListener('change', () => {
        try {
          const visible = cb.checked ? 'visible' : 'none';
          if (window.map && typeof map.setLayoutProperty === 'function') {
            if (map.getLayer && map.getLayer('RIBEIRAO-outline')) {
              map.setLayoutProperty('RIBEIRAO-outline', 'visibility', visible);
            }
            if (map.getLayer && map.getLayer('RIBEIRAO-hover-area')) {
              map.setLayoutProperty(
                  'RIBEIRAO-hover-area', 'visibility', visible);
            }
          }
        } catch (e) {
          console.warn('Erro ao alternar camada RIBEIRAO:', e);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

// Delegated handler para colapsíveis dentro dos popups (abre/fecha + monta
// filtros "Vazios")
(function() {
// evita dupla instalação
if (window.__epura_popup_collapsible_installed) return;
window.__epura_popup_collapsible_installed = true;

document.body.addEventListener('click', function(ev) {
  const btn = ev.target.closest('.popup-collapsible');
  if (!btn) return;

  const targetSel = btn.getAttribute('data-target');
  if (!targetSel) return;
  const target = document.querySelector(targetSel);
  if (!target) {
    console.warn('popup-collapsible target não encontrado:', targetSel);
    return;
  }

  // toggle aria + classe open no botão
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  btn.classList.toggle('open', !expanded);

  // animação simples com max-height para transição suave
  if (!expanded) {
    target.style.display = 'block';
    // força recálculo para garantir transição
    target.style.maxHeight = '0px';
    requestAnimationFrame(() => {
      target.style.maxHeight = (target.scrollHeight + 10) + 'px';
      target.classList.add('open');
    });
  } else {
    target.style.maxHeight = '0px';
    target.classList.remove('open');
    target.addEventListener('transitionend', function _h() {
      target.style.display = 'none';
      target.removeEventListener('transitionend', _h);
    });
  }

  // Se for o painel de "Vazios", monta os filtros caso ainda não existam
  if (targetSel === '#filtro-vazios-pesq') {
    try {
      if (typeof montarFiltros === 'function' && target.children.length === 0) {
        montarFiltros(target);
        // liga change em checkboxes para aplicar filtros
        target.querySelectorAll('.filtro').forEach(
            cb => cb.addEventListener('change', aplicarFiltros));
        // aplica estado inicial
        aplicarFiltros();
      }
    } catch (e) {
      console.error('Erro ao montar filtros (Vazios):', e);
    }
  }
});
})();

// centraliza criação do popup do CONTORNO (usa propriedades da feição quando
// disponíveis)
function showContornoPopup(e) {
  // remove popups previamente criados para evitar duplicação
  document
      .querySelectorAll(
          '.maplibregl-popup, .mapboxgl-popup, .contorno-popup, .ribeirao-popup')
      .forEach(el => el.remove());

  const coord = e.lngLat;

  // Valores fixos solicitados
  const tipo = 'Resumo Expandido';
  const ano = '2024';
  const evento = 'XVIII Colóquio Quapa Sel';
  const resumo =
      'Análise da Inserção Urbana do Contorno Leste - Relação entre Espaços Livres e Edificados e Conflitos Socioambientais.';
  const link =
      'https://drive.google.com/file/d/18KLABAMPlvdhuyk53H_qS9RRECY9v7Ye/view?usp=sharing';

  // id único para o colapsável dentro do popup (evita duplicidade de ids no
  // DOM)
  const uid = 'contorno-' + Date.now() + '-' + Math.floor(Math.random() * 9999);
  const targetId = `contorno-destaques-content-${uid}`;

  // CACHE BREAK v2.0.1 - Layout horizontal implementado 2025-09-12 02:04
  console.log('TESTE: showContornoPopup executado com novo layout!');
  const html = `
      <div class="contorno-popup-content" style="width:100%;max-width:250px;box-sizing:border-box;font-family:Arial, sans-serif;font-size:0.8rem;line-height:1.3;color:#222; overflow-wrap:break-word; word-wrap:break-word; hyphens:auto;">
        <div class="popup-horizontal-layout">
          <div class="popup-image-container">
            <img src="design/CONTORNO.png" alt="Contorno">
          </div>
          <div class="popup-text-container">

            <div class="popup-collapsible" role="button" aria-expanded="false" data-target="#${
      targetId}" style="font-weight:600;padding:.3rem 0;border-radius:4px;background:transparent;cursor:pointer;font-size:0.75rem;">
              <span>▼ Destaques</span>
            </div>

            <div id="${
      targetId}" class="popup-content" style="display:none;padding:0.3rem 0;">
              <div style="color:#222;font-size:0.7rem;line-height:1.2;word-wrap:break-word;overflow-wrap:break-word;hyphens:auto;">
                <strong>Tipo:</strong> ${tipo}<br>
                <strong>Ano:</strong> ${ano}<br>
                <strong>Evento:</strong> ${evento}
                <hr style="border:none;border-top:1px solid #eee;margin:4px 0">
                <strong>Resumo:</strong>
                <div style="margin-top:4px;font-size:0.65rem;line-height:1.2;word-wrap:break-word;overflow-wrap:break-word;hyphens:auto;">
                  ${resumo}
                </div>
                <div style="margin-top:6px;">
                  <a href="${
      link}" target="_blank" rel="noopener noreferrer" style="font-size:0.7rem;">Ver PDF</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  new maplibregl
      .Popup({
        offset: 12,
        closeButton: true,
        closeOnClick: true,
        className: 'contorno-popup'
      })
      .setLngLat(coord)
      .setHTML(html)
      .addTo(map);
}

// popup do RIBEIRAO com mesma formatação do CONTORNO
// ====================================================================
//  FUNÇÃO DO POPUP DO RIBEIRÃO (COM FORMATAÇÃO CORRIGIDA)
// ====================================================================
function showRibeiraoPopup(e) {
  // remove popups existentes para evitar duplicação
  document.querySelectorAll('.maplibregl-popup').forEach(el => el.remove());

  const coord = e.lngLat;
  const tipo = 'Artigo';
  const ano = '2023';
  const evento = 'XVII Colóquio Quapa Sel';
  const resumo = 'Este artigo discute a configuração do Sistema de Espaços Livres (SEL) e possível estruturação de Corredor Ecológico na Sub-bacia do Córrego Ribeirão do Lipa em Cuiabá/MT.';
  const link = 'https://drive.google.com/file/d/1zl1Ze0tweliKhVaRl3lejdSGwkE2Z0Kr/view?usp=sharing';

  const targetId = `ribeirao-destaques-content-${Date.now()}`;

  // Alterado: A estrutura do HTML agora é idêntica à do popup "Contorno"
  const html = `
    <div class="ribeirao-popup-content" style="width:100%; max-width:250px; box-sizing:border-box; font-family:Arial, sans-serif; font-size:0.8rem; line-height:1.3; color:#222; overflow-wrap:break-word; word-wrap:break-word; hyphens:auto;">
      <div class="popup-horizontal-layout">
        <div class="popup-image-container">
          <img src="design/ribeirao.png" alt="Ribeirão">
        </div>
        <div class="popup-text-container">

          <div class="popup-collapsible" role="button" aria-expanded="false" data-target="#${targetId}" style="font-weight:600; padding:.3rem 0; border-radius:4px; background:transparent; cursor:pointer; font-size:0.75rem;">
            <span>▼ Destaques</span>
          </div>

          <div id="${targetId}" class="popup-content" style="display:none; padding:0.3rem 0;">
            <div style="color:#222; font-size:0.7rem; line-height:1.2; word-wrap:break-word; overflow-wrap:break-word; hyphens:auto;">
              <strong>Tipo:</strong> ${tipo}<br>
              <strong>Ano:</strong> ${ano}<br>
              <strong>Evento:</strong> ${evento}
              <hr style="border:none; border-top:1px solid #eee; margin:4px 0">
              <strong>Resumo:</strong>
              <div style="margin-top:4px; font-size:0.65rem; line-height:1.2; word-wrap:break-word; overflow-wrap:break-word; hyphens:auto;">
                ${resumo}
              </div>
              <div style="margin-top:6px;">
                <a href="${link}" target="_blank" rel="noopener noreferrer" style="color:#007bff; text-decoration:none; font-size:0.7rem;">Ver PDF</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  new maplibregl.Popup({
      offset: 12,
      closeButton: true,
      closeOnClick: true,
      className: 'ribeirao-popup'
    })
    .setLngLat(coord)
    .setHTML(html)
    .addTo(map);
}

// ====================================================================
// FUNÇÃO GENÉRICA PARA CRIAR POPUP
// ====================================================================
function showGenericPopup(layerId, e) {
  // Fecha popups abertos
  document.querySelectorAll('.maplibregl-popup, .mapboxgl-popup').forEach(el => el.remove());

  const coord = e.lngLat;
  const meta = popupMetadata[layerId];
  if (!meta) {
    console.warn('Nenhum popup configurado para:', layerId);
    return;
  }

  const uid = `${layerId}-${Date.now()}-${Math.floor(Math.random()*9999)}`;
  const targetId = `popup-${uid}`;

  const html = `
    <div class="popup-generic-content" style="width:100%; max-width:250px; box-sizing:border-box; font-family:Arial, sans-serif; font-size:0.8rem; line-height:1.3; color:#222; overflow-wrap:break-word; word-wrap:break-word; hyphens:auto;">
      ${meta.img ? `
      <div style="text-align:center; margin-bottom:10px;">
        <img src="${meta.img}" alt="${layerId}" style="max-width:100px; width:100%; height:auto; display:block; margin:0 auto; border-radius:4px;">
      </div>` : ''}
      <div class="popup-collapsible" role="button" aria-expanded="false" data-target="#${targetId}" style="font-weight:600; padding:.4rem .25rem; border-radius:6px; background:transparent; cursor:pointer;">
        <span>Destaques</span>
      </div>

      <div id="${targetId}" class="popup-content" style="display:none; padding:0.5rem 0.25rem;">
        <div style="padding:0 .25rem; font-size:0.9rem; line-height:1.25; color:#222; overflow-wrap:anywhere; word-break:break-word;">
          ${meta.tipo ? `<strong>Tipo de produção:</strong> ${meta.tipo}<br>` : ''}
          ${meta.ano ? `<strong>Ano:</strong> ${meta.ano}<br>` : ''}
          ${meta.evento ? `<strong>Evento:</strong> ${meta.evento}<br>` : ''}
          <hr style="border:none; border-top:1px solid #eee; margin:8px 0">
          ${meta.resumo ? `<strong>Resumo:</strong><div style="margin-top:6px; white-space:pre-line; overflow-wrap:anywhere; word-break:break-word;">${meta.resumo}</div>` : ''}
          ${meta.link ? `<div style="margin-top:12px;"><a href="${meta.link}" target="_blank" rel="noopener noreferrer" style="color:#007bff; text-decoration:none;">Ver completo (PDF)</a></div>` : ''}
        </div>
      </div>
    </div>
  `;

  new maplibregl.Popup({
      offset: 12,
      closeButton: true,
      closeOnClick: true,
      className: `${layerId.toLowerCase()}-popup`
    })
    .setLngLat(coord)
    .setHTML(html)
    .addTo(map);
}

// ====================================================================
// FUNÇÕES DE POPUP: As funções showContornoPopup e showRibeiraoPopup
// já estão definidas acima com layout horizontal customizado
// ====================================================================

// ====================================================================
// REMOVIDO: bloco genérico de registro que estava fora do map.on('load')
// (evitava que os handlers genéricos fossem registrados duas vezes).
// Se você tinha este bloco, comente/remova-o. Abaixo é um comentário
// para lembrar onde estava.
// ====================================================================
/*
if (map && typeof map.on === 'function') {
  // ... antigo registro genérico removido ...
}
*/

// ...existing code...
