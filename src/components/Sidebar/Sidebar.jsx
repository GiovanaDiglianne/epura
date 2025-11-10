import React, { useState } from 'react'; // 1. IMPORTAMOS O useState
import './Sidebar.css';

// 2. COPIAMOS AS CONSTANTES DO SEU 'scripts.js' (TAMBÉM ESTÃO NO MAPCONTAINER)
// Precisamos delas aqui para gerar os filtros
const tipoLegenda = {
  "APP": "Área de Proteção Ambiental",
  "ELNC": "Espaço Livre Não Configurado",
  "EST": "Estacionamento",
  "GNP": "Gleba Não Parcelada",
  "LNE": "Não Edificado",
  "SEL": "Sistema de Espaço Livre",
  "SUB": "Subutilizado"
};
const tipoKeys = Object.keys(tipoLegenda).sort();

function Sidebar() {
  
  // 3. NOSSO PRIMEIRO "ESTADO"
  // [variável, funçãoParaMudar] = useState(valorInicial)
  // 'isFiltroOpen' vai guardar se o menu está aberto (true) ou fechado (false)
  const [isFiltroOpen, setIsFiltroOpen] = useState(false); // Começa fechado

  return (
    <div className="sidebar-container">
      <h3>Filtros</h3>

      {/* 4. ADICIONAMOS O onClick AQUI */}
      <div 
        className="collapsible"
        onClick={() => setIsFiltroOpen(!isFiltroOpen)} // Ao clicar, inverte o estado
      >
        Tipos de Lote
      </div>

      {/* 5. AQUI ESTÁ A "MÁGICA"
          Usamos uma "classe condicional". 
          Se 'isFiltroOpen' for true, o div terá a classe 'content open'
          Se for false, terá a classe 'content'
      */}
      <div className={`content ${isFiltroOpen ? 'open' : ''}`} >
        <div id="filtro-container">
          
          {/* 6. GERANDO OS FILTROS COM JAVASCRIPT (JEITO REACT)
              Usamos .map() para transformar o array 'tipoKeys' em HTML (JSX)
              Isso substitui seu 'document.createElement'
          */}
          {tipoKeys.map((key) => (
            <label key={key}>
              <input 
                type="checkbox" 
                className="filtro" 
                value={key} 
                defaultChecked // 'defaultChecked' significa "comece marcado"
              />
              {tipoLegenda[key]}
            </label>
          ))}

        </div>
      </div>

      <h3 id="zoom">Zoom</h3>
      <button onclick="zoomMapa([-56.1,-15.6],12)">
        Cuiabá
      </button>
      <button onclick="zoomMapa([-55.95,-15.64],15)">
        Pedra 90
      </button>
      <button onclick="zoomMapa([-56.059, -15.626],15)">
        Coxipó
      </button>

      <div id="info">
        Clique em um lote para ver detalhes
      </div>
    </div>
  );
}

export default Sidebar;