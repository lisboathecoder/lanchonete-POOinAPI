import prisma from '../utils/prismaClient.js';

export default class ItemPedido {
    constructor({ id = null, pedidoId = null, produtoId = null, quantidade, precoUnitario } = {}) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

    async criar() {
        if (this.quantidade <= 0 || this.quantidade > 99)
            return res
                .status(400)
                .json({ error: 'Quantidade deve ser maior que 0 e no máximo 99.' });

        const pedido = await prisma.pedido.findUnique({
            where: { id: this.pedidoId },
        });

        if (!pedido) {
            throw new Error('Pedido não encontrado.');
        }

        if (pedido.status === 'PAGO' || pedido.status === 'CANCELADO') {
            throw new Error('Não é possível adicionar itens a um pedido PAGO ou CANCELADO.');
        }

        const produto = await prisma.produto.findUnique({
            where: { id: this.produtoId },
        });

        if (!produto) {
            throw new Error('Produto não encontrado.');
        }

        if (!produto.disponivel) {
            throw new Error('Não é possível adicionar produto indisponível ao pedido.');
        }

        const item = await prisma.itemPedido.create({
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: produto.preco,
            },
        });

        return item;
    }

    static async buscarPorId(id) {
        return prisma.itemPedido.findUnique({
            where: { id },
            include: {
                produto: true,
            },
        });
    }

    async atualizar() {
        if (this.quantidade <= 0 || this.quantidade > 99) {
            throw new Error('Quantidade deve ser maior que 0 e no máximo 99.');
        }

        const item = await prisma.itemPedido.findUnique({
            where: { id: this.id },
            include: { pedido: true },
        });

        if (!item) {
            throw new Error('ItemPedido não encontrado.');
        }

        if (item.pedido.status === 'PAGO' || item.pedido.status === 'CANCELADO') {
            throw new Error('Não é possível alterar itens de um pedido PAGO ou CANCELADO.');
        }

        return prisma.itemPedido.update({
            where: { id: this.id },
            data: {
                quantidade: this.quantidade,
            },
        });
    }

    static async deletar(id) {
        const item = await prisma.itemPedido.findUnique({
            where: { id },
            include: { pedido: true },
        });

        if (!item) {
            throw new Error('ItemPedido não encontrado.');
        }

        if (item.pedido.status === 'PAGO' || item.pedido.status === 'CANCELADO') {
            throw new Error('Não é possível remover item de pedido PAGO ou CANCELADO.');
        }

        return prisma.itemPedido.delete({
            where: { id },
        });
    }

    static async buscarTodos() {
        const itens = await prisma.itemPedido.findMany({
            include: {
                produto: true,
                pedido: true,
            },
        });

        if (!itens || itens.length === 0) {
            throw new Error('Nenhum item de pedido encontrado.');
        }

        return itens;
    }
}
