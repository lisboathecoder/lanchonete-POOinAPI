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
        const itemPedidoAberto = await prisma.itemPedido.findFirst({
            where: {
                produtoID: this.id,
                pedido: {
                    status: "Aberto"
                },
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

      static async buscarTodos(filtro = {}) {
        const where = {};

        if(filtro.nome) {
            where.nome= {
                contains: filtro.nome,
                mode: "insensitive"
            };
        }
        if (filtro.categoria) {
            where.categoria ={
                contains: filtro.categoria,
                mode: "insensitive"
            };
        }

         if (filtro.disponivel !== undefined){
            where.disponivel = filtro.disponivel === "true";
           
         }

         if(filtro.precoMin || filtro.precoMax){
            where.preco = {}
         }

         if(filtro.precoMin) {
            where.preco.gte = parseFloat(filtro.precoMin);
         }

         if (filtro.precoMax) {
            where.preco.lte = parseFloat(filtro.precoMax);
         }
         return prisma.produto.findMany({ where});
         
      }

        static async buscarPorId(id) {
            return prisma.produto.findUnique({
                where: {id}
            });
        }
}
