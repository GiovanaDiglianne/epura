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
  setOpenMunicipality,
  showInitialMessage
}) {

  const handleMunicipalityClick = (id, center, zoom) => {
    if (zoomMapa) {
      zoomMapa(center, zoom);
    }   
    setActiveZoneId(id);
    setOpenMunicipality(id);
  };

  const handleZoneClick = (id, center, zoom) => {
    if (zoomMapa){
      zoomMapa(center, zoom);
    }
    setActiveZoneId(id);
  };

  return (
    <div className="sidebar-container">
      <button 
        className={`pesquisa-title ${isPesquisaOpen ? 'active' : ''}`} 
        onClick={() => setIsPesquisaOpen(prev => !prev)} 
      >
        Pesquisas
      </button>

      <h3 id="zoom">Municípios</h3>
      <button 
        className={openMunicipality === 'cuiaba' ? 'active' : ''}
        onClick={() => handleMunicipalityClick('cuiaba', [-56.1,-15.6], 12)}
      >
        Cuiabá
      </button>

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

      {showInitialMessage && (
        <div id="info">
          Clique em um lote para ver detalhes
        </div>
      )}
    </div>
  );
}

export default Sidebar;