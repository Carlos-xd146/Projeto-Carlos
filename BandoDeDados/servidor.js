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

// ==========================================================================================================================================
// ==========================================================================================================================================

// TABELA DE PEDIDOS

db.prepare(`

    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        cliente_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade REAL NOT NULL,
        mao_de_obra REAL NOT NULL,
        desconto REAL DEFAULT 0,
        forma_pagamento TEXT NOT NULL,
        data_entrega TEXT,
        data_pagamento TEXT,
        status TEXT NOT NULL DEFAULT 'Em andamemto',
        entregue INTEGER NOT NULL DEFAULT 0,
        pago INTEGER NOT NULL DEFAULT 0, 
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
        )
    `).run(); // Cria a tabela no SQLite caso ela ainda não exista

app.get("/pedidos", (req, res) => {
    const pedidos = db.prepare(`
        SELECT
            pedidos.id,
            pedidos.cliente_id,
            clientes.nome AS cliente,
            pedidos.produto_id,
            produtos.nome AS produto,
            produtos.preco AS preco_produto,
            pedidos.quantidade,
            pedidos.mao_de_obra,
            pedidos.desconto,
            ((produtos.preco * pedidos.quantidade) + pedidos.mao_de_obra - pedidos.desconto) AS valor_total,
            pedidos.forma_pagamento,
            pedidos.data_entrega,
            pedidos.data_pagamento,
            pedidos.status,
            pedidos.entregue,
            pedidos.pago
        
        
            
        FROM pedidos

        INNER JOIN clientes
            ON pedidos.cliente_id = clientes.id

        INNER JOIN produtos
            ON pedidos.produto_id = produtos.id
    `).all();

    res.json(pedidos);

});


// CADASTRAR PEDIDO

app.post("/pedidos", (req, res) => { // Cria uma rota POST para cadastrar pedidos
    const {
        cliente_id,
        produto_id,
        quantidade,
        mao_de_obra,
        desconto,
        forma_pagamento,
        data_entrega,
        data_pagamento
    } = req.body; // Pega os dados enviados pelo React

    if (!cliente_id || !produto_id || !quantidade || !mao_de_obra || !forma_pagamento) { // Verifica se os campos obrigatórios foram preenchidos
        return res.status(400).json({
            erro: "preencha todos os campos obrigatórios."
        }) // Retorna um erro caso algum campo esteja faltando
    }

    const comando = db.prepare(`
        
         INSERT INTO pedidos (
            cliente_id,
            produto_id,
            quantidade,
            mao_de_obra,
            desconto,
            forma_pagamento,
            data_entrega,
            data_pagamento
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)

        `); // Prepara o comando SQL para inserir o pedido

    const resultado = comando.run(
        cliente_id,
        produto_id,
        quantidade,
        mao_de_obra,
        desconto || 0,
        forma_pagamento,
        data_entrega || null,
        data_pagamento || null
    ); // Executa o cadastro no SQLite

    res.json({
        mensagem: "Pedido cadastrado com sucesso!", // Confirma o cadastro
        id: resultado.lastInsertRowid           // Retorna o ID criado pelo SQLite
    });
});



// ATUALIZAR STATUS DE ENTREGA DO PEDIDO (ENTREGUE)


app.patch("/pedidos/:id/entregue", (req, res) => { // Cria uma rota para alterar se o pedido foi entregue

    const { entregue } = req.body; // Pega o novo valor enviado pelo React

    const comando = db.prepare(`
        UPDATE pedidos
        SET entregue = ?
        WHERE id = ?
    `); // Prepara o comando SQL para atualizar a entrega

    comando.run(
        entregue ? 1 : 0, // SQLite usa 1 para true e 0 para false
        req.params.id // Pega o ID do pedido pela URL
    );

    res.json({
        mensagem: "Status de entrega atualizado com sucesso!"
    }); // Confirma a atualização
});


// ATUALIZAR STATUS DE PAGAMENTO DO PEDIDO (PAGO)


app.patch("/pedidos/:id/pago", (req, res) => { // Cria uma rota para alterar se o pedido doi pago

    const { pago } = req.body; // Pega o novo valor enviado pelo React

    const comando = db.prepare(`
            UPDATE pedidos
            SET pago = ?
            WHERE id = ?
        `);  // Prepara o comando SQL para atualizar o pagamento

    comando.run(
        pago ? 1 : 0, // SQLite usa 1 para true e 0 para false
        req.params.id // Pega o ID do pedido pela URL
    );

    res.json({
        mensagem: "Status de pagamento atualizado com sucesso!"
    });  // Confirma a atualização
});


// STATUS DO PEDIDO CONCLUIDO OU NAO

app.patch("/pedidos/:id/status", (req, res) => { // Cria uma rota para alterar o status do pedido

    const { status } = req.body; // Pega o novo status enviado pelo React

    const comando = db.prepare(`
        UPDATE pedidos
        SET status = ?
        WHERE id = ?
    `); // Prepara o comando SQL para atualizar o status

    comando.run(
        status, // Salva o novo status
        req.params.id // Pega o ID do pedido pela URL
    );

    res.json({
        mensagem: "Status atualizado com sucesso!"
    }); // Confirma a atualização
});








// INICIAR SERVIDOR


app.listen(PORT, () => {                            // Inicia o servidor na porta definida
    console.log(`Servidor rodando na porta ${PORT}`);     // Mostra uma mensagem no terminal
});