var express = require('express');
var router = express.Router();
var Compositores = require('../controllers/compositor')

/* GET users listing. */
router.get('/Compositores', function(req, res, next) {
  Compositores.list()
    .then(data => res.jsonp(data))
    .catch(err => res.status(500).jsonp(err))
});
/* GET users listing. */
router.get('/Compositores/:id', function(req, res, next) {
  Compositores.getById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(err => res.status(500).jsonp(err))
});
/* GET users listing. */
router.get('/Compositores/Periodo/:periodo', function(req, res, next) {
  Compositores.getByPeriodo(req.params.periodo)
    .then(data => res.jsonp(data))
    .catch(err => res.status(500).jsonp(err))
});
/* GET users listing. */
router.get('/Compositores/Periodo/:periodo/Nascimento', function(req, res, next) {
  if(typeof req.query.year !== 'undefined') {
    if(typeof req.query.month !== 'undefined' && typeof req.query.day !== 'undefined'){
      Compositores.getByPeriodoNasc(req.params.periodo,req.query.year,req.query.month,req.query.day)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
    }else{
      Compositores.getByPeriodoNasc(req.params.periodo,req.query.year)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
    }
  }
});

module.exports = router;
