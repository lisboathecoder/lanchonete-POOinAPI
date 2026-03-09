# 🍽️ Restaurante POO in API

Projeto de API para gerenciamento de restaurante, desenvolvido com foco em **Programação Orientada a Objetos (POO)** e boas práticas de organização de código.

---

## 📌 Objetivo

Este projeto tem como objetivo disponibilizar uma API para operações comuns de um restaurante, como:

- cadastro de pratos;
- gerenciamento de pedidos;
- controle de clientes;
- organização do fluxo de atendimento.

---

## 🛠️ Tecnologias

> Ajuste esta seção conforme o que foi usado no projeto.

- Linguagem: `...`
- Framework/API: `...`
- Banco de dados: `...`
- ORM/Driver: `...`
- Ferramentas: `...`

---

## 📂 Estrutura do Projeto

```bash
restaurante-POOinAPI/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── routes/
│   └── ...
├── tests/
├── .env.example
├── package.json / pyproject.toml / pom.xml
└── README.md
```

---

## ▶️ Como executar

1. Clone o repositório:
    ```bash
    git clone <url-do-repositorio>
    cd restaurante-POOinAPI
    ```

2. Instale as dependências:
    ```bash
    # exemplo
    npm install
    ```

3. Configure as variáveis de ambiente:
    ```bash
    cp .env.example .env
    ```

4. Inicie a aplicação:
    ```bash
    # exemplo
    npm run dev
    ```

---

## 📡 Endpoints (exemplo)

| Método | Rota              | Descrição                   |
|-------:|-------------------|-----------------------------|
| GET    | `/api/pratos`     | Lista todos os pratos       |
| POST   | `/api/pedidos`    | Cria um novo pedido         |
| GET    | `/api/clientes`   | Lista clientes cadastrados  |
| PUT    | `/api/pedidos/:id`| Atualiza um pedido          |
| DELETE | `/api/pratos/:id` | Remove um prato             |

---

## ✅ Funcionalidades

- Arquitetura orientada a objetos;
- Separação por camadas (controller, service, model);
- Validação de dados de entrada;
- Tratamento de erros;
- Base preparada para testes.

---

## 👨‍💻 Autor

Projeto desenvolvido por **Lisboa**.

---

## 📄 Licença

Este projeto está sob a licença definida no repositório.