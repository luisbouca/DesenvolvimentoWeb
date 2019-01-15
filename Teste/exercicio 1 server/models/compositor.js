var mongose = require('mongoose')

var schema = mongose.Schema

var CompositorSchema = new schema({
    nome: {type: String},
    bio: {type: String},
    dataNasc: {year: {type: Number},month:{type: Number},day:{type: Number}},
    dataObito: {year: {type: Number},month:{type: Number},day:{type: Number}},
    periodo: {type: String}
})



module.exports = mongose.model('compositores', CompositorSchema,'compositores')
