import React from 'react';
import './InfoPopup.css'; // Vamos criar este CSS

function InfoPopup({ info, onClose, tipoLegenda }) {

  const { TIPO, inscricao, AREA } = info;

  return (
    <div className="info-popup-container">
      <button className="info-popup-close" onClick={onClose}>
        &times; 
      </button>

      <h3>Detalhes do Lote</h3>
      {TIPO && (
        <p><b>Tipo:</b><br/> {tipoLegenda[TIPO] || TIPO}</p>
      )}
      {inscricao && (
        <p><b>Inscrição:</b><br/> {inscricao}</p>
      )}
      {AREA && (
        <p><b>Área:</b><br/> {AREA} m²</p>
      )}
    </div>
  );
}

export default InfoPopup;