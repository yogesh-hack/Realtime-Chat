function main() {
    // Import the mongoose module
    const mongoose = require("mongoose");

    // Set up default mongoose connection
    const mongoDB = process.env.MONGO_CONNECTION_URL;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    // Get the default connection
    const db = mongoose.connection;
    db.once('open', () => {
        console.log("MongoDB Connected...")
    })
    // Bind connection to error event (to get notification of connection errors)
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}
module.exports = main