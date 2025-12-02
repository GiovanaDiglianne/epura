// react: lógica, componentes, estados | react-dom: pega a lógica do react e "desenha" na tela.
import { StrictMode } from 'react' // Ferramenta de desenvolvimento auxilia na identificação de problemas.
import { createRoot } from 'react-dom/client' // Ferramenta para renderizar a aplicação React na DOM(página web).
import './index.css' // Importa o arquivo CSS global para estilizar a aplicação.
import App from './App.jsx' // Importa o componente principal da aplicação.

// Cria a raiz da aplicação React e renderiza o componente App dentro do elemento com id 'root' na página HTML.
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    {/* Desenha o componente App com o Strict Mode para auxiliar na depuração */}
    <App />
  </StrictMode>,
)
