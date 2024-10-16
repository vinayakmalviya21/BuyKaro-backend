const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db'); 
const MainRouter = require("./routes/main.route");

dotenv.config(); 

connectDB(); 

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware to parse incoming JSON requests
app.use(express.json()); 

// User Routes
app.use("/api", MainRouter);

// Enable Cross-Origin Resource Sharing (CORS)
const cors = require('cors');

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Start the server on the specified PORT or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

