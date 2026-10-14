
// informa ao Typescrpt que estas funçoes possuem estes tipos.

export type Sessao = {
    usuario: string;
    token: string;
    data: string;
};

export function getDataHoje(): string;

export function sha256(texto: string): Promise<string>;

export function gerarToken(
    usuario: string,
    senha: string,
    data: string
): Promise<string>;

export function salvarCookie(token: string): void;

export function lerCookie(nome: string): string | null;

export function apagarSessaoDoCookie(): void;

export function getSessaoValidaDeHoje(): Promise<Sessao | null>;


