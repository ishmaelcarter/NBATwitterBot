var Twit = require('twit')
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
})

T.get('friends/ids', {screen_name: 'NBABot98011077'},function (err, data, response){
  console.log(data)
  var users = data
  users.ids.forEach(function(element) {
    console.log(element);
    T.get('statuses/user_timeline', {user_id: element , count: 1}, function(err, data, response){
      time = data[0].created_at
      time = time.substr(11, 8)
      screen_name = data[0].user.screen_name
      retweet = data[0].id_str
      retweeted = data[0].retweeted
      console.log(screen_name);
      if (time > "22:00:00") {
        if (retweeted) {

          } else {
            T.post('statuses/retweet/:id', {id: retweet}, function(err, data, response){
              console.log(data);
            })
            T.post('statuses/update', { status: "@" + screen_name + " " + "is on Twitter late!" }, function(err, data, response) {
              console.log(data)
            })
          }
        }
    })

  })
})
// Lebron James, KD, John Wall, James Harden, Stephen Curry, Giannis, Anthony Davis, Jamal Murray, Damian Lillard, Kyrie Irving, Nick Young
