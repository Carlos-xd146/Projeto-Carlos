const express = require("express");                   // Importa o Express para criar nosso servidor
const cors = require("cors");                         // Permite que o React se comunique com o backend
const Database = require("better-sqlite3");          // Importa a biblioteca que permite o Node.js conversar com o SQLite

const app = express();                              // Cria uma aplicação do Express    

app.use(express.json())                           // Permite que o Express receba dados em formato JSON
app.use(cors());                                  // Permite requisições vindas do frontend ReactF

const db = new Database("marmoraria.db");           // Cria ou abre o banco de dados SQLite

const PORT = 3000;                                 // Define a porta onde o servidor vai funcionar


// TABELA DE CLIENTES

db.prepare(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL
        )
    `).run(); // Executa o comando SQL para criar a tabela

// CADASTRAR CLIENTE


app.post("/clientes", (req, res) => {          // Cria uma rota POST para cadastrar clientes

    const { nome, telefone } = req.body;       // Pega nome e telefone enviados pelo cliente

    if (!nome || !telefone) {           // Verifica se os dois campos foram enviados
        return res.status(400).json({
            erro: "Nome e telefone são obrigatórios."   // Retorna um erro para quem fez a requisição
        });
    }

    const comando = db.prepare(`                
        INSERT INTO clientes (nome, telefone)
        VALUES (?, ?)          
    `)                 // Prepara o comando SQL para inserir o cliente

    const resultado = comando.run(nome, telefone);        // Executa o INSERT usando os dados recebidos
    
    res.json({
        mensagem: "Cliente cadastrado com sucesso!",        // Envia uma resposta para quem fez a requisição
        id: resultado.lastInsertRowid
    }); 
})


// LISTAR CLIENTES

app.get("/clientes", (req, res) => { // Cria uma rota GET para consultar os clientes
    const clientes = db.prepare(`
        SELECT * FROM clientes
    `).all();                  // Busca todos os clientes cadastrados no banco

    res.json(clientes);    // Envia a lista de clientes em formato JSON

});


// EXCLUIR CLIENTE

app.delete("/clientes/:id", (req, res) => {        // Cria uma rota DELETE para excluir um cliente
    
    const id = Number(req.params.id);       // Pega o ID enviado pela URL e converte para número

    const comando = db.prepare(`
            DELETE FROM clientes
            WHERE id = ?    
        `); // Prepara o comando SQL para excluir o cliente pelo ID

    const resultado = comando.run(id); // Executa o DELETE no banco

    if (resultado.changes === 0) {      // Verifica se nenhum cliente foi encontrado
        return res.status(404).json({
            erro: "Cliente não encontrado."
        });          // Retorna erro caso o ID não exista
    }

    res.json({
        mensagem: "Cliente excluido com sucesso!"
    }); // Informa que a exclusão foi realizada
});

// CONTAR CLIENTES

app.get("/clientes/total", (req, res) => { // Cria uma rota para consultar a quantidade de clientes
    const resultado = db.prepare(`
        SELECT COUNT(*) AS total
        FROM clientes
    `).get(); // Conta quantos clientes existem na tabela

    res.json(resultado); // Envia o total para o React em formato JSON
})

// ==============================================================================================================================================
// ==============================================================================================================================================
// ==============================================================================================================================================




// TABELA DE PRODUTOS

db.prepare(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            preco REAL NOT NULL
        )
    `).run(); // Cria a tabela produtos caso ela ainda não exista


// LISTAR PRODUTOS

app.get("/produtos", (req, res) => { // Cria uma rota GET para consultar os produtos

    const produtos = db.prepare(`
        SELECT * FROM produtos
    `).all(); // Busca todos os produtos cadastrados no banco

    res.json(produtos); // Envia a lista de produtos para o React em formato JSON
});


// CADASTRAR PRODUTO


app.post("/produtos", (req, res) => {           // Cria uma rota POST para cadastrar produtos

    const { nome, tipo, preco } = req.body;         // Pega os dados enviados pelo React

    if (!nome || !tipo || !preco) {          // Verifica se todos os campos foram enviados
        return res.status(400).json({
            erro: "Nome, tipo e preço são obrigatórios."
        });                    // Retorna um erro caso algum campo esteja vazio
    }

    const comando = db.prepare(`
        INSERT INTO produtos (nome, tipo, preco)
        VALUES (?, ?, ?)
    `);                    // Prepara o comando SQL para inserir o produto

    const resultado = comando.run(nome, tipo, preco);           // Executa o INSERT usando os dados recebidos

    res.json({
        mensagem: "Produto cadastrado com sucesso!",           // Informa que o cadastro foi realizado
        id: resultado.lastInsertRowid            // Retorna o ID criado pelo SQLite
    });
});


// EXCLUIR PRODUTO

app.delete("/produtos/:id", (req, res) => { // Cria uma rota DELETE para excluir um produto

    const id = Number(req.params.id); // Pega o ID da URL e converte para número

    const comando = db.prepare(`
        DELETE FROM produtos
        WHERE id = ?
    `); // Prepara o comando SQL para excluir o produto pelo ID

    const resultado = comando.run(id); // Executa o DELETE no banco

    if (resultado.changes === 0) { // Verifica se nenhum produto foi encontrado
        return res.status(404).json({
            erro: "Produto não encontrado."
        }); // Retorna erro caso o ID não exista
    }

    res.json({
        mensagem: "Produto excluído com sucesso!"
    }); // Informa que a exclusão foi realizada
});












// INICIAR SERVIDOR


app.listen(PORT, () => {                            // Inicia o servidor na porta definida
    console.log(`Servidor rodando na porta ${PORT}`);     // Mostra uma mensagem no terminal
});