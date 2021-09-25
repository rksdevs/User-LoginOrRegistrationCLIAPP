const readline = require("readline-sync");
const regOrLog = require("./login-reg");
const chalk = require("chalk");

// Welcome function

let welcome = () => {
  console.log(
    chalk.bgHex("#FDBAF8").black("Welcome to Command Line Registration & Login")
  );
  console.log(chalk.hex("#FE8F8F")("1: Existing User - Login"));
  console.log(chalk.hex("#FE8F8F")("2: New User - Register"));
  console.log(chalk.hex("#FE8F8F")("0: Exit Program"));
};

welcome();
let input = readline.question(chalk.hex("#FE8F8F")("Enter your Option: "));

if (input == 0) {
  process.exit();
} else if (input == 1) {
  regOrLog.login();
} else if (input == 2) {
  regOrLog.register();
} else {
  console.log(chalk.bgHex("#FDBAF8").black("Enter Valid Input"));
}
