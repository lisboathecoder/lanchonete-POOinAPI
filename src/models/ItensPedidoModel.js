import prisma from "../utils/prismaClient.js";

export default class ItemPedido {
  constructor({
    id = null,
    pedidoId = null,
    produtoId = null,
    quantidade,
    precoUnitario,
  } = {}) {
    ((this.id = id), (this.pedidoId = pedidoId));
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.precoUnitario = precoUnitario;
  }
}
