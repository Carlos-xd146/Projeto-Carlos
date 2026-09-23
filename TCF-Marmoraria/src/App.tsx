import "./style.css"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from './paginas/login';
import Dashboard from './paginas/Dashboard';
// import Clientes from './paginas/Clientes';
import Produtos from './paginas/Produtos';
// import Pedidos from './paginas/Pedidos';
// import Layout from './components/layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Dashboard />} />

        <Route
          path="/login" element={<Login/>}
        
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />
      </Routes>
    </BrowserRouter>
  )
}


export default App
