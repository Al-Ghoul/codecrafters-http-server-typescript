import * as net from "net";


const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (data) => {
    const requestData = data.toString().split(" ");
    const urlSegments = requestData[1].split("/");
    const firstSegment = urlSegments[1];

    switch (firstSegment) {
      case "":
        socket.write("HTTP/1.1 200 OK\r\n\r\n");
        break;
      case "echo":
        const res = urlSegments[2];
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${res.length}\r\n\r\n${res}`);
        break;
      case "user-agent":
        const userAgent = data.toString().substring(data.toString().indexOf("User-Agent")).split(' ')[1].trim();
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
        break;
      default:
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

    console.log(requestData);
    socket.end();
  });
});

server.listen(4221, "localhost");
