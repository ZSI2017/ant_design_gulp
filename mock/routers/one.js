var fs = require('fs');
var url = require('url');
var path = require('path');

module.exports = function(req,res,next){
  var urlObj = url.parse(req.url,true);

  switch(urlObj.pathname){
    case '/api/index/list':
       res.setHeader('Content-Type','application/json');
       fs.readFile('./mock/list.json',function(err,data){
          res.end(data);
       });
      return;

//  不同的url  对应访问不同的json 文件
    case '/api/index/bannerList':
       res.setHeader('Content-Type','application/json');
       fs.readFile('./mock/banner.json',function(err,data){
          res.end(data);
       });
       return;
    case '/api/index/freshList':
        res.setHeader('Content-Type','application/json');
        fs.readFile('./mock/fresh.json',function(err,data){
          res.end(data);
        });
        return;
    case '/api/index/loadedList':
         res.setHeader('Content-Type','application/json');
         fs.readFile('./mock/index-loaded.json',function(err,data){
            res.end(data);
         });
         return;
    case '/api/other/otherData':
       res.setHeader('Content-Type','application/json');
       fs.readFile('./mock/other.json',function(err,data){
          res.end(data);
       });
       return;
  }
  next();
}
