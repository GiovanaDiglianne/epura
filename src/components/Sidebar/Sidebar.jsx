import React, { useState } from 'react'; // React: Ajuda o React a compreender JSX | {useState}: permite que o componente (tenha memória) gerencie estado.
import './Sidebar.css'; // Importa o arquivo CSS para estilizar o componente Sidebar.

// Definição do componente Sidebar que recebe várias props do componente pai App.
function Sidebar({ 
  zoomMapa, 
  setIsPesquisaOpen, 
  isPesquisaOpen, 
  activeZoneId,
  setActiveZoneId,
  openMunicipality,
  setOpenMunicipality
}) {

  // 1. FUNÇÃO DE ZOOM (Clica no TEXTO "Cuiabá")
  const handleMunicipalityZoom = (id, center, zoom) => {
    if (zoomMapa) zoomMapa(center, zoom);
    setActiveZoneId(id);
    // Opcional: Se você quiser que ao clicar no texto TAMBÉM abra a lista, descomente abaixo:
    // setOpenMunicipality(id); 
  };

  // 2. FUNÇÃO DE TOGGLE (Clica na SETA)
  const handleMunicipalityToggle = (e, id) => {
    e.stopPropagation(); // <--- O SEGREDO: Impede que o clique na seta ative o zoom
    
    // Se já está aberto, fecha (null). Se não, abre (id).
    if (openMunicipality === id) {
      setOpenMunicipality(null);
    } else {
      setOpenMunicipality(id);
    }
  };

  const handleZoneClick = (id, center, zoom) => {
    if (zoomMapa){
      zoomMapa(center, zoom);
    }
    setActiveZoneId(id);
  };

  const isCuiabaActive = ['cuiaba', 'pedra90', 'coxipo'].includes(activeZoneId);

  return (
    <div className="sidebar-container">
      <div 
        className="sidebar-logo" 
        onClick={() => window.location.reload()}
        title="Recarregar página">
        <img 
          src="https://placehold.co/200x80/490108/FFF?text=LOGOTIPO" 
          alt="Logo do Projeto"/>
      </div>
      <button 
        className={`pesquisa-title ${isPesquisaOpen ? 'active' : ''}`} 
        onClick={() => setIsPesquisaOpen(prev => !prev)} 
      >
        Pesquisas
      </button>

      <h3 id="zoom">Municípios</h3>
      <div className={`municipality-btn-wrapper ${isCuiabaActive ? 'active' : ''}`}>
        
        {/* LADO ESQUERDO: Texto (Zoom) */}
        <div 
          className="municipality-name"
          onClick={() => handleMunicipalityZoom('cuiaba', [-56.1,-15.6], 12)}
        >
          Cuiabá
        </div>

        {/* LADO DIREITO: Seta (Abrir/Fechar) */}
        <div 
          className="municipality-arrow"
          onClick={(e) => handleMunicipalityToggle(e, 'cuiaba')}
        >
          {/* Se estiver aberto mostra ^, senão v */}
          {openMunicipality === 'cuiaba' ? '▲' : '▼'}
        </div>

      </div>

      {/* --- ZONAS ESPECÍFICAS (FILHOS) --- */}
      {openMunicipality === 'cuiaba' && (
        <div className="content open"> 
          <button 
            className={activeZoneId === 'pedra90' ? 'active' : ''}
            onClick={() => handleZoneClick('pedra90', [-55.95,-15.64], 15)}
          >
            Pedra 90
          </button>
          <button 
            className={activeZoneId === 'coxipo' ? 'active' : ''}
            onClick={() => handleZoneClick('coxipo', [-56.059, -15.626], 15)}
          >
            Coxipó
          </button>
        </div>
      )}

      <div className="info-icon-wrapper">
        <div className="info-icon">i</div>
      
        <div className="info-tooltip">
          Clique em um lote para ver detalhes na caixa lateral.
        </div>
      </div>
    </div>
  );
}

export default Sidebar;