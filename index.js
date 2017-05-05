var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var clientRedis = redis.createClient(6379, "172.30.10.3");

console.log("server");
io.on('connection', function(client){
    console.log("client connection....");
    clientRedis.lrange("messages", 0,2, function(error, messagesList){
        for(i = messagesList.length-1; i>0; i++ ){
                client.emit("sendMessage",messagesList.length[i]);
        }
    });

    client.on("join", function(name){
        console.log("Client Joinned...")
        client.name = name;
    });

    client.on("messages", function(message){
        console.log("Client: "+client.name+" Message: "+message)
        clientRedis.lpush("messages", message, function(error, replay){
            clientRedis.ltrim("messages", 0, 10);
        });
        client.broadcast.emit("sendMessage", message, client.name);
    });
});



app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

server.listen(3000);