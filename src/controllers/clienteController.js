import ClientesModel from "../models/ClientesModel.js";
import buscarEnderecoPorCep from "../utils/viaCep.js";
import { buscarClimaViaCep, sugestaoClima } from "../utils/clima.js";


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
    return res.status(500).json({ error: "Erro interno ao salvar o registro." });
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
    return res.status(500).json({ error: "Erro ao buscar registros." });
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
    return res.status(500).json({ error: "Erro ao buscar registro." });
 
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
    return res.status(500).json({ error: "Erro ao buscar clima." });
  }
};

export const atualizar = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID inválido. Informe um número válido." });
    }

    if (!req.body) {
      return res.status(400).json({
        error: "Envie pelo menos um campo para atualizar.",
      });
    }

    let temCampoNoBody = false;
    for (const _campo in req.body) {
      temCampoNoBody = true;
      break;
    }

    if (!temCampoNoBody) {
      return res.status(400).json({
        error: "Envie pelo menos um campo para atualizar.",
      });
    }

    const camposPermitidos = [
      "nome",
      "telefone",
      "email",
      "cpf",
      "cep",
      "logradouro",
      "bairro",
      "localidade",
      "uf",
      "pedidos",
      "ativo",
    ];

    const dadosAtualizacao = { id };

    for (let i = 0; i < camposPermitidos.length; i++) {
      const campo = camposPermitidos[i];
      if (req.body[campo] !== undefined) {
        dadosAtualizacao[campo] = req.body[campo];
      }
    }

    if (dadosAtualizacao.cep !== undefined) {
      const endereco = await buscarEnderecoPorCep(dadosAtualizacao.cep);
      if (!endereco) {
        return res
          .status(400)
          .json({ error: "CEP inválido ou não encontrado." });
      }

      dadosAtualizacao.logradouro = endereco.logradouro || null;
      dadosAtualizacao.bairro = endereco.bairro || null;
      dadosAtualizacao.localidade = endereco.localidade || null;
      dadosAtualizacao.uf = endereco.uf || null;
    }

    const cliente = new ClientesModel(dadosAtualizacao);
    const clienteAtualizado = await cliente.atualizar();

    return res.status(200).json({
      message: "O registro foi atualizado com sucesso!",
      clienteAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return res.status(500).json({ error: "Erro ao atualizar registro." });
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
    return res.status(500).json({ error: "Erro ao deletar registro." });
  }
};
