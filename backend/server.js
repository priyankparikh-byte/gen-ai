require("dotenv").config()
const app = require("./src/app.js");
const connectionToDB=require("./src/config/database.js")

connectionToDB()




app.listen(3000,()=>{
    console.log("server started on port")
})