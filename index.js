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
    T.get('statuses/user_timeline', {user_id: element , count: 1}, function(err, data, response){
      time = data[0].created_at
      hour = time.substr(11, 2)
      hour = parseInt(hour)
      user = data[0].name
      retweet = data[0].id_str
      retweeted = data[0].retweeted
      console.log(user)
      if (hour > 22 || hour < 03) {
        if (retweeted) {

          } else {
            T.post('statuses/retweet/:id', {id: retweet}, function(err, data, response){
              console.log(data)
            })
            messages = ["was on Twitter late again last night", "may not be well rested today", "needs to take a break from the late tweets", "might be tired today", "get to bed a bit earlier"]
            message = messages[Math.floor(Math.random()*messages.length)];
            T.post('statuses/update', { status: user + " " + message }, function(err, data, response) {
              console.log(data)
            })
          }
        }
    })

  })
})
