const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require('cors')
const userRoutes = require("./routes/user/user");

//local variables
require("dotenv").config({ path: "./config.env" });
//support cross orgin scripting
const corsOptions = {
    origin: process.env.FRONTEND_DOMAIN_ORIGIN,
    optionsSuccessStatus: 200
}
const db_server = process.env.MONGO_DB_DEV_URI
//for logging database name
let db_name = db_server.match(/\@[A-Za-z-]+/).toString()
db_name = db_name.substring(1, db_name.length)

//test db connection 
mongoose.connection.on("connected", function(ref){
    console.log("connected to "+ db_name + " DB!")
    // add middleware set-up
    // add routes
    app.use(cors(corsOptions))
    //ensure that express handles all routes 
    //and coverts requests to json
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/user', userRoutes)

    //listen to port 7000
    const listener = app.listen(process.env.PORT||7000, ()=>{
        console.log("server running on port " + listener.address().port)
    })
})

mongoose.connection.on("error", function(err) {
    console.error('Failed to connect to DB ' + db_name + ' on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection to DB :' + db_name + ' disconnected');
});

//if node process ends, close mongoose connection
const gracefulExit = function() { 
    mongoose.connection.close(function () {
      console.log('Mongoose default connection with DB :' + db_name + ' is disconnected through app termination');
      process.exit(0);
    });
  }
process.on('SIGINT', gracefulExit).on("SIGNTERM", gracefulExit);

//inital mongoose connection
try{
    mongoose.connect(db_server, { keepAlive: 1 });
    console.log("Trying to connect to DB " + db_name);
} catch (err){
    console.log("Sever initialization failed" , err.message);
}
