// =========================================================
// database.js
// Responsavel por abrir a conexao com o banco SQLite e
// garantir que a estrutura (tabelas) exista, executando o
// arquivo dump.sql automaticamente na primeira execucao.
// =========================================================

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'dome_kids.db');
const DUMP_PATH = path.join(__dirname, 'dump.sql');

// Se o arquivo do banco ainda nao existe, ele sera criado aqui.
const dbExisteAntes = fs.existsSync(DB_PATH);

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

// Se o banco acabou de ser criado (nao existia antes), popula com o dump.
if (!dbExisteAntes) {
    console.log('[database] Banco nao encontrado. Criando estrutura a partir de dump.sql...');
    const sql = fs.readFileSync(DUMP_PATH, 'utf8');
    db.exec(sql);
    console.log('[database] Banco criado e populado com sucesso!');
}

module.exports = db;
