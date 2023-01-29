# Central de Pedidos (Monorepo)

Este é um monorepo para o projeto de Central de Pedidos. Aqui você encontrará todos os componentes e serviços necessários para a implementação do sistema.

## Escopo

**Aplicação Web**

- Pagina de criação de pedidos (Cliente)
- Pagina de gerencia de pedidos (Funcionário)
    - Visualização.
    - Marcar um pedido como pronto.
    - Marcar um pedido como entregue
    - Novos pedidos devem chegar em tempo real.
- Pagina de painel de senha (Cliente e TV)
    - ex: https://painelsenha.grupomadero.com.br/painel
    - Visualização dos números de pedidos prontos e preparando.
    - No mobile é ideal que não precise rolar a tela
    - Novos pedidos devem chegar em tempo real.
    - Pedidos entregues devem mudar de cor no painel e ficar com menos destaque

**API**

Especificação da API REST

A API REST fornece acesso aos recursos do sistema de forma simples e intuitiva. A seguir, são descritas as rotas disponíveis na API.

Endpoints

Recursos de pedidos

- `GET /api/orders` - Lista todos os pedidos do sistema
- `POST /api/orders` - Cria um novo pedido
- `PUT /api/order-status/:id` - Atualiza o status de um pedido (CRIADO, PREPARANDO, PRONTO, ENTREGUE)

Recursos de tempo real

- `SSE /api/orders-stream` - Este endpoint fornece uma stream de eventos das atualização de pedidos em tempo real.

Requisições

Request Headers

- `Content-Type: application/json`: Indica que o corpo da requisição é um objeto JSON.

Request Body

```json
{
    "keyx": "valorx",
    // ...
}
```

Repostas

Erro: (HTTP >= 400)

```json
{
  "message": "Descrição do erro"
}
```


## Estrutura de pastas

- `/client`: Contém o código fonte da aplicação cliente (React).
- `/server`: Contém o código fonte do servidor (Node.js).

