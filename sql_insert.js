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

function db_insert(T, con) {
  T.get('trends/place', {id: 1}, function (err, data, response){
    var top_trends = []
    for (i=0;i<11;i++) {
      top_trends.push(data[0].trends[i].name)
    }
    console.log(top_trends);
    top_trends.forEach(function(element) {
      T.get('search/tweets', {q: element, count: 10}, function (err,data,response){
       if (data) {
          for (var i = 0; i < 10; i++) {
            if (data.statuses[i]) {
              tweet = data
              lang = data.statuses[i].lang
              text = data.statuses[i].text
              text = text.substring(text.indexOf(":")+1)
              if (lang == "en") {
                var query = "INSERT INTO tweets (text) VALUES (?)"
                con.query(query, text, function(err, rows, fields) {
                  console.log(err);
                });
                console.log("Insert Complete");
              }
              retweeted = data.statuses[i].retweeted
              var retweets = data.statuses[i].retweet_count
              var favs = data.statuses[i].favorite_count
              console.log(retweets)
              console.log(favs);
            }
          }
        }
      })
    })
  })
}
