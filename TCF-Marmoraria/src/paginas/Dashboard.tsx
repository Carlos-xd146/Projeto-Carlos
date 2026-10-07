import { useEffect, useState } from "react"; // useState guarda o total e useEffect busca o dado quando a página abre
import CardDashboard from "../components/CardDashboard";
import { Link } from "react-router-dom";
import { apagarSessaoDoCookie } from "../auth.js";

export default function Dashboard({sessao, onLogout}) {

    function handleLogout() {
        apagarSessaoDoCookie();
        onLogout();
    }


    const [totalClientes, setTotalClientes] = useState(0); // Guarda a quantidade de clientes cadastrados
    const [pedidos, setPedidos] = useState<any[]>([]);

    async function carregarTotalClientes() {
        const resposta = await fetch("http://localhost:3000/clientes/total"); // Consulta o total de clientes no backend

        const dados = await resposta.json(); // Converte a resposta para JSON

        setTotalClientes(dados.total); // Atualiza o total de clientes

    }

    async function carregarPedidos() {
        const resposta = await fetch("http://localhost:3000/pedidos");

        const dados = await resposta.json();

        setPedidos(dados);
    }

    const faturamento = pedidos
        .filter((pedido) => Boolean(pedido.pago))
        .reduce(
            (total, pedido) => total + Number(pedido.valor_total),
            0
        );
    const valorAReceber = pedidos
        .filter((pedido) => !Boolean(pedido.pago))
        .reduce(
            (total, pedido) => total + Number(pedido.valor_total),
            0
        );

    const pedidosPendentes = pedidos.filter((pedido) => {
        return !(
            pedido.status === "Concluído" &&
            Boolean(pedido.pago) &&
            Boolean(pedido.entregue)
        );
    });

    useEffect(() => {
        carregarTotalClientes(); // Busca o total quando o Dashboard é carregado
    }, []);

    useEffect(() => {
        carregarPedidos();
    }, []);


    return (
        <div className="pagina">

            <div className="dashboard-topo">
                <div>
                    <h1>Marmoraria</h1>
                    <p>Bem vindo</p>
                    <p>Token do dia: {sessao.token}</p>
                    <button onClick={handleLogout}>Sair</button>
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
                    valor={pedidos.filter((pedido) => pedido.status === "Em andamento").length}
                />
                <CardDashboard
                    titulo="Pedidos concluídos"
                    valor={pedidos.filter((pedido) => pedido.status === "Concluído").length}
                />
                <CardDashboard
                    titulo="Pedidos entregues"
                    valor={pedidos.filter((pedido) => Boolean(pedido.entregue)).length}
                />
                <CardDashboard
                    titulo="Pedidos a receber"
                    valor={valorAReceber.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />
                <CardDashboard
                    titulo="Faturamento"
                    valor={faturamento.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                />
            </div>

            <section className="pedidos-pendentes">

                <h2>Pedidos pendentes</h2>

                {pedidosPendentes.length === 0 ? (<p>Nenhum pedido pendente.</p>) : (

                    <div className="lista-pedidos-pendentes">

                        {pedidosPendentes.map((pedido) => (
                            <div
                                className="pedido-pendente"
                                key={pedido.id}
                            >
                                <h3>
                                    Pedido #{pedido.id}
                                </h3>

                                <p>
                                    <strong>Cliente:</strong> {pedido.cliente}
                                </p>

                                <p>
                                    <strong>Produto:</strong> {pedido.produto}
                                </p>

                                <p>
                                    <strong>Status:</strong> {pedido.status}
                                </p>

                                <p>
                                    <strong>Pagamento:</strong>{" "}
                                    {Boolean(pedido.pago) ? "Pago" : "Não pago"}
                                </p>

                                <p>
                                    <strong>Entrega:</strong>{" "}
                                    {Boolean(pedido.entregue) ? "Entregue" : "Não entregue"}
                                </p>
                                <p>
                                    <strong>Valor:</strong>{" "}
                                    {Number(pedido.valor_total).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}