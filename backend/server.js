const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require('cors')

SERVER_PORT = process.env.PORT || 3002;

const app = express();
const DB_URL = "mongodb+srv://Ramtin:XZv8YYmxcK90lfDe@cluster0.9zcim.mongodb.net/COMP3123-Assignment?retryWrites=true&w=majority&appName=Cluster0";
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ 
    origin: 'https://one01419226-comp3123-assignment2-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Optional: specify allowed methods
    credentials: true // Optional: include credentials if necessary
}));

// Import user routes
const userRouter = require('./routes/user');
const empRouter = require('./routes/employee')

// Use routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/emp', empRouter);

// MongoDB Connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.listen(SERVER_PORT, ()=> {
    console.log(`The server is listening on port ${SERVER_PORT}`)
})

