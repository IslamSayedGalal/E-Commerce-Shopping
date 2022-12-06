const mongoose = require("mongoose");

const dbConnection =()=>{ 
    mongoose.connect(process.env.DB_URL)
    .then((con)=>{
        console.log(`DataBase Connected ${con.connection.host}`);
    })
    // .catch((err)=>{
    //     console.error(`DataBase Failed ${err}`);
    //     process.exit(1);
    // });
};

module.exports = dbConnection;