function greet(user) {
  return `Hello ${user}!`;
}

function displayMessage(user) {
  return `You are now using this file ${user}.`;
}

module.exports = {
  greet : greet,
  displayMessage : displayMessage
};