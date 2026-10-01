import "./style.css"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from './paginas/login';
import Dashboard from './paginas/Dashboard';
// import Clientes from './paginas/Clientes';
import Produtos from './paginas/Produtos';
import Clientes from "./paginas/Clientes";
import Pedidos from "./paginas/Pedidos";
// import Pedidos from './paginas/Pedidos';
// import Layout from './components/layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Login />} />

        <Route
          path="/login" 
          element={<Login/>}
        
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />

        <Route
          path="/clientes"
          element={<Clientes />}
        />

        <Route
          path="/pedidos"
          element={<Pedidos />}
        />
      </Routes>
    </BrowserRouter>
  )
}


export default App
