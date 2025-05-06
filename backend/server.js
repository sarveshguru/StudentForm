const cors = require("cors");
const express = require("express");
const studentRoutes = require("./routes/students");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
