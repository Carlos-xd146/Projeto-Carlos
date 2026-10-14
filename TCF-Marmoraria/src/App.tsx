import "./style.css"
import {
  
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import type { Sessao } from "./auth";

import Login from './paginas/login';
import Dashboard from './paginas/Dashboard';
import Produtos from './paginas/Produtos';
import Clientes from "./paginas/Clientes";
import Pedidos from "./paginas/Pedidos";
import { useEffect, useState } from "react";
import { getSessaoValidaDeHoje } from "./auth"



function App() {

  const [sessao, setSessao] = useState<Sessao | null | undefined>(undefined);

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

  if (sessao === null) {
    return <Login onLoginSucesso={(novaSessao) => setSessao(novaSessao)} />;
  }


  // if (!sessao) {
  //   return <Login onLoginSucesso={(novaSessao) => setSessao(novaSessao)} />;
  // }




  return (
    
      <Routes>
        {/* <Route path="" element={<Login />} /> */}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Navigate to="/dashboard" replace />} />

        {/* <Route
          path="/login"
          element={<Login />}

        /> */}
        <Route
          path="/dashboard"
          element={<Dashboard sessao={sessao} onLogout={() => setSessao(null)} />}
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
    
  )
}


export default App
