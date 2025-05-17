const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`mongoDB is connected to ${conn.connection.host}`);
    }catch(error){
        console.error(`Error : ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;