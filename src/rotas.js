const { Router } = require('express')
const { listarContasBancarias, criarContaBancario, atualizarUsuario, deletarConta, depositar, sacar, transferir, saldo, extrato} = require('./controladores/listarcontas')

const rotas = Router()

rotas.get('/:contas', listarContasBancarias)
rotas.post('/contas', criarContaBancario)
rotas.put('/contas/:numeroConta/usuario',atualizarUsuario)
rotas.delete('/contas/:numeroConta', deletarConta)
rotas.post('/transacoes/depositar',depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir',transferir)
rotas.get('/contas/saldo', saldo)
rotas.get('/contas/extrato',extrato)

module.exports = rotas