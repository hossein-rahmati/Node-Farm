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
function replaceTemplate(temp, product) {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  ///overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

    res.end(output);

    ///product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    console.log(output);
    res.end(output);

    ///api
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/JSON",
    });
    res.end(data);

    ///not found page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("404 page not found");
  }
});

server.listen(8000, "127.0.0.1", (err) => {
  if (err) return console.log("An error has occured in listening on port 8080");
  console.log("Listening to requests on port 8000");
});
