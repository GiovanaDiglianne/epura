import React, { useState } from 'react'; // React: Ajuda o React a compreender JSX | {useState}: permite que o componente (tenha memória) gerencie estado.
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MapContainer from './components/MapContainer/MapContainer'
import PesquisaSidebar from './components/PesquisaSidebar/PesquisaSidebar'
import InfoPopup from './components/InfoPopup/InfoPopup'

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
  const [zoomMapa, setZoomMapa] = useState(null);
  const [isPesquisaOpen, setIsPesquisaOpen] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState('cuiaba'); 
  const [openMunicipality, setOpenMunicipality] = useState('cuiaba');
  const [infoLote, setInfoLote] = useState(null); 
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  return (
    // Tudo oque o componente App renderiza dentro da div id='root'.
    <div className={`app-container ${isPesquisaOpen ? 'pesquisa-open' : ''}`}>
      {/* Todas as props que o componente pai passa para o filho */}
      <Sidebar 
        infoLote={infoLote}
        zoomMapa={zoomMapa}
        setIsPesquisaOpen={setIsPesquisaOpen}
        isPesquisaOpen={isPesquisaOpen}
        activeZoneId={activeZoneId}
        setActiveZoneId={setActiveZoneId}
        openMunicipality={openMunicipality}
        setOpenMunicipality={setOpenMunicipality}
        showInitialMessage={showInitialMessage}
      /> 

      {isPesquisaOpen && (
        <PesquisaSidebar 
          filtrosAtivos={filtrosAtivos}
          setFiltrosAtivos={setFiltrosAtivos}
          tipoLegenda={tipoLegenda}
          tipoKeys={tipoKeys}
        />
      )}

      <MapContainer 
        filtrosAtivos={filtrosAtivos}
        setInfoLote={setInfoLote}
        setZoomMapa={setZoomMapa}
        setShowInitialMessage={setShowInitialMessage}
      />

      {infoLote && (
        <InfoPopup 
          info={infoLote} 
          tipoLegenda={tipoLegenda}
          onClose={() => setInfoLote(null)} // O "X" limpa o estado (Request 3)
        />
      )}
    </div>
  )
}

export default App