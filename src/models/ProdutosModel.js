import prisma from '../utils/prismaClient.js';

export default class ProdutosModel {
    constructor({ id = null, nome, descricao, categoria, preco, disponivel } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.preco = preco;
        this.disponivel = disponivel;
    }

    async criar() {
        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel
            }
        });
    }

    async atualizar() {
        return prisma.produto.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel
            }
        });
    }

    async deletar() {
        const itemPedidoAberto = await prisma.itemPedido.findFisrt({
            where: {
                produtoID: this.id,
                pedido: {status: "Aberto"},
            },
        });

        if (itemPedidoAberto) {
            return {
                status: 400,
                error: "Não é possível deletar um produto vinculado a pedido aberto"
            };
        }

        await prisma.produto.delete({
            where: {id: this.id},
        });

        return{status:200};
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.categoria) where.categoria = { contains: filtros.categoria, mode: 'insensitive' };
        if (filtros.disponivel !== undefined) where.disponivel = filtros.disponivel === 'true';
        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        return prisma.produto.findUnique({ where: { id } });


    }

  

}
