export function getDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${dia}-${mes}-${ano}`;
}

export async function sha256(texto) {
    const encoder = new TextEncoder();
    const dados = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function gerarToken(usuario, senha, data) {
    return await sha256(usuario + senha + data);
}

export function salvarCookie(token){
    
    const NOME_COOKIE = "auth_session"
    document.cookie =`${NOME_COOKIE} = ${token}`
}

