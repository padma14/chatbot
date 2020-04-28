//a node.js middleware for handling JSON, Raw, Text and URL encoded form data
let bodyParser = require('body-parser');
let express = require('express');
let mysql = require('mysql');

const app = express();
const port = 3000;

//create db
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE chatbotDB';
  db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(res);
    res.send('database created');
  })
});
//create connection
let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'chatbotDB'
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//handle the post request

app.post('/', function (req, res, next) {
  var intentName = req.body.queryResult.intent.displayName;
  var queryText = req.body.queryResult.queryText;
  //console.log(intentName);

  switch(intentName){
    case 'starter':
      console.log('starter called');
      break;

    case 'getUser':
      console.log('getUser called');
      var unikey = req.body.queryResult.parameters.unikey;
      db.connect(function(err){  
          db.query("SELECT * FROM users WHERE UniKey = '" + unikey + "'"
          , function (err, result){
            try{    
              name = result[0].Name;
              res.send(nameRespond(name));  
            }catch(err) {
              console.log(err);
              res.send(simpleTextRespond("Cannot find unikey:" + unikey + ", would you like to try again?"));  
            }
          });
      });

      break;
    case 'logProductive':
      console.log('logProductive');
      logData(queryText);
      //respond is defiend on the dialog console.
      break;
    case 'logProductive_hasMore':
      console.log('logProductive_hasMore');
      logData(queryText);
      //respond is defiend on the dialog console.
      break;
    //---
    case 'logUnproductive':
      console.log('logUnproductive');
      //logData(queryText);
      db.connect(function(err){  
        db.query("SELECT * FROM tasks WHERE CourseCode = 'COMP5703'"
        , function (err, result){
          try{    
            var url = result[0].Url;
            res.send(simpleTextRespond("Check out this video: " + url));  
          }catch(err) {
            console.log(err);
          }
        });
    });
      break;
    

    default:
      console.log('no match intent found');
  }
  function logData(text){

    db.connect(function(err){
      try{
        db.query("INSERT INTO Logs (CourseCode, LogDate, LogDescription) " +
        "VALUES ('COMP5703', NOW(), " + "'" + text + "'" + ");"
        );
        console.log("query success");
      }catch(err){
        console.log(err);
      }

    });

  }



  //whenever the server receive a post, store the user input to 'Log' in the database
    // console.log("----------request --------");
    // console.log(req.body);
    // console.log("----------request --------");
    
    // db.connect(function(err){
    //   if(err){ console.log(err); }
    //   console.log('Dabatase connected');  
      
    //   db.query("INSERT INTO Courses (CourseCode, CourseName, UniKey) " +
    //   "VALUES ('COMP5703', 'Capstone Project', 'admin');", function (err, result){
    //    if(err) { throw err; console.log(err);};  
    //    });

    //    db.query("INSERT INTO Logs (CourseCode, LogDate, LogDescription) " +
    //    "VALUES ('COMP5703', NOW(), " + "'" + req.body.queryResult.queryText + "'" + ");", function (err, result){
    //     if(err) { throw err; console.log(err);};  
   
    //     });
      
    // });
});
 
function nameRespond(name) {
  let respond = {
    "fulfillmentText": "NameRespond_text",
    "fulfillmentMessages": [
      {
        "text": {
            "text":[
                "Hello " + name + ", what have you done today?"
            ]
        }         
      }
    ]
  }
  return respond;
}
function simpleTextRespond(text) {
  let respond = {
    "fulfillmentText": "NameRespond_text",
    "fulfillmentMessages": [
      {
        "text": {
            "text":[
                text
            ]
        }         
      }
    ]
  }
  return respond;
}


function createTextRespond(name, email) {
    let respond = {
        "fulfillmentText": "This is a text response",
        "fulfillmentMessages": [
          {
            "text": {
                "text":[
                    "Your name is " + name + " and your email is " + email
                ]
            }         
          }
        ],
        "source": "example.com",
        "payload": {
          "google": {
            "expectUserResponse": true,
            "richResponse": {
              "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": "this is a simple response"
                  }
                }
              ]
            }
          },
        },
        "outputContexts": [
          {
            "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
            "lifespanCount": 5,
            "parameters": {
              "param-name": "param-value"
            }
          }
        ],
        "followupEventInput": {
          "name": "event name",
          "languageCode": "en-US",
          "parameters": {
            "param-name": "param-value"
          }
        }
      }
      return respond;
}

