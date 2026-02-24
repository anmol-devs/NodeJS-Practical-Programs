const fs = require("fs").promises;
//fs.readFile is now used as fs.promises.readFile , when we used require('fs').promise in the header. other wise fs.readFile will be read as a callback instead of promise.
async function processFile() {
  try {
    const file1 = await fs.readFile("file1.txt", "utf8");
    console.log(file1);

    const file2 = await fs.readFile("file2.txt", "utf8");
    console.log(file2);

    const file3 = await fs.readFile("file3.txt", "utf8");
    console.log("File3 processed using Async/Await :");
    console.log(file3);
  } catch {
    console.error("Error occured in reading file");
  }
}

processFile();