var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
 }));

 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

 // default route
 app.get('/', function (req, res) {
     return res.send({ error: true, message: 'hello' })
 });

 // connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'userapp',
    password: '123456', //Pass user root
    database: 'appdb',
    port : 3306
});
// connect to database
dbConn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// Add a new user  
app.post('/register', function (req, res) {
    let userName = req.body.userName;
    let email = req.body.email;
    let passWord = req.body.passWord;
    console.log(userName);
    console.log(passWord);
    if (!userName || !passWord) {
      return res.status(400).send({ error:true, message: 'Vui lòng nhập username', iscreate: 0 });
    }
    let str_select ="select count(1) clmCount from users where name ='" + userName + "' and email='" + email +"'";
    console.log('str_select: ' + str_select);
    dbConn.query(str_select, function(error, results) {
        if(results[0].clmCount >= 1)
        {
            return res.send({error: false, data: results, message : 'UserName hoặc Email đã đăng ký', iscreate: 0});
        }else{
            let str_insert ="INSERT INTO users (name, email, password) VALUES('" + userName + "','" + email + "','" + passWord + "')";
            console.log('str_insert: ' + str_insert);
            dbConn.query(str_insert, function (error, results) {
                if (error) throw error;
                    return res.send({ error: false, data: results, message: 'Đăng ký thành công.', iscreate: 1});
                });
        }
    });
});

// User login
app.post('/login', function (req, res) {
    let email = req.body.email;
    let passWord = req.body.passWord;
    console.log(email);
    console.log(passWord);
    if (!email || !passWord) {
      return res.status(400).send({ error:true, message: 'Vui lòng nhập username, passWord!' });
    }
    let str_select ="select count(1) clmCount from users where email ='" + email + "' and password='" + passWord +"'";
    console.log('str_select: ' + str_select);
    dbConn.query(str_select, function(error, results) {
        if(results[0].clmCount >= 1)
        {
            return res.send({ error: false, data: results, message: 'Đăng nhập thành công.', islogin: 1 });
        }else{
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'Sai user name hoặc password', islogin: 0 });
        }
    });
});

 // set port
 app.listen(3000, function () {
     console.log('Node app is running on port 3000');
 });
 module.exports = app;