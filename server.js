const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const MainRouter = require("./routes/main.route");
const bodyParser = require("body-parser");
const cors = require('cors'); 

dotenv.config();

connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['POST', 'GET', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", MainRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
