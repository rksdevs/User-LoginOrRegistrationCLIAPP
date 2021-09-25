const fs = require("fs");

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

module.exports = { read, write };
