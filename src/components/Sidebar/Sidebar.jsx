// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';

// 1. Recebemos 'props' do App.jsx (filtrosAtivos, setFiltrosAtivos, etc.)
function Sidebar({ filtrosAtivos, setFiltrosAtivos, tipoLegenda, tipoKeys }) {
  
  const [isFiltroOpen, setIsFiltroOpen] = useState(false); // Estado local (só a sidebar usa)

  // 2. Esta é a função que muda o estado "Pai" (no App.jsx)
  const handleFiltroChange = (e) => {
    const filtro = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setFiltrosAtivos( (filtrosAnteriores) => [...filtrosAnteriores, filtro] );
    } else {
      setFiltrosAtivos( (filtrosAnteriores) => 
        filtrosAnteriores.filter(f => f !== filtro) 
      );
    }
  };

  return (
    <div className="sidebar-container">
      <h3>Filtros</h3>
      <div 
        className="collapsible"
        onClick={() => setIsFiltroOpen(!isFiltroOpen)} // onClick com {função} (correto)
      >
        Tipos de Lote
      </div>

      <div className={`content ${isFiltroOpen ? 'open' : ''}`} >
        <div id="filtro-container">
          
          {tipoKeys.map((key) => (
            <label key={key}>
              <input 
                type="checkbox" 
                className="filtro" 
                value={key}
                // 3. MUDAMOS DE 'defaultChecked' PARA 'checked'
                checked={filtrosAtivos.includes(key)}
                // 4. ADICIONAMOS O 'onChange'
                onChange={handleFiltroChange}
              />
              {tipoLegenda[key]}
            </label>
          ))}

        </div>
      </div>
      
      <h3 id="zoom">Zoom</h3>
      {/* 5. CORRIGIDO! 
          Eu comentei a função por enquanto, pois 'zoomMapa' não existe.
          O importante é que não é mais uma "string" 
      */}
      <button /* onClick={() => zoomMapa([-56.1,-15.6],12)} */>
        Cuiabá
      </button>
      <button /* onClick={() => zoomMapa([-55.95,-15.64],15)} */>
        Pedra 90
      </button>
      <button /* onClick={() => zoomMapa([-56.059, -15.626],15)} */>
        Coxipó
      </button>

      <div id="info">
        Clique em um lote para ver detalhes
      </div>
    </div>
  );
}

export default Sidebar;