
// informa ao Typescrpt que estas funçoes possuem estes tipos.

export function getDataHoje(): string;

export function sha256(texto: string): Promise<string>;

export function gerarToken(
    usuario: string,
    senha: string,
    data: string
): Promise<string>;

export function salvarCookie(token: string): void;