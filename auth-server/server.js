const express = require('express');
const app = express();
const {connectDB} = require('./config/db')

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", require("./middleware/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));