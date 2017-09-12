var express = require('express');
var bodyParser=require("body-parser");
var app = express();




//app.use('/', express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('test'));
app.all('*', function(req, res, next) {


        res.sendfile("./dist/index.html");
       });



var server = app.listen(9091, function() {

    var port = server.address().port;


});
