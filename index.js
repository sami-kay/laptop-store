const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;


  if (pathName === '/products' || pathName === '/'){
    res.writeHead(200, {'Content-type': 'text/html'});

    fs.readFile(`${__dirname}/templates/overview0.html`, `utf-8`, (err, data) => {
      let output = data;
      fs.readFile(`${__dirname}/templates/templatecard.html`, `utf-8`, (err, data) => {
        const cardsOuput = laptopData.map(el => replaceTemplate(data, el)).join('');
        output = output.replace('{%CARDS%}', cardsOuput);
        res.end(output);
      });
    });

  } else if (pathName === '/laptop' && id < laptopData.length){
    res.writeHead(200, {'Content-type': 'text/html'});
    fs.readFile(`${__dirname}/templates/laptop0.html`, `utf-8`, (err, data) => {
      const laptop = laptopData[id]
      const output = replaceTemplate(data, laptop);
      res.end(output);
    });

  } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) =>{
      res.writeHead(200, {'Content-type': 'image/jpg'});
      res.end(data);
    });
  }  else {
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end('Page does not exist');
  }

});

server.listen(1337, '127.0.0.1', () =>{
  console.log('Server is listening.');
});

function replaceTemplate(originalHTML, laptop){
  let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
};
