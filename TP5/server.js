var http = require('http');
var url = require("url");
var fs = require('fs');
var pug = require('pug');

var port = 85;

http.createServer((req, res) =>{
    var parsed = url.parse(req.url, true);
    
    var parentpath = parsed.pathname;
    var path = "";
    var regexindex = /\/(index)?\/?$/;
    var regexitem = /\/obra\/(.+)$/;
    var regexstyle = /(\/w3\.css)$/;
    if(regexindex.test(parentpath)){
        res.writeHead(200, {'Content-Type': 'text/html'});
        path = "json/index.json";
    }else if(regexitem.test(parentpath)){
        res.writeHead(200, {'Content-Type': 'text/html'});
        id=parentpath.match(regexitem);
        path = "json/"+id[1]+'.json';
    }else if(regexstyle.test(parentpath)){
        res.writeHead(200, {'Content-Type': 'text/css'});
        path = "style/w3.css";
    }else{
        res.write('<p><b>ERRO Caminho desconhecido:</b>'+parentpath+'</p>');
    }
    if(path != ""){
        fs.readFile(path,'utf8',(err,data)=>{
            if(!err){
                if(regexindex.test(parentpath)){
                    res.write(pug.renderFile('index.pug',{obras: JSON.parse(data)}));
                }else if(regexitem.test(parentpath)){
                    res.write(pug.renderFile('item.pug',{item: JSON.parse(data)}));
                }else if(regexstyle.test(parentpath)){
                    res.write(data);
                }
            }else{
                res.write('<p><b>ERRO:</b>'+err+'</p>');
            }
            res.end();
        })
    }
}).listen(port,()=>{
    console.log('Servidor as a escuta na porta :'+port);
});