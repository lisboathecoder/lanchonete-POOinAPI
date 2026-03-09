import prisma from "../utils/prismaClient.js";

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
        if (!this.nome || this.nome.trim().length < 3) {
            throw new Error('O campo "nome" é obrigatório e precisa ter pelo menos três caracteres.');
        }
        if (!this.categoria) {
            throw new Error('O campo "categoria" é obrigatório!');
        }
        if (this.preco === undefined || this.preco <= 0) {
            throw new Error('O "preco" deve ser definido e ser maior que 0');
        }
        if (this.descricao && this.descricao.length >= 255) {
            throw new Error('O campo "descricao" pode ter no máximo apenas 255 caracteres');
        }
        if (this.disponivel === false) {
            throw new Error("O produto não pode ser adicionado com indisponível");
        }

        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: parseFloat(this.preco),
                disponivel: this.disponivel ?? true
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
        const itemPedidoAberto = await prisma.itemPedido.findFirst({
            where: {
                produtoID: this.id,
                pedido: { status: "ABERTO" }
            }
        });

        if (itemPedidoAberto) {
            return {
                status: 400,
                error: "Não é possível deletar um produto vinculado a pedido aberto"
            };
        }

        return prisma.produto.delete({
            where: { id: this.id }
        });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = {
                contains: filtros.nome,
                mode: "insensitive"
            };
        }

        if (filtros.categoria) {
            where.categoria = {
                contains: filtros.categoria,
                mode: "insensitive"
            };
        }

        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === true;
        }

        if (filtros.precoMax) {
            where.preco = {
                lte: parseFloat(filtros.precoMax)
            };
        }

        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        return prisma.produto.findUnique({ where: { id } });
    }
}