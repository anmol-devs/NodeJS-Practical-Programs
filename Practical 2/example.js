// A nested object containing configuration data
const appConfig = {
    name: "MyNodeApp",
    version: "2.1.0",
    settings: { // Nested object jise export krenge apne doosri file me
        theme: "dark",
        port: 5000
    }
};

// A function that perfomrs a task
const displayMessage = (user) => {
    return `Welcome, ${user}! You are running version ${appConfig.version}`; // Backtick use tab krte hai apne jb ye $ sign se btana hota hai ki ye string nhi hai and baaki ka string hai.
};

// Exporting both as a single object
module.exports = { // Export kr ske is module ki functionalities, to is method se krenge.
    config: appConfig,
    greet: displayMessage // Yha pr apno ne alag se names de diye inhe, taaki dusri file me apne in names se access kr ske. Agar na bhi ye aliasing kre seedha object ya function ke names likhde, to bhi chlega.
};