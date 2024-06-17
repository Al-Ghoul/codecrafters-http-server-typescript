import * as net from "net";
import * as fs from "fs";

let directory: string;

process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val);
  if (val === "--directory") {
    directory = array[index + 1];
  }
});

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
      case "files":
        try {
          const content = fs.readFileSync(directory + urlSegments[2], "utf8");
          socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
        }
        catch {
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }
        break;
      default:
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

    console.log(requestData);
    socket.end();
  });
});

server.listen(4221, "localhost");
