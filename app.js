var express = require('express');
var bodyParser=require("body-parser");
var app = express();
var qiniu = require("qiniu");
var fun = require('./common/Fun.js');
qiniu.conf.ACCESS_KEY = 'XSghKCNu9i46NZrqepAOv7cknXRGgtfeva6O7WAr';
qiniu.conf.SECRET_KEY = '7qahI3s3aOrEZZTviyi3v95pdcnFKtJ3_DvwWtvn';


//app.use('/', express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('dist'));
app.all('*', function(req, res, next) {
           res.header("Access-Control-Allow-Origin", "*");
           res.header("Access-Control-Allow-Headers", "X-Requested-With");
           res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
           res.header("X-Powered-By",' 3.2.1')
           res.header("Content-Type", "application/json;charset=utf-8");
           next();
       });
app.post('/filetoken', function(req, res) {
    bucket = 'itvwork';
    var putPolicy = new qiniu.rs.PutPolicy(bucket);
    res.send({token:putPolicy.token()});
});
app.post('/datatoken', function(req, res) {
    res.send(fun.getToken());
});



var server = app.listen(2000, function() {
    var host = 'localhost';
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
