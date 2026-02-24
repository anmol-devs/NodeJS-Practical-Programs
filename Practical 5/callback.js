const fs = require("fs");

function readFileCallback(fileName) {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading ${fileName}`);
      return;
    }
    console.log(`Data from ${fileName} : `);
    console.log(data);
  });
}


readFileCallback('file1.txt');
readFileCallback('file2.txt');
readFileCallback('file3.txt');