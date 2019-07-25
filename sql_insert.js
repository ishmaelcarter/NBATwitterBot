'use strict';
var Twit = require('twit')
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});
var mysql = require('mysql');
var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
db_insert(T, con);
function db_insert(T, con) {
  T.get('trends/place', { id: 23424977 })
    .catch(function (err) {
      console.log(err);
    })
    .then(function (data) {
      const trends = data.data[0].trends;
      var top_trends = [];
      for (var i = 0; i < trends.length; i++) {
        var j = i;
        var volume = trends[j].tweet_volume;
        if (volume > 1000) {
          top_trends.push(trends[j].name);
        }
      }
      return top_trends;
    })
    .then(function (top_trends) {
      top_trends.forEach(trend => {
        T.get('search/tweets', { q: trend, count: 50 })
          .catch(function (err) {
            console.log('error: ', err);
          })
          .then(function (result) {
            var tweets = result.data.statuses;
            return tweets;
          })
          .then(function (tweets) {
            tweets.forEach(tweet => {
              console.log(tweet);
              var text = tweet.text;
              text = text.substring(text.indexOf(":") + 1);
              const time = tweet.created_at;
              const lang = tweet.lang;
              if (typeof tweet.retweeted_status !== 'undefined' && typeof tweet.entities.media !== 'undefined') {
                const url = tweet.entities.media[0].url;
                const media_url = tweet.entities.media[0].media_url_https;
                const retweets = tweet.retweeted_status.retweet_count;
                const favs = tweet.retweeted_status.favorite_count;
                if (retweets > 400 || favs > 700) {
                  if (lang === "en") {
                    if (media_url.includes("video_thumb") !== true) {
                      const query = "INSERT IGNORE INTO tweets (text, time, retweets, favs, media, url) VALUES (?, ?, ?, ?, ?, ?);";
                      const values = [text, time, retweets, favs, media_url, url];
                      con.query(query, values, function (err, rows, fields) {
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
            })
          })
      })
    })
}
