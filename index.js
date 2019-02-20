var Twit = require('twit')
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
})

T.get('friends/ids', {screen_name: 'NBAatNight'},function (err, data, response){
  console.log(data)
  var users = data
  users.ids.forEach(function(element) {
    console.log(element);
    T.get('statuses/user_timeline', {user_id: element , count: 3}, function(err, data, response){
      created_1 = data[0].created_at
      created_2 = data[1].created_at
      created_3 = data[2].created_at
      day_1 = created_1.substr(0,10)
      day_2 = created_2.substr(0,10)
      day_3 = created_3.substr(0,10)
      hour = created.substr(11, 2)
      hour = parseInt(hour)
      user = data[0].user.name
      retweet = data[0].id_str
      retweets = data[0].retweet_count
      retweeted = data[0].retweeted
      console.log(user)
        if (retweeted) {
          console.log("No new tweets to see")
          }
        else if (day_1 == day_2 || day_2 == day_3) {
            messages = ["was on Twitter a lot yesterday", "was active on Twitter yesterday", "may not be well rested today", "needs to take a break from tweeting", "might be tired today", "get off of twitter a bit earlier", "has tweeted a lot this week"]
            message = messages[Math.floor(Math.random()*messages.length)];
            T.post('statuses/update', { status: user + " " + message , function(err, data, response) {
              console.log(user)
            })
          }
    })

  })
})
