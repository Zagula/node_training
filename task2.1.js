const Server = require("./task2/server");
const EventEmitter = require('events');
const readline = require('readline');
// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);
const colors = {
 Reset: "\x1b[0m",
 Bright: "\x1b[1m",
 Dim: "\x1b[2m",
 Underscore: "\x1b[4m",
 Blink: "\x1b[5m",
 Reverse: "\x1b[7m",
 Hidden: "\x1b[8m",
 fg: {
  Black: "\x1b[30m",
  Red: "\x1b[31m",
  Green: "\x1b[32m",
  Yellow: "\x1b[33m",
  Blue: "\x1b[34m",
  Magenta: "\x1b[35m",
  Cyan: "\x1b[36m",
  White: "\x1b[37m",
  Crimson: "\x1b[38m"
 },
 bg: {
  Black: "\x1b[40m",
  Red: "\x1b[41m",
  Green: "\x1b[42m",
  Yellow: "\x1b[43m",
  Blue: "\x1b[44m",
  Magenta: "\x1b[45m",
  Cyan: "\x1b[46m",
  White: "\x1b[47m",
  Crimson: "\x1b[48m",

  Black2: "\x1b[100m",
  Red2: "\x1b[101m",
  Green2: "\x1b[102m",
  Yellow2: "\x1b[103m",
  Blue2: "\x1b[104m",
  Magenta2: "\x1b[105m",
  Cyan2: "\x1b[106m",
  White2: "\x1b[107m"
 }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new EventEmitter();
const server = Server(client);

let timer, answersCount, varPos = 1;

process.stdin.on("keypress", (input, code) => {
    if (code.name == "up") {
        readline.cursorTo(rl, 0, (varPos <= 1) ? varPos = answersCount : --varPos);
    }
    if (code.name == "down") {
        readline.cursorTo(rl, 0, (varPos >= answersCount) ? varPos = 1 : ++varPos);
    }
    readline.cursorTo(rl, 0, varPos);
    readline.clearLine(rl, -1);
})

let questionColor = colors.fg.Yellow,
    secColor = colors.fg.White,
    variantColor = colors.fg.Cyan,
    alertColor = colors.fg.Red,
    resultColor = colors.fg.Magenta;

function render(question, sec) {
    reset();
    process.stdout.write(`${colors.fg.Yellow}${question.title} (${secColor}${sec}${questionColor})${variantColor}`);
    for (let key in question.answer) {
        process.stdout.write(`\n ${key.toUpperCase()}: ${question.answer[key]}`);
    }
    process.stdout.write(`${questionColor}`);
    readline.cursorTo(rl, 0, varPos);
}
function reset() {
    varPos = 1;
    clearInterval(timer);
    readline.cursorTo(rl, 0, 0);
    readline.clearScreenDown(rl);
}
server.on('response', (resp) => {
    let question = JSON.parse(resp);
    answersCount = Object.keys(question.answer).length;
    let sec = 30;
    let pos = question.title.length;
    render(question, sec--);
    timer = setInterval(() => {
        if (!sec) {
            client.emit('request', "");
        } else {
            readline.cursorTo(rl, pos + 2, 0);
            readline.clearLine(rl, 1);
            timeColor = (sec < 10) ? alertColor : secColor;
            process.stdout.write(`${timeColor}${sec--}${questionColor})`);
            readline.cursorTo(rl, 0, varPos);
        }
    }, 1000);
});
server.on("result", (responce) => {
    let data = JSON.parse(responce);
    reset();
    process.stdout.write(`${resultColor}${data.result}${colors.fg.White}`);
    process.stdin.on("keypress", (input, code) => {
        rl.close();
    });
})

rl.on('line', (input) => {
    let data = varPos;
    reset();
    client.emit('request', data);
});
rl.on('close', (input) => {
    process.stdout.write(`${colors.fg.White}`);
});
rl.on('SIGINT', () => {
    reset();
    rl.close();
});