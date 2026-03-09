import PedidoModel from "../models/PedidosModel.js";
import prisma from "../utils/prismaClient.js";

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: "Corpo da requisição vazio. Envie os dados!",
            });
        }

        const { clienteId, itens } = req.body;

        if (clienteId === undefined || isNaN(clienteId)) {
            return res.status(400).json({
                error: 'O campo "clienteId" é obrigatório e deve ser numérico.',
            });
        }

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                error: 'O campo "itens" é obrigatório e deve conter ao menos 1 item.',
            });
        }

        const itensTratados = [];
        const produtoIds = [];

        for (const item of itens) {
            if (!item || item.produtoId === undefined || isNaN(item.produtoId)) {
                return res.status(400).json({
                    error: 'Cada item deve possuir "produtoId" numérico.',
                });
            }

            if (item.quantidade === undefined || isNaN(item.quantidade)) {
                return res.status(400).json({
                    error: 'Cada item deve possuir "quantidade" numérica.',
                });
            }

            const quantidade = parseInt(item.quantidade);
            if (quantidade <= 0) {
                return res.status(400).json({
                    error: 'A "quantidade" de cada item deve ser maior que zero.',
                });
            }

            const produtoId = parseInt(item.produtoId);
            itensTratados.push({ produtoId, quantidade });

            if (!produtoIds.includes(produtoId)) {
                produtoIds.push(produtoId);
            }
        }

        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(clienteId) },
        });

        if (!cliente) {
            return res.status(404).json({ error: "Cliente não encontrado." });
        }

        if (cliente.ativo === false) {
            return res.status(400).json({
                error: "Não é possível criar um pedido para esse cliente inativo.",
            });
        }

        const produtos = await prisma.produto.findMany({
            where: {
                id: { in: produtoIds },
                ativo: true,
            },
            select: {
                id: true,
                preco: true,
            },
        });

        if (produtos.length !== produtoIds.length) {
            return res.status(400).json({
                error: "Um ou mais produtos não foram encontrados ou estão inativos.",
            });
        }

        const itensParaCriar = [];
        let totalPedido = 0;

        for (const item of itensTratados) {
            const produto = produtos.find((p) => p.id === item.produtoId);

            if (!produto) {
                return res.status(400).json({
                    error: "Um ou mais produtos não foram encontrados ou estão inativos.",
                });
            }

            const precoUnitario = parseFloat(produto.preco);
            totalPedido += precoUnitario * item.quantidade;

            itensParaCriar.push({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario,
            });
        }

        const pedido = new PedidoModel({
            clienteId: parseInt(clienteId),
            total: totalPedido,
            status: "ABERTO",
            itens: itensParaCriar,
        });

        const data = await pedido.criar();

        return res.status(201).json({
            message: "Pedido criado com sucesso!",
            data,
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao salvar o pedido." });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const pedidos = await PedidoModel.buscarTodos(req.query);

        if (!pedidos || pedidos.length === 0) {
            return res.status(200).json({ message: "Nenhum pedido encontrado." });
        }

        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                error: "O ID enviado não é um número válido.",
            });
        }

        const pedido = await PedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado." });
        }

        return res.status(200).json(pedido);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar pedido." });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        if (!req.body) {
            return res.status(400).json({
                error: "Corpo da requisição vazio. Envie os dados!",
            });
        }

        let temCampoNoBody = false;
        for (const _campo in req.body) {
            temCampoNoBody = true;
            break;
        }

        if (!temCampoNoBody) {
            return res.status(400).json({
                error: "Corpo da requisição vazio. Envie os dados!",
            });
        }

        const pedido = await PedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido não encontrado para atualizar.",
            });
        }

        if (req.body.clienteId !== undefined) {
            if (isNaN(req.body.clienteId)) {
                return res.status(400).json({
                    error: 'O campo "clienteId" deve ser numérico.',
                });
            }

            const cliente = await prisma.cliente.findUnique({
                where: { id: parseInt(req.body.clienteId) },
            });

            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            if (cliente.ativo === false) {
                return res.status(400).json({
                    error: "Não é possível vincular pedido a cliente inativo.",
                });
            }

            pedido.clienteId = parseInt(req.body.clienteId);
        }

        if (req.body.total !== undefined) {
            const total = parseFloat(req.body.total);

            if (isNaN(total)) {
                return res.status(400).json({
                    error: 'O campo "total" deve ser numérico.',
                });
            }

            pedido.total = total;
        }

        if (req.body.status !== undefined) {
            if (req.body.status === "CANCELADO" && pedido.status !== "ABERTO") {
                return res.status(400).json({
                    error: "Só é possível cancelar um pedido que esteja ABERTO.",
                });
            }

            pedido.status = req.body.status;
        }

        const data = await pedido.atualizar();

        return res.status(200).json({
            message: `O pedido com id ${data.id} foi atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar pedido." });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        const pedido = await PedidoModel.buscarPorId(parseInt(id));

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido não encontrado para deletar.",
            });
        }

        await pedido.deletar();

        return res.status(200).json({
            message: `O pedido com o id ${pedido.id} foi deletado com sucesso!`,
            deletado: pedido,
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar pedido." });
    }
};