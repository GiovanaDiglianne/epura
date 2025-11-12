import React, { useState } from 'react'; // React: Ajuda o React a compreender JSX | {useState}: permite que o componente (tenha memória) gerencie estado.
import './App.css'// Importa o arquivo CSS para estilizar o componente App.
import Sidebar from './components/Sidebar/Sidebar' // Importa o componente filho Sidebar.
import MapContainer from './components/MapContainer/MapContainer' // Importa o componente filho MapContainer.

// Define o tipoLegenda e o tipoKeys fora do componente App para evitar recriação desnecessária em cada renderização.
const tipoLegenda = {
  // Chave : Descrição.
  "APP": "Área de Proteção Ambiental", 
  "ELNC": "Espaço Livre Não Configurado",
  "EST": "Estacionamento", 
  "GNP": "Gleba Não Parcelada", 
  "LNE": "Não Edificado",
  "SEL": "Sistema de Espaço Livre", 
  "SUB": "Subutilizado"
};
const tipoKeys = Object.keys(tipoLegenda); // Cria um array com as chaves do objeto tipoLegenda.

// Definição do componente principal da aplicação.
function App() {
  const [filtrosAtivos, setFiltrosAtivos] = useState(tipoKeys); // Estado para gerenciar os filtros ativos.
  // Array de filtrosAtivos e função para atualizá-los, iniciando com todos os tipos ativos.
  // Passamos tipoKeys para que todos os filtros estejam ativos inicialmente.
  const [infoLote, setInfoLote] = useState('Clique em um lote para ver detalhes'); 
  const [zoomMapa, setZoomMapa] = useState(null);

  return (
    // Tudo oque o componente App renderiza dentro da div id='root'.
    <div className="app-container">
      {/* Todas as props que o componente pai passa para o filho */}
      <Sidebar 
        filtrosAtivos={filtrosAtivos}
        setFiltrosAtivos={setFiltrosAtivos}
        tipoLegenda={tipoLegenda}
        tipoKeys={tipoKeys}
        infoLote={infoLote}
        zoomMapa={zoomMapa}
      /> 
      <MapContainer 
        filtrosAtivos={filtrosAtivos}
        setInfoLote={setInfoLote}
        setZoomMapa={setZoomMapa}
      />
    </div>
  )
}

export default App