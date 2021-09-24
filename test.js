var readline = require("readline-sync");

let inp = readline.questionNewPassword("Enter your password: ", {
  min: 3,
  max: 6,
});
console.log("Your password is: " + inp);
