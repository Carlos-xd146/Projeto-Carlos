import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { salvarCookie, getDataHoje, gerarToken } from "../auth.js";

type Usuario = {
    usuario: string;
    senha: string;
};

export default function Login() {
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    async function entrar(event: React.FormEvent) { // variavel do evento que envia o submit do formulario e tipagem do evento de formulario
       
        event.preventDefault(); // react atualiza sem precisar recarregar a pagina


        const resposta = await fetch("/users.json");
        const bancoDeDados: Usuario[] = await resposta.json();

        const usuarioEncontrado = bancoDeDados.find((user) => user.usuario===nome && user.senha === senha)
        if (usuarioEncontrado){
            const data = getDataHoje();
            const token = await gerarToken(
                usuarioEncontrado.usuario,
                usuarioEncontrado.senha,
                data
            );
            salvarCookie(token);
            setMensagem("Logado!");

            console.log("LOGIN CORRETO");

            navigate("/dashboard");
        }else{

            console.log("LOGIN INCORRETO");
            setMensagem("Usuario ou senha incorretos")
        }
        // Exibe um aviso se o nome ou a senha estao vazios
        // if (!nome || !senha) {
        //     alert("Preencha o nome e a senha.");
        //     return;
        // }
        
    }

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={entrar}>
                <h1>Marmoraria</h1>
                <p>Acesse o sistema</p>

                <label>Nome do usuário</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome"
                />

                <label>Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                />

                <p>{mensagem}</p>

                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}