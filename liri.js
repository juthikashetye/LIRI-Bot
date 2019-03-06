require("dotenv").config();

//spotify keys stored here
var keys = require("./keys");

//for getting data from omdb and bands in town api
var axios = require("axios");

var moment = require("moment");

//for date formatting
moment().format();

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var f = require("fs");

//api response
var output;

//rotten tomatoes rating
var rtRating;

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

  //bands in town api
  var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(bandsUrl).then(function(response) {

    var concerts = response.data;

    if (concerts[0].venue === null) {

      console.log("\n" + "Sorry! Currently there are no shows listed for this artist." + "\n");

    } else {
      // console.log(JSON.stringify(response.data,null,2));
      for (var i = 0; i < concerts.length; i++) {

      	output = "\n" + [i + 1] + ". " + "Venue : " + concerts[i].venue.name + "\n" +
      			 "Location : " + concerts[i].venue.city + "," + concerts[i].venue.country + "\n" +
      			 "Date : " + moment(concerts[i].datetime).format("MM/DD/YYYY") + "\n";

      	console.log(output);

      	logData(process.argv[2], process.argv.slice(3).join(" ").trim(), output);

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

      output = "\n" + "Artists : " + track[i].album.artists[0].name + "\n" +
      		   "Song name : " + track[i].name + "\n" +
      		   "Album name : " + track[i].album.name + "\n" +
      		   "Preview link of the song : " + track[i].preview_url + "\n";

      console.log(output);

      logData(process.argv[2], process.argv.slice(3).join(" ").trim(), output);
    }

  });

}

function processMovie(movie) {

  if (movie === "") {
    movie = "Mr. Nobody";
  }

  //omdb api
  var url = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.get(url).then(function(m) {

    var ratings = m.data.Ratings;

    for (var i = 0; i < ratings.length; i++) {

      if ((ratings[i].Source == "Rotten Tomatoes")) {

        rtRating = ratings[i].Source + " Rating : " + ratings[i].Value;

      }
    }

    if (rtRating == undefined) {

      rtRating = "Rotten Tomatoes Rating : N/A";

    }

      output = "\n" + "Title : " + m.data.Title + "\n" +
         "Date/Year of Release : " + m.data.Released + "\n" +
         "IMDB Rating : " + m.data.imdbRating + "\n" +
         rtRating + "\n" + 
         "Country : " + m.data.Country + "\n" +
         "Language : " + m.data.Language + "\n" +
         "Plot : " + m.data.Plot + "\n" +
         "Actors : " + m.data.Actors + "\n";

    console.log(output);

    logData(process.argv[2], process.argv.slice(3).join(" ").trim(), output);

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

function logData(command, entertainment, toBeLogged){

  //append all the data including user commands into log.txt
  f.appendFileSync("log.txt", "\n" +"LIRI command: " + command + " " + entertainment + "\n" + toBeLogged + "\n");
  
}

function init() {

  processUserCommand(process.argv[2], process.argv.slice(3).join("+").trim());

}

init();