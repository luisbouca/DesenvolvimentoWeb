
// first


var http = require('http');//variavel e modo mesmo nome
var meta = require('./mymod');
var url = require("url");
var fs = require('fs');
var port = 85;
http.createServer((req, res) =>{
    var parsed = url.parse(req.url, true);
    res.writeHead(200, {'Content-Type': 'text/html'});
    var subpath = parsed.pathname.split("/");
    
    if(subpath[1]==="index"){
        fs.readFile('website/index.html',(err, data)=>{
            if(!err){
                res.write(data);
            }else{
                res.write('<p><b>ERRO:</b>'+err+'</p>');
            }
            res.end();
        });
    }else if(subpath[1]==="arqelem" && subpath.length>2){
        fs.readFile('website/html/'+subpath[2]+'.html',(err, data)=>{
            if(!err){
                res.write(data);
            }else{
                res.write('<p><b>ERRO:</b>'+err+'</p>');
            }
            res.end();
        });
    }
    ///res.write('Pedido recebido em ' + meta.data() + " por server1 desenvolvido por  " + meta.autor);
    /*//res.write("<dl>"+
            "<dt>Host</dt><dd>"+ myObdj.host + "</dd>"+
            "<dt>URL</dt><dd>"+ myObdj.pathname + "</dd>"+
            "<dt>Query</dt><dd>"+ JSON.stringify(myObdj.query) + "</dd>");//*/
    /*/var r = parseInt(myObdj.query.n1) * parseInt(myObdj.query.n2);
    console.log("product = "+r);
    res.write('<p>'+ myObdj.query.n1 + ' * ' + myObdj.query.n2 +' = '+r);/*/
    
}).listen(port,()=>{
    console.log('Servidor as a escuta na porta :'+port);
});



/*  http
    fs - file system
    url 
    variavel e modo mesmo nome
*/
/*
var url = require('url');//variavel e modo mesmo nome
var endereco = "http://localhost:86"+"/default.html?ano=2017&mes=10&dia=16";

var q = url.parse(endereco,true);

console.log(q.host); // returns "localhost:8080"
console.log(q.pathname) // returns "/default.html"
console.log(q.search) // returns 
*/