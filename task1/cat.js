let animal = require("./animal");

let type = "Cat";
let hello = "Meow"
exports.sayHello = animal.sayHello.bind(this, type, hello);