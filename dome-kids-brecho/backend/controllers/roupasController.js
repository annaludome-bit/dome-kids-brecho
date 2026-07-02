// =========================================================
// roupasController.js
// Regras de negocio do CADASTRO DE ROUPAS (CRUD completo)
// =========================================================

const db = require('../db/database');

// GET /roupas/listar
function listar(req, res) {
    const roupas = db.prepare('SELECT * FROM roupas ORDER BY data_cadastro DESC').all();
    res.json(roupas);
}

// GET /roupas/buscar/:id
function buscarPorId(req, res) {
    const { id } = req.params;
    const roupa = db.prepare('SELECT * FROM roupas WHERE id = ?').get(id);

    if (!roupa) {
        return res.status(404).json({ erro: 'Peca nao encontrada.' });
    }
    res.json(roupa);
}

// POST /roupas/salvar
function salvar(req, res) {
    const { nome, categoria, tamanho, cor, condicao, preco, quantidade, descricao } = req.body;

    if (!nome || !categoria || !tamanho || preco === undefined) {
        return res.status(400).json({ erro: 'Campos obrigatorios: nome, categoria, tamanho e preco.' });
    }

    const stmt = db.prepare(`
        INSERT INTO roupas (nome, categoria, tamanho, cor, condicao, preco, quantidade, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
        nome,
        categoria,
        tamanho,
        cor || null,
        condicao || 'Seminovo',
        Number(preco),
        Number(quantidade) || 1,
        descricao || null
    );

    const novaRoupa = db.prepare('SELECT * FROM roupas WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(novaRoupa);
}

// PUT /roupas/editar/:id
function editar(req, res) {
    const { id } = req.params;
    const existente = db.prepare('SELECT * FROM roupas WHERE id = ?').get(id);

    if (!existente) {
        return res.status(404).json({ erro: 'Peca nao encontrada.' });
    }

    const {
        nome = existente.nome,
        categoria = existente.categoria,
        tamanho = existente.tamanho,
        cor = existente.cor,
        condicao = existente.condicao,
        preco = existente.preco,
        quantidade = existente.quantidade,
        descricao = existente.descricao
    } = req.body;

    db.prepare(`
        UPDATE roupas
        SET nome = ?, categoria = ?, tamanho = ?, cor = ?, condicao = ?, preco = ?, quantidade = ?, descricao = ?
        WHERE id = ?
    `).run(nome, categoria, tamanho, cor, condicao, Number(preco), Number(quantidade), descricao, id);

    const atualizada = db.prepare('SELECT * FROM roupas WHERE id = ?').get(id);
    res.json(atualizada);
}

// DELETE /roupas/deletar/:id
function deletar(req, res) {
    const { id } = req.params;
    const existente = db.prepare('SELECT * FROM roupas WHERE id = ?').get(id);

    if (!existente) {
        return res.status(404).json({ erro: 'Peca nao encontrada.' });
    }

    db.prepare('DELETE FROM roupas WHERE id = ?').run(id);
    res.json({ mensagem: 'Peca removida com sucesso.' });
}

module.exports = { listar, buscarPorId, salvar, editar, deletar };
