var express = require('express');
var axios = require('axios');
var router = express.Router();



var dbFile = "Database/files.json"

/* GET home page. */


router.get('/',(req,res)=>{
    axios.get("http://clav-test.di.uminho.pt/api/classes/nivel/1")
		.then(response=>{
			console.log(JSON.stringify(response.data))
			res.render('index', { title: 'Index de classes nivel 1',classes:response.data });
		})
		.catch(err=>{
			console.log('Erro ao carregar db')
			res.render('error',{error: err, message:"Erro ao carregar db"})
		})
})

router.get('/:class',(req,res)=>{
    axios.get("http://clav-test.di.uminho.pt/api/classes/c"+req.params.class)
		.then(response=>{
            console.log(JSON.stringify(response.data[0]))
            axios.get("http://clav-test.di.uminho.pt/api/classes/c"+req.params.class + "/descendencia")
            .then(response2=>{
                console.log(JSON.stringify(response2.data))
                parent = req.params.class
                var result = parent.split(".")
                var newparent = ""
                for (index = 0; index < result.length-1; ++index) {
                    if(index > 0)
                        newparent=newparent+"."+result[index]
                    else
                        newparent=newparent+result[index]
                }
                res.render('classInfo', { title: 'Class '+ req.params.class, data:{parent: newparent,classe:response.data[0],childs: response2.data}});
            })
            .catch(err=>{
                console.log('Erro ao carregar db')
                res.render('error',{error: err, message:"Erro ao carregar db"})
            })
		})
		.catch(err=>{
			console.log('Erro ao carregar db')
			res.render('error',{error: err, message:"Erro ao carregar db"})
		})
})


module.exports = router;
