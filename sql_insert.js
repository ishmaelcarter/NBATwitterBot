var mysql = require('mysql');
var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

var Twit = require('twit')
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});


db_insert(T, con);
function db_insert(T, con) {
  T.get('trends/place', {id: 23424977}, function (err, data, response){
    var top_trends = []
    for (i=0;i<data[0].trends.length;i++) {
      var volume = data[0].trends[i].tweet_volume;
      if (volume > 1000) {
        top_trends.push(data[0].trends[i].name);
      }
    }
    console.log(top_trends);
    top_trends.forEach(function(element) {
      T.get('search/tweets', {q: element, count: 1000}, function (err,data,response){
       if (data) {
         var tweets;
         tweets = data.statuses ? data.statuses : ["empty"];
         var length = tweets.length;
         var url;
         var media;
         tweets.forEach(tweet => {
           if (tweet) {
            const lang = tweet.lang;
            var text = tweet.text;
            text = text.substring(text.indexOf(":")+1);
            var time = tweet.created_at;
            if (typeof tweet.retweeted_status !== 'undefined' && typeof tweet.entities.media !== 'undefined'){
              var url = tweet.entities.media[0].url;
              var media_url = tweet.entities.media[0].media_url_https;
              var retweets = tweet.retweeted_status.retweet_count;
              var favs = tweet.retweeted_status.favorite_count;
              console.log([retweets, favs])
              if (retweets > 500 || favs > 1500) {
                if (lang == "en") {
                  if (media_url.includes("video_thumb") !== true) {
                    var query = "INSERT IGNORE INTO tweets (text, time, retweets, favs, media, url) VALUES (?, ?, ?, ?, ?, ?);";
                    var values = [text, time, retweets, favs, media_url, url];
                    con.query(query, values, function(err, rows, fields) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("Insert Complete: " + + values);
                      }
                    }); 
                  }
                }
              }
            }
           }
         });
        }
      })
    })
  })
}
