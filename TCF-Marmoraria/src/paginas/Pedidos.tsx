import { useEffect, useState } from "react"; // useState controla os dados e useEffect busca os pedidos quando a página abre

type Pedido = {
    id: number;
    cliente_id: number;
    produto_id: number;
    quantidade: number;
    maoDeObra: number;
    desconto: number;
    formaPagamento: string;
    data_entrega: string | null;
    data_pagamento: string | null;
    status: string;
    entregue: boolean;
    pago: boolean;
    preco_produto: number;
    valor_total: number;
};

type Cliente = {
    id: number;
    nome: string;
    telefone: string;

};

type Produto = {
    id: number;
    nome: string;
    tipo: string;
    preco: number;
}

export default function Pedidos() {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    const [cliente, setCliente] = useState("");
    const [produto, setProduto] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [maoDeObra, setMaoDeObra] = useState("");
    const [desconto, setDesconto] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");

    const [clientes, setClientes] = useState<Cliente[]>([]); // Guarda os clientes vindos do banco
    const [produtos, setProdutos] = useState<Produto[]>([]); // Guarda os produtos vindos do banco

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        carregarPedidos(); // Busca os pedidos
        carregarClientes(); // Busca os clientes
        carregarProdutos(); // Busca os produtos
    }, []);


    //  CARREGAR PEDIDOS

    async function carregarPedidos() {
        const resposta = await fetch("http://localhost:3000/pedidos"); // Faz uma requisição GET para o banco de dados

        const dados = await resposta.json(); // Converte a resposta do servidor para JSON

        const pedidosFormatados: Pedido[] = dados.map((pedido: any) => ({

            id: pedido.id, // ID do pedido
            cliente_id: pedido.cliente_id, // ID do cliente relacionado
            produto_id: pedido.produto_id, // ID do produto relacionado
            quantidade: pedido.quantidade, // Quantidade do produto
            maoDeObra: pedido.mao_de_obra, // Converte mao_de_obra para maoDeObra
            desconto: pedido.desconto, // Valor do desconto
            formaPagamento: pedido.forma_pagamento, // Converte forma_pagamento para formaPagamento
            data_entrega: pedido.data_entrega, // Data de entrega
            data_pagamento: pedido.data_pagamento, // Data de pagamento
            status: pedido.status, // Status do pedido
            entregue: Boolean(pedido.entregue), // Converte 0/1 do SQLite para false/true
            pago: Boolean(pedido.pago), // Converte 0/1 do SQLite para false/true
            preco_produto: pedido.preco_produto,
            valor_total: pedido.valor_total,

        }));

        setPedidos(pedidosFormatados); // Coloca os pedidos formatados dentro da listaF
    }

    // CARREGAR CLIENTES

    async function carregarClientes() {
        const resposta = await fetch("http://localhost:3000/clientes"); // Busca os clientes no banco de dados

        const dados = await resposta.json(); // Converte a resposta para JSON

        setClientes(dados); // Guarda os clientes no estado
    }

    // CARREGAR PRODUTOS

    async function carregarProdutos() {
        const resposta = await fetch("http://localhost:3000/produtos"); // Busca os produtos no banco de dados

        const dados = await resposta.json(); // Converte a resposta para JSON

        setProdutos(dados); // Guarda os produtos no estado
    }


    async function alterarPagamento(id: number, pago: boolean) {
        const resposta = await fetch(`http://localhost:3000/pedidos/${id}/pago`, {

            method: "PATCH", // Informa que estamos alterando apenas uma parte do pedido

            headers: {
                "Content-Type": "application/json", // Informa que estamos enviando JSON
            },

            body: JSON.stringify({
                pago: pago, // Envia o novo estado do pagamento
            }),
        }
        );

        if (!resposta.ok) { // Verifica se o backend retornou algum erro
            alert("Erro ao atualizar pagamento");
            return;
        }

        carregarPedidos(); // Busca novamente os pedidos para atualizar a tabela
    }

    async function alterarEntrega(id: number, entregue: boolean) {
        const resposta = await fetch(`http://localhost:3000/pedidos/${id}/entregue`, {

            method: "PATCH", // Informa que estamos alterando apenas uma parte do pedido

            headers: {
                "Content-Type": "application/json", // Informa que estamos enviando JSON
            },

            body: JSON.stringify({
                entregue: entregue, // Envia o novo estado da entrega
            }),
        }
        );

        if (!resposta.ok) { // Verifica se o backend retornou algum erro
            alert("Erro ao atualizar entrega");
            return;
        }

        carregarPedidos(); // Busca novamente os pedidos para atualizar a tabela
    }

    // ALTERAR STATUS

    async function alterarStatus(id: number, status: string) {
        const resposta = await fetch(
            `http://localhost:3000/pedidos/${id}/status`,
            {
                method: "PATCH", // Informa que estamos alterando apenas o status do pedido

                headers: {
                    "Content-Type": "application/json", // Informa que estamos enviando JSON
                },

                body: JSON.stringify({
                    status: status, // Envia o novo status para o backend
                }),
            }
        );

        if (!resposta.ok) { // Verifica se o backend retornou algum erro
            alert("Erro ao atualizar status");
            return;
        }

        carregarPedidos(); // Busca novamente os pedidos para atualizar a tabela
    }


    async function cadastrarPedido(event: React.FormEvent) {
        event.preventDefault();

        if (
            !cliente.trim() ||
            !produto.trim() ||
            !quantidade ||
            !maoDeObra ||
            !formaPagamento
        ) {
            alert("Preencha todos os campos.");
            return; // Verifica se os campos obrigatórios foram preenchidos
        }

        const valorQuantidade = Number(quantidade); // Converte a quantidade de texto para número

        const valorMaoDeObra = Number(maoDeObra); // Converte a mão de obra de texto para número

        const valorDesconto = Number(desconto); // Converte o desconto de texto para número


        const resposta = await fetch("http://localhost:3000/pedidos", {
            method: "POST", // Informa que estamos cadastrando um novo pedido

            headers: {
                "Content-Type": "application/json", // Informa que estamos enviando JSON
            },

            body: JSON.stringify({  // Converte os dados do pedido para JSON
                cliente_id: Number(cliente), // Envia o ID do cliente convertido para número

                produto_id: Number(produto), // Envia o ID do produto convertido para número

                quantidade: valorQuantidade, // Envia a quantidade do produto

                mao_de_obra: valorMaoDeObra, // Envia o valor da mão de obra

                desconto: valorDesconto, // Envia o desconto

                forma_pagamento: formaPagamento, // Envia a forma de pagamento

                data_entrega: null, // Por enquanto não estamos cadastrando a data de entrega

                data_pagamento: null, // Por enquanto não estamos cadastrando a data de pagamento
            }),
        });


        if (!resposta.ok) { // Verifica se o banco de dados retornou algum erro

            alert("Erro ao cadastrar pedido");

            return;
        }

        setCliente(""); // Limpa o cliente selecionado
        setProduto(""); // Limpa o produto selecionado
        setQuantidade(""); // Limpa a quantidade
        setMaoDeObra(""); // Limpa a mão de obra
        setDesconto(""); // Limpa o desconto
        setFormaPagamento(""); // Limpa a forma de pagamento
        carregarPedidos(); // Busca novamente os pedidos para atualizar a tabela
    }



    return (
        <div className="pagina">
            <h1>Pedidos</h1>
            <p>Cadastre e consulte os pedidos</p>

            <section className="pedidos-formulario">
                <div className="titulo-formulario">
                    <h2>Novo pedido</h2>

                    <button
                        type="button"
                        className="botao-toggle-formulario"
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    >
                        {mostrarFormulario ? "Fechar" : "Novo Pedido"}

                    </button>
                </div>

                {mostrarFormulario && (
                    <form onSubmit={cadastrarPedido}>
                        <div className="campo-pedido">
                            <label>Cliente</label>
                            <select
                                value={cliente}
                                onChange={(e) => setCliente(e.target.value)}
                            >
                                <option value="">Selecione um cliente</option>

                                {clientes.map((cliente) => (
                                    <option
                                        key={cliente.id}
                                        value={cliente.id}
                                    >
                                        {cliente.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo-pedido">
                            <label>Produto</label>
                            <select
                                value={produto}
                                onChange={(e) => setProduto(e.target.value)}
                            >
                                <option value="">Selecione um produto</option>

                                {produtos.map((produto) => (
                                    <option
                                        key={produto.id}
                                        value={produto.id}
                                    >
                                        {produto.nome}
                                    </option>
                                ))}
                            </select>
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
                )}

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
                                    <th>Preço</th>
                                    <th>Quantidade</th>
                                    <th>Mão de obra</th>
                                    <th>Desconto</th>
                                    <th>Pagamento</th>
                                    <th>Status</th>
                                    <th>Entregue</th>
                                    <th>Pago</th>
                                    <th>Valor Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>{clientes.find((cliente) => cliente.id === pedido.cliente_id)?.nome}</td>
                                        <td>{produtos.find((produto) => produto.id === pedido.produto_id)?.nome}</td>
                                        <td>{Number(pedido.preco_produto).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}</td>
                                        <td>{pedido.quantidade} m²</td>
                                        <td>
                                            {pedido.maoDeObra.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </td>
                                        <td>
                                            {pedido.desconto.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </td>
                                        <td>{pedido.formaPagamento}</td>
                                        <td>
                                            <select
                                                className={         // Define a cor conforme o status do pedido
                                                    pedido.status === "Concluído"
                                                        ? "status-concluido"
                                                        : "status-andamento"
                                                }
                                                value={pedido.status}
                                                onChange={(e) => alterarStatus(pedido.id, e.target.value)}
                                            >
                                                <option value="Em andamento">Em andamento</option>
                                                <option value="Concluído">Concluído</option>

                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className={pedido.entregue ? "status-sim" : "status-nao"} // Define a cor conforme o status
                                                value={pedido.entregue ? "sim" : "nao"}
                                                onChange={(e) => alterarEntrega(pedido.id, e.target.value === "sim")}
                                            >
                                                <option value="nao">Não</option>
                                                <option value="sim">Sim</option>
                                            </select>
                                        </td>

                                        <td>
                                            <select
                                                className={pedido.pago ? "status-sim" : "status-nao"} // Define a cor conforme o status
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
                                        <td>
                                            {pedido.valor_total.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </td>

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
