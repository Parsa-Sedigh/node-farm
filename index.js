/* When you type node and then enter in terminal, it will open up node REPL which REPL stands for read eval print loop.
* For exit REPL you can write .exit also you can hit ctrl + d. Also by hitting tab or maybe two tabs you can see all the
* global variables that are available in node (these are node modules.). So we can see all kinds of global variables that we
* can access whenever we want in node.js
*
* Trick: Let's assume that you entered this calculation in node terminal : 3*8
* now you can say : _+6 and the result would be 30. So _ is basically your previous result (underscore is 24 now)
*
* Trick : You can use those global variables that have some constructors in it like String
* So if we say: String.<hit tab> : You can see all of the methods and properties that constrictor gives us.*/

/* Calling this function here with this built-in fs module name will return an object and in that object there are a lot of
* functions that we can use.  */
/* If you don't specify the second arg of readFileSync (encoding), that function will return a buffer */

/* Node.js is single threaded, so for each application, there's only one thread.So all the users that are accessing your application,
are all using the same thread and so whenever they're interacting with the application, the code that is run for each user,
will be executed all in the same thread at the same place in the computer running the app and that is true, no matter if you have
5 users or 5 million users. What does this mean? Well, when one user blocks the single thread with syncronous code, then ALL other
users have to wait for that execution to finish (because the entire execution is blocked, for example when one user accessing one huge
file, the other users won't be able to do even simple things!). So we must use async code in node.js
But in PHP, you get one new thread for each user that is using the application.

* Remember: When we use callbacks in our code, that doesn't automatically make it asyncronous! In other words, passing functions
* into other functions, doesn't make them asyncronous automatically. It only workds this way for some functions in Node API.Such
 as readFile() function and many many more.*/
const fs = require('fs');
const http = require('http');

/* url module helps us to parse the parameters and their values in url into a nicely formatted object. */
const url = require('url');

//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `Hell yeah : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file has been written');

//Non-blocking, asynchronous way
/* In readFile() we start reading the file in the background and as soon as it's ready, it will start or call the
 callback function, that we specified. Many times the first parameter in a callback will be the error, so the error is
 usually the first one and the data is second one (in readFile()). But in writeFile() method we haven't any data that come back
 from writeFile() so we can only include err parameter in callback of writeFile()
 When we have multiple callbacks inside each other, the next callback is depend on the result of the previous callback.

 So node.js implements async operations by calling callbacks as soon as the operation that it's doing has been finished.  */
/* Remember: Arrow function doesn't get it's own this keyword, so it uses the this keyword from the parent function and that
* is called the lexical this keyword. */
/* Important: The dot in file path arg in readFile() method refers to the directory from which we run node command in the terminal.
*   But we could have run node command somewhere else and therefore the dot would mean something else.For example we could go to desktop
*   and run node command there, so dot would mean desktop, so it would cause errors.Therefore we can use __dirname. This variable always
*   translate to the directory in which the script that we're currently executing is located. So we can always use this variable EXCEPT
*   1 place which is in require() function. Because in () of require(), dot also means the current working directory and NOT the place
*   we are executing the script from it.
*
* RECAP: USUALLY dot means where the script is running and __dirname is where the current file is located. */

// fs.readFile('./txt/starter.txt', 'utf-8',(err, data) => {
//     console.log(data);
// });

/* We can use sync version of reading file here, which is outside of .createServer(). Yeah!I know! The async version is better.
* But here this is not a problem at all.Because the top level code only gets executed ONCE WE START THE PROGRAM, RIGHT IN THE BEGINNING! But the
* callback function arg in .createServer() gets executed EACH TIME that a new request hits the server but not the code that's out
* of the .createServer() . So we can use sync version of reading a file now, because it's easier to handle the read data, because
* this sync method, simply puts the data into a variable that we can then use right away.
* So don't worry that this function is blocking the execution, because it is a top level code and it only executed once.\
* So we didn't use the async version here:

fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {

     data parameter is json so we must take this json parameter which is a string and then turn it into
     javascript object or array using JSON.parse() which will automatically do this task.

    const productData = JSON.parse(data);

});
*/

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

/* In order to build our server, first we create the server and then second, we start the server so with this, the server starts
* to listen to incoming requests. In order to listen to request we need to save the result of the .createServer() into a variable
* and then call .listen() on that variable.
*
* createServer() method accepts a callback function which will be fired off each time a new request hits our server and this
* callback function gets access to two very important variables named req and res. */
const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {

        res.end('this is the overview');

    } else if (pathName === '/product') {

        res.end('this is the product');

    } else if (pathName === '/api') {

        res.writeHead(200, {'Content-Type': 'application/json'});
        /* Important: res.end() method needs to send back a string and not an object, so we MUST send data that is a string
        *   in JSON format not the productData that is the parsed of data parameter!!! But before res.end() we need to tell
        *   browser that we are sending back json data. So we must use res.writeHead() */

        res.end(data);
        /* It's better to read file once in the beginning and then each time someone hits this route, simply send back the data
         * of reading the file.Instead of for each request read the file!!! */

    } else {

        /* What is header? An http header is basically a piece of information about the response that we are sending back from server.
        * Important: These headers and also the status code always need to be set BEFORE we send out the response. So we never can
        * send headers after the response content itself. So we can use headers to send some metadata about the response itself.
        * You COULD send response to be HTML but don't set the header's content-type to be text-html, but it's better to send information
        * about the response we are sending to browser.
        *
        * But also there are some request headers but they set by browser automatically  */
        res.writeHead(404, {

            /* Now browser is expecting some HTML  */
            'Content-Type': 'text/html',
            'my-own-header': 'Parsa'
        });
        res.end('<h1>Page can not be found</h1>');
    }

});

/* Port is a sub address on a certain host. Also we don't need to specify the host here and then it would be by default localhost,
* but we can actually specify it to localhost explicitly and localhost usually has 127.0.0.1 (standard IP address for localhost)
*  address as default. (localhost is the current computer that this program is currently running on it.) */
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000 ...');
});

/* After listening, the app keeps running but before it was always stopping right away. But now it doesn't do that because of
* event loop.*/

/* Routing basically means implementing different actions for different URLs. */
