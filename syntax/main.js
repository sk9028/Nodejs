var http = require('http'); //import와 같은 의미
var fs = require('fs');
var url = require('url'); //url모듈을 사용하겠다.
var qs = require('querystring');

function templateHTML(title, list, body){ //반복되는 html내용을 함수로 정의
  return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
          <a href="/create">create</a>
        ${body}

      </body>
      </html>
      `;
}
function templateList(filelist){ //반복되는 css, html ,javascript, nodejs의 리스트 목록을 함수로 정의
  var list = '<ul>'
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i+1;
  }

  list = list+'</ul>';
  return list;
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    if(pathname == '/'){ //홈 페이지 접속요청시
      if(queryData.id == undefined){

        fs.readdir('./data',function(error,filelist){
          console.log(filelist);
          var title = 'Welcome';
          var description = 'hello, node.js'
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
              response.writeHead(200); //파일을 정상적으로 보냈을 때 200 아닐 때 404
              response.end(template);
        })



      }else{
        fs.readdir('./data',function(error,filelist){
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200); //파일을 정상적으로 보냈을 때 200 아닐 때 404
            response.end(template);
      });
    });
    }
  }else if(pathname=='/create'){
    fs.readdir('./data',function(error,filelist){
      console.log(filelist);
      var title = 'WEB - create';
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
        <form action="http://localhost:3000/create_process" method="post">
         <p><input type="text" name="title" placeholder="title"></p>
         <p>
           <textarea name="description" placeholder="description"></textarea>
         </p>
         <p>
        <input type="submit">
         </p>
        </form>

        `);
          response.writeHead(200); //파일을 정상적으로 보냈을 때 200 아닐 때 404
          response.end(template);
    })
  }else if(pathname="/create_process"){
    var body='';
    request.on('data',function(data){//callback이 실행될때마다 데이터 추가
      body = body + data;

    });
    request.on('end',function(){//데이터를 끝까지 다받을 경우 end콜백
      var post = qs.parse(body);
      var title = post.title; //데이터를 post방식으로 받는다
      var description = post.description; //데이터를 post방식으로 받는다
      console.log(post.title);
      fs.writeFile(`data/${title}`,description, 'utf8',function(err){
        response.writeHead(302,{Location:`/?id=${title}`}); //파일을 정상적으로 보냈을 때 200 아닐 때 404,
                                //302은 이 페이지를 다른곳으로 리다이렉션하라, 즉
                                //그 페이지를 만들고 바로 이동하라는 뜻
        response.end();
      })
    });

  }else{
      response.writeHead(404);
      response.end('Not found');
    }






});
app.listen(3000);
