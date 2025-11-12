import React, { useState } from 'react'; // React: Ajuda o React a compreender JSX | {useState}: permite que o componente (tenha memória) gerencie estado.
import './Sidebar.css'; // Importa o arquivo CSS para estilizar o componente Sidebar.

// Definição do componente Sidebar que recebe várias props do componente pai App.
function Sidebar({ filtrosAtivos, setFiltrosAtivos, tipoLegenda, tipoKeys, infoLote, zoomMapa }) {

  // Estado para controlar se a seção de filtros está aberta ou fechada.
  const [isFiltroOpen, setIsFiltroOpen] = useState(false); 

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
      <div className="collapsible" onClick={() => setIsFiltroOpen(!isFiltroOpen)}>
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
                checked={filtrosAtivos.includes(key)}
                onChange={handleFiltroChange}
              />
              {tipoLegenda[key]}
            </label>
          ))}

        </div>
      </div>
      
      <h3 id="zoom">Zoom</h3>
      <button  onClick={() => zoomMapa ? zoomMapa([-56.1,-15.6],12): null}>
        Cuiabá
      </button>
      <button onClick={() => zoomMapa ? zoomMapa([-55.95,-15.64],15): null}>
        Pedra 90
      </button>
      <button onClick={() => zoomMapa ? zoomMapa([-56.059, -15.626],15): null}>
        Coxipó
      </button>

      <div id="info" dangerouslySetInnerHTML={{ __html: infoLote }}/>
    </div>
  );
}

export default Sidebar;