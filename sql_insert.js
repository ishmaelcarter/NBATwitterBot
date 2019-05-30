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
})



db_insert(T, con);
function db_insert(T, con) {
  T.get('trends/place', {id: 23424977}, function (err, data, response){
    var top_trends = []
    for (i=0;i<data[0].trends.length;i++) {
      volume = data[0].trends[i].tweet_volume
      if (volume > 1000) {
        top_trends.push(data[0].trends[i].name)
      }
    }
    console.log(top_trends);
    top_trends.forEach(function(element) {
      T.get('search/tweets', {q: element, count: 100}, function (err,data,response){
       if (data) {
         var length = data.statuses.length
          for (var i = 0; i < length; i++) {
            if (data.statuses[i]) {
              if (typeof data.statuses[i].entities.media !== "undefined") {
                console.log(data.statuses[i].entities.media)
                if (typeof data.statuses[i].entities.media[0].media_url != "undefined") {
                  var url = data.statuses[i].entities.media[0].url
                  var media_url = data.statuses[i].entities.media[0].media_url_https
                  console.log(media_url)
                  console.log(url)
                } else {
                  console.log("In Else");
                  media_url = "NULL"
                  url = "NULL"
                }
              }
              var lang = data.statuses[i].lang
              var text = data.statuses[i].text
              text = text.substring(text.indexOf(":")+1)
              var time = data.statuses[i].created_at
              var retweets = data.statuses[i].retweeted_status.retweet_count
              var favs = data.statuses[i].retweeted_status.favorite_count
              if (retweets > 2500 || favs > 5000) {
                if (lang == "en") {
                  if (media_url.includes("video_thumb") != true) {
                    var query = "INSERT INTO tweets (text, time, retweets, favs, media, url) VALUES (?, ?, ?, ?, ?, ?)"
                    var values = [text, time, retweets, favs, media_url, url]
                    con.query(query, values, function(err, rows, fields) {
                      console.log(err);
                    });
                    console.log("Insert Complete");
                  }
                }
              }
              console.log(retweets)
              console.log(favs);
            }
          }
        }
      })
    })
  })
}
