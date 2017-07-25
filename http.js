var http=require("http");
var config=require("./config");
var path=require("path");
var fs=require("fs");

http.createServer(function(req,res){
 var url=(req.url);
 if(url=="/favicon.ico"){
     res.end();
 }else{
     var url=req.url;
     var ext=path.extname(url);
     if(!ext){
        url=path.join(url,config.index);
     }
     var fullPath=path.resolve("."+url);

     //要指定静态的目录
     if(config.static){



          if(config.staticType.indexOf(path.extname(fullPath))>-1&&path.extname(fullPath)) {
              var staticUrl = path.resolve(config.static,path.basename(fullPath));

              fs.readFile(staticUrl,function(err,data){
                    if(err){
                        console.log("static file not find");
                        res.writeHead(404);
                        res.end("static file not find");
                    }else{

                        setCatch(staticUrl,req,res,function(){
                            res.writeHead("200",{"content-type":config.type[path.extname(staticUrl)]+";charset=utf-8"})
                            res.end(data);
                        })

                    }
              })


          }else{

              fs.readFile(fullPath,function(err,data){
                    if(err){
                        res.writeHead(404);
                        console.log("this page not find");
                        res.end("this page not find");
                    }else{

                        setCatch(fullPath,req,res,function(){

                            res.writeHead("200",{"content-type":config.type[path.extname(fullPath)]+";charset=utf-8"});
                            console.log("11111");
                            res.end(data);

                        })

                    }
              })

          }

     }else {
         fs.readFile(fullPath,function(err,data){
             if(err){
                 res.writeHead(404);
                 console.log("this page not find");
                 res.end("this page not find");
             }else{

                 setCatch(fullPath,req,res,function(){
                     res.writeHead("200",{"content-type":config.type[path.extname(fullPath)]+";charset=utf-8"})
                     res.end(data);
                 })

             }
         })
     }

 }

}).listen(8888,function(){
    console.log("服务器启动了")
});



function setCatch(url,req,res,callback){
        var time=req.headers["if-modified-since"];
        fs.stat(url,function (err,info) {
            if(err){
                console.log("不存在");
                res.end();
            }else{

                if(config.cache) {
                    var mtime = info.mtime.toUTCString();
                    if (mtime == time && time) {
                        res.writeHead(304);
                        res.end();
                    } else {
                        res.setHeader("cache-control", eval(config["cache-control"]));
                        res.setHeader("last-modified", mtime);
                        callback();
                    }
                }else{
                    callback();
                }
            }
        })




}