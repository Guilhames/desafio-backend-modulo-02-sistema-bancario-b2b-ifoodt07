const bancodedados = require("../bancodedados")
const { format } = require('date-fns')
const contaExistente = (cpf, email) => bancodedados.contas.some(conta => {
    return conta.usuario.cpf === cpf || conta.usuario.email === email;
});

const encontrarConta = (numeroConta) => bancodedados.contas.find(numerodaconta => {
    return numerodaconta.numero == numeroConta
})

const listarContasBancarias = (req, res) => {
    const { contas } = req.params
    const senha_banco = req.query.senha_banco

    if (senha_banco != bancodedados.banco.senha) {
        return res.status(400).json({ mensagem: "A senha do banco informada é inválida" })
    }

    return res.json(bancodedados.contas)
}

const criarContaBancario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Você não preencheu todos os campos corretamente" })
    }

    if (contaExistente(cpf, email)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }
    const encontrarLacunaNoNumeroDeContas = () => {
        const contas = bancodedados.contas;
        contas.sort((a, b) => a.numero - b.numero);

        let lacunaEncontrada = 1;

        for (let i = 0; i < contas.length; i++) {
            if (contas[i].numero !== lacunaEncontrada) {

                break;
            }
            lacunaEncontrada++;
        }

        return lacunaEncontrada;
    }
    numero = encontrarLacunaNoNumeroDeContas()
    bancodedados.contas.push({
        numero,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    })


    return res.json()
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const { cpf, email } = req.body
    const contaEncontrada = encontrarConta(numeroConta)
    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada" })
    }
    if (contaExistente(cpf, email)) {
        return res.status(400).json({ mensagem: "cpf ou e-mail informado já existe cadastrado!" })
    } else {
        for (const objeto in req.body) {
            contaEncontrada.usuario[objeto] = req.body[objeto]
        }
    }
    return res.send()
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params
    const contaEncontrada = encontrarConta(numeroConta)
    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada" })
    }
    if (contaEncontrada.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    }

    const deletar = bancodedados.contas.filter(objeto => {
        return objeto != contaEncontrada
    })
    bancodedados.contas = deletar
    return res.send()
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    const conta = encontrarConta(numero_conta)
    if (!encontrarConta(numero_conta)) {
        return res.status(400).json({ mensagem: "Numero da conta não encontrado" })
    }
    if (valor <= 0 || !valor) {
        return res.status(400).json({ mensagem: "Valor inválido" })
    }

    conta.saldo += valor
    const dataDeposito = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    let transacao = {
        data: dataDeposito,
        numero_conta,
        valor
    }

    bancodedados.depositos.push(transacao)
    return res.send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    const conta = encontrarConta(numero_conta)
    if (!conta) {
        return res.status(400).json({ mensagem: 'Conta não encontrada' })
    }

    if (valor > conta.saldo || valor <= 0) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente ou valor inválido' })
    }

    if (senha != conta.usuario.senha) {
        return res.status(401).json({ mnesamge: 'Senha incorreta' })
    }

    conta.saldo -= valor
    const dataDeposito = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let transacao = {
        data: dataDeposito,
        numero_conta,
        valor
    }
    bancodedados.saques.push(transacao)
    return res.send()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
    const contaOrigem = encontrarConta(numero_conta_origem)
    const contaDestino = encontrarConta(numero_conta_destino)

    if (!contaOrigem || !contaDestino || contaDestino == contaOrigem) {
        return res.status(400).json({ mensagem: 'Conta origem ou destino inválido' })
    }
    if (!senha || senha != contaOrigem.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha inválida' })
    }
    if (!valor || valor > contaOrigem.saldo || valor <= 0) {
        return res.status(400).json({ mensagem: 'Não foi possível realizar a transação, verifique se o valor esta correto' })
    }

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const dataDeposito = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    let transacao = {
        data: dataDeposito,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    bancodedados.transferencias.push(transacao)
    return res.send();
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query
    const conta = encontrarConta(numero_conta)
    if (!conta || !senha || conta.usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'Conta bancária ou senha inválida' })
    }
    return res.json({ saldo: conta.saldo })
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query
    const conta = encontrarConta(numero_conta)
    if (!conta || !senha || conta.usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'Conta bancária ou senha inválida' })
    }

    const depositos = bancodedados.depositos.filter(numero => numero.numero_conta == numero_conta)
    const saques = bancodedados.saques.filter(numero => numero.numero_conta == numero_conta)
    const transferenciasEnviadas = bancodedados.transferencias.filter(numero => numero.numero_conta_origem == numero_conta)
    const transferenciasRecebidas = bancodedados.transferencias.filter(numero => numero.numero_conta_destino == numero_conta)

res.json({depositos,
saques,
transferenciasEnviadas,
transferenciasRecebidas})
}



module.exports = { listarContasBancarias, criarContaBancario, atualizarUsuario, deletarConta, depositar, sacar, transferir, saldo, extrato }
