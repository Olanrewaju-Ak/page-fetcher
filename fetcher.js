const request = require("request");
const fs = require("fs");

// get arguments from command line
const arguments = process.argv.slice(2);

//creating variables to hold the request url and local file path
const url = arguments[0];
const localFilePath = arguments[1];

//Making the request and nesting the write function in the request cos they are asyn
request(url, (error, response, body) => {
  console.log("statusCode:", response && response.statusCode);
  fs.writeFile(localFilePath, body, (error) => {
    if (error) {
      console.log("error:", error);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
  });
});
