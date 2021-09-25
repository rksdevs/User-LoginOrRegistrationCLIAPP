const { v4 } = require("uuid");
const readline = require("readline-sync");
const fs = require("fs");
const bcrypt = require("bcrypt");
const rw = require("./read-write");
const chalk = require("chalk");

let register = async () => {
  try {
    console.log(chalk.bgHex("#DE8971").black("NEW USER REGISTRATION"));
    let userName = readline.question(chalk.hex("#FE8F8F")`Enter your name: `);
    let userEmail = readline.questionEMail(
      chalk.hex("#FE8F8F")`Enter your email: `,
      {
        limitMessage:
          "Invalid Email Address! Expected format: mail@example.com",
      }
    );
    //Confirm password using questionNewPassword Method - readline

    // let userPassword = readline.questionNewPassword(
    //   "Enter password (minimum length: 6 & maximum length: 15): ",
    //   {
    //     min: 6,
    //     max: 15,
    //     confirmMessage: "Confirm password: ",
    //     unmatchMessage:
    //       "Passwords do not match. Hit ONLY THE ENTER KEY if you want to retry by Setting Primary Password again., else...",
    //   }
    // );

    // Confirm password using question, hideEchoBack & loop with attempts method

    let userPassword = readline.question(
      chalk.hex("#FE8F8F")`Enter Password: `,
      {
        hideEchoBack: true,
      }
    );
    for (let a = 2; a >= 0; a--) {
      let confirmPassword = readline.question(
        chalk.hex("#FE8F8F")`Confirm Password (Attempts Remaining - ${a}): `,
        {
          hideEchoBack: true,
        }
      );
      if (confirmPassword == userPassword) {
        break;
      } else {
        if (a == 0) {
          return console.log(
            chalk
              .bgHex("#FDBAF8")
              .black("Passwords do not match! Exiting Program")
          );
        } else {
          continue;
        }
      }
    }

    let hashedPassword = await bcrypt.hash(userPassword, 10);
    let userId = v4();
    let createdOn = Date();

    let newUser = {
      name: userName,
      email: userEmail.toLocaleLowerCase(),
      password: hashedPassword,
      id: userId,
      createdOn: createdOn,
    };

    let listOfUsers = await rw.read("userDetails.json");
    if (listOfUsers == "") {
      let userDetails = await rw.write(
        "userDetails.json",
        JSON.stringify([newUser])
      );
      console.log(chalk.bgHex("#FDBAF8").black("Registration Success"));
    } else {
      //check if the useremail already exists
      let existingUser = await rw.read("userDetails.json");
      let existingUserList = JSON.parse(existingUser);
      for (user of existingUserList) {
        if (userEmail.toLowerCase() == user.email) {
          return console.log(
            chalk
              .bgHex("#FDBAF8")
              .black("Already Registered. Please login using your credentials.")
          );
        }
      }
      //When it doesn't exist update the list of user and write in the list
      let arrayOfUsers = JSON.parse(listOfUsers);
      arrayOfUsers.push(newUser);
      let newUserList = await rw.write(
        "userDetails.json",
        JSON.stringify(arrayOfUsers)
      );
      console.log(chalk.bgHex("#FDBAF8").black("Registration Success"));
    }
  } catch (error) {
    console.error(error);
  }
};

//For Login

let login = async () => {
  try {
    console.log(chalk.bgHex("#DE8971").black("EXISTING USER LOGIN"));
    let userEmail = readline.questionEMail(
      chalk.hex("#FE8F8F")`Enter your email: `,
      {
        limitMessage:
          "Invalid Email Address! Expected format: mail@example.com",
      }
    );
    let userPassword = readline.question(
      chalk.hex("#FE8F8F")`Enter Password (Remaining attempts - 2): `,
      {
        hideEchoBack: true,
      }
    );
    //Pull the email address of existing users in an array

    let listOfUser = await rw.read(`userDetails.json`);
    let parsedListOfUser = JSON.parse(listOfUser);
    let listOfUserEmail = [];
    let listOfUserObj = [];

    for (user of parsedListOfUser) {
      listOfUserEmail.push(user.email);
      listOfUserObj.push(user);
    }

    // Check if the email address exists

    for (let i = 0; i < listOfUserEmail.length; i++) {
      if (listOfUserEmail[i] != userEmail.toLowerCase()) {
        if (i == listOfUserEmail.length - 1) {
          return console.log(
            chalk
              .bgHex("#FDBAF8")
              .black(
                "User doesn't exist. Check email address or register as new user to continue"
              )
          );
        }
        continue;
      } else {
        // check if the password matches our records
        let validPass = await bcrypt.compare(
          userPassword,
          listOfUserObj[i].password
        );
        if (validPass) {
          return console.log(chalk.bgHex("#FDBAF8").black("Login Successful"));
        } else {
          for (let a = 2; a <= 3; a++) {
            if (a == 2) {
              let passAttempt2 = readline.question(
                chalk.hex(
                  "#FE8F8F"
                )`Incorrect Password, enter Password again (Remaining attempts - 1): `,
                {
                  hideEchoBack: true,
                }
              );
              let validPassAttmpt2 = await bcrypt.compare(
                passAttempt2,
                listOfUserObj[i].password
              );
              if (validPassAttmpt2) {
                return console.log(
                  chalk.bgHex("#FDBAF8").black("Login Successful")
                );
              } else {
                continue;
              }
            } else {
              let passAttempt3 = readline.question(
                chalk.hex(
                  "#FE8F8F"
                )`Incorrect Password, enter Password again (Remaining attempts - 0): `,
                {
                  hideEchoBack: true,
                }
              );
              let validPassAttmpt3 = await bcrypt.compare(
                passAttempt3,
                listOfUserObj[i].password
              );
              if (validPassAttmpt3) {
                return console.log(
                  chalk.bgHex("#FDBAF8").black("Login Successful")
                );
              } else {
                return console.log(
                  chalk
                    .bgHex("#FDBAF8")
                    .black(
                      "Password doesn't match our records. Exiting Program."
                    )
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { register, login };
