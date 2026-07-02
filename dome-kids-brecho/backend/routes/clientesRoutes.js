// =========================================================
// clientesRoutes.js
// Endpoints da API relacionados ao CADASTRO DE CLIENTES
// =========================================================

const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/listar', clientesController.listar);
router.get('/buscar/:id', clientesController.buscarPorId);
router.post('/salvar', clientesController.salvar);
router.put('/editar/:id', clientesController.editar);
router.delete('/deletar/:id', clientesController.deletar);

module.exports = router;
