var airlinePrototype={
airlinerExist:(username,password,airlineID)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
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
AirlineLogin:(AI,AP)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`SELECT Airline_ID from \`Airline\` where \`Airline_ID\`
	='${AI}' and Airline_Password ='${AP}'`,
	(error, results, fields)=>{
if(results!=undefined && results.RowDataPacket != 0 && results.length != 0)
	{
		console.log("HELLO");
		resolve(true);
	}	

else
	{   
		console.log(results+" "+error);
		reject(error);
	}
});	
});
},
AirlineSignup:(AI,AN,AP)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`INSERT INTO \`AIRLINE\`(\`AIRLINE_ID\`,\`AIRLINE_NAME\`, \`AIRLINE_PASSWORD\`) VALUES ('${AI}','${AN}','${AP}')`,
	(error, results, fields)=>{
		//console.log(results);
if(results!=undefined && results.affectedRows != 0)
	{    //console.log("at resolve");
		resolve(true);
	}
else
	{   //console.log("at reject");
		reject(error);
	}
});	
});
},
AddInTemp:(FNO,FS,FD,DT,AI,S,U)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`INSERT INTO \`FLIGHT\`(\`FLIGHT_NUMBER\`,\`FLIGHT_SOURCE\`, \`FLIGHT_DESTINATION\`,\`DEPARTURE_TIME\`,\`AIRLINE_ID\`,\`FLIGHT_STATUS\`
) VALUES ('${FNO}','${FS}','${FD}',DATE_FORMAT('${DT}', '%Y-%m-%dT%H:%i'),'${AI}','${S}')`,
	(error, results, fields)=>{
if(results!=undefined && results.affectedRows != 0)
	{    
		resolve(true);}
else
	{   
		console.log(results+" "+error);
		reject(error);

	}
});	
});
},

AddInTempClass:(FNO,FC,DT,NS,P)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`INSERT INTO \`FLIGHT_CLASS\`(\`FLIGHT_NUMBER\`,\`FLIGHT_CLASS\`,\`DEPARTURE_TIME\`,\`NO_OF_SEATS\`,\`PRICE\`
) VALUES ('${FNO}','${FC}',DATE_FORMAT('${DT}', '%Y-%m-%dT%H:%i'),'${NS}','${P}')`,
	(error, results, fields)=>{
if(results!=undefined && results.affectedRows != 0)
	{   
		resolve(true);}
else
	{   
		reject(error);
	}
});	
});
},
CancelRequestInFlight:(FNO,DT)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`delete FROM FLIGHT WHERE FLIGHT.FLIGHT_NUMBER='${FNO}' AND FLIGHT.DEPARTURE_TIME =DATE_FORMAT('${DT}', '%Y-%m-%dT%H:%i')`,
	(error, results, fields)=>{
		

	if(results.affectedRows!=0)
	{
		resolve(results);
	}
	else
		reject("unable to fetch error:"+error);
	});
});
},
CancelRequestInFlightClass:(FNO,DT)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`delete FROM FLIGHT_CLASS WHERE FLIGHT_CLASS.FLIGHT_NUMBER='${FNO}' AND FLIGHT_CLASS.DEPARTURE_TIME =DATE_FORMAT('${DT}', '%Y-%m-%dT%H:%i')`,
	(error, results, fields)=>{


	if(results.affectedRows!=0)
	{
		resolve(results);
	}
	else
		reject("unable to fetch error:"+error);
	});
});
},
UpdateRequestInFlight:(FNO,DT,NDT)=>{
	return new Promise((resolve,reject)=>{
		var connection=require("../airlineportal.js").connection;
		connection.query(`update FLIGHT SET FLIGHT.DEPARTURE_TIME= DATE_FORMAT('${NDT}', '%Y-%m-%dT%H:%i') WHERE FLIGHT.FLIGHT_NUMBER='${FNO}' AND FLIGHT.DEPARTURE_TIME =DATE_FORMAT('${DT}', '%Y-%m-%dT%H:%i')`,
		(error, results, fields)=>{
		 
		 console.log(results," ",error);
		if(results.affectedRows!=0)
		{
			
			resolve(results);
		}
		else
			{
				console.log("here error");
				reject("unable to fetch error:"+error);
			}	
		});
	});
	},
	UpdateRequestInFlightClass:(FNO,DT,NDT)=>{
	return new Promise((resolve,reject)=>{
		var connection=require("../airlineportal.js").connection;
		connection.query(`update FLIGHT_CLASS SET DEPARTURE_TIME= DATE_FORMAT('${NDT}', '%Y-%m-%dT%H:%i')WHERE FLIGHT_NUMBER='${FNO}' AND DEPARTURE_TIME =DATE_FORMAT('${DT}', '%Y-%m-%dT%H:%i')`,
		(error, results, fields)=>{
	
		console.log(results);	
		if(results.affectedRows!=0)
		{
			
			resolve(results);
		}
		else
			{
				reject("unable to fetch error:"+error);
			}
		});
	});
	}
};
module.exports.airlinePrototype=airlinePrototype;



