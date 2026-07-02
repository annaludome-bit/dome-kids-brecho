// =========================================================
// clientesController.js
// Regras de negocio do CADASTRO DE CLIENTES (CRUD completo)
// =========================================================

const db = require('../db/database');

// GET /clientes/listar
function listar(req, res) {
    const clientes = db.prepare('SELECT * FROM clientes ORDER BY nome ASC').all();
    res.json(clientes);
}

// GET /clientes/buscar/:id
function buscarPorId(req, res) {
    const { id } = req.params;
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);

    if (!cliente) {
        return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    }
    res.json(cliente);
}

// POST /clientes/salvar
function salvar(req, res) {
    const { nome, telefone, email } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: 'O campo nome e obrigatorio.' });
    }

    const stmt = db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)');
    const info = stmt.run(nome, telefone || null, email || null);

    const novoCliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(novoCliente);
}

// PUT /clientes/editar/:id
function editar(req, res) {
    const { id } = req.params;
    const existente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);

    if (!existente) {
        return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    }

    const {
        nome = existente.nome,
        telefone = existente.telefone,
        email = existente.email
    } = req.body;

    db.prepare('UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?')
        .run(nome, telefone, email, id);

    const atualizado = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
    res.json(atualizado);
}

// DELETE /clientes/deletar/:id
function deletar(req, res) {
    const { id } = req.params;
    const existente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);

    if (!existente) {
        return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    }

    db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
    res.json({ mensagem: 'Cliente removido com sucesso.' });
}

module.exports = { listar, buscarPorId, salvar, editar, deletar };
