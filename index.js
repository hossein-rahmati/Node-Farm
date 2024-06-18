const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////* FILES
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOut = `This is some information about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("An error has occured");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your file has been written");
//       });
//     });
//   });
// });

////////////////* SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathname = req.url;

  if (pathname === "/" || pathname === "/overview") {
    res.end("this is OVERVIEW");
  } else if (pathname === "/product") {
    res.end("this is PRODUCT");
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/JSON",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("404 page not found");
  }
});

server.listen(8080, "127.0.0.1", (err) => {
  if (err) return console.log("An error has occured in listening on port 8080");
  console.log("Listening to requests on port 8080");
});
