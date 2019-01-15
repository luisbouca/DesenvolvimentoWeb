var compositor = require('../models/compositor')

const Compositores = module.exports

//Returns compositor list
Compositores.list = ()=>{
    return compositor
        .find({})
        .exec()
}

//Returns compositor by id
Compositores.getById = id=>{
    return compositor
        .findOne({_id: id})
        .exec()
}

//Returns compositor by periodo
Compositores.getByPeriodo = periodo=>{
    return compositor
        .find({periodo: periodo})
        .exec()
}

//Returns compositor by periodo and year
Compositores.getByPeriodoNasc = (periodo,year)=>{
    return compositor
        .find({periodo: periodo,"dataNasc.year":{$gt:parseInt(year,10)}})
        .exec()
}