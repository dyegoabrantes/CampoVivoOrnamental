const express = require('express'),
      passport = require('passport'),
      passportService = require('./../config/passport');
const router = express.Router();

const authController = require('./../controllers/auth.controller');
const estoqueController = require('./../controllers/estoque.controller');
const colaboradorController = require('./../controllers/colaborador.controller');
const usuarioController = require('./../controllers/usuario.controller');

const requireAuth = passport.authenticate('jwt',  {session: false});
const requireLogin = passport.authenticate('local', {session: false});

// auth
router.post('/auth/entrar', requireLogin, authController.login);
router.post('/auth/registrar', requireAuth, authController.roleAuthorization(['admin']), authController.register);
router.post('/auth/recuperar-senha', authController.recoverPassword);
router.get('/auth/resetar-senha', authController.resetPassword);
router.post('/auth/resetar-senha', authController.resetPassword);
// to avoid search three times, the auth is done inside the logout route
router.post('/auth/logout', authController.logout);
router.get('/auth/protected', requireAuth, function(req, res) {
  res.status(200).end();
});

// estoque
router.get('/estoque', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.listarItens);
router.post('/estoque/adicionar', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.registrarEntrada);
router.get('/estoque/buscar', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.executarBuscaGeral);
router.get('/estoque/permanentes-em-uso', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.listarPermanentesEmUso);
router.get('/estoque/permanentes-em-uso/:id', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.obterPermanenteEmUso);
router.post('/estoque/registrar-devolucao', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.registrarDevolucao);
router.get('/estoque/historico-compras/:id', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.obterHistoricoCompras);
router.get('/estoque/historico-compras/:id/compra/:id_compra', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.obterCompra);
router.put('/estoque/historico-compras/:id/compra/:id_compra', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.atualizarCompra);
router.get('/estoque/:id', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.obterItem);
router.delete('/estoque/:id/remover-compra/:compra', requireAuth, authController.roleAuthorization(['admin']), estoqueController.removerCompra);
router.delete('/estoque/:id', requireAuth, authController.roleAuthorization(['admin']), estoqueController.removerItem);
router.put('/estoque/:id', requireAuth, authController.roleAuthorization(['admin']), estoqueController.atualizarItem);
router.put('/estoque/nova-compra/:id', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.registrarNovaCompra);
router.post('/estoque/busca-descricao', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.buscarPorDescricao);
router.post('/estoque/saida', requireAuth, authController.roleAuthorization(['user', 'admin']), estoqueController.registrarSaida);

// colaborador
router.get('/colaboradores', requireAuth, authController.roleAuthorization(['user', 'admin']), colaboradorController.listarColaboradores);
router.post('/colaboradores/adicionar', requireAuth, authController.roleAuthorization(['user', 'admin']), colaboradorController.adicionarColaborador);
router.get('/colaboradores/buscar', requireAuth, authController.roleAuthorization(['user', 'admin']), colaboradorController.executarBuscaGeral);
router.get('/colaboradores/:id', requireAuth, authController.roleAuthorization(['user', 'admin']), colaboradorController.obterColaborador);
router.delete('/colaboradores/:id', requireAuth, authController.roleAuthorization(['admin']), colaboradorController.removerColaborador);
router.put('/colaboradores/:id', requireAuth, authController.roleAuthorization(['admin']), colaboradorController.atualizarColaborador);
router.post('/colaboradores/checa-cpf', requireAuth, authController.roleAuthorization(['user', 'admin']), colaboradorController.checarCpf);
router.post('/colaboradores/busca-nome', requireAuth, authController.roleAuthorization(['user', 'admin']), colaboradorController.buscarPorNome);

//usuario
router.get('/usuarios', requireAuth, authController.roleAuthorization(['user', 'admin']), usuarioController.listarUsuarios);
router.delete('/usuarios/:id', requireAuth, authController.roleAuthorization(['admin']), usuarioController.removerUsuario);

// todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), TodoController.getTodos);
// todoRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['creator','editor']), TodoController.createTodo);
// todoRoutes.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), TodoController.deleteTodo);

module.exports = router;
