const express = require("express");
const ejs = require("ejs");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "public"))); //'__dirname' tudo que está atrás da raiz do projeto

app.set("views", path.join(__dirname, "public"));

app.engine('html', ejs.renderFile);

app.use('/', (request, response) => {
  response.render('index.html');
});

server.listen(3000, () => {
  console.log("SERVIDOR RODANDO EM - http://localhost:3000");
});

let messages = [];

io.on("connection", socket => {

  console.log("ID de usuário conectado: " + socket.id) //pra ligar o socketIO

  socket.emit("previousMessage", messages); //emite as mensagens

  socket.on("sendMessage", data => {

    messages.push(data); //posição de fila ou pilha => o último que entra é o primeiro que sai

    socket.broadcast.emit("receivedMessage", data);

  });

}); 
