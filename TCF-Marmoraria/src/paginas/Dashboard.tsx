import { use, useEffect, useState } from "react"; // useState guarda o total e useEffect busca o dado quando a página abre
import CardDashboard from "../components/CardDashboard";
import { Link } from "react-router-dom";

export default function dashboard() {

    const [totalClientes, setTotalClientes] = useState(0); // Guarda a quantidade de clientes cadastrados

    async function carregarTotalClientes() {
        const resposta = await fetch("http://localhost:3000/clientes/total"); // Consulta o total de clientes no backend

        const dados = await resposta.json(); // Converte a resposta para JSON

        setTotalClientes(dados.total); // Atualiza o total de clientes

    }

    useEffect(() => {
        carregarTotalClientes(); // Busca o total quando o Dashboard é carregado
    }, []);


    return (
        <div className="pagina">

            <div className="dashboard-topo">
                <div>
                    <h1>Marmoraria</h1>
                    <p>Bem vindo</p>
                </div>

                <nav className="dashboard-links">
                    <Link to="/Produtos">Produtos
                    </Link>

                    <Link to="/Clientes">Clientes
                    </Link>

                    <Link to="/Pedidos">Pedidos
                    </Link>
                </nav>


            </div>


            <div className="dashboard-cards">
                <CardDashboard
                    titulo="Total de clientes"
                    valor={totalClientes}
                />
                <CardDashboard
                    titulo="Pedidos em andamento"
                    valor={0}
                />
                <CardDashboard
                    titulo="Pedidos concluídos"
                    valor={0}
                />
                <CardDashboard
                    titulo="Pedidos entregues"
                    valor={0}
                />
                <CardDashboard
                    titulo="Pedidos a receber"
                    valor={"R$ 0,00"}
                />
                <CardDashboard
                    titulo="Faturamento"
                    valor={"R$ 0,00"}
                />
            

            </div>

        </div>
    )
}