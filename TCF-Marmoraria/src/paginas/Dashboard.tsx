import CardDashboard from "../components/CardDashboard";
import { Link } from "react-router-dom";

export default function dashboard() {
    return (
        <div className="pagina">
            <h1>Marmoraria</h1>
            <p>Bem vindo</p>

            <div className="dashboard-cards">
                <CardDashboard
                    titulo="Total de clientes"
                    valor={0}
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
                <Link to ="/Produtos">Produtos
                </Link>

                <Link to ="/Clientes">Clientes
                </Link>

                <Link to ="/Pedidos">Pedidos
                </Link>

            </div>

        </div>
    )
}