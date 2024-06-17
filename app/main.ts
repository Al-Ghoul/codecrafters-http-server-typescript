import * as net from "net";


const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const requestData = data.toString().split(" ");
    const url = requestData[1];

    switch (url) {
      case "/":
        socket.write("HTTP/1.1 200 OK\r\n\r\n");
        break;
      default:
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

    console.log(requestData);
    socket.end();
  });
});

server.listen(4221, "localhost");
