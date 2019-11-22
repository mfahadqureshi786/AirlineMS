var airlinePrototype={
airlinerExist:(username,password,airlineID)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../app.js").connection;
connection.query(`SELECT id from \`account\` where \`username\`
	='${username}' and password ='${password}' and airlineID='${airlineID}'`,
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
addFlightRequest:(flightNumber,Departure,Source,DepartureTime)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../app.js").connection;
connection.query(`INSERT INTO \`tempairlineadd\`(\`flightNumber\`,\`Departure\`, \`Source\`,\`DepartureTime\`
) VALUES ('${flightNumber}','${Departure}','${Source}','${DepartureTime}')`,
	(error, results, fields)=>{
		console.log(results);
if(results!=undefined && results.length != 0)
	{    console.log("at resolve");
		resolve(true);}
else
	{   console.log("at reject");
		reject(error);}
});	
});
}};
module.exports.airlinePrototype=airlinePrototype;