// =========================================================
// vendasController.js
// Regras de negocio das VENDAS (registro de compras dos
// clientes, baixa de estoque e historico de vendas)
// =========================================================

const db = require('../db/database');

// Busca uma venda completa (cabecalho + itens) pelo id
function montarVendaCompleta(vendaId) {
    const venda = db.prepare(`
        SELECT vendas.*, clientes.nome AS cliente_nome
        FROM vendas
        LEFT JOIN clientes ON clientes.id = vendas.cliente_id
        WHERE vendas.id = ?
    `).get(vendaId);

    if (!venda) return null;

    const itens = db.prepare(`
        SELECT venda_itens.*, roupas.nome AS roupa_nome
        FROM venda_itens
        JOIN roupas ON roupas.id = venda_itens.roupa_id
        WHERE venda_itens.venda_id = ?
    `).all(vendaId);

    return { ...venda, itens };
}

// GET /vendas/listar
function listar(req, res) {
    const vendas = db.prepare(`
        SELECT vendas.*, clientes.nome AS cliente_nome
        FROM vendas
        LEFT JOIN clientes ON clientes.id = vendas.cliente_id
        ORDER BY vendas.data_venda DESC
    `).all();
    res.json(vendas);
}

// GET /vendas/buscar/:id  (traz a venda com os itens do carrinho)
function buscarPorId(req, res) {
    const venda = montarVendaCompleta(req.params.id);
    if (!venda) {
        return res.status(404).json({ erro: 'Venda nao encontrada.' });
    }
    res.json(venda);
}

// POST /vendas/salvar
// Espera: { cliente_id, forma_pagamento, itens: [{ roupa_id, quantidade }] }
function salvar(req, res) {
    const { cliente_id, forma_pagamento, itens } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ erro: 'A venda precisa ter ao menos um item.' });
    }

    const registrarVenda = db.transaction(() => {
        // Valida estoque e calcula total
        let total = 0;
        const itensValidados = [];

        for (const item of itens) {
            const roupa = db.prepare('SELECT * FROM roupas WHERE id = ?').get(item.roupa_id);
            if (!roupa) {
                throw new Error(`Peca com id ${item.roupa_id} nao existe.`);
            }
            if (roupa.quantidade < item.quantidade) {
                throw new Error(`Estoque insuficiente para "${roupa.nome}" (disponivel: ${roupa.quantidade}).`);
            }
            total += roupa.preco * item.quantidade;
            itensValidados.push({ roupa, quantidade: item.quantidade });
        }

        const infoVenda = db.prepare(`
            INSERT INTO vendas (cliente_id, forma_pagamento, total)
            VALUES (?, ?, ?)
        `).run(cliente_id || null, forma_pagamento || 'Dinheiro', total);

        const vendaId = infoVenda.lastInsertRowid;

        const inserirItem = db.prepare(`
            INSERT INTO venda_itens (venda_id, roupa_id, quantidade, preco_unitario)
            VALUES (?, ?, ?, ?)
        `);
        const baixarEstoque = db.prepare('UPDATE roupas SET quantidade = quantidade - ? WHERE id = ?');

        for (const { roupa, quantidade } of itensValidados) {
            inserirItem.run(vendaId, roupa.id, quantidade, roupa.preco);
            baixarEstoque.run(quantidade, roupa.id);
        }

        return vendaId;
    });

    try {
        const vendaId = registrarVenda();
        res.status(201).json(montarVendaCompleta(vendaId));
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
}

// PUT /vendas/editar/:id
// Permite atualizar dados da venda (forma de pagamento / status)
function editar(req, res) {
    const { id } = req.params;
    const existente = db.prepare('SELECT * FROM vendas WHERE id = ?').get(id);

    if (!existente) {
        return res.status(404).json({ erro: 'Venda nao encontrada.' });
    }

    const {
        forma_pagamento = existente.forma_pagamento,
        status = existente.status
    } = req.body;

    db.prepare('UPDATE vendas SET forma_pagamento = ?, status = ? WHERE id = ?')
        .run(forma_pagamento, status, id);

    res.json(montarVendaCompleta(id));
}

// DELETE /vendas/deletar/:id
// Cancela a venda, remove os itens e devolve as pecas ao estoque
function deletar(req, res) {
    const { id } = req.params;
    const existente = db.prepare('SELECT * FROM vendas WHERE id = ?').get(id);

    if (!existente) {
        return res.status(404).json({ erro: 'Venda nao encontrada.' });
    }

    const cancelarVenda = db.transaction(() => {
        const itens = db.prepare('SELECT * FROM venda_itens WHERE venda_id = ?').all(id);
        const devolverEstoque = db.prepare('UPDATE roupas SET quantidade = quantidade + ? WHERE id = ?');

        for (const item of itens) {
            devolverEstoque.run(item.quantidade, item.roupa_id);
        }

        db.prepare('DELETE FROM venda_itens WHERE venda_id = ?').run(id);
        db.prepare('DELETE FROM vendas WHERE id = ?').run(id);
    });

    cancelarVenda();
    res.json({ mensagem: 'Venda cancelada e itens devolvidos ao estoque.' });
}

module.exports = { listar, buscarPorId, salvar, editar, deletar };
