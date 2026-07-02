// =========================================================
// server.js
// Ponto de entrada do back-end do Dome & Kids.
// Aqui todas as rotas (roupas, clientes, vendas) sao ligadas
// a aplicacao Express.
// =========================================================

const express = require('express');
const cors = require('cors');

const roupasRoutes = require('./routes/roupasRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const vendasRoutes = require('./routes/vendasRoutes');

const app = express();
const PORT = 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota raiz - apenas para checar se a API esta no ar
app.get('/', (req, res) => {
    res.json({ mensagem: 'API Dome & Kids no ar!', versao: '1.0.0' });
});

// Ligando cada modulo de rotas ao seu prefixo
app.use('/roupas', roupasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/vendas', vendasRoutes);

// Tratamento simples para rotas nao encontradas
app.use((req, res) => {
    res.status(404).json({ erro: 'Rota nao encontrada.' });
});

app.listen(PORT, () => {
    console.log(`Servidor Dome & Kids rodando em http://localhost:${PORT}`);
});
