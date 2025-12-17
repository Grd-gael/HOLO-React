require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");


require("./Services/mongo");


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

require("./Services/passport")(app);

app.use("/user", require("./Controllers/user"));
app.use("/mood", require("./Controllers/mood"));


app.get("/", (req, res) => {
  res.send("API - Last deploy: " + new Date().toISOString());
});


app.listen(3000, "0.0.0.0", () => console.log("Serveur lancé sur 0.0.0.0:3000"));