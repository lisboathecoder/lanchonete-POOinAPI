import prisma from "../utils/prismaClient.js";

export default class PedidosModel {
  constructor({
    id = null,
    nome = null,
    clienteId = null,
    itens = [],
    total = 0.0,
    status = "ABERTO",
  } = {}) {
    this.id = id;
    this.clienteId = clienteId;
    this.itens = itens;
    this.total = total;
    this.status = status;
  }

  async criar() {
    return prisma.pedido.create({
      data: {
        clienteId: this.clienteId,
        total: this.total,
        status: this.status,
        itens: {
          create: this.itens,
        },
      },
      include: { itens: { include: { produto: true } } },
    });
  }

  async atualizar() {
    return prisma.pedido.update({
      where: { id: this.id },
      data: {
        clienteId: this.clienteId,
        total: this.total,
        status: this.status,
      },
    });
  }

  async deletar() {
    return prisma.pedido.delete({ where: { id: this.id } });
  }

  static async buscarTodos(filtros = {}) {
    const where = {};

    if (filtros.clienteId) where.clienteId = parseInt(filtros.clienteId);
    if (filtros.status) where.status = filtros.status;

    return prisma.pedido.findMany({
      where,
      include: { itens: { include: { produto: true } } },
    });
  }

  static async buscarPorId(id) {
    const data = await prisma.pedido.findUnique({
      where: { id },
      include: { itens: { include: { produto: true } } },
    });
    if (!data) return null;
    return new PedidosModel(data);
  }
}
