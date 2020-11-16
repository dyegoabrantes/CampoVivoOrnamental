const mongoose = require('mongoose');

var ItemEstoqueSchema = new mongoose.Schema({
	descricao: {
		type: String,
		required: true,
		index: true
	},
	tipo: {
		type: String,
		required: true
	},
	categoria: {
		type: String,
		required: true
	},
	unidade: {
		type: String,
		required: true
	},
	quantidade: {
		type: Number,
		required: true
	},
	valorUnitario: {
		type: Number,
		required: true,
	},
	ultimaCompra: {
		type: String,
		required: true
	},
	historicoCompras: {
		type: [{
			data: {
				type: String,
				required: true
			},
			quantidade: {
				type: Number,
				required: true
			},
			valorUnitario: {
				type: Number,
				required: true,
				set: v => v * 100
			},
			anotacoes: {
				type: String,
				required: false
			}
		}],
		required: true
	}
}, {
	timestamps: true
});

ItemEstoqueSchema.path('valorUnitario').set(function(num) {
  return num * 100;
});

module.exports = mongoose.model('ItemEstoque', ItemEstoqueSchema);
