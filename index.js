var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var client = redis.createClient(6379, "172.30.10.3");

console.log("server");
io.on('connection', function(client){
    console.log("client connection....");
    client.on("join", function(name){
        console.log("Client Joinned...")
        client.name = name;
    });

    client.on("messages", function(message){
        console.log("Client: "+client.name+" Message: "+message)
    });
});



app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

server.listen(3000);