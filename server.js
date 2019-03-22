//Part 1
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
//to deal with file paths
const path = require("path");

// for the items.js file to work
const items = require("./routes/api/items");

//initialise express
const app = express();

// BodyParser Middleware
app.use(bodyParser.json());

//DB CONFIG.. mlab.com/cloud.mongodb.com URI ..create the config Folder for the URI and bring it in here
const db =
  "mongodb+srv://andrey:andrey123@cluster0-1gs4s.mongodb.net/test?retryWrites=true";

//connnect to Mongo (Promise based)
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongo DV Connected"))
  .catch(err => console.log(err));

//new code for the new MongoDB website
// const client = new MongoClient(db, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("andrey").collection("andrey");
//   client.close();
// }, console.log("Connected..."));

//use routes. anything that goes to ap/items should refer to the items variable which is the 'items = file' definition above.
app.use("/api/items", items);

//heroku step: If, in our node environment = production then we want to set a static folder.
if (process.env.NODE_ENV === "production") {
  //if we're in production, set static folder, so it will load client/build
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    //using the path module, then we go into client/build/index.html, this should load it as long as its hitting the api route above client/build and its in production.
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//now that we have connected to mongo we need to run our server:: create a variable for the port we are going to use. If its for heroku use an evironmental variable: process.env.PORT ..or just 5000
const port = process.env.PORT || 5000;

// now we want our app to llisten on that 'port' and take a callback
app.listen(port, () => console.log(`Server started on ${port}`));
