import React, { useState } from 'react'; // React: Ajuda o React a compreender JSX | {useState}: permite que o componente (tenha memória) gerencie estado.
import './Sidebar.css'; // Importa o arquivo CSS para estilizar o componente Sidebar.

// Definição do componente Sidebar que recebe várias props do componente pai App.
function Sidebar({ infoLote, zoomMapa, setIsPesquisaOpen, isPesquisaOpen }) {

  return (
    <div className="sidebar-container">
      <h3 
        className={`pesquisa-title ${isPesquisaOpen ? 'active' : ''}`} 
        onClick={() => setIsPesquisaOpen(prev => !prev)} 
      >
        Pesquisas
      </h3>

      <h3 id="zoom">Zoom</h3>
      <button onClick={() => zoomMapa ? zoomMapa([-56.1,-15.6], 12) : null}>
        Cuiabá
      </button>
      <button onClick={() => zoomMapa ? zoomMapa([-55.95,-15.64], 15) : null}>
        Pedra 90
      </button>
      <button onClick={() => zoomMapa ? zoomMapa([-56.059, -15.626], 15) : null}>
        Coxipó
      </button>

      <div id="info" dangerouslySetInnerHTML={{ __html: infoLote }}/>
    </div>
  );
}

export default Sidebar;