var express = require('express'),
    app = express(),
    http = require('http');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var server = http.createServer(app);
var socketServer = require('socket.io');


var io = socketServer.listen(server);
app.get('/',urlencodedParser, function (req, res) {

})



app.get('/css', urlencodedParser, function (req, res) {
    // 允许跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    // 允许跨域end

    io.sockets.emit('refer', "css");
    res.send('收到信息');
})

app.get('/js', urlencodedParser, function (req, res) {
    // 允许跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    // 允许跨域end

    io.sockets.emit('refer', "js");
    res.send('收到信息');
})


server.listen(process.env.PORT || 5000);
