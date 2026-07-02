-- =========================================================
-- Dome & Kids - Brecho Infantil
-- Script de criacao e populacao do banco de dados (SQLite)
-- Este arquivo recria toda a estrutura do banco usado no projeto.
-- =========================================================

DROP TABLE IF EXISTS venda_itens;
DROP TABLE IF EXISTS vendas;
DROP TABLE IF EXISTS roupas;
DROP TABLE IF EXISTS clientes;

-- ---------------------------------------------------------
-- Tabela: roupas (pecas do brecho infantil)
-- ---------------------------------------------------------
CREATE TABLE roupas (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          TEXT NOT NULL,
    categoria     TEXT NOT NULL,      -- ex: Bebe, Menina, Menino, Calcados, Acessorios
    tamanho       TEXT NOT NULL,      -- ex: RN, P, M, G, 2, 4, 6, 8...
    cor           TEXT,
    condicao      TEXT NOT NULL DEFAULT 'Seminovo', -- Novo, Seminovo, Usado
    preco         REAL NOT NULL,
    quantidade    INTEGER NOT NULL DEFAULT 1,
    descricao     TEXT,
    data_cadastro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- ---------------------------------------------------------
-- Tabela: clientes
-- ---------------------------------------------------------
CREATE TABLE clientes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          TEXT NOT NULL,
    telefone      TEXT,
    email         TEXT,
    data_cadastro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- ---------------------------------------------------------
-- Tabela: vendas
-- ---------------------------------------------------------
CREATE TABLE vendas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id      INTEGER,
    data_venda      TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    forma_pagamento TEXT NOT NULL DEFAULT 'Dinheiro',
    status          TEXT NOT NULL DEFAULT 'Concluida', -- Concluida, Cancelada
    total           REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- ---------------------------------------------------------
-- Tabela: venda_itens (itens de cada venda / carrinho)
-- ---------------------------------------------------------
CREATE TABLE venda_itens (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id        INTEGER NOT NULL,
    roupa_id        INTEGER NOT NULL,
    quantidade      INTEGER NOT NULL,
    preco_unitario  REAL NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (roupa_id) REFERENCES roupas(id)
);

-- ---------------------------------------------------------
-- Populacao inicial (dados de exemplo)
-- ---------------------------------------------------------
INSERT INTO roupas (nome, categoria, tamanho, cor, condicao, preco, quantidade, descricao) VALUES
('Macacao Plush Ursinho', 'Bebe', 'RN', 'Bege', 'Seminovo', 39.90, 3, 'Macacao de plush com capuz de orelhinhas'),
('Vestido Xadrez Manga Longa', 'Menina', '4', 'Vermelho', 'Seminovo', 34.90, 2, 'Vestido de festa junina, tecido leve'),
('Camisa Polo Listrada', 'Menino', '6', 'Azul', 'Usado', 19.90, 4, 'Polo em otimo estado, poucas lavagens'),
('Conjunto Moletom Dino', 'Menino', '2', 'Verde', 'Seminovo', 44.90, 2, 'Conjunto blusa + calca estampa de dinossauro'),
('Tenis Led Infantil', 'Calcados', '26', 'Rosa', 'Usado', 49.90, 1, 'Tenis com luzes de led, sola em bom estado'),
('Bandana + Sapatilha', 'Acessorios', 'Unico', 'Branco', 'Novo', 14.90, 5, 'Kit acessorios para recem-nascido');

INSERT INTO clientes (nome, telefone, email) VALUES
('Mariana Souza', '(35) 99123-4567', 'mariana.souza@email.com'),
('Carlos Eduardo', '(35) 99876-5432', 'carlos.edu@email.com');
