var express = require('express');
var pug = require('pug');
var jsfile = require('jsonfile');
var formidable = require('formidable')
var fs = require('fs')
var router = express.Router();



var dbFile = "Database/files.json"

/* GET home page. */


router.get('/',(req,res)=>{
    res.write(pug.renderFile('views/index.pug'));
    res.end();
})

router.get('/File/All',(req,res)=>{
    jsfile.readFile(dbFile,(err,resultado)=>{
        if(!err){
            if(resultado.lenght != 0)
                res.end(pug.renderFile('views/file.pug',{items: resultado}));
            else
                res.write(pug.renderFile('views/error.pug',{error: err, message: "Erro Ficheiro não Existe!"}));
                res.end();
        }else{
            res.write(pug.renderFile('views/error.pug',{error: err, message: "Erro na leitura da base de dados!"}));
            res.end();
        }
    });
})

router.get('/File/:fileId',(req,res)=>{
    jsfile.readFile(dbFile,(err,resultado)=>{
        console.log(JSON.stringify(err))
        if(!err){
            if(resultado[req.params.fileId] != null){
                res.end(pug.renderFile('views/file_details.pug',{item: resultado[req.params.fileId]}));
            }else{
                res.end(pug.renderFile('views/file_details.pug',{item: []}));
            }
        }else{
            res.end(pug.renderFile('views/error.pug',{error: err, message: "Erro na leitura da base de dados!"}));
        }
    });
})

router.get('/File/All/Hide/',(req,res)=>{
    jsfile.readFile(dbFile,(err,data)=>{
        if(!err){
            console.log("Read DB Success!");
            for (var i = 0, len = data.length; i < len; i++) {
                data[i]['hidden'] = true;
            }
            jsfile.writeFile(dbFile,data,(err)=>{
                if(err){
                    console.log("Hide Entry Failure!");
                }else{
                    console.log("Hide Entry Success!");
                }
            });
            res.write(pug.renderFile('views/file.pug',{items: data}));
        }else{
            console.log("Read DB Failure!");
            res.write(pug.renderFile('views/file.pug',{items: []}));
        }
        res.end();
    })
})

router.get('/File/Hide/:fileId',(req,res)=>{
    jsfile.readFile(dbFile,(err,data)=>{
        if(!err){
            console.log("Read DB Success!");
            data[req.params.fileId]['hidden'] = true;
            jsfile.writeFile(dbFile,data,(err)=>{
                if(err){
                    console.log("Hide All Failure!");
                }else{
                    console.log("Hide All Success!");
                }
            });
            res.write(pug.renderFile('views/file.pug',{items: data}));
        }else{
            console.log("Read DB Failure!");
            res.write(pug.renderFile('views/file.pug',{items: []}));
        }
        res.end()
    })
})

router.post('/File/Save',(req,res)=>{
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files)=>{
        file = files.ficheiro
        fs.rename(file.path,"public/Upload/"+file.name, (err)=>{
            if(!err){
                var today = new Date();
                var resultado = {name:fields.name,
                                desc:fields.desc,
                                path:"/Upload/"+file.name,
                                uploadDate:today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
                                hidden:false}
                
                console.log(JSON.stringify(resultado));
                addEntry(resultado);
                res.end()
            }else{
                res.write(pug.renderFile('views/error.pug',{error: err, message:"Erro Não foi possivel armazenar ficheiro!"}));
                res.end();
            }
        })
    })
})

function addEntry(entry){
    jsfile.readFile(dbFile,(err,data)=>{
        if(!err){
            console.log("Read DB Success!");
            data.push(entry);
            jsfile.writeFile(dbFile,data,(err)=>{
                if(err){
                    console.log("Added Entry Failure!");
                }else{
                    console.log("Added Entry Success!");
                }
            });
        }else{
            console.log("Read DB Failure!");
        }
    })
}


module.exports = router;
