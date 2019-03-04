require("dotenv").config();
var keys = require('./keys');
var request = require('request');
var axios = require("axios");
var moment = require("moment");
moment().format();
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var f = require("fs");


// node liri.js userCommand queryParameter

function processUserCommand(userCommand, queryParameter){

	// console.log('Movie: ' + queryParameter);
	switch(userCommand) {
	  case "concert-this":
	    processConcertThis(queryParameter);
	    // code block
	    break;
	  case "spotify-this-song":
	  	processSpotifySong(queryParameter);
	    // code block
	    break;
	  case "movie-this":
	    processMovie(queryParameter);
	    // code block
	    break;
	  case "do-what-it-says":
	    processDoWhatItSays(queryParameter);
	    // code block
	    break;
	  default:
	    // code block
	}
}

function processConcertThis(artist){
	console.log("Concert loaded");

 	var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandsUrl).then(function (response) {

        var concerts = response.data;
        if (response.data[0].venue === null) {

            console.log("Sorry! Currently there are no shows listed for this artist.");

        } else {
            for (var i = 0; i < concerts.length; i++) {

                console.log("\n" + [i+1] + ". " + "Venue : " + concerts[i].venue.name + "\n");
                console.log("Location : " + concerts[i].venue.city + "," + concerts[i].venue.country + "\n")
                console.log("Date : " + moment(concerts[i].datetime).format("MM/DD/YYYY") + "\n");

            }
        }

    }).catch(function (error) {
        
       	console.log("Sorry! We couldn't find any shows.");
        
      });

}

function processSpotifySong(song){

	console.log("Spotify song loaded");

	if (song === "") {
        song = "The Sign Ace of Base";
    }

	spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
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

function processMovie(movie){
	console.log("Movie loaded");

	if (movie === "") {
		movie = "Mr. Nobody";
	}

	var url = 'https://www.omdbapi.com/?t='+movie+'&y=&plot=short&apikey=trilogy';

	axios.get(url)
		 .then(function(m){

		 	console.log("\n" + "Title : " + m.data.Title + "\n");
		 	console.log("Date/Year of Release : " + m.data.Released + "\n");

			var ratings = m.data.Ratings;

			for (var i = 0; i < ratings.length; i++) {

				if ((ratings[i].Source == "Internet Movie Database")||(ratings[i].Source == "Rotten Tomatoes")) {
				console.log(ratings[i].Source + " Rating : " + ratings[i].Value + "\n");
				}

			}

			console.log("Country : " + m.data.Country + "\n");
			console.log("Language : " + m.data.Language + "\n");
			console.log("Plot : " + m.data.Plot + "\n");
			console.log("Actors : " + m.data.Actors + "\n");

		 }).catch(function (error) {
        
        	  console.log("Sorry! We couldn't find that movie.");
        
    		});

}

function processDoWhatItSays(doAsTold){
	console.log("Do what it says loaded");
	// read random.txt
	// get command and parameter from file
	// pass them to processUSerCommand
	
    f.readFile('./random.txt', 'UTF8', function(err, data) {

        if (err) {
                console.log("I don't know what that means!")
        }

        var command = data.substring(0, data.indexOf(","));
        // doAsTold = data.substring(data.indexOf(",") + 2, data.length - 1);
        doAsTold = data.substring(data.indexOf(",") + 1);

        console.log(command , doAsTold);

        spotify.search({ type: 'track', query: doAsTold, limit: 1 }, function(err, data) {

		  if (err) {
		    return console.log('Error occurred: ' + err);
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

    });
    
}

processUserCommand(process.argv[2], process.argv.slice(3).join("+").trim());

