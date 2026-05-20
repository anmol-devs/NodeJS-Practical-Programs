const http = require('http');
const handleRoutes = require('./routes');

const server = http.createServer((req,res)=>{
    handleRoutes(req,res);
});

server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});