var express = require('express')
var http = require('http')
var logger = require('morgan')
var fs = require('fs')
var pug = require('pug')
var formidable = require('formidable')
var jsfile = require('jsonfile')
var path = require('path')


////variable defenition
var port = 85
var dbFile = "db.json"
var app = express()
////end variable defenition

////Middleware
app.use(logger('combined'))
app.use('/Upload/', express.static(path.join(__dirname, 'Upload')))

app.all('*',(req,res,next)=>{
    if(req.url == '/w3.css')
        res.writeHead(200, {'Content-Type': 'text/css'});
    else
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    next()
})

////Route defenition
app.get('/',(req,res)=>{
    res.write(pug.renderFile('form.pug'));
    res.end();
})

app.get('/Ficheiro/:fileId',(req,res)=>{
    jsfile.readFile(dbFile,(err,resultado)=>{
        if(!err){
            if(resultado[req.params.fileId] != null)
                res.end(pug.renderFile('recebido.pug',{item: resultado[req.params.fileId]}));
            else
                res.write(pug.renderFile('erro.pug',{e: "Erro: Ficheiro não Existe!"}));
                res.end();
        }else{
            res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
            res.end();
        }
    });
})

app.get('/ficheiros',(req,res)=>{
    jsfile.readFile(dbFile,(err,resultado)=>{
        if(!err){
            res.end(pug.renderFile('lista.pug',{lista: resultado}));
        }else{
            res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
            res.end();
        }
    });
})

app.get('/Hide/:fileId',(req,res)=>{
    updateEntry(req.params.fileId,"hidden",true);
    res.end("<script>window.location.href = '/ficheiros'</script>");
})

app.get('/w3.css',(req,res)=>{
    fs.readFile("style/w3.css",'utf8',(err,data)=>{
        res.write(data);
        res.end();
    });
})

/*app.get('/Uploads/:file',(req,res)=>{
    var regexImg = /.*((\.jpg)|(\.png)|(\.gif)|(\.jpeg))/
    var file = req.params.file
    if(regexImg.test(file)){
        res.end(pug.renderFile('image.pug',{path: "file:///"+__dirname+"\\Upload\\"+file}));
    }else {//if(regexWeb.test(file))
        fs.readFile("Upload/"+file,'utf8',(err,data)=>{
            res.write(data);
            res.end();
        });
    }
})*/

app.post('/processaForm',(req,res)=>{
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files)=>{
        console.dir(fields)
        console.dir(files)
        file = files.ficheiro
        fs.rename(file.path,"Upload/"+file.name, (err)=>{
            if(!err){
                var today = new Date();
                var resultado = {name:fields.name,
                                desc:fields.desc,
                                path:"Upload/"+file.name,
                                uploadDate:today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
                                hidden:false}
                
                console.log(JSON.stringify(resultado));
                addEntry(resultado);
                res.write(pug.renderFile("recebido.pug",{item: resultado}))
                res.end()
            }else{
                res.write(pug.renderFile('erro.pug',{e: "Erro: Não foi possivel armazenar ficheiro!"}));
                res.end();
            }
        })
    })
})
////end Route Defenition

////end Middleware

////functions defenition

//adiciona uma entrada a base de dados (json file)
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

//update uma entrada da base de dados (JSON file)
function updateEntry(id,type,value){
    jsfile.readFile(dbFile,(err,data)=>{
        if(!err){
            console.log("Read DB Success!");
            data[id][type] = value;
            jsfile.writeFile(dbFile,data,(err)=>{
                if(err){
                    console.log(type+" Entry Failure!");
                }else{
                    console.log(type+" Entry Success!");
                }
            });
        }else{
            console.log("Read DB Failure!");
        }
    })
}
////end functions defenition

////server initialize
http.createServer(app).listen(port,()=>{
    console.log('Servidor as a escuta na porta :'+port);
});
////end server initialize