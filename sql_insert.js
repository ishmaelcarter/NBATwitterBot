'use strict';
var mysql = require('mysql');


var Twit = require('twit')

var T = new Twit({
  consumer_key:         'f7kgByrtb2nqtWUSgRAaU7Kur',
  consumer_secret:      'tu9QzGb2C1xwloWIDFqA1Dh3toFO4BFc0qOOO8q6tMfAdY7sdP',
  access_token:         '1067520612820602882-2sCHP6qzJcKjhP1ANSAqw9FgwDytyP',
  access_token_secret:  'pOhTfQ75M16yh17bZqw1gglvEb8MArK67Ke8QM0OlCErJ',
})
var con = mysql.createConnection({
host: 'us-cdbr-iron-east-03.cleardb.net',
user: 'b0943139dae1e6',
password: '0f1af6bb',
database: 'heroku_121b5e7e1db5572'
});


db_insert(T, con);
function db_insert(T, con) {
  T.get('trends/place', {id: 23424977}, function (err, data, response){
    var top_trends = []
    for (var i=0;i<data[0].trends.length;i++) {
      var j = i;
      var volume = data[0].trends[j].tweet_volume;
      if (volume > 1000) {
        top_trends.push(data[0].trends[j].name);
      }
    }
    console.log(top_trends);
    top_trends.forEach(function(element) {
      T.get('search/tweets', {q: element, count: 10}, function (err,data,response){
       if (data) {
         var tweets;
         tweets = data.statuses ? data.statuses : ["empty"];
         var length = tweets.length;
         var url;
         var media;
         tweets.forEach(tweet => {
           if (tweet) {
             console.log(tweet.id);
            const lang = tweet.lang;
            var text = tweet.text;
            text = text.substring(text.indexOf(":")+1);
            var time = tweet.created_at;
            if (typeof tweet.retweeted_status !== 'undefined' && typeof tweet.entities.media !== 'undefined'){
              var url = tweet.entities.media[0].url;
              var media_url = tweet.entities.media[0].media_url_https;
              var retweets = tweet.retweeted_status.retweet_count;
              var favs = tweet.retweeted_status.favorite_count;
              //console.log([text, lang, media_url, retweets, favs])
              if (retweets > 200 || favs > 500) {
                if (lang == "en") {
                  if (media_url.includes("video_thumb") !== true) {
                    var query = "INSERT IGNORE INTO tweets (text, time, retweets, favs, media, url) VALUES (?, ?, ?, ?, ?, ?);";
                    var values = [text, time, retweets, favs, media_url, url];
                    con.query(query, values, function(err, rows, fields) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("Insert Complete: " + values);
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
