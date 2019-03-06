# LIRI-Bot

* LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

* LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

## Things to do before you start using the app

* To retrieve the data that will power this app, you'll need to install the following Node packages. Without installing these packages the app won't work on your computer.

  * Node-Spotify-API https://www.npmjs.com/package/node-spotify-api
             npm install --save node-spotify-api

  * Axios https://www.npmjs.com/package/axios
             npm install axios

  * You'll use Axios to grab data from the OMDB API http://www.omdbapi.com and the Bands In Town API http://www.artists.bandsintown.com/bandsintown-api

  * Moment https://www.npmjs.com/package/moment
             npm i moment

  * DotEnv https://www.npmjs.com/package/dotenv
            npm install dotenv

* Visit Spotify website https://developer.spotify.com/my-applications/#!/ to get your own spotify API keys

* Next, create a file named `.env`, add the following to it, replacing the values with your API keys (no quotes):

	* Spotify API keys

	SPOTIFY_ID=your-spotify-id
	SPOTIFY_SECRET=your-spotify-secret

## Instructions to use the app

* In your terminal/command navigate to the folder where liri.js is saved and type the following:

	* To get a list of shows for an artist/band :

		node liri.js concert-this artist/band name
		eg: node liri.js concert-this lady gaga

	* To get info about a movie :

		node liri.js movie-this movie name
		eg: node liri.js movie-this Cast Away

	* To get info about a song :

		node liri.js spotify-this-song song name
		eg: node liri.js spotify-this-song World Cup

	* To get info of whatever is written in random.txt :

		node liri.js do-what-it-says
	  This command will give info about a song, artist shows or movie as per the random.txt contents.
	  You can edit random.txt to put your own parameters.


