import React, { useState } from 'react';
import './PesquisaSidebar.css';

function PesquisaSidebar({ filtrosAtivos, setFiltrosAtivos, tipoLegenda, tipoKeys }) {

  const [isFiltroOpen, setIsFiltroOpen] = useState(true);

  const handleFiltroChange = (e) => {
    const filtro = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setFiltrosAtivos((prev) => [...prev, filtro]);
    } else {
      setFiltrosAtivos((prev) => prev.filter(f => f !== filtro));
    }
  };

  return (
    <div className="second-sidebar-container">
        <h3>Eixos Temáticos</h3>
        <div 
        className={`collapsible ${isFiltroOpen ? 'active' : ''}`}
        onClick={() => setIsFiltroOpen(!isFiltroOpen)}>
            Vazios Urbanos
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
                    onChange={handleFiltroChange}/>
                {tipoLegenda[key]}
                </label>
            ))}
            </div>
        </div>
        </div>
  );
}
export default PesquisaSidebar;