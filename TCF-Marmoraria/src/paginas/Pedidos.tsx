import { useState } from "react";

type Pedido = {
    id: number;
    cliente: string;
    produto: string;
    quantidade: number;
    maoDeObra: number;
    desconto: number;
    formaPagamento: string;
    status: string;
    entregue: boolean;
    pago: boolean;
};

export default function Pedidos() {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    const [cliente, setCliente] = useState("");
    const [produto, setProduto] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [maoDeObra, setMaoDeObra] = useState("");
    const [desconto, setDesconto] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");

    function alterarPagamento(id: number, pago: boolean) {
        setPedidos((lista) => 
            lista.map((pedido) =>
                pedido.id === id 
                    ? {...pedido, pago: pago} : pedido))
    }

    function alterarEntrega(id: number, entregue: boolean) {
        setPedidos((lista) => 
            lista.map((pedido) =>
                pedido.id === id 
                    ? {...pedido, entregue: entregue} : pedido))
    }

    function cadastrarPedido(event: React.FormEvent) {
        event.preventDefault();

        if (                          // verificaçao para preencher todos os campos
            !cliente.trim() ||
            !produto.trim() ||
            !quantidade ||
            !maoDeObra ||
            !formaPagamento
        ) {
            alert("Preencha todos os campos.");
            return;
        }


        const valorQuantidade = Number(quantidade);
        const valorMaoDeObra = Number(maoDeObra);
        const valorDesconto = Number(desconto);

        const novoPedido: Pedido = {
            id: Date.now(),
            cliente: cliente.trim(),
            produto: produto.trim(),
            quantidade: valorQuantidade,
            maoDeObra: valorMaoDeObra,
            desconto: valorDesconto,
            formaPagamento,
            status: "Em andamento",
            entregue: false,
            pago: false,
        };

        setPedidos((lista) => [...lista, novoPedido]);

        setCliente("");
        setProduto("");
        setQuantidade("");
        setMaoDeObra("");
        setDesconto("");
        setFormaPagamento("");
    }



    return (
        <div className="pagina">
            <h1>Pedidos</h1>
            <p>Cadastre e consulte os pedidos</p>

            <section className="pedidos-formulario">
                <h2>Novo pedido</h2>

                <form onSubmit={cadastrarPedido}>
                    <div className="campo-pedido">
                        <label>Cliente</label>
                        <input
                            type="text"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Digite o nome do cliente"
                        />
                    </div>

                    <div className="campo-pedido">
                        <label>Produto</label>
                        <input
                            type="text"
                            value={produto}
                            onChange={(e) => setProduto(e.target.value)}
                            placeholder="Digite o produto"
                        />
                    </div>

                    <div className="campo-pedido">
                        <label>Quantidade (m²)</label>
                        <input
                            type="number"
                            min="0.01" // quantidade minima
                            step="0.01" // intevalos permitidos 0.01, 0.02, 0.03 ...
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            placeholder="Ex.: 10,5"
                        />
                    </div>

                    <div className="campo-pedido">
                        <label>Mão de obra (R$)</label>

                        <input
                            type="number"
                            min="0" // valor minimo
                            step="0.01"
                            value={maoDeObra}
                            onChange={(e) => setMaoDeObra(e.target.value)}
                            placeholder="Ex.: 50,00"
                        />
                    </div>

                    <div className="campo-pedido">
                        <label>Desconto (R$)</label>

                        <input
                            type="number"
                            min="0" // valor minimo
                            step="0.01"
                            value={desconto}
                            onChange={(e) => setDesconto(e.target.value)}
                            placeholder="Ex.: 100,00"
                        />
                    </div>

                    <div className="campo-pedido">
                        <label>Forma de pagamento</label>

                        <select
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            <option value="PIX">PIX</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartão">Cartão(Débito/Crédito)</option>
                        </select>
                    </div>

                    <button type="submit">Cadastrar pedido</button>

                </form>
            </section>

            <section className="pedidos-lista">
                <h2>Pedidos cadastrados</h2>

                {pedidos.length === 0 ? (
                    <p>Nenhum pedido cadastrado</p>
                ) : (
                    <div className="tabela-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Mão de obra</th>
                                    <th>Desconto</th>
                                    <th>Pagamento</th>
                                    <th>Status</th>
                                    <th>Entregue</th>
                                    <th>Pago</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.cliente}</td>
                                        <td>{pedido.produto}</td>
                                        <td>{pedido.quantidade} m²</td>
                                        <td>
                                            {pedido.maoDeObra.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </td>
                                        <td>
                                            {pedido.maoDeObra.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </td>
                                        <td>{pedido.formaPagamento}</td>
                                        <td>{pedido.status}</td>
                                        <td>
                                            <select
                                                value={pedido.entregue ? "sim" : "nao"}
                                                onChange={(e) => alterarEntrega(pedido.id, e.target.value === "sim")}
                                            >
                                                <option value="nao">Não</option>
                                                <option value="sim">Sim</option>
                                            </select>
                                        </td>

                                        <td>
                                            <select
                                                value={pedido.pago ? "sim" : "nao"}
                                                onChange={(e) =>
                                                    alterarPagamento(
                                                        pedido.id,
                                                        e.target.value === "sim"
                                                    )
                                                }
                                            >
                                                <option value="nao">Não</option>
                                                <option value="sim">Sim</option>
                                            </select>
                                        </td>
                                            {/* (? :) forma mais simples do if e else */}
                                        
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>


    );



}
