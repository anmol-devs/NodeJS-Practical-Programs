const http = require('http'); // 'http' and 'fs' core module hai isiliye ise install nhi krna padta.
const fs = require('fs');

// Create HTTP server
const server = http.createServer((req, res) => { // yaha apne server create kar rhe hai.

    // Read the text file
    fs.readFile('data.txt', 'utf8', (err, data) => {
        if (err) { // error aane pr if wala code run hoga.
            res.writeHead(500, { 'Content-Type': 'text/plain' }); // 'writeHead' means jab ham response generate kr rhe hai to uska ek header add kro. 500 error code hai ek, means server error hai, agar apne ko koi error smjh nhi aata to apne 500 bhejte hai means server pr koi error hai. Yaha apne header me jo-jo information bhejna chahte hai vo-vo likh skte hai. 
            res.end('Error reading file'); // 'end' means response me data bhej kr exit kar do.
        } else { // response is part se jaaega agar error nhi hai koi to.
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        }
    });
});

// Start server
server.listen(3000, () => { // Ye server create krega at 3000 port with following message.
    console.log('Server is running on http://localhost:3000');
});

// Vaise to apne paas abi ke liye front end nhi hai koi jisse apne koi request generate krke backend me bhej ske. Isiliye apne "Thunder Client" extension ka use krte hai. Ye extension ki mdad se apne requests bhej skte hai apne server par.