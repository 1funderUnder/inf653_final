const mongoose = require('mongoose');
//const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
          //  useUnifiedTopology: true,
          //  useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;
