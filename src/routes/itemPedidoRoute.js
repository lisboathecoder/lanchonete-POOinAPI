import express from 'express';
import * as controller from '../controllers/itemPedidoController.js';

const router = express.Router();

router.post('/itens-pedido', controller.criarItemPedido);
router.get('/itens-pedido', controller.buscarTodosItensPedidos);
router.get('/itens-pedido/:id', controller.buscarItemPedidoPorId);
router.delete('/itens-pedido/:id', controller.removerItemPedido);
router.put('/itens-pedido/:id', controller.atualizarItemPedido);

export default router;
