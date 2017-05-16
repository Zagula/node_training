let animal = require("./animal");

let type = "Dog";
let hello = "Bark"
exports.sayHello = animal.sayHello.bind(this, type, hello);