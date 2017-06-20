const colors = require("./all/colors");
const fs = require("fs");
const http = require("http");
const url= require("url");
const os = require("os");

http.createServer((req, res) => {
    let urlParse = url.parse(req.url, true);
    let pathname = urlParse.pathname;
    let result = "";
    switch (pathname) {
        case "/": 
            index.pipe(res);
            break;
        case "/search":
            let search = urlParse.query.search;
            fs.readFile('./task3/index.txt', { encoding : 'utf-8' }, (err, data) => {
                if (err) throw err;
                let indexes = [];
                data.split('\n').forEach((line, index) => {
                    let current = 0;
                    while ((current = line.toLowerCase().indexOf(search.toLowerCase(), current)) != -1 && search != "") {
                        indexes.push({
                            startLine: index,
                            startColumn: current,
                            endLine: index,
                            endColumn: current + search.length
                        })
                        current++;
                        
                    }
                });
                res.end(JSON.stringify(indexes));
            });
            break;
        case "/chunk":
            let params = urlParse.query;
            params = {
                startLine: params.startLine || 0,
                startColumn: params.startColumn || 0,
                endLine: params.endLine || Infinity,
                endColumn: params.endColumn || Infinity
            }
            fs.readFile('./task3/index.txt', { encoding : 'utf-8' }, (err, data) => {
                if (err) throw err;
                let result = "";
                data.split('\n').forEach((line, index) => {
                    if (index < params.startLine || index > params.endLine) return;
                    if (index != params.startLine && index != params.endLine) {
                        result += "\n" + line;
                        return;
                    }
                    if (index == params.startLine && index == params.endLine) {
                        result += line.slice(params.startColumn, params.endColumn);
                        return;
                    }
                    if (index == params.startLine) result += line.slice(params.startColumn);
                    if (index == params.endLine) result += line.slice(0, params.endColumn);
                });
                res.end(result);
            });
            let query = urlParse.query;
            if (query.search) {
                result = search + index;
            }
            break;
        case "/info":
            res.write(`Hostname: ${os.hostname()}\n`);
            res.write(`CPU: ${os.cpus()[0].model}\n`);
            res.write(`OS: ${os.type()} ${os.arch()} ${os.release()}\n`);
            res.end(`Memory: ${os.freemem()}/${os.totalmem()}`);
            break;
        default:
            res.end("nothing...");
    }
}).listen(8000);