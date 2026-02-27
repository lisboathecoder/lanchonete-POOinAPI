import prisma from '../utils/prismaClient.js';

export default class ClientesModel {
    constructor({ id = null, nome, telefone, email, cpf, cep, logradouro = null, bairro = null, localidade = null, uf = null, pedidos = [], ativo = true } = {}) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.pedidos = pedidos;
        this.ativo = ativo;
    }

    async criar() {
        const data = {
            nome: this.nome,
            telefone: this.telefone,
            email: this.email,
            cpf: this.cpf,
            cep: this.cep,
        };
        if (this.logradouro) data.logradouro = this.logradouro;
        if (this.bairro) data.bairro = this.bairro;
        if (this.localidade) data.localidade = this.localidade;
        if (this.uf) data.uf = this.uf;
        if (this.ativo !== undefined) data.ativo = this.ativo;

        return prisma.cliente.create({ data });
    }

    async atualizar() {
        const data = {};
        if (this.nome !== undefined) data.nome = this.nome;
        if (this.telefone !== undefined) data.telefone = this.telefone;
        if (this.email !== undefined) data.email = this.email;
        if (this.cpf !== undefined) data.cpf = this.cpf;
        if (this.cep !== undefined) data.cep = this.cep;
        if (this.logradouro !== undefined) data.logradouro = this.logradouro;
        if (this.bairro !== undefined) data.bairro = this.bairro;
        if (this.localidade !== undefined) data.localidade = this.localidade;
        if (this.uf !== undefined) data.uf = this.uf;
        if (this.ativo !== undefined) data.ativo = this.ativo;

        return prisma.cliente.update({ where: { id: this.id }, data });
    }

    async deletar() {
        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.telefone) where.telefone = parseInt(filtros.telefone);
        if (filtros.email) where.email = { contains: filtros.email, mode: 'insensitive' };
        if (filtros.cpf) where.cpf = parseInt(filtros.cpf);
        if (filtros.cep) where.cep = parseInt(filtros.cep);
        if (filtros.ativo !== undefined) where.ativo = filtros.ativo === 'true';

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) return null;
        return new ClientesModel(data);
    }
}
