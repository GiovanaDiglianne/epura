import React, { useState } from 'react';
import './ProducoesSidebar.css';

const ProducoesSidebar = ({ showRibeirao, setShowRibeirao }) => {
    // Estado local para controlar se a aba está aberta
    const [isOpen, setIsOpen] = useState(true);
    return (
    <div className="second-sidebar-container">
        <h3>Regiões Metropolitanas</h3>

        {/* Botão Acordeão */}
        <div 
            className={`collapsible ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
        >
            Vale do Rio Cuiabá
        </div>

        {/* Conteúdo Expansível */}
        <div className={`content ${isOpen ? 'open' : ''}`}>
            <div className="opcoes-lista">
                
                <div className="opcao-item destaque-section">
                    <strong>Destaques</strong>
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={showRibeirao} 
                            onChange={() => setShowRibeirao(!showRibeirao)} 
                        />
                        Corredor Ecológico - Ribeirão do Lipa
                    </label>
                </div>

                <div className="opcao-item">
                    <strong>Artigos</strong>
                </div>

                <div className="opcao-item">
                    <strong>TFGS</strong>
                </div>

                <div className="opcao-item">
                    <strong>Mestrados/Doutorados</strong>
                </div>

            </div>
        </div>
    </div>
    );
};

export default ProducoesSidebar;