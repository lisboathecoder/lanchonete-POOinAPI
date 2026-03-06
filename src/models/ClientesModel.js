import prisma from "../utils/prismaClient.js";

export default class ClientesModel {
  constructor({
    id = null,
    nome,
    telefone,
    email,
    cpf,
    cep,
    logradouro = null,
    bairro = null,
    localidade = null,
    uf = null,
    pedidos = [],
    ativo = true,
  } = {}) {
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

  async buscarTodos(filtros = {}) {
    const where = {};

    if (filtros.nome)
      where.nome = { contains: filtros.nome, mode: "insensitive" };
    if (filtros.telefone) where.telefone = parseInt(filtros.telefone);
    if (filtros.email)
      where.email = { contains: filtros.email, mode: "insensitive" };
    if (filtros.cpf) where.cpf = parseInt(filtros.cpf);
    if (filtros.cep) where.cep = parseInt(filtros.cep);
    if (filtros.ativo !== undefined) where.ativo = filtros.ativo === "true";

    return prisma.cliente.findMany({ where });
  }

  async buscarPorId() {
    if (!this.id) throw new Error("ID não definido para busca.");
    const registro = await prisma.cliente.findUnique({
      where: { id: this.id },
    });
    if (!registro) return null;
    this.id = registro.id;
    this.nome = registro.nome;
    this.telefone = registro.telefone;
    this.email = registro.email;
    this.cpf = registro.cpf;
    this.cep = registro.cep;
    this.logradouro = registro.logradouro;
    this.bairro = registro.bairro;
    this.localidade = registro.localidade;
    this.uf = registro.uf;
    this.pedidos = registro.pedidos;
    this.ativo = registro.ativo;
    return this;
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

    if (!data.nome)
      return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
    if (!data.telefone)
      return res
        .status(400)
        .json({ error: 'O campo "telefone" é obrigatório!' });
    const telefoneExiste = await ClientesModel.verificarTelefoneUnico(data.telefone);
    if (telefoneExiste)
      return res
        .status(400)
        .json({ error: "O telefone informado já está cadastrado!" });
    if (!data.email)
      return res.status(400).json({ error: 'O campo "email" é obrigatório!' });
    if (!data.cpf)
      return res.status(400).json({ error: 'O campo "cpf" é obrigatório!' });
    if (isNaN(data.cpf))
      return res
        .status(400)
        .json({ error: 'O campo "cpf" deve conter somente números!' });
    const cpfExiste = await ClientesModel.verificarCpfUnico(data.cpf);
    if (cpfExiste)
      return res
        .status(400)
        .json({ error: "O CPF informado já está cadastrado!" });

    if (data.cpf.toString().trim().length !== 11)
      return res
        .status(400)
        .json({ error: 'O campo "cpf" deve conter exatamente 11 dígitos!' });
    if (!data.cep)
      return res.status(400).json({ error: 'O campo "cep" é obrigatório!' });
    if (data.cep.toString().length !== 8)
      return res
        .status(400)
        .json({ error: 'O campo "cep" deve conter exatamente 8 dígitos!' });

    return prisma.cliente.create({ data });
  }

  async atualizar() {
    const id = Number(this.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido para atualização.");
    }

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

    return prisma.cliente.update({ where: { id }, data });
  }

  async deletar() {
    const id = Number(this.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID inválido para exclusão.");
    }

    return prisma.cliente.delete({ where: { id } });
  }

  static async buscarTodos(filtros = {}) {
    const where = {};

    if (filtros.nome)
      where.nome = { contains: filtros.nome, mode: "insensitive" };
    if (filtros.telefone) where.telefone = parseInt(filtros.telefone);
    if (filtros.email)
      where.email = { contains: filtros.email, mode: "insensitive" };
    if (filtros.cpf) where.cpf = parseInt(filtros.cpf);
    if (filtros.cep) where.cep = parseInt(filtros.cep);
    if (filtros.ativo !== undefined) where.ativo = filtros.ativo === "true";

    return prisma.cliente.findMany({ where });
  }

  static async buscarPorId(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) return null;

    const data = await prisma.cliente.findUnique({ where: { id: parsedId } });
    if (!data) return null;
    return new ClientesModel(data);
  }

  static async verificarTelefoneUnico(telefone) {
    const parsedTelefone = Number(telefone);
    if (Number.isNaN(parsedTelefone)) return false;

    const cliente = await prisma.cliente.findUnique({
      where: { telefone: parsedTelefone },
      select: { id: true },
    });

    return Boolean(cliente);
  }

  static async verificarCpfUnico(cpf) {
    const parsedCpf = Number(cpf);
    if (Number.isNaN(parsedCpf)) return false;

    const cliente = await prisma.cliente.findUnique({
      where: { cpf: parsedCpf },
      select: { id: true },
    });

    return Boolean(cliente);
  }
}
