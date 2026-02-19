// app.use ---> used for middleware
// app.use(cors({origin : 'http://192.168.56.1:3000'})); ---> middleware
// node - npm init -y
// math.js - 2 functions 
// message.js - 2 functions
// app.js/server.js - import math and message (using require)

const math = require("./math.js");
const message = require("./message.js");

const c = math.add(1, 2);
console.log(c);

const d = math.sub(50, 66);
console.log(d);

const e = message.greet("Anmol");
const f = message.displayMessage("Anmol");
console.log(e);
console.log(f);