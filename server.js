const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// create changeable variables
let currentMovieID;

// To be able to open files bundled to html (js and css in folder "public")
app.use(express.static("public"));

// for POSTing information that we get from form or ajax
// app.use(express.urlencoded({extended: true}));
app.use(express.json());

// create new DB indise MongoDB named "movieslistDB"
mongoose.connect("mongodb://127.0.0.1/movieslistDB");

// Mongoose Schema and Mongoose Model(Ususally capitalised)
const movieSchema = new mongoose.Schema({
  _id: String,
  dbMovieID: String,
  dbMoviePoster: String,
  dbMovieTitle: String,
});
const Movie = mongoose.model("Movie", movieSchema);

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.post("/", function (request, response) {
  // get movieID and moviePoster if user clicked add Button on main page
  response.send({
    serverMovieID: request.body.movieID,
    serverMoviePoster: request.body.moviePoster,
    serverMovieTitle: request.body.movieTitle,
  });

  // CREATE new movie item with required id if it doesn't exist yet
  Movie.findOne({ _id: request.body.movieID }, function (err, foudItem) {
    if (!err) {
      if (!foudItem) {
        // if NO ITEM EXISTS (or it was deleted) we create new one
        const newMovieItem = new Movie({
          _id: request.body.movieID,
          dbMovieID: request.body.movieID,
          dbMoviePoster: request.body.moviePoster,
          dbMovieTitle: request.body.movieTitle,
        });
        // we SAVE item into collection
        newMovieItem.save();
      }
    }
  });
});

app.get("/watchlist", function (request, response) {
  response.sendFile(__dirname + "/keeper.html");
});

app.post("/watchlist", function (request, response) {
  // send information to watchlist directly from database (items inside array)
  Movie.find({}, function (err, allMovies) {
    if (!err) {
      // allMovies is array from database, we transfer it to our "/watchlist"
      // and loop through to create movie items
      response.send({
        serverArray: allMovies,
        serverItemID: request.body.movieItemID,
      });
    }
  });
  // change value of currentMovieID with purpose to transfer it to "/movieinfo"
  currentMovieID = request.body.movieItemID;
});

app.get("/movieinfo", function (request, response) {
  response.sendFile(__dirname + "/movieinfo.html");
});

app.post("/movieinfo", function (request, response) {
  // transfer currentMovieID to get full movie info
  response.send({ serverItemID: currentMovieID });
  // test
  console.log(`Sending Item ID ${currentMovieID}`);
});

app.get("/remove", function (request, response) {
  
});

app.post("/remove", function (request, response) {
  response.send({ serverRemoveMovie: request.body.movieItemID });
  console.log(request.body.movieItemID);
  let removeMovieId = request.body.movieItemID;
  Movie.findByIdAndDelete(removeMovieId, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", foundItem);
    }
  });
});

app.listen(port, function () {
  console.log("Server is working of port 3000");
});
