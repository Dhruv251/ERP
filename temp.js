require('dotenv').config();

const express= require("express");
const mysql= require("mysql2");
const bodyParser = require("body-parser");
const { QueryError } = require('sequelize');
// const bcrypt = require("bcrypt");

const app = express();
const salthand=10;
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const pool = mysql.createPool({
    host :process.env.HOST ,
    user : process.env.USER,
    database :process.env.DB ,
    password : process.env.PWD
});

pool.getConnection(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + pool.threadId);
  });
var req_id;
    var reqid = "REQ-C-"
    const q="SELECT * from request;";

    pool.query("SELECT * FROM request ", function(err, rows, fields){
      if(err) {
         console.log(err);
      } else {
        
        setName(rows);
      }
    });
    
    function setName(rows) {
      req_id = rows[0].request_id;
      console.log(rows);
      reqid += req_id;
      console.log(reqid)

    }