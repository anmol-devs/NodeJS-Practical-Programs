const fs = require('fs');
const path = require('path');

function handleRoutes(req, res){
  
     let filePath = "";

     if(req.url === "/"){
        filePath = path.join(_dirname, "pages", "home.html");
    }
    else if(req.url === "/about"){
        filePath = path.join(_dirname, "pages", "about.html");
    }
    else if(req.url === "/contact"){
     filePath = path.join(_dirname, "pages", "contact.html");
   }
    else{
        res.writeHead (404, {"Content-Type": "text/plain"});
        res.write("404 Page Not Found");
        return res.end();
    }
   
    fs.readFile(filePath, (err, data) =>{
        if(err){
            res.writeHead(500);
            res.end("Server Error")
        }
        else{
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
            }
  });
} 

module.exports = handleRoutes;