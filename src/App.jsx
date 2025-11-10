import './App.css'

import Sidebar from './components/Sidebar/Sidebar'
import MapContainer from './components/MapContainer/MapContainer'

function App() {
  return (
    <div className="app-container">

      <Sidebar />
      <MapContainer />
    </div>
  )
}

export default App