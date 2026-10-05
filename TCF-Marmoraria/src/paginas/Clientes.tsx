import React, { useEffect, useState } from "react";        // useState controla os dados e useEffect executa ações quando a página carrega

type Cliente = {
    id: number;
    nome: string;
    telefone: string;
};

export default function Clientes() {

    const [clientes, setClientes] = useState<Cliente[]>([]);   // Guarda a lista de clientes

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        carregarClientes();     // Busca os clientes assim que a página é aberta
    }, []);


    async function carregarClientes() {
        const resposta = await fetch("http://localhost:3000/clientes");   // Faz uma requisição GET para o backend

        const dados = await resposta.json();                      // Converte a resposta do servidor para JSON

        setClientes(dados);                            // Coloca os clientes recebidos dentro da lista
    }


    async function cadastrarClientes(event: React.FormEvent) {
        event.preventDefault();

        if (!nome.trim() || !telefone.trim()) {          // Verifica se nome e telefone foram preenchidos
            alert("Preencha o nome e o telefone.");
            return;
        }

        const resposta = await fetch("http://localhost:3000/clientes", {
            method: "POST",  // Informa que estamos cadastrando um novo cliente
            headers: {
                "Content-Type": "application/json", // Informa que estamos enviando JSON
            },
            body: JSON.stringify({
                nome: nome.trim(),
                telefone: telefone.trim(),
            }),  // Converte os dados do cliente para JSON
        });

        if (!resposta.ok) {   // Verifica se o backend retornou algum erro
            alert("Erro ao cadastrar cliente");
            return;
        }

        setNome("");      // Limpa o campo de nome
        setTelefone("");  // Limpa o campo de telefone

        carregarClientes(); //Busca novamente os clientes para atualizar a tabela
    }

    async function excluirCliente(id: number) {
        const resposta = await fetch(`http://localhost:3000/clientes/${id}`, {
            method: "DELETE",  // Informa que queremos excluir um cliente
        });

        if (!resposta.ok) {  // Verifica se o backend retornou algum erro
            alert("Erro ao excluir cliente.");
            return;
        }

        carregarClientes(); // Busca novamente os clientes depois da exclusão

    }



    return (
        <div className="pagina">
            <h1>Clientes</h1>
            <p>Cadastre e consulte os clientes</p>

            <section className="clientes-formulario">

                <div className="titulo-formulario">
                    <h2>Novo Cliente</h2>

                    <button
                        type="button"
                        className="botao-toggle-formulario"
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    >
                        {mostrarFormulario ? "Fechar" : "Novo cliente"}
                    </button>
                </div>

                {mostrarFormulario && (
                    <form onSubmit={cadastrarClientes}>

                        <div className="campo-cliente">
                            <label>Nome</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome do cliente"
                            />
                        </div>

                        <div className="campo-cliente">
                            <label>Telefone</label>
                            <input
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="Digite o nome do cliente"
                            />
                        </div>

                        <button type="submit">Cadastrar cliente</button>

                    </form>
                )}


            </section>

            <section className="clientes-lista">
                <h2>Clientes cadastrados</h2>

                {clientes.length === 0 ? (             // versao simplificada de if e else (? :)
                    <p>Nenhum cliente cadastrado</p>
                ) : (
                    <div className="tabela-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Telefone</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {clientes.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.telefone}</td>

                                        <td>
                                            <button type="button" onClick={() => excluirCliente(cliente.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                )}
            </section>
        </div>
    )
}



