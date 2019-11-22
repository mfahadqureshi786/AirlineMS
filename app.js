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
  database : 'airlinems',
  clearExpired: true //auto remove expired session tuples from db 
});

connection.connect();
var sessionStore = new MySQLStore({}/* session store options */, connection);
var user='fahad';
var pass='123456';
module.exports.connection=connection;
var UserPrototype=require("./controllers/user.js").UserPrototype;
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
  resave: false,
  saveUninitialized: false,
  store:sessionStore,
  cookie: {secure: false,maxAge: 5*60*1000 }//session cookie expire after 5 mins
}));


app.get('/',(req,res)=>{
console.log("at root route");
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
//mybookings here
app.get("/airlineLogin",(req,res)=>{
res.render("airlineLogin.ejs");
});
app.get("/airlineSignup",(req,res)=>{
res.render("airlineSignup.ejs");
});

app.get("/addFlight",(req,res)=>{
res.render("addflight.ejs");
}); //Css or bootstrap
app.post("/addFlight",(req,res)=>{
	airlinePrototype.addFlightRequest(12345,'Karachi','Ontario','11/12/19 4:00pm').then((info)=>{
     console.log("Request for flight add made successfully");
     
	}).catch((msg)=>{

		console.log("Request for flight add Failed");
		console.log(msg);

	});
	res.redirect('/addflight');
//res.render("addflight.ejs");
}); //Css or bootstrap

app.get("/cancelFlight",(req,res)=>{
res.render("cancelflight.ejs");
});
app.get("/delayFlight",(req,res)=>{
res.render("delayflight.ejs");
});
app.post('/login',(req,res)=>{
UserPrototype.exist(req.body.user).then((val)=>{
		UserPrototype.findUserDetails(req.body.user,req.body.pass).then((info)=>{
			req.session.customer_id=info.id;
			res.redirect('/');
		});
	}).catch((msg)=>{console.log(msg);
res.redirect('/');
	});
})



function Flight(FLIGHT_int,SOURCE,DESTINATION,DEPARTURE_Date,price,AIRPLANE_ID){
	this.FLIGHT_int=FLIGHT_int;
	this.SOURCE=SOURCE;
	this.DESTINATION=DESTINATION;
	this.DEPARTURE_Date=DEPARTURE_Date;
	this.AIRPLANE_ID=AIRPLANE_ID;
	this.price=price;
}

app.get('/SearchFlights',(req,res)=>{
UserPrototype.searchFlights("islamabad","ontario","2019-11-20").then((result)=>{
	var flightArr_local=[];
	for (var i = 0; i < result.length; i++) {
	var flightObj_local=new Flight(result[i].FLIGHT_int,result[i].SOURCE,result[i].DESTINATION,result[i].DEPARTURE_Date,result[i].AIRPLANE_ID,
		result[i].price);
	flightArr_local.push(flightObj_local);
	}
	res.render('test_search.ejs',{ssData:flightArr_local});
console.log(result);
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


app.listen(3000,()=>{
console.log('Server listening on port 3000');

});
