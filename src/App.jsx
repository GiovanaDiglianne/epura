// src/App.jsx
import React, { useState } from 'react';
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MapContainer from './components/MapContainer/MapContainer'

// Trazemos as 'tipoKeys' para cá, pois elas definem o estado inicial
const tipoLegenda = {
  "APP": "Área de Proteção Ambiental", "ELNC": "Espaço Livre Não Configurado",
  "EST": "Estacionamento", "GNP": "Gleba Não Parcelada", "LNE": "Não Edificado",
  "SEL": "Sistema de Espaço Livre", "SUB": "Subutilizado"
};
const tipoKeys = Object.keys(tipoLegenda).sort();

function App() {
  // ELEVAMOS O ESTADO!
  // 'filtrosAtivos' vai guardar o array de filtros marcados (ex: ['APP', 'LNE'])
  const [filtrosAtivos, setFiltrosAtivos] = useState(tipoKeys); // Começa com tudo marcado

  return (
    <div className="app-container">
      {/* PASSAMOS O ESTADO E A FUNÇÃO PARA A SIDEBAR */}
      <Sidebar 
        filtrosAtivos={filtrosAtivos}
        setFiltrosAtivos={setFiltrosAtivos}
        tipoLegenda={tipoLegenda}
        tipoKeys={tipoKeys}
      />
      
      {/* PASSAMOS O ESTADO PARA O MAPA */}
      <MapContainer 
        filtrosAtivos={filtrosAtivos} 
      />
    </div>
  )
}

export default App