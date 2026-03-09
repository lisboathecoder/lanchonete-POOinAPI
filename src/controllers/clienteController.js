import ClientesModel from "../models/ClientesModel.js";
import buscarEnderecoPorCep from "../utils/viaCep.js";
import { buscarClimaViaCep, sugestaoClima } from "../utils/clima.js";

const erroBancoIndisponivel = (error) => {
  const mensagem = error?.message || "";

  return (
    error?.code === "ECONNREFUSED" ||
    error?.name === "PrismaClientInitializationError" ||
    mensagem.includes("ECONNREFUSED")
  );
};

const responderErro = (res, error, mensagemPadrao) => {
  if (erroBancoIndisponivel(error)) {
    return res.status(503).json({
      error: "Banco de dados indisponível no momento. Tente novamente em instantes.",
    });
  }

  return res.status(500).json({ error: mensagemPadrao });
};


export const criar = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados!",
      });
    }
    const {
      nome,
      telefone,
      email,
      cpf,
      cep,
      logradouro,
      bairro,
      localidade,
      uf,
      pedidos = [],
      ativo = true,
    } = req.body;

    let endereco;
    if (cep) {
      endereco = await buscarEnderecoPorCep(cep);
      if (!endereco) {
        return res
          .status(400)
          .json({ error: "CEP inválido ou não encontrado." });
      }
    }

    const cliente = new ClientesModel({
      nome,
      telefone,
      email,
      cpf,
      cep,
      logradouro: endereco?.logradouro || null,
      bairro: endereco?.bairro || null,
      localidade: endereco?.localidade || null,
      uf: endereco?.uf || null,
      pedidos,
      ativo,
    });
    const data = await cliente.criar();
    let clima = null;

    if (data?.cep) {
      try {
        clima = await buscarClimaViaCep(data.cep);
      } catch (error) {
        clima = null;
      }
    }

    res.status(201).json({ message: "Registro criado com sucesso!", data, clima });
  } catch (error) {
    console.error("Erro ao criar:", error);
    return responderErro(res, error, "Erro interno ao salvar o registro.");
  }
};
export const buscarTodos = async (req, res) => {
  try {
    const { nome, cpf, ativo } = req.query;
    const filtros = {};

    if (nome) filtros.nome = nome;
    if (cpf) filtros.cpf = cpf;
    if (ativo !== undefined) filtros.ativo = ativo === "true";

    const cliente = new ClientesModel();
    const registros = await cliente.buscarTodos(filtros);

    if (!registros || registros.length === 0) {
      return res.status(200).json({ message: "Nenhum registro encontrado." });
    }
    res.json(registros);
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return responderErro(res, error, "Erro ao buscar registros.");
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }
    const cliente = new ClientesModel({ id: parseInt(id) });
    const data = await cliente.buscarPorId();
    if (!data) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    res.json({ data });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return responderErro(res, error, "Erro ao buscar registro.");
 
  }
};

export const buscarClima = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }
    const cliente = new ClientesModel({ id: parseInt(id) });
    const data = await cliente.buscarPorId();
    if (!data) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    if (!data.cep) {
      return res
        .status(400)
        .json({ error: "O cliente não possui CEP cadastrado." });
    }
    const clima = await buscarClimaViaCep(data.cep);
    const sugestao = sugestaoClima(clima);
    res.json({ data, clima, sugestaoClima: sugestao });
  
  } catch (error) {
    console.error("Erro ao buscar clima:", error);
    return responderErro(res, error, "Erro ao buscar clima.");
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Corpo da requisição vazio. Envie os dados!" });
    }
    const cliente = new ClientesModel({ id: parseInt(id) });
    const exists = await cliente.buscarPorId();
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para atualizar." });
    }
    if (req.body.nome !== undefined) cliente.nome = req.body.nome;
    if (req.body.telefone !== undefined) cliente.telefone = req.body.telefone;
    if (req.body.email !== undefined) cliente.email = req.body.email;
    if (req.body.cpf !== undefined) cliente.cpf = req.body.cpf;
    if (req.body.cep !== undefined) cliente.cep = req.body.cep;
    if (req.body.logradouro !== undefined)
      cliente.logradouro = req.body.logradouro;
    if (req.body.bairro !== undefined) cliente.bairro = req.body.bairro;
    if (req.body.localidade !== undefined)
      cliente.localidade = req.body.localidade;
    if (req.body.uf !== undefined) cliente.uf = req.body.uf;
    if (req.body.pedidos !== undefined) cliente.pedidos = req.body.pedidos;
    if (req.body.ativo !== undefined) cliente.ativo = req.body.ativo;

    const data = await cliente.atualizar();
    res.json({
      message: `O registro "${data.nome}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return responderErro(res, error, "Erro ao atualizar registro.");
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const cliente = new ClientesModel({ id: parseInt(id) });
    const exists = await cliente.buscarPorId();
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para deletar." });
    }
    await cliente.deletar();
    res.json({
      message: `O registro "${exists.nome}" foi deletado com sucesso!`,
      deletado: exists,
    });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return responderErro(res, error, "Erro ao deletar registro.");
  }
};
