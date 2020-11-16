const async = require('async'),
			sanitize = require('mongo-sanitize'),
			errorHandler = require('./error-handler.controller');

const ItemEstoque = require('./../models/item-estoque.model');
const SaidaEstoque = require('./../models/saida-estoque.model');

const resultsPerPage = 15;

const date_sort_desc = function (date1, date2) {
	if (date1 > date2) return -1;
	if (date1 < date2) return 1;
	return 0;
};

exports.registrarEntrada = function(req, res) {
	let descricao = req.body.descricao;
	let tipo = req.body.tipo;
	let categoria = req.body.categoria;
	let ultimaCompra = req.body.dataEntrada;
	let unidade = req.body.unidade;
	let quantidade = req.body.quantidade;
	let valorUnitario = req.body.valorUnitario;
	let historicoCompras = {
		data: ultimaCompra,
		quantidade: quantidade,
		valorUnitario: valorUnitario,
		anotacoes: req.body.anotacoes
	};
	if (descricao && tipo && categoria && ultimaCompra && unidade && quantidade && valorUnitario) {
		if (quantidade > 0) {
			let itemEstoque = new ItemEstoque({
				descricao: descricao,
				tipo: tipo,
				categoria: categoria,
				ultimaCompra: ultimaCompra,
				unidade: unidade,
				quantidade: quantidade,
				valorUnitario: valorUnitario,
				historicoCompras: historicoCompras});
			itemEstoque.validate(function(err) {
				if (err) {
					errorHandler.answerWithError({custom_code: 400}, req, res);	
				} else {
					itemEstoque.save(function(err, item) {
						if (err) {
							errorHandler.answerWithError(err, req, res);
						} else {
							res.status(200).send({message: 'Added'});
						}
					});
				}
			});
		} else {
			errorHandler.answerWithError({custom_code: 400}, req, res);			
		}
	} else {
		errorHandler.answerWithError({custom_code: 400}, req, res);
	}
}

exports.listarItens = function(req, res) {
	let pageQuery = 0;
	if (req.query.page && req.query.page > 1) {
		pageQuery = req.query.page - 1;
	}
	ItemEstoque.count({}, function(err, count) {
		if (err) {
			errorHandler.answerWithError(err, req, res);
		} else {
			ItemEstoque.find({})
								 .select('descricao tipo categoria quantidade unidade ultimaCompra')
								 .limit(resultsPerPage)
								 .skip(pageQuery * resultsPerPage)
								 .sort({'updatedAt': -1, 'quantidade': -1})
								 .lean().exec(function(err, itens) {
				if (err) {
					errorHandler.answerWithError(err, req, res);
				} else {
					itens.forEach(function(item) {
						item.valorUnitario = (item.valorUnitario / 100).toFixed(2);
					}); 
					res.status(200).json({totalCount: count, itens: itens});
				}
			});
		}
	});
}

// não envia histórico de compras
exports.obterItem = function(req, res) {
	let s_id = sanitize(req.params.id);
	ItemEstoque.findById(s_id).lean().exec(function(err, item) {
		if (err) {
			errorHandler.answerWithError(err, req, res);
		} else if (item) {
			item.valorUnitario = (item.valorUnitario / 100).toFixed(2);
			item.dataEntrada = item.ultimaCompra;
			item.ultimaCompra = undefined;
			item.anotacoes = item.historicoCompras[item.historicoCompras.length - 1].anotacoes;
			item.historicoCompras = undefined;
			res.status(200).send(item);
		} else {
			errorHandler.answerWithError({custom_code: 404}, req, res);
		}
	});
}

exports.obterHistoricoCompras = function(req, res) {
	try {
		let s_id = sanitize(req.params.id);
		ItemEstoque.findById(s_id).select('historicoCompras').lean().exec(function(err, item) {
			if (err) {
				errorHandler.answerWithError(err);
			} else if (!err && !item) {
				errorHandler.answerWithError({custom_code: 400}, req, res);
			} else {
				item.historicoCompras.forEach(function(_item) {
					_item.valorUnitario = (_item.valorUnitario / 100).toFixed(2);
				});
				res.status(200).send({historico: item.historicoCompras});
			}
		})
	} 
	catch (e) {
		errorHandler.answerWithError({custom_code: 400}, req, res);
	}
}

exports.removerItem = function(req, res) {
	let s_id = sanitize(req.params.id);
	SaidaEstoque.find({'itens.item': s_id}).exec(function(err, saidas) {
		if (err) {
			done(err);
		} else if (!err && !saidas) {
			done({custom_code: 400});
		} else {
			let quantidade_emprestada = 0;
			saidas.forEach(function(saida) {
				for (let i = 0; i < saida.itens.length; i++) {
					quantidade_emprestada += saida.itens[i].quantidade;
				}
			});
			if (quantidade_emprestada > 0) {
				errorHandler.answerWithError({custom_code: 422, custom_message: {itensEmprestados: quantidade_emprestada}}, req, res);
			} else {
				ItemEstoque.findByIdAndRemove(s_id).exec(function(err, item) {
					if (err) {
						errorHandler.answerWithError(err, req, res);
					} else if (item) {
						res.status(200).send({message: "Removed"});
					} else {
						errorHandler.answerWithError({custom_code: 404}, req, res);
					}
				});
			}
		}
	});
}

exports.atualizarItem = function(req, res) {
	let s_id = sanitize(req.body._id);
	ItemEstoque.findByIdAndUpdate({ _id: s_id}, { 'descricao': req.body.descricao,
												  'tipo': req.body.tipo,
												  'categoria': req.body.categoria,
												  'unidade': req.body.unidade },
												  { new: true }, function(err, item) {
		if (err) {
			errorHandler.answerWithError(err);
		} else if (item){
			res.status(200).send(item);
		} else {
			errorHandler.answerWithError({custom_code: 404});
		}
	});
}

exports.registrarNovaCompra = function(req, res) {
	let s_id = req.body._id;
	let unidade = req.body.unidade;
	let quantidade = req.body.quantidade;
	let valorUnitario = req.body.valorUnitario;
	let dataEntrada = req.body.dataEntrada;
	let anotacoes = req.body.anotacoes;

	if (s_id && dataEntrada && unidade && valorUnitario) {
		let novoHistorico = {
			data: dataEntrada,
			quantidade: quantidade,
			valorUnitario: valorUnitario,
			anotacoes: anotacoes
		};
		ItemEstoque.findById(s_id).exec(function(err, item) {
			if (err) {
				errorHandler.answerWithError(err);
			} else if (!err && !item) {
				errorHandler.answerWithError({custom_code: 400}, req, res);
			} else {
				item.valorUnitario = valorUnitario;
				item.quantidade = item.quantidade + quantidade;
				item.historicoCompras.push(novoHistorico);
				let datas = [];
				item.historicoCompras.forEach(function(item_historico) {
					datas.push(item_historico.data);
				});
				item.ultimaCompra = datas.sort(date_sort_desc)[0];
				item.save(function(err, item) {
					if (err) {
						errorHandler.answerWithError(err, req, res);
					} else {
						res.status(200).send({Message: 'Added'});
					}
				})				
			}
		});
	} else {
		errorHandler.answerWithError({custom_code: 400}, req, res);
	}
}

exports.obterCompra = function(req, res) {
	let s_item_id = sanitize(req.params.id);
	let s_compra_id = sanitize(req.params.id_compra);
	ItemEstoque.findOne({'historicoCompras._id': s_compra_id}).lean().exec(function(err, item) {
		if (err) {
			errorHandler.answerWithError({custom_code: 400}, req, res);
		} else if (!err && !item) {
			errorHandler.answerWithError({custom_code: 400}, req, res);
		} else {
			let posCompra;
			for (let i = 0; i < item.historicoCompras.length; i++) {
				if (item.historicoCompras[i]._id.toString() === s_compra_id) {
					posCompra = i;
				}
			}
			let compra = item.historicoCompras[posCompra];
			compra.valorUnitario = (compra.valorUnitario / 100).toFixed(2);
			res.status(200).send({unidadeItem: item.unidade, compra: compra});
		}
	});
}

exports.atualizarCompra = function(req, res) {
	async.waterfall([
		_validateRequest,
		_getItemHistorico,
		_checkDependencies,
		_atualizarCompra
	], function(err, success) {
		if (err) {
			return errorHandler.answerWithError(err, req, res);
		} else {
			return res.status(200).send(success);
		}
	});

	function _validateRequest(done) {
		if (req.body._id && req.body.data && req.body.quantidade && req.body.valorUnitario) {
			done(null);
		} else {
			done({custom_code: 400});
		}
	}

	function _getItemHistorico(done) {
		try {
			let s_item_id = sanitize(req.params.id);
			let s_compra_id = sanitize(req.params.id_compra);			
			ItemEstoque.findById(s_item_id).exec(function(err, item) {
				if (err) {
					done(err);
				} else if (!err && !item) {
					done({custom_code: 400});
				} else {
					let item_historico_index;
					for (let i = 0; i < item.historicoCompras.length; i++) {
						if (item.historicoCompras[i]._id.toString() === s_compra_id) {
							item_historico_index = i;
						} 
					}
					done(null, item, item_historico_index);
				}
			});
		}
		catch (e) {
			done(e);
		}
	}

	function _checkDependencies(item, item_historico_index, done) {
		SaidaEstoque.find({'itens.item': item._id}).exec(function(err, saidas) {
			if (err) {
				done(err);
			} else if (!err && !saidas) {
				done({custom_code: 400});
			} else {
				let quantidade_emprestada = 0;
				saidas.forEach(function(saida) {
					for (let i = 0; i < saida.itens.length; i++) {
						quantidade_emprestada += saida.itens[i].quantidade;
					}
				});
				if (item.quantidade < quantidade_emprestada) {
					done({custom_code: 422, custom_message: 'Excede emprestados.'});
				} else {
					done(null, item, item_historico_index);
				}
			}
		});
	}

	function _atualizarCompra(item, item_historico_index, done) {
		let datas = [];
		item.historicoCompras.forEach(function(item_historico) {
			datas.push(item_historico.data);
		});
		item.ultimaCompra = datas.sort(date_sort_desc)[0];
		item.historicoCompras[item_historico_index].data = req.body.data;
		item.quantidade = item.quantidade - item.historicoCompras[item_historico_index].quantidade + req.body.quantidade;
		item.historicoCompras[item_historico_index].quantidade = req.body.quantidade;
		item.historicoCompras[item_historico_index].valorUnitario = req.body.valorUnitario;
		item.valorUnitario = (item.historicoCompras[item.historicoCompras.length - 1].valorUnitario / 100).toFixed(2);
		if (req.body.anotacoes) {
			item.historicoCompras[item_historico_index].anotacoes = req.body.anotacoes;
		}
		item.save(function(err, item) {
			if (err) {
				done(err);
			} else if (!err && !item) {
				done({custom_code: 400});
			} else {
				done(null, {Message: 'Success'});
			}
		})
	}
	
}

exports.removerCompra = function(req, res) {
	async.waterfall([
		_getItemHistorico,
		_checkDependencies,
		_removeBuyAndApplyMostRecentDate
	], function(err, success) {
		if (err) {
			return errorHandler.answerWithError(err, req, res);
		} else {
			return res.status(200).send(success);
		}
	});

	function _getItemHistorico(done) {
		try {
			let s_item_id = sanitize(req.params.id);
			let s_compra_id = sanitize(req.params.compra);			
			ItemEstoque.findById(s_item_id).exec(function(err, item) {
				if (err) {
					done(err);
				} else if (!err && !item) {
					done({custom_code: 400});
				} else {
					if (item.historicoCompras.length == 1) {
						done({custom_code: 422, custom_message: 'Não é possível remover a última conta'});
					} else {
						let item_historico_index;
						for (let i = 0; i < item.historicoCompras.length; i++) {
							if (item.historicoCompras[i]._id.toString() === s_compra_id) {
								item_historico_index = i;
							} 
						}
						done(null, item, item_historico_index);
					}
				}
			});
		}
		catch (e) {
			done(e);
		}
	}

	function _checkDependencies(item, item_historico_index, done) {
		SaidaEstoque.find({'itens.item': item._id}).exec(function(err, saidas) {
			if (err) {
				done(err);
			} else if (!err && !saidas) {
				done({custom_code: 400});
			} else {
				let quantidade_emprestada = 0;
				saidas.forEach(function(saida) {
					for (let i = 0; i < saida.itens.length; i++) {
						quantidade_emprestada += saida.itens[i].quantidade;
					}
				});
				if ((item.quantidade + quantidade_emprestada - item.historicoCompras[item_historico_index].quantidade) < quantidade_emprestada) {
					done({custom_code: 422, custom_message: 'Excede emprestados.'});
				} else {
					done(null, item, item_historico_index);
				}
			}
		});
	}

	function _removeBuyAndApplyMostRecentDate(item, item_historico_index, done) {
		let datas = [];
		item.historicoCompras.forEach(function(item_historico) {
			datas.push(item_historico.data);
		});
		item.ultimaCompra = datas.sort(date_sort_desc)[0];
		item.quantidade -= item.historicoCompras[item_historico_index].quantidade;
		item.historicoCompras.splice(item_historico_index, 1);
		item.valorUnitario = (item.historicoCompras[item.historicoCompras.length - 1].valorUnitario / 100).toFixed(2);
		item.save(function(err, item) {
			if (err) {
				done(err);
			} else {
				done(null, {Message: 'Success'});
			}
		});
	}
}

// retorna somente id, descricao e quantidade disponível
exports.buscarPorDescricao = function(req, res) {
	let queryRegex = new RegExp(req.body.partial, "i");
	ItemEstoque.find({ descricao: { $regex: queryRegex }})
						 .select('_id descricao quantidade unidade')
						 .exec(function(err, itens) {
		if (err) {
			errorHandler.answerWithError(err, req, res);
		} else {
			res.status(200).json(itens);
		}
	}); 
}

exports.executarBuscaGeral = function(req, res) {
	var queryRegex = new RegExp(req.query.q, "i");
	let pageQuery = 0;
	if (req.query.page && req.query.page > 1) {
		pageQuery = req.query.page - 1;
	}
	ItemEstoque.count({ descricao: { $regex: queryRegex }}, function(err, count) {
		if (err) {
			errorHandler.answerWithError(err, req, res);
		} else {
			ItemEstoque.find({ descricao: { $regex: queryRegex }})
								 .limit(resultsPerPage)
								 .skip(pageQuery * resultsPerPage)
								 .sort({ dataEntrada: -1})
								 .lean()
								 .exec(function(err, results) {
				if (err) {
					errorHandler.answerWithError(err, req, res);
				} else {
					results.forEach(function(item) {
						item.valorUnitario = (item.valorUnitario / 100).toFixed(2);
					}); 
					res.status(200).json({totalCount: count, itens: results});
				}
			}); 
		}
	});
}

exports.registrarSaida = function(req, res) {
	if (req.body.responsavel && req.body.data && req.body.construcaoDestino && req.body.itens) {
		let found_itens = [];
		async.forEach(req.body.itens, function (item, done) {
			let s_id = item.item;
			ItemEstoque.findById(s_id).exec(function(err, found_item) {
				if (found_item.unidade == 'unidade' && item.quantidade >= 1 && item.quantidade <= found_item.quantidade ||
						found_item.unidade != 'unidade' && item.quantidade >= 0.01 && item.quantidade <= found_item.quantidade) {
					found_item.quantidade_retirar = item.quantidade;
					found_itens.push(found_item);
				} else {
					return done('err');
				}
				done(null);
			});
		}, function(e) {
			if (e) {
				errorHandler.answerWithError({custom_code: 400}, req, res);
			} else {
				let saidaEstoque = new SaidaEstoque(req.body);
				saidaEstoque.validate(function(err) {
					if (err) {
						errorHandler.answerWithError({custom_code: 400}, req, res);
					} else {
						saidaEstoque.save();
						async.forEach(found_itens, function (item, done) {
							item.quantidade -= item.quantidade_retirar;
							item.quantidade_retirar = undefined;
							item.save();
							done();
						}, function() {
							res.status(200).send({message: 'Success'});
						});
					}
				})
			}
		});
	} else {
		errorHandler.answerWithError({custom_code: 400}, req, res);
	}
}

exports.listarPermanentesEmUso = function(req, res) {
	let pageQuery = 0;
	if (req.query.page && req.query.page > 1) {
		pageQuery = req.query.page - 1;
	}
	SaidaEstoque.count({concluida: false}, function(err, count) {
		if (err) {
			errorHandler.answerWithError(err, req, res);
		} else {
			SaidaEstoque.find({concluida: false})
									.limit(resultsPerPage)
									.skip(pageQuery * resultsPerPage).sort({updatedAt: -1})
									.populate('responsavel', 'nomeColaborador')
									.populate('itens.item', 'descricao')
									.lean().exec(function(err, itens) {
				if (err) {
					errorHandler.answerWithError(err, req, res);
				} else {
					// não retorna os itens cujas devoluções forem concluídas
					itens.forEach(function(item) {
						for (let i = 0; i < item.itens.length; i++) {
							if (item.itens[i].statusDevolucao === 'concluida') {
								item.itens.splice(i, 1);
							}
						}
					});
					res.status(200).json({totalCount: count, itens: itens});
				}
			});
		}
	});
}

// exibição de registrar devolução - anotações e histórico são removidos para evitar duplicação ao salvar, além de não serem necessários
// no contexto
exports.obterPermanenteEmUso = function(req, res) {
	let s_id = sanitize(req.params.id);
	SaidaEstoque.findById(s_id)
							.populate('responsavel', 'nomeColaborador')
							.populate('itens.item', 'descricao')
							.select('-anotacoes -itens.historicoDevolucao -concluida')
							.exec(function(err, result) {
		if (err) {
			errorHandler.answerWithError(err, req, res);
		} else if (!err && !result) {
			errorHandler.answerWithError({custom_code: 400}, req, res);
		} else {
			for (let i = 0; i < result.itens.length; i++) {
				if (result.itens[i].statusDevolucao === 'concluida') {
					result.itens.splice(i, 1);
				}
			}
			res.status(200).send(result);
		}
	});
}

exports.registrarDevolucao = function(req, res) {
	async.waterfall([
		_getSaidaEstoque,
		_validateRequest,
		_applyItemChanges,
		_reAddStock
	], function(err, success) {
		if (err) {
			return errorHandler.answerWithError(err, req, res);
		} else {
			return res.status(200).send(success);
		}
	});

	function _getSaidaEstoque(done) {
		try {
			let s_id = sanitize(req.body._id);
			SaidaEstoque.findById(s_id, function(err, saidaEstoque) {
				if (err) {
					done(err);
				} else if (!err && !saidaEstoque) {
					done({custom_code: 400});
				} else {
					done(null, saidaEstoque);
				}
			});
		}	catch (e) {
			done(e);
		}
	}

	function _validateRequest(saidaEstoque, done) {
		let isValid = true;
		try {
			for (let i = 0; i < req.body.itens.length; i++) {
				let req_item = req.body.itens[i];
				let item = saidaEstoque.itens.filter(x => x.id === req_item._id)[0];
				if (req_item.quantidade !== item.quantidade || !req_item.statusDevolucao) {
					isValid = false;
				}
			}
			if (isValid) {
				done(null, saidaEstoque);
			} else {
				done({custom_code: 400})
			}
		}	catch (e) {
			done({custom_code: 400});
		}
	}

	function _applyItemChanges(saidaEstoque, done) {
		if (req.body.anotacoes) {
			saidaEstoque.anotacoes.push(req.body.anotacoes);
		}
		let stillValid = true;
		let concluded = true;
		let reAddStockList = [];
		try {
			for(let i = 0; i < req.body.itens.length; i++) {
				let req_item = req.body.itens[i];
				let item = saidaEstoque.itens.filter(x => x.id === req_item._id)[0];
				if (req_item.historicoDevolucao.devolvidos === item.quantidade) {
					item.historicoDevolucao.push(req_item.historicoDevolucao);
					reAddStockList.push({_id: item.item, quantity: item.quantidade});
					item.statusDevolucao = 'concluida';
					item.quantidade = 0;
				} else if (req_item.historicoDevolucao.devolvidos < item.quantidade) {
					item.historicoDevolucao.push(req_item.historicoDevolucao);
					reAddStockList.push({_id: item.item, quantity: req_item.historicoDevolucao.devolvidos});
					item.quantidade -= req_item.historicoDevolucao.devolvidos;
					item.statusDevolucao = req_item.statusDevolucao;
					if (item.statusDevolucao === 'aguardando') {
						concluded = false;
					}
				} else {
					stillValid = false;
				}
			}
			if (concluded) {
				saidaEstoque.concluida = true;
			}
			if (stillValid) {
				saidaEstoque.save(function(err, item) {
					if (err) {
						done(err);
					} else {
						done(null, reAddStockList);
					}
				});
			} else {
				done({custom_code: 400});
			}
		} catch (e) {
			done(e);
		}
	}

	function _reAddStock(itens, done) {
		if (itens.length > 0) {
			try {
				async.forEach(itens, function (item, async_done) {
					let s_id = item._id;
					ItemEstoque.findByIdAndUpdate(s_id, {$inc: {quantidade: item.quantity}}).exec(function(err, f_item) {
						if (err) {
							done(err);
						} else {
							async_done();
						}
					});
				}, function() {
					done(null, {message: 'Success'});
				});
			} catch (e) {
				done(e);
			}
		} else {
			done(null, {message: Success});
		}
	}
}

// {
// 	"$lookup": {
// 			"from": "colaboradors",
// 			"localField": "responsavel",
// 			"foreignField": "_id", // <-- reference field from country collection
// 			"as": "resultingArray"
// 	}
// }, { 
// 	"$match": { 
// 		"resultingArray.nomeColaborador": { $regex: queryRegex }
// 	}
// }

// {
// 	"$group": {
// 		_id: "$responsavel"
// 	}
// }

// SaidaEstoque.find()
// 							.populate({ path: 'responsavel',
// 													select: 'nomeColaborador',
// 													match: { 
// 														$or: [
// 															{ nomeColaborador: { $regex: queryRegex }}
// 														] 
// 													} 
// 												})