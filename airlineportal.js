const exp=require('express');

const uuid = require('uuid/v4');
var bodyParser = require('body-parser');
var session=require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser')
 

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodemysql',
  clearExpired: true //auto remove expired session tuples from db 
});

connection.connect();
var sessionStore = new MySQLStore({}/* session store options */, connection);
var user='zain';
var pass='123';
module.exports.connection=connection;
//var UserPrototype=require("./controllers/user.js").UserPrototype;
var airlinePrototype=require("./controller/airline.js").airlinePrototype;
const app=exp();

app.set('view engine', 'ejs');
app.use(exp.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	genid: (req) => {
    console.log('Creating session Id')
    return uuid(); // use UUIDs for session IDs
  },
	name:'Session-Cookie',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store:sessionStore,
  cookie: {secure: false,maxAge: 5*60*1000 }//session cookie expire after 5 mins
}));


app.get("/Createdb",(req,res)=>
{
  connection.query("CREATE DATABASE nodemysql", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

app.get("/Login",(req,res)=>{
res.render("airlineLogin.ejs");
});
app.get("/Signup",(req,res)=>{
res.render("airlineSignup.ejs");
});

app.get("/addFlight",(req,res)=>{
res.render("addflight.ejs");
}); 

app.get("/cancelFlight",(req,res)=>{
    res.render("cancelflight.ejs");
});
app.get("/delayFlight",(req,res)=>{
    res.render("delayflight.ejs");
});
    
app.get("/addintoflight",(req,res)=>
{
  
  let sql = connection.query("SELECT F.AIRLINE_ID , F.FLIGHT_NUMBER ,F.FLIGHT_SOURCE, F.FLIGHT_DESTINATION , F.DEPARTURE_TIME ,FC.FLIGHT_CLASS , FC.NO_OF_SEATS , FC.PRICE , FS.FLIGHT_CLASS, FS.NO_OF_SEATS ,FS.PRICE FROM FLIGHT F , FLIGHT_CLASS FC ,FLIGHT_CLASS FS WHERE F.FLIGHT_NUMBER = FS.FLIGHT_NUMBER AND F.FLIGHT_NUMBER = FC.FLIGHT_NUMBER AND F.DEPARTURE_TIME = FC.DEPARTURE_TIME AND F.DEPARTURE_TIME = FS.DEPARTURE_TIME AND FC.FLIGHT_CLASS <> FS.FLIGHT_CLASS AND FC.FLIGHT_CLASS = 'BUSINESS' AND FS.FLIGHT_CLASS = 'ECONOMIC' ", (err, result, fields)=> {
    if (err) throw err;
    console.log(result);
    res.render('addintoflight.ejs',{F:result});
  });
  
});

app.get("/Profile",(req,res)=>
{
    res.render('airlineprofile.ejs');
});

app.get("/error",(req,res)=>
{
    res.render('error.ejs');
});


app.post("/ASignup",(req,res)=>
{
  var Airline_ID = req.body.AirlineID;
  var Airline_Name = req.body.AirlineName;
  var Airline_Password = req.body.Apassword;
  let message;
  console.log(Airline_ID,Airline_Name,Airline_Password);
  airlinePrototype.AirlineSignup(Airline_ID,Airline_Name,Airline_Password).then((info)=>
  {  
     message = "Signup Successful Now Login";
     res.render("airlineLogin.ejs",{F:message});
  }).catch((msg)=>
  {
    message = "Signup Is Unsuccessful";
    res.render("signuperror.ejs",{F:message});
  });

});
app.post("/ALogin",(req,res)=>
{

});


app.post("/addinflight",(req,res)=>{

  var Airline_ID = req.body.AirlineID;
  var FLIGHT_NUMBER = req.body.FlightNumber;
  var Souce = req.body.FSOURCE;
  var Destination = req.body.Destination;
  var DEPARTURE_TIME = req.body.DepartureTime;
  var BSeat = req.body.BSeat;
  var BPrice = req.body.BPrice;
  var ESeat = req.body.ESeat;
  var EPrice = req.body.EPrice;
  let message;


airlinePrototype.AddInTemp(FLIGHT_NUMBER,req.body.FSOURCE,Destination,DEPARTURE_TIME,Airline_ID).then((info)=>{

   airlinePrototype.AddInTempClass(FLIGHT_NUMBER,"BUSINESS",DEPARTURE_TIME,BSeat,BPrice).then((info)=>{
   
   airlinePrototype.AddInTempClass(FLIGHT_NUMBER,"ECONOMIC",DEPARTURE_TIME,ESeat,EPrice).then((info)=>
   {  
      message = "Flight Added Successfully";
      res.render("Error.ejs",{F:message});
   }).catch((msg)=>
   {
     message = "Add Flight Is Unsuccessful";
     res.render("Error.ejs",{F:message});
   });
    
  }).catch((msg)=>{
     message = "Add Flight Is Unsuccessful";
     res.render("Error.ejs",{F:message});
  });
  }).catch((msg)=>{
    message = "Add Flight Is Unsuccessful";
    res.render("Error.ejs",{F:message});
  });

}); 




app.post("/delayinflight",(req,res)=>
{
    var Airline_ID = req.body.AirlineID;
    var FLIGHT_NUMBER = req.body.FlightNumber;
    var OLDDEPARTURE_TIME =req.body.OldDepartureTime;
    var DEPARTURE_TIME = req.body.DepartureTime;
    let message;
    airlinePrototype.UpdateRequestInFlight(FLIGHT_NUMBER,OLDDEPARTURE_TIME,DEPARTURE_TIME).then((info)=>
    {
       airlinePrototype.UpdateRequestInFlightClass(FLIGHT_NUMBER,OLDDEPARTURE_TIME,DEPARTURE_TIME).then((info)=>
       {
            
            message = "Flight Delay Is Successful ";
            res.render("Error.ejs",{F:message});
       
       }).catch((msg)=>
       
       {

          message = "Flight Delay Is UnSuccessful";
          res.render("Error.ejs",{F:message});
      });
      }).catch((msg)=>
      {
        message = "Flight Delay Is UnSuccessful";
        res.render("Error.ejs",{F:message});
      });
});

app.post("/cancelinflight",(req,res)=>
{
    var Airline_ID = req.body.AirlineID;
    var FLIGHT_NUMBER = req.body.FlightNumber;
    var DEPARTURE_TIME = req.body.DepartureTime;
    let message;
    airlinePrototype.CancelRequestInFlightClass(FLIGHT_NUMBER,DEPARTURE_TIME).then((info)=>
    {
      airlinePrototype.CancelRequestInFlight(FLIGHT_NUMBER,DEPARTURE_TIME).then((info)=>
      {
         message = "Flight Cancellation Is Successful";
        res.render("error.ejs",{F:message});
        
      }).catch((msg)=>
      
      {
        message = "Flight Cancellation Is Unsuccessful";
        res.render("error.ejs",{F:message});

      });
   }).catch((msg)=>
   
   {

      message = "Flight Cancellation Is Unsuccessful";
      res.render("error.ejs",{F:message});

   });   
});


app.listen(3000,()=>{
console.log('Server listening on port 3000');

});






