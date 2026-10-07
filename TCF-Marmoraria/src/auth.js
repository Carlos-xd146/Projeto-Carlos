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

const COOKIE_USER = "auth_user";
const COOKIE_TOKEN = "auth_token";

export function lerCookie(nome) {
    const cookies = document.cookie.split("; ");
    const encontrado = cookies.find((linha) => linha.startsWith(`${nome}=`));
    if (!encontrado) return null;
    return decodeURIComponent(encontrado.split("=")[1]);
}

export function apagarSessaoDoCookie() {
    const past = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `${COOKIE_USER}=; ${past}`;
    document.cookie = `${COOKIE_TOKEN}=; ${past}`; 
}


export async function getSessaoValidaDeHoje() {
    const usuario = lerCookie(COOKIE_USER);
    const tokenSalvo = lerCookie(COOKIE_TOKEN);

    if (!usuario || !tokenSalvo) return null;

    try {
        const resposta = await fetch("/users.json");
        const usuarios = await resposta.json();

        const usuarioEncontrado = usuarios.find((u) => u.usuario === usuario);
        if (!usuarioEncontrado) {
            apagarSessaoDoCookie();
            return null;
        }

        const hoje = getDataHoje();
        const tokenCalculado = await gerarToken(usuarioEncontrado.usuario, usuarioEncontrado.privateKey, hoje);

        if (tokenSalvo !== tokenCalculado) {
            apagarSessaoDoCookie();
            return null;
        }

        return { usuario: usuarioEncontrado.usuario, token:tokenSalvo, data: hoje };
    } catch {
        return null;
    }
}

