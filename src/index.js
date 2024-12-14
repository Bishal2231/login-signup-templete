import {app } from "./app.js"
import dbconnection from "./db/db.js"

import dotenv from "dotenv"
dotenv.config()
dbconnection().then(()=>{
    try {
        app.listen(process.env.PORT||4000,()=>{
            console.log(`mongodb is runnig on the http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        console.log("database connsection failed",error)
        
    }

}).catch((err)=>{
    console.log(err);
})
