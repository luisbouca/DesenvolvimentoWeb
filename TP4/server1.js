var http = require('http');
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
}).listen(port,()=>{
    console.log('Servidor as a escuta na porta :'+port);
});