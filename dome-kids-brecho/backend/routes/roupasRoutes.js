// =========================================================
// roupasRoutes.js
// Endpoints da API relacionados ao CADASTRO DE ROUPAS
// =========================================================

const express = require('express');
const router = express.Router();
const roupasController = require('../controllers/roupasController');

router.get('/listar', roupasController.listar);
router.get('/buscar/:id', roupasController.buscarPorId);
router.post('/salvar', roupasController.salvar);
router.put('/editar/:id', roupasController.editar);
router.delete('/deletar/:id', roupasController.deletar);

module.exports = router;
