import ProdutosModel from "../models/ProdutosModel.js";

export const criar = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados!",
      });
    }
    const { nome, descricao, categoria, preco, disponivel = true } = req.body;

    if (!nome)
      return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
    if (!categoria)
      return res
        .status(400)
        .json({ error: 'O campo "categoria" é obrigatório!' });
    if (!preco)
      return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
    if (disponivel === false)
      return res
        .status(400)
        .json({ error: "O produto não pode ser adicionado com indisponível" });

    const parsedPrice = parseInt(preco);
    if (isNaN(parsedPrice)) {
      return res
        .status(400)
        .json({ error: "O preço precisa ser uma número válido" });
    }

    if (preco <= 0) {
      return res.status(400).json({
        error: "O preço precisa ser positivo",
      });
    }

    const produto = new ProdutosModel(nome, descricao, categoria, preco, ativo);
    const data = await produto.criar();

    res.status(201).json({ message: "Registro criado com sucesso!", data });
  } catch (error) {
    console.error("Erro ao criar:", error);
    res.status(500).json({ error: "Erro interno ao salvar o registro." });
  }
};

export const buscarTodos = async (req, res) => {
  try {
    const produtos = await ProdutosModel.buscarTodos();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const produto = new ProdutosModel(parseInt(id));
    const data = await produto.buscarPorId(id);
    if (!data) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    res.json({ data });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ error: "Erro ao buscar registro." });
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
    const produto = new ProdutosModel(parseInt(id));
    const produtoExiste = await produto.buscarPorId();
    if (!produtoExiste) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para atualizar." });
    }

    const data = await produto.atualizar();
    res.json({
      message: `O registro "${data.nome}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: "Erro ao atualizar registro." });
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const produto = new ProdutosModel(parseInt(id));
    const produtoExiste = await produto.buscarPorId();
    if (!produtoExiste) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para deletar." });
    }
    await produto.deletar();
    res.json({
      message: `O registro "${exists.nome}" foi deletado com sucesso!`,
      deletado: exists,
    });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: "Erro ao deletar registro." });
  }
};
