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
      screen_name = data[0].user.screen_name
      retweet = data[0].id_str
      retweeted = data[0].retweeted
      console.log(screen_name)
      if (hour > "22" || hour < "02") {
        if (retweeted) {

          } else {
            T.post('statuses/retweet/:id', {id: retweet}, function(err, data, response){
              console.log(data)
            })
            T.post('statuses/update', { status: "@" + screen_name + " " + "was on Twitter late again last night" }, function(err, data, response) {
              console.log(data)
            })
          }
        }
    })

  })
})
