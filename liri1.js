/*** At the top of the liri.js file, write the code you need to grab the data from keys.js.
Then store the keys in a variable. fs stores to node. ***/

var key = require("./keys.js");
var fs = require('fs');

/*** collecting user input and save to variable ***/
var userInput = process.argv[2];
var userInputMore = process.argv.slice(3).join(" ");

/*** switch statement to cycle through user input selections ***/
function liriInput(userInput, userInputMore) {
	switch (userInput) {
		case "my-tweets":
			twitterCall();
			break;
		case "spotify-this-song":
			spotifyCall(userInputMore);
			break;
		case "movie-this":
			omdbCall(userInputMore);
			break;
		case "do-what-it-says":
			fsCall();
			break;
		default:
			console.log("Not an available selection.")
	}

	/*** append data into the log file of what user searched ***/
	fs.appendFile("log.txt", userInput + " " + userInputMore + ` \n`, function (err) {
		if (err) {
			console.log(err);
		}
	});
};

/*** creating Twitter function communicate with Twitter API ***/
function twitterCall() {
	var Twitter = require('twitter');

	var tClient = new Twitter(key.twitter);

	var params = {
		count: 20,
	};

	tClient.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (!error) {
			tweets.forEach(function (tweet) {
				var tweetDate = tweet.created_at;
				var tweetDateFormatted = tweetDate.split(' ').slice(0, 4).join(' ')
				console.log("tweeted: " + tweet.text + " on " + tweetDateFormatted);
			});
		} else {
			console.log(error);
		}

	});
};

/*** creating Spotify function communication with Spotify API ***/
function spotifyCall(userInputMore) {
	var Spotify = require('node-spotify-api');

	var sClient = new Spotify(key.spotify);

	var search = "";

	if (!userInputMore) {
		userInputMore = "Ace of Base, The Sign";
	}

	sClient.search({
		type: 'track',
		query: userInputMore
	}, function (err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		var sData = data.tracks.items[0];
		var sArtist = sData.artists[0].name;
		var sSongName = sData.name;
		var sLink = sData.preview_url;
		var sAlbum = sData.album.name;

		console.log(
			`Artist: ${sArtist} \n` +
			`Song Name: ${sSongName} \n` +
			`Preview Link: ${sLink} \n` +
			`Album: ${sAlbum} \n`);
	});
};

/*** creating OMDB Request function communicate with OMDB API ***/
function omdbCall() {
	var request = require('request');

	const apiKey = "40e9cece";

	if (!userInputMore) {
		userInputMore = "Mr. Nobody";
	}

	var movieName = userInputMore;

	request(`http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${apiKey}`, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			var oData = JSON.parse(body);
			var rotRating;

			if (!oData.Ratings[0]) {
				var rotRating = "N/A";
			} else {
				var rotRating = oData.Ratings[0].Value;
			}

			console.log(
				`Title: ${oData.Title} \n` +
				`Year: ${oData.Year} \n` +
				`IMDB Rating: ${oData.imdbRating} \n` +
				`Rotten Tomatoes Rating: ${rotRating} \n` +
				`Production Country: ${oData.Country} \n` +
				`Language: ${oData.Language} \n` +
				`Plot: ${oData.Plot} \n` +
				`Actors: ${oData.Actors} \n`
			);
		}
	});
};

/*** creating fs Node package function to run from random.txt ***/
function fsCall() {
	var fs = require('fs');

	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		} else {
			userInput = data.split(",");
			liriInput(userInput[0], userInput[1]);
		}
	});
}

/*** calling function to start liri with user inputs ***/
liriInput(userInput, userInputMore);