// =========================================================
// vendasRoutes.js
// Endpoints da API relacionados as VENDAS
// =========================================================

const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');

router.get('/listar', vendasController.listar);
router.get('/buscar/:id', vendasController.buscarPorId);
router.post('/salvar', vendasController.salvar);
router.put('/editar/:id', vendasController.editar);
router.delete('/deletar/:id', vendasController.deletar);

module.exports = router;
