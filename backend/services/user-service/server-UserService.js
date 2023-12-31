require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
// require("dotenv").config();
require("dotenv").config({ path: "./privateValues.env" });

const app = express();

mongoose
  .connect(process.env.USER_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

app.use(express.json());
app.use("/user", userRoutes);

const port = 3002;
app.listen(port, () => console.log(`User service running on port ${port}`));
