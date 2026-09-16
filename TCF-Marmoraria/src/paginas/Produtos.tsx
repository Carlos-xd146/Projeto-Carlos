import { useState } from "react";

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

    function cadastrarProduto(event: React.FormEvent) {
        event.preventDefault(); //Impede o navegador de recarregar a página quando o formulário é enviado.
    

    if (!nome.trim() || !tipo || !preco) { //trim remove espaços no começo e no final
        alert("Preencha todos os campos.");
        return;
    }

    const valor = Number(preco); // converte texto(string) para numero(Number)

    if (valor <= 0 || !Number.isFinite(valor)) { // verifica se o numero é menor ou igual a zero ou se o numero é valido e finito
        alert("Digite um preço válido");
        return;
    }

    const novoProduto: Produto = { // precisa seguir o formato Produto(id, nome, tipo e preço)
        id: Date.now(), //pego o horario atual
        nome: nome.trim(),
        tipo,
        preco: valor, //recebe o valor convertido
    };

    setProdutos((lista) => [...lista, novoProduto]); // Pegua todos os produtos antigos e coloque o novo produto no final.
    // ... espalha os elementos da lista
    setNome("");
    setTipo("");
    setPreco("");
}

    function excluirProduto(id: number) {
        setProdutos((lista) => lista.filter((produto) => produto.id !== id));
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