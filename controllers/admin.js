var adminPrototype={
    getRequests:(tempvar)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            
            connection.query(`SELECT * from flight,flight_class where flight.FLIGHT_NUMBER=flight_class.FLIGHT_NUMBER and flight.departure_time=flight_class.departure_time`,
            (error, results, fields)=>{//result[0].
                
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log("at select failed");
                reject(undefined);}
        });	
        });
        


    },
    acceptRequests:(FLIGHT_NUMBER)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            console.log("Aaaaaaaaaaaaaaaaaaccetp req");
           console.log(FLIGHT_NUMBER);
            connection.query(`select t.FLIGHT_NUMBER ,t.FLIGHT_SOURCE ,t.FLIGHT_DESTINATION ,t.DEPARTURE_TIME ,t.AIRLINE_ID ,t1.NO_OF_SEATS ,t1.PRICE ,t2.NO_OF_SEATS AS BS , t2.PRICE AS BP from flight t ,flight_class t1 ,flight_class t2 where t1.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_NUMBER = t2.FLIGHT_NUMBER AND t2.FLIGHT_NUMBER = t.FLIGHT_NUMBER AND t1.FLIGHT_CLASS = 'business' AND t2.FLIGHT_CLASS = 'economy' AND t1.FLIGHT_CLASS <> t2.FLIGHT_CLASS AND t.FLIGHT_NUMBER =\'${FLIGHT_NUMBER}\' AND t.FLIGHT_STATUS <> \'B\'`,
            (error, results, fields)=>{//result[0].
                console.log("Aaaaaaaaassssssssssssssssaaaaaaaaaccetp req");
           console.log(results," HELLO");
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve here");
                resolve(results);}
        else
            {   console.log("result here");

                console.log("insert failed");
                reject(error);}
        });	
           
        });
        


    }
    ,





    insertFlightTemp:(FNO,FS,FO)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            console.log(FNO,FS,FO);
            connection.query(`update FLIGHT SET FLIGHT.FLIGHT_STATUS='${FS}', FLIGHT.USERNAME = 'talhajamal197' WHERE FLIGHT.FLIGHT_NUMBER = '${FNO}' AND FLIGHT.FLIGHT_STATUS='${FO}'` ,
            (error, results, fields)=>{
                console.log(results ,"HELLO HYE BYE BYE");
                
        if(results!=undefined && results.affectedRows != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("at reject insert");
                reject(error);}
        });	
           
        }); 

    },     
    deletetemp:(FLIGHT_NUMBER,DEPARTURE_TIME)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            console.log(DEPARTURE_TIME);
            connection.query(`DELETE from FLIGHT where FLIGHT_NUMBER=\'${FLIGHT_NUMBER}\'` ,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("errorat temp");
                reject(error);}
        });	
           
        }); 
        
        
        


        
    },
    deletetemp1:(FLIGHT_NUMBER,DEPARTURE_TIME)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            console.log(DEPARTURE_TIME);
            connection.query(`DELETE from FLIGHT_class where FLIGHT_NUMBER=\'${FLIGHT_NUMBER}\'` ,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log(error);
                console.log("error at temClass");
                reject(error);}
        });	
           
        }); 
        
        
        


        
    }
    ,
    getAllFlights:(tempvar)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            
            connection.query(`SELECT AIRLINE_ID ,FLIGHT_NUMBER ,DEPARTURE_TIME, FLIGHT_SOURCE  from FLIGHT WHERE FLIGHT_STATUS = 'B'`,
            (error, results, fields)=>{//result[0].
                console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);}
        else
            {   console.log("at flight failed");
                reject(undefined);}
        });	
        });
        


    } ,
    gettemp:(tempvar)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            
            var post="SELECT * FROM FLIGHT WHERE FLIGHT.FLIGHT_STATUS = ?";
            var sql =connection.query(post,["U"],(error, results, fields)=>{
            console.log(results);
                
        if(results!=undefined && results.length != 0)
            {    console.log("at resolve");
                resolve(results);
            }
        else
            {   console.log("at flight failed");
                reject(undefined);}
        });	
        });
        

    },
    verifyAdmin:(username,password)=>{
        return new Promise((resolve,reject)=>{
            var connection=require("../airlineportal.js").connection;
            console.log(username,password,"at verify function");
            connection.query(`select * from adminlogin`,
            (error, results, fields)=>{//result[0].
           console.log(results[0].USERNAME , results[0].PASSWORD);
                
        if(username='talhajamal197' && password=='pakistan')
            {    console.log("login");
                resolve(true);}
        else
            {   console.log("loginfailed");
                reject(undefined);}
        });	
        });
        


    }

    



};
    module.exports.adminPrototype=adminPrototype;