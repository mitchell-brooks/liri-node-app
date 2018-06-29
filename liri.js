require("dotenv").config();
var fs = require("fs");
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require ("request");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var divider = "\n====================\n"
var arg = process.argv
var param = process.argv[2];
param.toLowerCase();
var searchQuery = "";
for (var i = 3; i<arg.length; i++){
  searchQuery += arg[i] + " "
}
searchQuery.trim();
searchQuery.toLowerCase();

switch (param) {
  case "my-tweets":
    readTweets();
    break;
    case "spotify-this-song":
    searchSpotify();
    break;
    case "movie-this":
    searchMovie();
    break;
    case "do-what-it-says":
    justDoIt();
    break;
    default:
    console.log("I'm sorry, I didn't understand.")
    break;
}

function readTweets(){
  // if (!searchQuery)
  client.get('statuses/user_timeline','screen_name=CampCoding&count=20', function(error, tweets, response) {
    if(error) throw error;
    var results = "";
    for(var i=0; i<20; i++){
    results += ["\nTweet: " + tweets[i].text, "Date: " + tweets[0].created_at, "-------"].join("\n");
    }
    fs.appendFile("log.txt", results + divider, function(err) {
  if (err) throw err;
  console.log(results);
}); 
  });
}
function searchSpotify(){
  if (!searchQuery){
    searchQuery = "the sign ace of base";
  }
  spotify.search({type: 'track', query: searchQuery}, function(err, data) {
    if(err){
      return console.log('Error occurred querying Spotify: ' + err);
    }

  var track = data.tracks.items[0]

  var results = [
    "Artist: " + track.artists[0].name, 
    "Track title: " + track.name,
    "Quick link: " + track.href,
    "Album: " + track.album.name].join("\n")

  fs.appendFile("log.txt", results + divider, function(err) {
  if (err) throw err;
  console.log(results);
});;
  });
};

function searchMovie(){
  if(!searchQuery){
    searchQuery = "mr nobody"
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=trilogy";


request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var results = [
      "Title: " + JSON.parse(body).Title, "Year: " + JSON.parse(body).Year, "IMDB Rating: " + JSON.parse(body).imdbRating, "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value, "Country: " + JSON.parse(body).Country, "Language: " + JSON.parse(body).Language, "Plot: " + JSON.parse(body).Plot, "Actors: " + JSON.parse(body).Actors].join("\n");
    
    fs.appendFile("log.txt", results + divider, function(err) {
  if (err) throw err;
  console.log(results);
});;
  }
});
}
function justDoIt(){
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(" ");
    param = dataArr[0];
    searchQuery = dataArr.slice(1).join(" ");
    searchQuery.trim()
    searchQuery.toLowerCase();
    switch (param) {
      case "my-tweets":
        readTweets();
        break;
        case "spotify-this-song":
        searchSpotify();
        break;
        case "movie-this":
        searchMovie();
        break;
        default:
        console.log("I'm sorry, the command in the text file isn't cromulent.")
        break;
    }
  });
}


