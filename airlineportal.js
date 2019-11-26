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
  database : 'arilinemsnew',
  clearExpired: true //auto remove expired session tuples from db 
});

connection.connect();
var sessionStore = new MySQLStore({}/* session store options */, connection);
var user='zain';
var pass='123';
module.exports.connection=connection;
var airlinePrototype=require("./controllers/airline.js").airlinePrototype;
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
  resave: true,
  saveUninitialized: true,
  store:sessionStore,
  cookie: {secure: false,maxAge: 5*60*1000 }//session cookie expire after 5 mins
}));

var UserPrototype=require("./controllers/user.js").UserPrototype;
//var UserPrototype=require("./controllers/user.js").UserPrototype;

app.get('/',(req,res)=>{
  console.log("at root route");
  console.log("session is:"+req.session.id);
  console.log(req.session);
  res.render('home_copy.ejs');
  });
  app.get('/login',(req,res)=>{
  console.log('On login route');
  if(req.session.customer_id==undefined)
  {console.log("On login page");
  res.render('loginSignup_copy.ejs');
  }
  else
  {console.log("signed in user on login page");
  res.redirect('/');
  }
  
  });
  app.get("/userProfile",(req,res)=>{
  res.render("userProfile.ejs");
  });
  app.get("/purchaseHistory",(req,res)=>{
  res.render("purchaseHistory.ejs");
  });
  
  function Flight(FLIGHT_NUMBER,FLIGHT_SOURCE,FLIGHT_DESTINATION,DEPARTURE_TIME,AIRPLANE_ID,FLIGHT_CLASS,NO_OF_SEATS,PRICE){
    this.FLIGHT_NUMBER=FLIGHT_NUMBER;
    this.FLIGHT_SOURCE=FLIGHT_SOURCE;
    this.FLIGHT_DESTINATION=FLIGHT_DESTINATION;
    this.DEPARTURE_TIME=DEPARTURE_TIME;
    this.AIRPLANE_ID=AIRPLANE_ID;
    this.FLIGHT_CLASS=FLIGHT_CLASS;
    this.NO_OF_SEATS=NO_OF_SEATS;
    this.PRICE=PRICE;
  }
  
  app.post('/login',(req,res)=>{
  UserPrototype.exist(req.body.user).then((val)=>{
      UserPrototype.findUserDetails(req.body.user,req.body.pass).then((info)=>{
        req.session.customer_id=info.id;
        res.redirect('/');
      });
    }).catch((msg)=>{console.log(msg);
  res.redirect('/');
    });
  });
  app.get('/myTripData',(req,res)=>{
  res.setHeader('Content-Type', 'application/json');
  var obj={trip_type:req.session.trip_type,tripData:req.session.trip_Data,members:req.session.members};
  
  res.end(JSON.stringify(obj));
  
  });
  
  var selectedFlights=[];
  
  app.get('/saveFlight/:option/:FLIGHT_NUMBER/:departTime/:class',(req,res)=>{
  console.log("at save flight route");
  var ticketSelectedNo=parseInt(req.params.option);
  console.log("TicketSelected No"+ticketSelectedNo);
  
  var obj={FLIGHT_NUMBER:req.params.FLIGHT_NUMBER,departTime:req.params.departTime,class:req.params.class};
  selectedFlights[ticketSelectedNo]=obj;
  console.log(ticketSelectedNo);
  req.session.selectedFlights=selectedFlights;
  console.log("selected flights:");
  console.log(req.session.selectedFlights);
  res.send(JSON.stringify({}));
  });
  
  app.get('/flightData/:from/:to/:depart/:members',(req,res)=>{
    var flightArr_local=[];
    var str=req.params.depart;
        //var fdate=str.substring(str.length, str.length-4)+'-'+str.substring(str.length-7, str.length-5)+'-'+str.substring(0, 2);
        var fdate=str;
  
        console.log(req.params.from+req.params.to+fdate+req.params.members);
     UserPrototype.searchFlights(req.params.from,req.params.to,fdate,req.params.members).then((result)=>{
    for (var i = 0; i < result.length; i++) {
         
    var flightObj_local=new Flight(result[i].FLIGHT_NUMBER,result[i].FLIGHT_SOURCE,result[i].FLIGHT_DESTINATION,result[i].DEPARTURE_TIME,result[i].AIRPLANE_ID,result[i].FLIGHT_CLASS,result[i].NO_OF_SEATS,result[i].PRICE);
    flightArr_local.push(flightObj_local);
    }
    res.setHeader('Content-Type', 'application/json');
    
    res.end(JSON.stringify(flightArr_local));
  }).catch((error)=>{
    res.redirect('/');
    console.log(error);
  });
  
  });
  
  app.get('/payment',(req,res)=>{
  res.render('payment.ejs');
  });
  app.get('/SearchFlights',(req,res)=>{
    console.log("at search flight route");
    var flightArr_local=[];
    var trip_type=req.query.exampleRadios;
  
  
    if(trip_type=="oneWay")
    {
      req.session.trip_type=trip_type;
      req.session.trip_Data=[];
      var str=req.query.depart[0];
        var fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
  var obj={from:req.query.from[0],to:req.query.to[0],depart:fdate};
  req.session.trip_Data.push(obj);
    }
    if(trip_type=="roundTrip")
    {
  req.session.trip_type=trip_type;
  req.session.trip_Data=[];
  var str=req.query.depart[0];
        var fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
  var obj={from:req.query.from[0],to:req.query.to[0],depart:fdate};
  req.session.trip_Data.push(obj);
  str=req.query.return;
  fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
  obj={from:req.query.to[0],to:req.query.from[0],depart:fdate};
  req.session.trip_Data.push(obj);
  
    }
    if(trip_type=="multiCity")
    {
  req.session.trip_type=trip_type;
  req.session.trip_Data=[];
  var str=req.query.depart[0];
        var fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
  var obj={from:req.query.from[0],to:req.query.to[0],depart:fdate};
  req.session.trip_Data.push(obj);
  
  str=req.query.depart[1];
  fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
  
  obj={from:req.query.from[1],to:req.query.to[1],depart:fdate};
  req.session.trip_Data.push(obj);
  
  str=req.query.depart[2];
  fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
  
  obj={from:req.query.from[2],to:req.query.to[2],depart:fdate};
  req.session.trip_Data.push(obj);
    }
      req.session.members={adults:parseInt(req.query.adults),children:parseInt(req.query.children),infants:parseInt(req.query.infants)};
  
  
    var totalMembers=parseInt(req.query.adults)+parseInt(req.query.children)+parseInt(req.query.infants);
  
        var str=req.query.depart[0];
        var fdate=str.substring(str.length, str.length-4)+'-'+str.substring(0, 2)+'-'+str.substring(str.length-7, str.length-5);
    
     UserPrototype.searchFlights(req.query.from[0],req.query.to[0],fdate,totalMembers).then((result)=>{
    
    
  
    for (var i = 0; i < result.length; i++) {
      var month = result[i].DEPARTURE_TIME.getMonth() + 1; //months from 1-12
  var day = result[i].DEPARTURE_TIME.getDate();
  var year =result[i].DEPARTURE_TIME.getUTCFullYear();
  
  var newdate2 = year + "-" + month + "-" + day;
  
    var flightObj_local=new Flight(result[i].FLIGHT_NUMBER,result[i].FLIGHT_SOURCE,result[i].FLIGHT_DESTINATION,newdate2,result[i].AIRPLANE_ID,result[i].FLIGHT_CLASS,result[i].NO_OF_SEATS,result[i].PRICE);
    flightArr_local.push(flightObj_local);
    console.log("here it is"+result[i].FLIGHT_NUMBER);
    console.log(newdate2);
    }
    
    res.render('test_search.ejs',{ssData:flightArr_local,trip_type:req.session.trip_type
      ,trip_Data:req.session.trip_Data,members:req.session.members});
  }).catch((error)=>{
    res.redirect('/');
    console.log(error);
  });
  
  });
  
  
  function flightReq(flightNumber,source,destination,startTime,stay){
    this.flightNo=flightNumber;
    this.source=source;
    this.destination=destination;
    this.startTime=startTime;
    this.stay=stay;
  }
  var flightReqObj=new flightReq('pk301','pakistan','israel','6:00pm','5');
  var flightReqArr=[flightReqObj];
  flightReqArr.push(flightReqObj);
  flightReqArr.push(flightReqObj);
  flightReqArr.push(flightReqObj);
  
  
  app.get('/admin_type=req',(req,res)=>{
    
  res.render('admin.ejs',{ssData:flightReqArr});
  });
  


app.get("/Createdb",(req,res)=>
{
  connection.query("CREATE DATABASE nodemysql", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

app.get("/AirlineLogin",(req,res)=>{
res.render("airlineLogin.ejs");
});
app.get("/Signup",(req,res)=>{
req.session.loggedin=false;
res.render("airlineSignup.ejs");
});

app.get("/addFlight",(req,res)=>{
  if(req.session.loggedin)
  {  
    res.render("addflight.ejs",{F:req.session.user});
  }
  else
  {
    res.redirect("/AirlineLogin");
  }  
}); 

app.get("/cancelFlight",(req,res)=>{
  if(req.session.loggedin)
  { 
    res.render("cancelflight.ejs",{F:req.session.user});
  }
  else
  {
    res.redirect("/AirlineLogin");

  } 
});
app.get("/delayFlight",(req,res)=>{
  if(req.session.loggedin)
  { 
    res.render("delayflight.ejs",{F:req.session.user});
  }
  else
  {
    res.redirect("/AirlineLogin");
  }  
});
    
app.get("/addintoflight",(req,res)=>
{
  
  if(req.session.loggedin)
  { 
    let userid = req.session.user;
    let post = "select DISTINCT t.FLIGHT_NUMBER ,t.FLIGHT_SOURCE ,t.FLIGHT_DESTINATION ,t.DEPARTURE_TIME ,t.AIRLINE_ID ,t1.NO_OF_SEATS ,t1.PRICE ,t2.NO_OF_SEATS AS BS , t2.PRICE AS BP from FLIGHT t ,FLIGHT_class t1 ,FLIGHT_class t2 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_NUMBER = t2.FLIGHT_NUMBER AND t2.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_CLASS <> t2.FLIGHT_CLASS AND t1.FLIGHT_CLASS = 'business' AND t2.FLIGHT_CLASS = 'economy' AND t.AIRLINE_ID = ?"
    let sql = connection.query(post,[userid], (err, result, fields)=> {
    if (err) throw err;
    console.log("Result Is Here");
    //console.log(result);
    res.render('addintoflight.ejs',{F:result});
  });
  }
  else
  {
    res.redirect("/AirlineLogin");
  }
  
});
app.get("/temp",(req,res)=>
{
  if(req.session.loggedin)
  { 
    let userid=req.session.user;
    console.log(userid);
    let post="select DISTINCT t.FLIGHT_NUMBER ,t.FLIGHT_SOURCE ,t.FLIGHT_DESTINATION ,t.DEPARTURE_TIME ,t.AIRLINE_ID ,t1.NO_OF_SEATS ,t1.PRICE ,t2.NO_OF_SEATS AS BS , t2.PRICE AS BP from temp t ,temp_class t1 ,temp_class t2 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_NUMBER = t2.FLIGHT_NUMBER AND t2.FLIGHT_NUMBER = t.FLIGHT_NUMBER  AND t1.FLIGHT_CLASS = 'business' AND t2.FLIGHT_CLASS = 'economic' AND t1.FLIGHT_CLASS <> t2.FLIGHT_CLASS AND t.AIRLINE_ID = ?";
    let sql = connection.query(post,[userid], (err, result, fields)=> {
      if (err) throw err;
      console.log(result);
      

      res.render('tempflight.ejs',{F:result});
    });
  }
  else
  {
    res.redirect("/AirlineLogin");
  }  
});

app.get("/Profile",(req,res)=>
{
  if(req.session.loggedin)
  {   
    let post = "SELECT AIRLINE_ID , AIRLINE_NAME FROM AIRLINE WHERE AIRLINE_ID = ?";
    let sql = connection.query(post,[req.session.user],(error,results,fields)=>
    {
       if(error)throw error;  
       res.render('airlineprofile.ejs',{F:results});
    });
    
  }
  else
  {
    res.redirect("/AirlineLogin");
  } 
});

app.get("/error",(req,res)=>
{
  if(req.session.loggedin)
  {   
    res.render('error.ejs');
  }
  else
  {
    res.redirect("/AirlineLogin");
  } 
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
  var Airline_ID = req.body.AirlineID;
  var Airline_Password = req.body.APassword;
  console.log(Airline_ID);
  let message;
  
  airlinePrototype.AirlineLogin(Airline_ID,Airline_Password).then((info)=>
  {
       
       message = "Login Successful ";
       console.log("HYE")
       req.session.user=Airline_ID;
       req.session.loggedin = true;
       let post = "SELECT AIRLINE_ID , AIRLINE_NAME FROM AIRLINE WHERE AIRLINE_ID = ?";
       let sql = connection.query(post,[req.session.user],(error,results,fields)=>
       {
          if(error)throw error;  
          res.render("airlineprofile.ejs",{F:results});
       });
       
  
  }).catch((msg)=>
  
  {
    console.log("HELLO");
     message = "Flight Delay Is UnSuccessful";
     res.render("airlinelogin.ejs",{F:message});
 });




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
    var DEPARTURE_TIME = req.body.OldDepartureTime;
    var NEWDEPARTURE_TIME=req.body.DepartureTime;
    let message;
    console.log(FLIGHT_NUMBER,DEPARTURE_TIME,NEWDEPARTURE_TIME);
    airlinePrototype.UpdateRequestInFlightClass(FLIGHT_NUMBER,DEPARTURE_TIME,NEWDEPARTURE_TIME).then((info)=>
    {
      airlinePrototype.UpdateRequestInFlight(FLIGHT_NUMBER,DEPARTURE_TIME,NEWDEPARTURE_TIME).then((info)=>
      {
         message = "Flight Delay Is Successful";
        res.render("error.ejs",{F:message});
        
      }).catch((msg)=>
      
      {
        message = "Flight Delay Is Unsuccessful";
        res.render("error.ejs",{F:message});

      });
   }).catch((msg)=>
   
   {

      message = "Flight Delay Is Unsuccessful";
      res.render("error.ejs",{F:message});

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

app.post("/updateprofile",(req,res)=>
{
  var Airline_ID = req.body.AirlineID;
  var oldpass = req.body.OldPassword;
  var newpass = req.body.NewPassword;

  let post = "Update AIRLINE SET AIRLINE_PASSWORD = ? WHERE AIRLINE_ID = ? AND AIRLINE_PASSWORD = ?";
  let sql = connection.query(post,[newpass,Airline_ID,oldpass],(error ,result,fields)=>
  {
      let message = "Update Profile UnSuccessful";
      if(error)
      {
        throw error;
        res.render("error.ejs",{F:message});
        
      }  
      else
      {
        console.log("In ELSE PART ");
        message = "Update Profile Successful";
        res.render("Error.ejs",{F:message});
      }

  });


});



app.listen(3001,()=>{
console.log('Server listening on port 3000');

});






