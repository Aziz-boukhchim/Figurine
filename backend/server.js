const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/Db");

dotenv.config();
const app = express();

//connection
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req,res) => {
    res.send("API is running");
});

app.use('/api/figurines', require('./routes/figurines'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orderRoute'));





//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});