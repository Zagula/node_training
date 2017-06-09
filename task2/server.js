const EventEmitter = require('events');
const questions = require("./questions");

class Server extends EventEmitter {
    constructor(client) {
        super();
        this.answers = [];
        this.index = 0;
        process.nextTick(() => {
            this.emit('response', JSON.stringify(questions[0]));
        });

        client.on('request', (input) => {
            this.answers[this.index] = {
                variant: input
            };
            if (this.answers.length != questions.length) {
                this.index++;
                this.emit("response", JSON.stringify(questions[this.index]));
            } else {
                this.emit("result", this.calculate());
            }
        });
    }

    calculate() {
        let total = 0;
        questions.forEach((question, index) => {
            if (question.correct == Object.keys(question.answer)[this.answers[index].variant-1]) total++;
        });
        return JSON.stringify({result: `Correct answers: ${total}/${questions.length}`});
    }
}

module.exports = (client) => new Server(client);