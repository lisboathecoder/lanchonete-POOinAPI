import ProdutosModel from "../models/ProdutoModel.js";

export const criar = async (req, res) => {
    try {
        const produto = new ProdutosModel(req.body);

        const data = await produto.criar();

        res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error("Erro ao criar:", error);
        res.status(500).json({ error: "Erro interno ao salvar o registro." });
    }
}

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
      return res.status(400).json({ error: "O ID enviado não é um número válido." });
      }

      const data = await ProdutosModel.buscarPorId(id);

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

      const produtoExiste = await ProdutosModel.buscarPorId(id);
      if (!produtoExiste) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para atualizar." });
    }
      const produto = new ProdutosModel({ id, ...req.body });
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

            const produtoExiste = await ProdutosModel.buscarPorId(id);
            if (!produtoExiste) {
                return res.status(404).json({ error: "Registro não encontrado para deletar." });
            }

            const produto = new ProdutosModel({ id: parsedInt(id) });
            const resultado = await produto.deletar();

            if (resultado.error) {
                return res.status(resultado.status).json({ error: resultado.error });
            }

            res.json({
                message: `O registro foi deletado com sucesso!`,
                deletado: produtoExiste,
            });
        } catch (error) {
            console.error("Erro ao deletar:", error);
            res.status(500).json({ error: "Erro ao deletar registro." });
        }
    };
