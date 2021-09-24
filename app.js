const { v4 } = require("uuid");
const readline = require("readline-sync");
const fs = require("fs");
const bcrypt = require("bcrypt");

// let input;
// Functions creation section starts

// Welcome function

let welcome = () => {
  console.log("Welcome to Command Line Registration & Login");
  console.log("1: Existing User - Login");
  console.log("2: New User - Register");
  console.log("0: Exit Program");
  //   input = readline.question("Enter your Option: ");
};

// append file function

const appendF = (fileName, dataToAppend) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(fileName, dataToAppend, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("New User Registered");
      }
    });
  });
};

// read file function

const read = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// write file function

const write = (fileName, dataToWrite) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, dataToWrite, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Data write task completed");
      }
    });
  });
};

// Email validation

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    // console.log("Invalid Email Address! Try again");
    if (input == 2) {
      console.log("Invalid Email Address! Try again");
      process.exit();
    } else {
      console.log("Invalid Email Address! Try again");
      process.exit();
    }
  }
}

// Registration function
let register = async () => {
  try {
    console.log("NEW USER REGISTRATION");
    let userName = readline.question("Enter your name: ");
    let userEmail = readline.question("Enter your email: ");
    validateEmail(userEmail);

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

    let userPassword = readline.question(`Enter Password: `, {
      hideEchoBack: true,
    });

    let confirmPassword = readline.question(
      `Confirm Password: (Remaining Attempts - 2)`,
      {
        hideEchoBack: true,
      }
    );

    let hashedPassword = await bcrypt.hash(userPassword, 10);
    let userId = v4();
    let createdOn = Date();
    // let listOfUsers = [];

    let newUser = {
      name: userName,
      email: userEmail.toLocaleLowerCase(),
      password: hashedPassword,
      id: userId,
      createdOn: createdOn,
    };
    // listOfUsers.push(newUser);

    let listOfUsers = await read("userDetails.json");
    if (listOfUsers == "") {
      let userDetails = await write(
        "userDetails.json",
        JSON.stringify([newUser])
      );
      console.log("Registration Success");
    } else {
      //check if the useremail already exists
      let existingUser = await read("userDetails.json");
      let existingUserList = JSON.parse(existingUser);
      for (user of existingUserList) {
        if (userEmail.toLowerCase() == user.email) {
          return console.log(
            "Already Registered. Please login using your credentials."
          );
        }
      }
      //When it doesn't exist update the list of user and write in the list
      let arrayOfUsers = JSON.parse(listOfUsers);
      arrayOfUsers.push(newUser);
      let newUserList = await write(
        "userDetails.json",
        JSON.stringify(arrayOfUsers)
      );
      console.log("Registration Success");
    }
  } catch (error) {
    console.error(error);
  }
};

let login = async () => {
  try {
    console.log("EXISTING USER LOGIN");
    let userEmail = readline.question("Enter your email: ");
    validateEmail(userEmail);
    let userPassword = readline.question(
      `Enter Password (Remaining attempts - 2): `,
      {
        hideEchoBack: true,
      }
    );

    //Pull the email address of existing users in an array

    let listOfUser = await read(`userDetails.json`);
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
            "User doesn't exist. Check email address or register as new user to continue"
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
          return console.log("Login Successful");
        } else {
          for (let a = 2; a <= 3; a++) {
            if (a == 2) {
              let passAttempt2 = readline.question(
                `Incorrect Password, enter Password again (Remaining attempts - 1): `,
                {
                  hideEchoBack: true,
                }
              );
              let validPassAttmpt2 = await bcrypt.compare(
                passAttempt2,
                listOfUserObj[i].password
              );
              if (validPassAttmpt2) {
                return console.log("Login Successful");
              } else {
                continue;
              }
            } else {
              let passAttempt3 = readline.question(
                `Incorrect Password, enter Password again (Remaining attempts - 0): `,
                {
                  hideEchoBack: true,
                }
              );
              let validPassAttmpt3 = await bcrypt.compare(
                passAttempt3,
                listOfUserObj[i].password
              );
              if (validPassAttmpt3) {
                return console.log("Login Successful");
              } else {
                return console.log(
                  "Password doesn't match our records. Exiting Program."
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

// Function creation section ends

welcome();
let input = readline.question("Enter your Option: ");

if (input == 0) {
  process.exit();
} else if (input == 1) {
  login();
} else if (input == 2) {
  register();
} else {
  console.log("Enter Valid Input");
}
