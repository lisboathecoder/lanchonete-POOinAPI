import prisma from "../utils/prismaClient.js";

export default class PedidoModel {
  constructor({
    id = null,
    nome = null,
    clienteId = null,
    produtos = [],
    total = 0.0,
    status = "ABERTO",
  } = {}) {
    this.id = id;
    this.nome = nome;
    this.clienteId = clienteId;
    this.produtos = produtos;
    this.total = total;
    this.status = status;
  }

  async criar() {
    return prisma.pedido.create({
      data: {
        nome: this.nome,
        clienteId: this.clienteId,
        total: this.total,
        status: this.status,
        produtos: {
          connect: this.produtos.map((produtoId) => ({ id: produtoId })),
        },
      },
    });
  }

  async atualizar() {
    return prisma.pedido.update({
      where: { id: this.id },
      data: {
        nome: this.nome,
        clienteId: this.clienteId,
        total: this.total,
        status: this.status,
        produtos: {
          set: this.produtos.map((produtoId) => ({ id: produtoId })),
        },
      },
    });
  }

  async deletar() {
    return prisma.pedido.delete({ where: { id: this.id } });
  }

  static async buscarTodos(filtros = {}) {
    const where = {};

    if (filtros.nome)
      where.nome = { contains: filtros.nome, mode: "insensitive" };
    if (filtros.clienteId) where.clienteId = parseInt(filtros.clienteId);
    if (filtros.status) where.status = filtros.status;

    return prisma.pedido.findMany({ where, include: { produtos: true } });
  }

  static async buscarPorId(id) {
    const data = await prisma.pedido.findUnique({
      where: { id },
      include: { produtos: true },
    });
    if (!data) return null;
    return new PedidoModel(data);
  }
}
