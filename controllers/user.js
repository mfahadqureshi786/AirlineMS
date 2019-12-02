
var UserPrototype={
exist:(username,password)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`SELECT CUSTOMER_ID from \`customer\` where \`email\`='${username}' and \`CUSTOMER_PASSWORD\`=${password}`,
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
checkBalance:(CCN,Amount)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
connection.query(`select * from credit_card where CCARD_NUMBER=${CCN} and BALANCE>=${Amount}`,
	(error, results, fields)=>{
		console.log(results);
if(error)
	{   console.log(error);
		reject("Either card not valid or have insufficient balance");}
else
	{   resolve(results);
		
		}
});	
});
}
,
makePayment:(CCN,Amount)=>{
return new Promise((resolve,reject)=>{
	
	var connection=require("../airlineportal.js").connection;
connection.query(`update credit_card set BALANCE=BALANCE-${Amount} where CCARD_NUMBER=${CCN}`,
	(error, results, fields)=>{
		console.log(results);
if(error)
	{   console.log(error);
		reject("unable to make payment");}
else
	{   
       if(results.affectedRows>=1)
		resolve("Transaction Successfully Completed!");
	else
		resolve("Transaction Could Not Be Completed");
		
		}
});	
});
}
,
updateCustomerContact:(ID,ContactNumber)=>{
return new Promise((resolve,reject)=>{
	if(ContactNumber=='')
		ContactNumber=0;
	var connection=require("../airlineportal.js").connection;
connection.query(`update customer set \`ContactNumber\`=${ContactNumber} where \`CUSTOMER_ID\`=${ID}`,
	(error, results, fields)=>{
		console.log(results);
if(error)
	{   
		reject(error);}
else
	{   resolve(results);
		
		}
});	
});
},
updateCCNumber:(ID,CCN,BALANCE)=>{
return new Promise((resolve,reject)=>{
	if(CCN=='')
		CCN=0;
	if (BALANCE=='') 
	{
BALANCE=0;
	}
	var connection=require("../airlineportal.js").connection;
connection.query(`update credit_card set \`CCARD_NUMBER\`=${CCN},\`BALANCE\`=${BALANCE} where \`CUSTOMER_ID\`=${ID}`,
	(error, results, fields)=>{
		console.log(results);
if(error)
	{   
		reject(error);}
else
	{   resolve(results);
		
		}
});	
});
}
,
updateCustomer:(ID,req)=>{
return new Promise((resolve,reject)=>{
		var connection=require("../airlineportal.js").connection;
		//updates only if provided valid ID,email,pass
		if(req.body.NewEmail==req.body.ConfirmEmail && req.body.NewEmail!="" &&req.body.NewPassword!=""){
			
	connection.query(`update \`customer\` set \`DATE_OF_BIRTH\`='${req.body.DateOfBirth}',\`EMAIL\`='${req.body.NewEmail}',\`CUSTOMER_PASSWORD\`='${req.body.NewPassword}'
		where \`CUSTOMER_ID\`=${ID} and \`CUSTOMER_PASSWORD\`='${req.body.Password}';`,(error, results, fields)=>{
	if(error)
		{reject(error);
		console.log(error);}

	else
		{   console.log(error);
			resolve(results[0]);
		}
	});	
}
else if(req.body.NewEmail=="" && req.body.NewEmail==req.body.ConfirmEmail && req.body.NewPassword!=""){
connection.query(`update \`customer\` set \`DATE_OF_BIRTH\`='${req.body.DateOfBirth}',\`CUSTOMER_PASSWORD\`='${req.body.NewPassword}'
		where \`CUSTOMER_ID\`=${ID} and \`CUSTOMER_PASSWORD\`='${req.body.Password}';`,(error, results, fields)=>{
	if(results!=undefined)
		resolve(results[0]);
	else
		{   console.log(error);
			reject('unable to update user');}
	});	

}
else if(req.body.NewEmail!="" && req.body.NewEmail==req.body.ConfirmEmail && req.body.NewPassword==""){
connection.query(`update \`customer\` set \`DATE_OF_BIRTH\`='${req.body.DateOfBirth}',\`EMAIL\`='${req.body.NewEmail}'
		where \`CUSTOMER_ID\`=${ID} and \`CUSTOMER_PASSWORD\`='${req.body.Password}';`,(error, results, fields)=>{
	if(results.length!=0)
		resolve(results[0]);
	else
		{   console.log(error);
			reject('unable to update user');}
	});	

}
else if(req.body.NewEmail=="" && req.body.NewEmail==req.body.ConfirmEmail && req.body.NewPassword==""){
connection.query(`update \`customer\` set \`DATE_OF_BIRTH\`='${req.body.DateOfBirth}'
		where \`CUSTOMER_ID\`=${ID} and \`CUSTOMER_PASSWORD\`='${req.body.Password}';`,(error, results, fields)=>{
	if(error)
		reject(error);
	else
		{   console.log(results);
			resolve(results);}
	});	

}
else{
reject("One of the cases failed");
}
});
},
findUserByID:(ID)=>{
	return new Promise((resolve,reject)=>{
		var connection=require("../airlineportal.js").connection;
		console.log("ID passed:"+ID);
	connection.query(`SELECT * from \`customer\` where \`CUSTOMER_ID\`='${ID}'`,(error, results, fields)=>{
	if(error)
		reject(error);
	else
		{   
			resolve(results[0]);}
	});
});
}
,
findUserDetails:(username,password)=>{
	return new Promise((resolve,reject)=>{
		var connection=require("../airlineportal.js").connection;
		console.log("username"+username);
		console.log("password"+password);
	connection.query(`SELECT * from \`customer\` where \`email\`='${username}' 
and \`CUSTOMER_PASSWORD\`='${password}'`,(error, results, fields)=>{
	if(results.length!=0)
		resolve(results[0]);
	else
		{   console.log(error);
			reject('unable to fetch details');}
	});
});
},
findAllUserIDs:()=>{
	return new Promise((resolve,reject)=>{
		var connection=require("../airlineportal.js").connection;
	connection.query(`SELECT CUSTOMER_ID from \`customer\``,(error, results, fields)=>{
	if(results!=undefined)
		resolve(results);
	else
		reject('unable to fetch customer ids');
	});
});
},
findCardByUserID:(ID)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	
    connection.query(`select * from credit_card,customer where credit_card.CUSTOMER_ID=${ID}`
	, function (error, results, fields) {
	if(error)
		reject(error);
	else
		resolve(results);
});//outer query ends here
});
},
findCardInfo:()=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	
    connection.query(`select * from credit_card,customer where credit_card.CUSTOMER_ID=customer.CUSTOMER_ID`
	, function (error, results, fields) {
	if(error)
		reject(error);
	else
		resolve(results);
});//outer query ends here
});
}
,
insertCardInfo:(ccn,ID)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	
    connection.query(`insert into \`credit_card\`(\`CCARD_NUMBER\`,\`BALANCE\`,\`CUSTOMER_ID\`) values(${ccn},0,${ID})`
    	, function (error, results, fields) {
	if(error)
		reject(error);
	else
		resolve(results);
});//outer query ends here
});
}
,
register:(ID,req)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	
	var newCnic=parseInt(req.body.cnic.substring(0,5)+req.body.cnic.substring(6,14)+req.body.cnic.substring(15,16));
	console.log(newCnic);
connection.query(`insert into customer (CUSTOMER_ID,\`cnic\`,\`CUSTOMER_PASSWORD\`,\`email\`,\`FIRST_NAME\`
	,\`LAST_NAME\`,\`COUNTRY\`,\`Address\`,\`DATE_OF_BIRTH\`) 
	values(${ID},${newCnic},'${req.body.password}','${req.body.email}','${req.body.first_name}',
	'${req.body.last_name}','${req.body.country}','${req.body.Address}','1111-11-11')`
	, function (error, results, fields) {
	if(error)
		reject(error);
	else
		resolve(results);



});//outer query ends here
});
},
searchFlightByID:(FlightID,DepartTime,FlightClass)=>
{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	console.log("flight id:"+FlightID+" Departtime:"+DepartTime+" Flightclass:"+FlightClass);
	var newdepartTime=DepartTime.substring(0,DepartTime.length-2)+parseInt(DepartTime.substring(DepartTime.length-2,DepartTime.length))+1;
    connection.query(`select * from flight,flight_class where flight.FLIGHT_NUMBER=flight_class.FLIGHT_NUMBER and 
    	flight.DEPARTURE_TIME=flight_class.DEPARTURE_TIME and 
    	flight.FLIGHT_NUMBER=\'${FlightID}\'and flight_class.FLIGHT_CLASS='${FlightClass}'  and flight.DEPARTURE_TIME=\'${DepartTime}\' or flight.DEPARTURE_TIME=\'${newdepartTime}\'`
    	, function (error, results, fields) {
	if(error)
		reject(error);
	else
		{
            console.log("flight searched by id");
            console.log(results);
			resolve(results);}
});//outer query ends here
});

}
,
searchFlights:(from,to,departTime,userSeats)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	
	connection.query(`SELECT * from flight,flight_class where flight.FLIGHT_NUMBER=flight_class.FLIGHT_NUMBER 
		and flight.DEPARTURE_TIME=flight_class.DEPARTURE_TIME
		and lower(flight.FLIGHT_SOURCE) like \"${from}\" 
		and lower(flight.FLIGHT_DESTINATION) like \"${to}\" 
		and flight.DEPARTURE_TIME>=STR_TO_DATE(\"${departTime}\", \"%Y-%m-%d\") and flight_class.NO_OF_SEATS>=${userSeats} 

`,(error, results, fields)=>{
			console.log("results are:");
			
	if(results!=undefined)
		{//if(results[0].flight_int!="")
	console.log("Search flight results:");
	    console.log(results);
		resolve(results);
	}
	else
		reject("unable to fetch error:"+error);
	});
});
},
searchFlightByClass: (FLIGHT_int,from,to,departTime,userSeats,flight_class)=>{
return new Promise((resolve,reject)=>{
	var connection=require("../airlineportal.js").connection;
	
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