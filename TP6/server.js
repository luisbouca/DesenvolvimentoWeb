var http = require('http');
var url = require("url");
var fs = require('fs');
var pug = require('pug');
var jsfile = require('jsonfile');

var {parse} = require('querystring');

var dbFile = "todo.json"


var port = 85;

http.createServer((req, res) =>{
    var parsed = url.parse(req.url, true);
    var parentpath = parsed.pathname;

    var regexRegisto = /\/registo$/;
    var regexIndex = /\/(index|lista)?$/;
    var regexHistorico = /\/historico$/;
    var regexForm = /\/processaForm$/;
    var regexDetalhes = /\/Tarefa\/([0-9]+)$/;
    var regexHide = /\/Hide\/([0-9]+)$/;
    var regexFinish = /\/Finish\/([0-9]+)$/;
    var regexStyle = /(\/w3\.css)$/;

    console.log("\nCurrent Path "+JSON.stringify(parentpath)+"\n\n");

    if(req.method == 'GET'){

        //Pagina de lista de tarefas não removidas------------------------------------------------------

        if(regexIndex.test(parentpath)){
            jsfile.readFile(dbFile,(err,resultado)=>{
                if(!err){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(pug.renderFile('lista.pug',{lista: {items : resultado, all: false}}));
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
                    res.end();
                }
            });

            //Pagina de registo de novas tarefas---------------------------------------------------

        }else if(regexRegisto.test(parentpath)){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(pug.renderFile('form.pug'));
            res.end();

            //Pagina de vizualizar detalhes de uma tarefa-------------------------------------------

        }else if(regexDetalhes.test(parentpath)){
            jsfile.readFile(dbFile,(err,resultado)=>{
                if(!err){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    id=parentpath.match(regexDetalhes);
                    result = resultado[id[1]];
                    console.log(JSON.stringify(result));
                    res.end(pug.renderFile('recebido.pug',{item: resultado[id[1]]}));
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
                    res.end();
                }
            });

            //Pagina de lista de todas as tarefas-----------------------------------------------------------

        }else if(regexHistorico.test(parentpath)){
            jsfile.readFile(dbFile,(err,resultado)=>{
                if(!err){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(pug.renderFile('lista.pug',{lista: {items : resultado, all: true}}));
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
                    res.end();
                }
            });

            //Pagina de completar uma tarefa---------------------------------------------------------

        }else if(regexHide.test(parentpath)){
            id=parentpath.match(regexHide);
            updateEntry(id[1],"hidden");
            res.writeHead(301,{Location: '/lista'});
            res.end();

            //Pagina de completar uma tarefa---------------------------------------------------------

        }else if(regexFinish.test(parentpath)){
            id=parentpath.match(regexFinish);
            updateEntry(id[1],"completo");
            res.writeHead(301,{Location: '/lista'});
            res.end();
              
            //Pagina do CSS utilizado----------------------------------------------------------------

        }else if(regexStyle.test(parentpath)){
            res.writeHead(200, {'Content-Type': 'text/css'});
            fs.readFile("style/w3.css",'utf8',(err,data)=>{
                res.write(data);
                res.end();
            });
            //Pagina de erro-------------------------------------------------------------------------
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(pug.renderFile('erro.pug',{e: "Erro: "+parentpath+" não está implementado!"}));
            res.end();
        }
    }else if(req.method == 'POST'){

        //Pagina de confirmação de registo de novas tarefas------------------------------------------

        if(regexForm.test(parentpath)){
            retrievePostData(req, resultado =>{
                res.writeHead(200, {'Content-Type': 'text/html'});
                resultado.completo=false;
                var today = new Date();
                resultado.registo=today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear();
                resultado.hidden = false;
                console.log(JSON.stringify(resultado));
                res.end(pug.renderFile('recebido.pug',{item: resultado}));
                addEntry(resultado);
            });
            //Pagina de erro-------------------------------------------------------------------------
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(pug.renderFile('erro.pug',{e: "Erro: "+parentpath+" não está implementado!"}));
            res.end();
        }
        //Pagina de erro-----------------------------------------------------------------------------
    }else{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(pug.renderFile('erro.pug',{e: "Metodo: "+req.method+" não implementado!"}));
        res.end();
    }
}).listen(port,()=>{
    console.log('Servidor as a escuta na porta :'+port);
});

//Devolve o conteudo enviado atravez de POST com o content type 'application/x-www-form-urlencoded'--
function retrievePostData(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = '';
        request.on('data', chunk =>{
            body += chunk.toString();
        })
        request.on('end', ()=>{
            console.log(body);
            callback(parse(body));
        });
    }else{
        callback(null);
    }
}

//adiciona uma entrada a base de dados (json file)--------------------------------------------------
function addEntry(entry){
    jsfile.readFile(dbFile,(err,data)=>{
        if(!err){
            console.log("Read DB Success!");
            data.push(entry);
            jsfile.writeFile(dbFile,data,(err)=>{
                if(err){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pug.renderFile('erro.pug',{e: "Erro: não foi possivel escrever na Base de dados!"}));
                    res.end();
                    console.log("Added Entry Failure!");
                }else{
                    console.log("Added Entry Success!");
                }
            });
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
            res.end();
            console.log("Read DB Failure!");
        }
    })
}

//update uma entrada da base de dados (JSON file)--------------------------------------------------
function updateEntry(id,type){
    jsfile.readFile(dbFile,(err,data)=>{
        if(!err){
            console.log("Read DB Success!");
            data[id][type] = true;
            jsfile.writeFile(dbFile,data,(err)=>{
                if(err){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pug.renderFile('erro.pug',{e: "Erro: não foi possivel escrever na Base de dados!"}));
                    res.end();
                    console.log(type+" Entry Failure!");
                }else{
                    console.log(type+" Entry Success!");
                }
            });
        }else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(pug.renderFile('erro.pug',{e: "Erro: na leitura da base de dados!"}));
            res.end();
            console.log("Read DB Failure!");
        }
    })
}