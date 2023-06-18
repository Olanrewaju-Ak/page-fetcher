const request = require("request");
const readline = require("readline");
const fs = require("fs");

// get arguments from command line
const arguments = process.argv.slice(2);

//creating variables to hold the request url and local file path
const url = arguments[0];
const localFilePath = arguments[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//valid path checker
function isPathValid(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

//URL checks
function isUrlValid(url) {
  const regex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return regex.test(url);
}

//Making the request and nesting the write function in the request cos they are asyn
request(url, (error, response, body) => {
  console.log("statusCode:", response && response.statusCode);

  //assigning the fs.writeFile to variable so it can be called multiple times
  const writeFile = fs.writeFile(localFilePath, body, (error) => {
    if (error) {
      console.log("error:", error);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
  });

  //checking the validity of the path
  if (!isPathValid(localFilePath)) {
    console.error("Invalid file Path");
    process.exit(1);
  }

  if (!isUrlValid(url)) {
    console.error("Invalid URL");
    process.exit(1);
  }

  //checking if the file already exists using fs.access()
  fs.access(localFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
      console.log("File already exists");
      rl.question("Do you want to overwrite it? Type Y to overwrite: ", (key) => {
        let keyUpperCase = key.toUpperCase();
        if (keyUpperCase !== "Y") {
          console.log("skipping the download!");
          rl.close();
        } else {
          writeFile;
        }
      });
    } else {
      writeFile;
    }
  });
});
