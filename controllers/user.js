
var UserPrototype={
exist:(username)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../app.js").connection;
connection.query(`SELECT id from \`account\` where \`username\`='${username}'`,
	(error, results, fields)=>{
		console.log(results);
if(results!=undefined && results.length != 0)
	{    console.log("at resolve");
		resolve(true);}
else
	{   console.log("at reject");
		reject(false);}
});	
});
},
findUserDetails:(username,password)=>{
	return new Promise((resolve,reject)=>{
		var connection=require("../app.js").connection;
	connection.query(`SELECT * from \`account\` where \`username\`='${username}' 
and password='${password}'`,(error, results, fields)=>{
	if(results[0].id!=undefined)
		resolve(results[0]);
	else
		reject('unable to fetch details');
	});
});
},
register:(req)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../app.js").connection;
connection.query(`insert into customer (\`username\`,\`password\`,\`email_id\`,\`first_name\`
	,\`last_name\`,\`country\`,\`state\`,\`city\`,\`house_no\`) 
	values('${req.body.username}','${req.body.password}','${req.body.email_id}','${req.body.first_name}','${req.body.last_name}','${req.body.country}','${req.body.state}','${req.body.city}','${req.body.house_no}')`
	, function (error, results, fields) {
	console.log("inserted id:"+results.insertId);
  if (error) 
  	{reject("User registration Failed");}
 connection.query(`select username from \`customer\` where \`id\`=${results.insertId}`
 	,function(error,results,fields){
if(results[0].username)
 resolve('User registered successfully!');
 });

});//outer query ends here
});
},
searchFlights:(from,to,departTime,userSeats)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../app.js").connection;
	
	connection.query(`SELECT * from flight,flight_class where flight.FLIGHT_NUMBER=flight_class.FLIGHT_NUMBER and lower(flight.FLIGHT_SOURCE) like \"${from}\" and lower(flight.FLIGHT_DESTINATION) like \"${to}\" 
		and flight.DEPARTURE_TIME>=STR_TO_DATE(\"${departTime}\", \"%Y-%m-%d\") and flight_class.NO_OF_SEATS>=${userSeats}
`,(error, results, fields)=>{
			console.log("results are:");
			
	if(results!=undefined)
		{//if(results[0].flight_int!="")
	
		resolve(results);
	}
	else
		reject("unable to fetch error:"+error);
	});
});
},
searchFlightByClass: (FLIGHT_int,from,to,departTime,userSeats,flight_class)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../app.js").connection;
	
	connection.query(`SELECT * from flight,flight_class where flight.FLIGHT_int=flight_class.FLIGHT_int and 
   	lower(flight.SOURCE) like \"islamabad\" and lower(flight.DESTINATION) like \"ontario\" 
		and flight.DEPARTURE_Date>=STR_TO_DATE(\"2019-11-20\", \"%Y-%m-%d\") 
		and flight_class.NO_OF_SEATS>=14 and flight_class.FLIGHT_CLASS=\"economy\" 
		and flight.FLIGHT_NUMBER=\"${result[i].FLIGHT_int}\"`,(error, results, fields)=>{
	if(results!=null)
		{//if(results[0].flight_int!="")
	console.log("searchFlightByClass results:"+results);
		resolve(results);
	}
	else
		reject("unable to fetch error:"+error);
	});
});
}
};


module.exports.UserPrototype=UserPrototype;