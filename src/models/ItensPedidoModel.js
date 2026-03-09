import prisma from "../utils/prismaClient.js";

export default class itemPedidoModel {
  constructor(id, pedidoId, produtoId, quantidade, precoUnitario) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.precoUnitario = precoUnitario;
  }

  async criar() {

    if (!this.quantidade || this.quantidade <= 0 || this.quantidade > 99) {
      return res.status(400).json({ error: "Quantidade deve estar entre 1 e 99" });
    }

    const produto = await prisma.produto.findUnique({
      where: { id: this.produtoId },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (!produto.disponivel) {
      return res.status(400).json({ error: "Produto não está disponível" });
    }


    return prisma.itemPedido.create({
      data: {
        pedidoId: this.pedidoId,
        produtoId: this.produtoId,
        quantidade: this.quantidade,
        precoUnitario: produto.preco,
      },
    });
  }

  async deletar(id) {

    const itemPedido = await prisma.itemPedido.findUnique({
      where: { id },
      include: { pedido: true },
    });

    if (!itemPedido) {
      return res.status(404).json({ error: "Item de pedido não encontrado" });
    }

    if (["PAGO", "CANCELADO"].includes(itemPedido.pedido.status)) {
      return res.status(400).json({ error: "Não é permitido remover itens de pedidos pagos ou cancelados" });
    }

    return prisma.itemPedido.delete({
      where: { id },
    });
  }

  static async buscarPorId(id) {
    return prisma.itemPedido.findUnique({
      where: { id },
      include: {
        pedido: true,
        produto: true,
      },
    });
  }

  static async buscarPorPedido(pedidoId) {
    return prisma.itemPedido.findMany({
      where: { pedidoId },
      include: {
        produto: true,
      },
    });
  }
}