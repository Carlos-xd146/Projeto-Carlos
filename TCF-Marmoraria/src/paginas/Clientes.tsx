import React, { useState } from "react";

type Cliente = {
    id: number;
    nome: string;
    telefone: string;
};

export default function Clientes() {

    const [clientes, setClientes] = useState<Cliente[]>([]);

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");


    function cadastrarCliente(event: React.FormEvent) {
        event.preventDefault();

        if (!nome.trim() || !telefone.trim()) {
            alert("Preencha o nome e o telefone.");
            return;
        }

        const novoCliente: Cliente = {
            id: Date.now(),
            nome: nome.trim(),
            telefone: telefone.trim(),
        };

        setClientes((lista) => [...lista, novoCliente]);

        setNome("");
        setTelefone("");

    }

    return (
        <div className="pagina">
            <h1>Clientes</h1>
            <p>Cadastre e consulte os clientes</p>

            <section className="clientes-formulario">
                <h2>Novo Cliente</h2>

                <form onSubmit={cadastrarCliente}>

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
                                </tr>
                            </thead>

                            <tbody>
                                {clientes.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.telefone}</td>
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



