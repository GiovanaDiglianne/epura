import React, { useState } from 'react';
import { FaSearch, FaFolderOpen } from 'react-icons/fa';
import './Sidebar.css'; 
import logoSrc from '../../assets/logo.png';

function Sidebar({ 
  infoLote,
  zoomMapa, 
  setIsPesquisaOpen, 
  isPesquisaOpen,
  setIsProducoesOpen,
  isProducoesOpen,
  activeZoneId,
  setActiveZoneId,
  openMunicipality,
  setOpenMunicipality
}) {

  const handleMunicipalityZoom = (id, center, zoom) => {
    if (zoomMapa) zoomMapa(center, zoom);
    setActiveZoneId(id);
  };

  const handleMunicipalityToggle = (e, id) => {
    e.stopPropagation();

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
          src={logoSrc}
          alt="Logo do Projeto" 
        />
      </div>
      <h3 id="titulo">ÉPURA</h3>
      <button 
        className={`sidebar-btn ${isPesquisaOpen ? 'active' : ''}`}
        onClick={setIsPesquisaOpen}>
        <FaSearch size={20} />
        <span>  Pesquisas</span>
      </button>

      <button 
        className={`sidebar-btn ${isProducoesOpen ? 'active' : ''}`}
        onClick={setIsProducoesOpen}>
        <FaFolderOpen size={20} />
        <span>  Produções</span>
      </button>

      <h3 id="zoom">Municípios</h3>
      <div className={`municipality-btn-wrapper ${isCuiabaActive ? 'active' : ''}`}>
        
        <div 
          className="municipality-name"
          onClick={() => handleMunicipalityZoom('cuiaba', [-56.1,-15.6], 12)}>
          Cuiabá
        </div>

        <div 
          className="municipality-arrow"
          onClick={(e) => handleMunicipalityToggle(e, 'cuiaba')}>
          {openMunicipality === 'cuiaba' ? '▲' : '▼'}
        </div>

      </div>

      {openMunicipality === 'cuiaba' && (
        <div className="content open"> 
          <button 
            className={activeZoneId === 'pedra90' ? 'active' : ''}
            onClick={() => handleZoneClick('pedra90', [-55.95,-15.64], 15)}>
            Pedra 90
          </button>
          <button 
            className={activeZoneId === 'coxipo' ? 'active' : ''}
            onClick={() => handleZoneClick('coxipo', [-56.059, -15.626], 15)}>
            Coxipó
          </button>
        </div>
      )}

      <div className="info-icon-wrapper">
        <div className="info-icon">i</div>
      
        <div className="info-tooltip">
          Clique em um lote para ver detalhes na caixa lateral.<br/><br/>
          Clique com o botão direito do mouse e arraste no mapa para mudar a visualização.<br/><br/>
          Clique com o botão esquerdo do mouse e arraste para navegar pelo mapa.<br/><br/>
          Use a roda do mouse para dar zoom in e zoom out no mapa.
        </div>
      </div>
    </div>
  );
}

export default Sidebar;