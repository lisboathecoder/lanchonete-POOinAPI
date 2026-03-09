import prisma from '../utils/prismaClient.js';

export default class ItemPedido {
    constructor({ id = null, pedidoId, produtoId, quantidade, precoUnitario } = {}) {
        (this.id = id), (this.pedidoId = pedidoId);
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

    async criar() {
        if (!this.pedidoId) {
            throw new Error(`O preenchimento do campo "pedidoId" é obrigatório!`);
        }
        if (!this.produtoId) {
            throw new Error(`O preenchimento do campo "produtoId" é obrigatório!`);
        }
        if (!this.quantidade || this.quantidade <= 0) {
            throw new Error(`O preenchimento do campo "quantidade" é obrigatório!`);
        }
        if (!this.precoUnitario) {
            throw new Error(`O preenchimento do campo "precoUnitário" é obrigatório!`);
        }
        const produto = await prisma.produto.findUnique({
            where: {
                id: this.produtoId,
            },
        });

        if (this.quantidade <= 0 || this.quantidade >= 100) {
            throw new Error(`A quantidade deve estar entre 1 e 99!`);
        }

        if (!produto) {
            throw new Error(`Produto com ID ${this.produtoId} não encontrado!`);
        }
        this.precoUnitario = produto.preco;

        if (produto.disponivel === false) {
            throw new Error(`Não é possível adicionar um produto não disponível ao pedido!`);
        }

        const itemPedidoCriado = await prisma.itemPedido.create({
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: this.precoUnitario,
            },
        });
        this.id = itemPedidoCriado.id;

        return itemPedidoCriado;
    }

    async remover() {
        if (!this.id) {
            throw new Error(`O ID do item do pedido é obrigatório para ser removido!`);
        }
        const itemPedidoRemovido = await prisma.itemPedido.delete({
            where: {
                id: this.id,
            },
        });

        if (itemPedidoRemovido.pedidoId) {
            const pedido = await prisma.pedido.findUnique({
                where: {
                    id: itemPedidoRemovido.pedidoId,
                },
            });
            if (pedido.status === 'PAGO' || pedido.status === 'CANCELADO') {
                throw new Error(`Não é possível remover um item de um pedido ${pedido.status}!`);
            }
        }
        return itemPedidoRemovido;
    }

    static async buscarPorId(id) {
        const itemPedido = await prisma.itemPedido.findUnique({
            where: {
                id: id,
            },
        });
        return itemPedido;
    }

    static async buscarTodos() {
        const itensPedido = await prisma.itemPedido.findMany();
        return itensPedido;
    }

    async atualizar() {
        if (!this.id) {
            throw new Error(`O ID do item do pedido é obrigatório para ser atualizado!`);
        }
        if (!this.quantidade || this.quantidade <= 0) {
            throw new Error(`A quantidade deve ser maior que zero!`);
        }
        const itemPedidoAtualizado = await prisma.itemPedido.update({
            where: {
                id: this.id,
            },
            data: {
                quantidade: this.quantidade,
                precoUnitario: this.precoUnitario,
            },
        });
        return itemPedidoAtualizado;
    }
}
