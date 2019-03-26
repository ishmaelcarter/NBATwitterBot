var Twit = require('twit')
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
})

T.get('trends/place', {id: 1}, function (err, data, response){
  var top_trends = []
  for (i=0;i<11;i++) {
    top_trends.push(data[0].trends[i].name)
  }
  console.log(top_trends);
  top_trends.forEach(function(element) {
    T.post('statuses/update', { status: element + " is trending today"}, function(err, data, response) {
      console.log(element)
    })
    T.get('search/tweets', {q: element, count: 10}, function (err,data,response){
     if (data) {
        for (var i = 0; i < 10; i++) {
          if (data.statuses[i]) {
            tweet = data
            retweeted = data.statuses[i].retweeted
            var retweets = data.statuses[i].retweet_count
            var favs = data.statuses[i].favorite_count
            console.log(retweets)
            console.log(favs);
            if (retweets > 1000 || favs > 5000) {
              if (!retweeted) {
                console.log(tweet.statuses[i].id_str);
                T.post('statuses/retweet/:id', {id: tweet.statuses[i].id_str}, function(err, data, response){
                  console.log(data)
                })
              }
            }
          }
        }
      }
    })
  })
})
/*
T.get('friends/ids', {screen_name: 'NBAatNight'},function (err, data, response){
  console.log(data)
  var users = data
  users.ids.forEach(function(element) {
    console.log(element);
    T.get('statuses/user_timeline', {user_id: element , count: 3}, function(err, data, response){
      if (data[0]) {
        created = []
        for (var i = 0; i < 3; i++) {
          created.push(data[i].created_at)
        }
        day = []
        for (var i = 0; i < 3; i++) {
          day.push(created[i].substr(4,6))
        }
        user = data[0].user.name
        retweet = data[0].id_str
        retweets = data[0].retweet_count
        retweeted = data[0].retweeted
        console.log(user)
          if (retweeted) {
            console.log("No new tweets to see")
            }
          else if (day[0] == day[1] && day[1] == day[2]) {
            T.post('statuses/retweet/:id', {id: retweet}, function(err, data, response){
                console.log(data)
            })
            messages = ["was on Twitter a lot on", "was active on Twitter during", "needs to take a break from tweeting after", "might be tired", "tweeted multiple times on", "has tweeted a lot this week","has been very active since"]
            message = messages[Math.floor(Math.random()*messages.length)];
            T.post('statuses/update', { status: user + " " + message + " " + day[1], function(err, data, response) {
              console.log(user)
            }
         })
        }
      }
    })
  })
})
*/
