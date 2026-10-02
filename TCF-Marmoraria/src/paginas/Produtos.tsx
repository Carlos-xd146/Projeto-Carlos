import { useEffect, useState } from "react"; // useState controla os dados e useEffect busca os produtos quando a página abre

type Produto = {
    id: number;
    nome: string;
    tipo: string;
    preco: number;
};

export default function Produtos() {
    const [produtos, setProdutos] = useState<Produto[]>([]) // lista de produtos

    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [preco, setPreco] = useState("");

    useEffect(() => {
        carregarProdutos();   // Busca os produtos do banco quando a página é aberta
    }, []);

    async function carregarProdutos() {
        const resposta = await fetch("http://localhost:3000/produtos"); // Faz uma requisição GET para o backend

        const dados = await resposta.json() // Converte a resposta do servidor para JSON

        setProdutos(dados); // Coloca os produtos recebidos dentro da lista
    }

    async function cadastrarProduto(event: React.FormEvent) {
        event.preventDefault(); //Impede o navegador de recarregar a página quando o formulário é enviado.
    

    if (!nome.trim() || !tipo || !preco) { //trim remove espaços no começo e no final
        alert("Preencha todos os campos.");
        return;
    }

    const valor = Number(preco); // converte texto(string) para numero(Number)

    if ( valor <= 0 ) { // verifica se o numero é menor ou igual a zero
        alert("Digite um preço válido");
        return;
    }

    const resposta = await fetch("http://localhost:3000/produtos", {
        method: "POST", //Informa que estamos cadastrando um produto

        headers: {
            "Content-Type": "application/json",      // Informa que estamos enviando JSON
        },

        body: JSON.stringify({
            nome: nome.trim(),
            tipo,
            preco: valor,
        }), // Converte os dados do produto para JSON
    });

    if (!resposta.ok) {            // Verifica se o backend retornou algum erro
        alert("Erro ao cadastrar produto");
    }


    setNome("");
    setTipo("");
    setPreco("");

    carregarProdutos();     // Busca novamente os produtos para atualizar a tabela
}


    // EXCLUIR PRODUTO

    async function excluirProduto(id: number) {
    const resposta = await fetch(`http://localhost:3000/produtos/${id}`, {
        method: "DELETE", // Informa que queremos excluir o produto
    });

    if (!resposta.ok) { // Verifica se o backend retornou algum erro
        alert("Erro ao excluir produto.");
        return;
    }

    carregarProdutos(); // Busca novamente os produtos depois da exclusão
}

    return (
        <div className="pagina">
            <h1>Produtos</h1>
            <p>Cadastre e consulte os materiais da marmoaria</p>

            <section className="produtos-formulario">
                <h2>Novo produto</h2>
                                                    
                <form onSubmit={cadastrarProduto}>  {/* conecta o formulario com a funçao */}
                    <div className="produto-campos">
                        <div className="campo-produto">
                            <label>Nome do Material</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex.: Granito Preto São Gabriel"
                            />
                        </div>

                        <div className="campo-produto">
                            <label>Tipo</label>
                             <select value={tipo} onChange={(e) => setTipo(e.target.value)}> {/* quando selecionado altera o estado do Tipo */}
                                <option value="">Selecione</option>
                                <option value="Granito">Granito</option>
                                <option value="Mármore">Mármore</option>
                                <option value="Quartzo">Quartzo</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div className="campo-produto">
                            <label>Preço por m²(R$)</label>
                            <input
                                type="number"
                                min="0.01" // campo numerico
                                step="0.01" // nao permite valores menores que 0,01 ex: 350,50 ou 350,99
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                placeholder="Ex.: 350,00"
                            />
                        </div>
                    </div>

                    <button type="submit">Cadastrar produto</button>
                </form>
            </section>

            <section className="produtos-lista">
                <h2>Produtos cadastrados</h2>

                {produtos.length === 0 ? ( // verifica se existem produtos, exemplo se for igual a 0 exibe "Nenhum produto cadastrado." se nao "<div className="tabela-container">"
                    <p>Nenhum produto cadastrado.</p> 
                ) : (
                    <div className="tabela-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Tipo</th>
                                    <th>Preço por m²</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map((produto) => ( // .map gera uma linha para cada produto da lista // key usado pra identificar cada produto da lista
                                    <tr key={produto.id}>  
                                        <td>{produto.nome}</td>
                                        <td>{produto.tipo}</td>
                                        <td>
                                            {produto.preco.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL", // exibe o perço em real ex: 350 em 350,00
                                            })}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="botao-excluir"
                                                onClick={() => excluirProduto(produto.id)}
                                            >
                                                Excluir
                                            </button>
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