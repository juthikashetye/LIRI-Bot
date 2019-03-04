require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var axios = require("axios");
var moment = require("moment");
moment().format();
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var f = require("fs");

// node liri.js userCommand queryParameter

function processUserCommand(userCommand, queryParameter) {

  switch (userCommand) {

    case "concert-this":
      processConcertThis(queryParameter);

      break;

    case "spotify-this-song":
      processSpotifySong(queryParameter);

      break;

    case "movie-this":
      processMovie(queryParameter);

      break;

    case "do-what-it-says":
      processDoWhatItSays(queryParameter);

      break;

    default:

  }
}

function processConcertThis(artist) {

  var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(bandsUrl).then(function(response) {

    var concerts = response.data;
    if (response.data[0].venue === null) {

      console.log("\n" + "Sorry! Currently there are no shows listed for this artist." + "\n");

    } else {
      // console.log(JSON.stringify(response.data,null,2));
      for (var i = 0; i < concerts.length; i++) {

        console.log("\n" + [i + 1] + ". " + "Venue : " + concerts[i].venue.name + "\n");
        console.log("Location : " + concerts[i].venue.city + "," + concerts[i].venue.country + "\n")
        console.log("Date : " + moment(concerts[i].datetime).format("MM/DD/YYYY") + "\n");

      }
    }

  }).catch(function(error) {

    console.log("\n" + "Sorry! We couldn't find any shows." + "\n");

  });

}

function processSpotifySong(song) {

  if (song === "") {
    song = "The Sign Ace of Base";
  }

  spotify.search({
    type: "track",
    query: song,
    limit: 1
  }, function(err, data) {
    if (err) {
      return console.log("\n" + "Error occurred: " + err + "\n");
    }

    // console.log(JSON.stringify(data, null, 2));
    var track = data.tracks.items;

    for (var i = 0; i < track.length; i++) {

      console.log("\n" + "Artists : " + JSON.stringify(track[i].album.artists[0].name) + "\n");
      console.log("Song name : " + JSON.stringify(track[i].name) + "\n");
      console.log("Album name : " + JSON.stringify(track[i].album.name) + "\n");
      console.log("Preview link of the song : " + JSON.stringify(track[i].preview_url) + "\n");
    }

  });

}

function processMovie(movie) {

  if (movie === "") {
    movie = "Mr. Nobody";
  }

  var url = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.get(url).then(function(m) {

    console.log("\n" + "Title : " + m.data.Title + "\n");
    console.log("Date/Year of Release : " + m.data.Released + "\n");

    var ratings = m.data.Ratings;

    for (var i = 0; i < ratings.length; i++) {

      if ((ratings[i].Source == "Internet Movie Database") || (ratings[i].Source == "Rotten Tomatoes")) {
        console.log(ratings[i].Source + " Rating : " + ratings[i].Value + "\n");
      }

    }

    console.log("Country : " + m.data.Country + "\n");
    console.log("Language : " + m.data.Language + "\n");
    console.log("Plot : " + m.data.Plot + "\n");
    console.log("Actors : " + m.data.Actors + "\n");

  }).catch(function(error) {

    console.log("\n" + "Sorry! We couldn't find that movie." + "\n");

  });

}

function processDoWhatItSays(doAsTold) {

  // read random.txt
  // get userCommand and queryParameter from file
  // pass them to processUSerCommand

  f.readFile("./random.txt", "utf8", function(err, data) {

    if (err) {
      console.log("\n" + "I don't know what that means!" + "\n");
    }

    var command = data.slice(0, data.indexOf(","));

    //exclude quotes
    doAsTold = data.slice(data.indexOf(",") + 2, data.length - 1);

    //include quotes
    // doAsTold = data.slice(data.indexOf(",") + 1);

    console.log(command, doAsTold);

    if (command == "spotify-this-song") {

      processSpotifySong(doAsTold);

    } else if (command == "movie-this") {

      processMovie(doAsTold);

    } else if (command == "concert-this") {

      processConcertThis(doAsTold);

    }

  });

}

function init() {

  processUserCommand(process.argv[2], process.argv.slice(3).join("+").trim());

}

init();