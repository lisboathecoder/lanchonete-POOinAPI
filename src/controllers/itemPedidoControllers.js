import ItemPedido from '../models/ItensPedidoModel.js';

export const criarItemPedido = async (req, res) => {
    try {
        const { pedidoId, produtoId, quantidade } = req.body;
        const itemPedido = new ItemPedido({ pedidoId, produtoId, quantidade });
        const itemPedidoCriado = await itemPedido.criar();
        res.status(201).json(itemPedidoCriado);
    } catch (error) {
        res.status(400).json({ error: error.message || "Erro ao criar o item do pedido." });
    }
};

export const removerItemPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const itemPedido = new ItemPedido({ id });
        const itemPedidoRemovido = await itemPedido.remover();
        res.json(itemPedidoRemovido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const buscarTodosItensPedidos = async (req, res) => {
    try {
        const itensPedidos = await ItemPedido.buscarTodos();
        res.json(itensPedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const buscarItemPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const itemPedido = await ItemPedido.buscarPorId(id);
        if (!itemPedido) {
            return res.status(404).json({ error: "Item do pedido não encontrado." });
        }
        res.json(itemPedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
