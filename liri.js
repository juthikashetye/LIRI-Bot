require("dotenv").config();
var keys = require('./keys');
var request = require('request');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

// node liri.js concert-this entertainment

function processUserCommand(userCommand, queryParameter){

	console.log('Movie: ' + queryParameter);
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
	console.log("concert loaded");

	var bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
	console.log(bandsUrl);

	request(bandsUrl, function (error, response, a) {

	  console.log(JSON.parse(a));

	});

}

function processSpotifySong(song){

	console.log("spotify song loaded");

	spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
 
	// console.log(JSON.stringify(data, null, 2));

	console.log("\n" + "Artists : " + JSON.stringify(data.tracks.items[0].album.artists[0].name) + "\n");
	console.log("Song name : " + JSON.stringify(data.tracks.items[0].name) + "\n");
	console.log("Album name : " + JSON.stringify(data.tracks.items[0].album.name) + "\n");
	console.log("Preview link of the song : " + JSON.stringify(data.tracks.items[0].preview_url) + "\n");

});

}

function processMovie(movie){
	console.log("movie loaded");

	var url = 'https://www.omdbapi.com/?t='+movie+'&y=&plot=short&apikey=trilogy';
	console.log(url);

	request(url, function (error, response, m) {

		// console.log(m);

		console.log("Title : " + JSON.parse(m).Title + "\n");
		console.log("Date/Year of Release : " + JSON.parse(m).Released + "\n");

		var ratings = JSON.parse(m).Ratings;

		for (var i = 0; i < ratings.length; i++) {
			if ((ratings[i].Source == "Internet Movie Database")||(ratings[i].Source == "Rotten Tomatoes")) {
			console.log(ratings[i].Source + " Rating : " + ratings[i].Value + "\n");
			}
		}

		console.log("Country : " + JSON.parse(m).Country + "\n");
		console.log("Language : " + JSON.parse(m).Language + "\n");
		console.log("Plot : " + JSON.parse(m).Plot + "\n");
		console.log("Actors : " + JSON.parse(m).Actors + "\n");
	});
}

function processDoWhatItSays(){
	console.log("do what it says loaded");
	// read random.txt
	// get command and parameter from file
	// pass them to processUSerCommand
}

processUserCommand(process.argv[2], process.argv.slice(3).join("+").trim());

