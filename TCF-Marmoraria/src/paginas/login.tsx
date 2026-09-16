import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    function entrar(event: React.FormEvent) { // variavel do evento que envia o submit do formulario e tipagem do evento de formulario
        event.preventDefault(); // react atualiza sem precisar recarregar a pagina

        // Exibe um aviso se o nome ou a senha estao vazios
        if (!nome || !senha) {
            alert("Preencha o nome e a senha.");
            return;
        }


        // Login provisório, sem autenticação real.
        navigate("/dashboard");
    }

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={entrar}>
                <h1>Marmoaria</h1>
                <p>Acesse o sitema</p>

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

                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}