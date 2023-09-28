![](https://i.imgur.com/xG74tOh.png)

# Desafio Módulo 2 - Back-end - Cubos academy - API BANK


## Descrição do desafio

O Desafio consiste em criar uma API simulando as mesmas funções de um banco de uma maneira mais simplificada porém seguindo o mesmo princípio

---
## 📜 Funções

- Atualizar usuário da conta bancária
- Criar usuário
- Depositar valor
- Exibir saldo
- Extrato bancário
- Listar usuários de contas bancárias
- Remover usuário da conta bancária
- Sacar valor
- Transferir valor entre contas

## ⚙️ Como executar o projeto

### Pré-requisitos

![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Insomnia](https://img.shields.io/badge/Insomnia-4000BF.svg?style=for-the-badge&logo=Insomnia&logoColor=white)

#### 💻 Rodando o Backend

```bash
# Clone este repositório
$ git clone git@github.com:Guilhames/desafio-backend-modulo-02-sistema-bancario-b2b-ifood-t07.git

# Acesse a pasta do projeto no terminal/cmd
$ cd desafio-backend-modulo-02-sistema-bancario-b2b-ifood-t07

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta:3000 - acesse http://localhost:3000 
```

## 🛣️ Endpoints

Antes de dar dar sequência aos endpoints, todas as requisições que necessitam de body precisam ser em formato de texto JSON que devera ser inserido através do app __Insomnia__ para que funcione

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Esse endpoint deverá listar todas as contas bancárias existentes se a requisição da senha for correta.

-   **Requisição** - query params (respeitando este nome)

    -   senha_banco


### Criar conta bancária

#### `POST` `/contas`

Esse endpoint deverá criar uma conta bancária, onde será gerado um número único para identificação da conta (número da conta).

-   **Requisição** - O corpo (body) deverá conter obrigatoriamente todas as propriedades seguintes (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

#### Exemplo de Requisição

```javascript
// POST /contas
{
    "nome": "Guilherme gameplay",
    "cpf": "00011111234",
    "data_nascimento": "2001-11-09",
    "telefone": "99999998888",
    "email": "guizinho_rei_delas@gmail.com",
    "senha": "1234"
}
```


### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint deverá atualizar os dados da conta bancária informada no parametro `:numeroConta` se a conta existir.

-   **Requisição** - O corpo (body) deverá possuir os dados que a pessoa necessita alterar podendo ser estes:

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

#### Exemplo de Requisição 1
```javascript
// PUT /contas/:numeroConta/usuario
{
    "nome": "Guilherme Rodrigues",
    "cpf": "99911822234",
    "data_nascimento": "2001-11-09",
    "telefone": "99999998888",
    "email": "guizinho_do_freefire@gmail.com",
    "senha": "1234"
{
```
Não é necessário inserir todos os dados apenas os que deseja alterar, se o cpf ou email já possuir em alguma outra conta existente no banco de dados não sera possível concluir as alterações

#### Exemplo de Requisição 2
```javascript
// PUT /contas/:numeroConta/usuario
{
    "nome": "Guilherme Rodrigues",
    "senha": "1234"
{
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint deve excluir uma conta bancária existente do parametro `:numeroConta` presente na URL se a conta existente não possuir nenhum saldo.

 ### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint deverá somar o valor do depósito ao saldo de uma conta válida e registrar essa transação.

-   **Requisição**

    -   numero_conta
    -   valor

#### Exemplo de Requisição
```javascript
// POST /transacoes/depositar
{
	"numero_conta": "1",
	"valor": 1900
}
```


### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint deverá realizar o saque de um valor em uma determinada conta bancária e registrar essa transação somente se a senha for válida.

-   **Requisição** -

    -   numero_conta
    -   valor
    -   senha

#### Exemplo de Requisição
```javascript
// POST /transacoes/sacar
{
  "numero_conta": "1",
  "valor": 1900,
  "senha": "1234"
}
```


### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint deverá permitir a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.

-   **Requisição**

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha

#### Exemplo de Requisição
```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "1234"
}
```


### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint deverá retornar o saldo de uma conta bancária.

-   **Requisição** - query params

    -   numero_conta
    -   senha


### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint deverá listar as transações realizadas de uma conta específica se o query params `senha` estiver correto com o query params `numero_conta`.

-   **Requisição** - query params

    -   numero_conta
    -   senha
