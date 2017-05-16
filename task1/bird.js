let animal = require("./animal");

let type = "Bird";
let hello = "Chirick"
exports.sayHello = animal.sayHello.bind(this, type, hello);