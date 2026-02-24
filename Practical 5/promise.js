const fs = require("fs");

function readFilePromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        reject(`Error reading ${fileName}`);
      } else {
        resolve(data);
      }
    });
  });
}
Promise.all([
  readFilePromise("file1.txt"),
  console.log("hello"),
  readFilePromise("file2.txt"),
  console.log("bye bye"),
  readFilePromise("file3.txt"),
])

  // if we console.log('') between the readFilePromise , then console.log will be in the ouput before readFile
  // as it needs all the functions(promises) to be resolved first and than print all of them togather. If any one is stuck with error , they non of them will be executed
  .then((data) => {
    console.log("All files read successfully!");
    console.log(data);
  })
  .catch((error) => {
    console.error("One of the files failed:", error);
  });