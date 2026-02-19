// Import the custom module
const example = require('./example'); // "require" se apne koi file (module) ki saari functionalities ek saath import ho jaati hai and "import" se vhi part add hota hai jo apne ko chahiye.

// Accessing the nested object
console.log("App Name:", example.config.name);
console.log("Current Theme:", example.config.settings.theme); // Yaha jo "appConfig" object ke andr jo "settings" wala nested object ko print krwa rhe hai ko practical me kaha gya tha.

// Using the exported function
const message = example.greet("Anmol"); // Yaha par apno ne "message" me store kr diya return wala, jo "displayMessage" me return kra tha. 
console.log(message);