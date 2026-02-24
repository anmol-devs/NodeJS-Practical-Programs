const fs = require('fs');
// readFile reads the whole file at once , createReadStream reads the file chunk by chunk
function readFileStream(fileName){
  const stream = fs.createReadStream(fileName , 'utf8');

  stream.on('data' , (chunk)=>{
    console.log(`chunk from ${fileName}:`);
    console.log(chunk);
  })
  stream.on('end' , ()=>{
    console.log(`${fileName} reading completed`);
  });

  stream.on('error' , (err)=>{
    console.log(`Error reading ${fileName}` , err);
  });
}

readFileStream('file1.txt');
readFileStream('file2.txt');
readFileStream('file3.txt');
