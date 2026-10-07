import "./style.css"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from './paginas/login';
import Dashboard from './paginas/Dashboard';
import Produtos from './paginas/Produtos';
import Clientes from "./paginas/Clientes";
import Pedidos from "./paginas/Pedidos";
import { useEffect, useState } from "react";
import { getSessaoValidaDeHoje } from "./auth"



function App() {

  const [sessao, setSessao] = useState(undefined);

  useEffect(() => {
    async function checarSessao() {
      const sessaoValida = await getSessaoValidaDeHoje();
      setSessao(sessaoValida);
    }

    checarSessao();
  }, []);

  if (sessao === undefined) {
    return <p>Carregando...</p>;
  }

  if (!sessao) {
    return <Login onLoginSucesso={(novaSessao) => setSessao(novaSessao)} />;
  }

  


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
          element={<Dashboard sessao={sessao} onLogout={() => setSessao(null)}/>}
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
