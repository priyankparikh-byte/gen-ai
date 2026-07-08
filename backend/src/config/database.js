const mongoose = require("mongoose");


async function connectionToDB() {
    
    try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log("connnecte to database")
    }catch(e){
        console.log(e)
    }
}

module.exports=connectionToDB;