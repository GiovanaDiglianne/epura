import React, { useState } from 'react'; 
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import MapContainer from './components/MapContainer/MapContainer'
import PesquisaSidebar from './components/PesquisaSidebar/PesquisaSidebar'
import ProducoesSidebar from './components/ProducoesSidebar/ProducoesSidebar'
import InfoPopup from './components/InfoPopup/InfoPopup'

const tipoLegenda = {
  "APP": "Área de Proteção Ambiental", 
  "ELNC": "Espaço Livre Não Configurado",
  "EST": "Estacionamento", 
  "GNP": "Gleba Não Parcelada", 
  "LNE": "Não Edificado",
  "SEL": "Sistema de Espaço Livre", 
  "SUB": "Subutilizado"
};
const tipoKeys = Object.keys(tipoLegenda); 

function App() {
  const [filtrosAtivos, setFiltrosAtivos] = useState(tipoKeys); 
  const [zoomMapa, setZoomMapa] = useState(null);

  const [isPesquisaOpen, setIsPesquisaOpen] = useState(false);
  const [isProducoesOpen, setIsProducoesOpen] = useState(false);

  const [showRibeirao, setShowRibeirao] = useState(true);

  const [activeZoneId, setActiveZoneId] = useState('cuiaba'); 
  const [openMunicipality, setOpenMunicipality] = useState('cuiaba');
  const [infoLote, setInfoLote] = useState(null); 
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  const togglePesquisa = () => {
    setIsPesquisaOpen(!isPesquisaOpen);
    if (!isPesquisaOpen) setIsProducoesOpen(false);
  }

  const toggleProducoes = () => {
    setIsProducoesOpen(!isProducoesOpen);
    if (!isProducoesOpen) setIsPesquisaOpen(false);
  }

  const isSidebarExpanded = isPesquisaOpen || isProducoesOpen;

  return (
    <div className={`app-container ${isSidebarExpanded ? 'pesquisa-open' : ''}`}>

      <Sidebar 
        infoLote={infoLote}
        zoomMapa={zoomMapa}
        setIsPesquisaOpen={togglePesquisa}
        isPesquisaOpen={isPesquisaOpen}
        setIsProducoesOpen={toggleProducoes}
        isProducoesOpen={isProducoesOpen}
        activeZoneId={activeZoneId}
        setActiveZoneId={setActiveZoneId}
        openMunicipality={openMunicipality}
        setOpenMunicipality={setOpenMunicipality}
      /> 

      {isPesquisaOpen && (
        <PesquisaSidebar 
          filtrosAtivos={filtrosAtivos}
          setFiltrosAtivos={setFiltrosAtivos}
          tipoLegenda={tipoLegenda}
          tipoKeys={tipoKeys}
        />
      )}

      {isProducoesOpen && (
        <ProducoesSidebar 
          showRibeirao={showRibeirao}
          setShowRibeirao={setShowRibeirao}
        />
      )}

      <MapContainer 
        filtrosAtivos={filtrosAtivos}
        setInfoLote={setInfoLote}
        setZoomMapa={setZoomMapa}
        setShowInitialMessage={setShowInitialMessage}
        showRibeirao={showRibeirao}
      />

      {infoLote && (
        <InfoPopup 
          info={infoLote} 
          tipoLegenda={tipoLegenda}
          onClose={() => setInfoLote(null)}
        />
      )}
      
    </div>
  )
}

export default App