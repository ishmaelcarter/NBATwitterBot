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
  console.log(users);
  users.ids.forEach(function(element) {
    T.post('friendships/create', {user_id: element}, function (err, data, response){
      console.log(data)
    })

    T.get('statuses/user_timeline', {user_id: element , count: 1}, function(err, data, response){
      console.log(data)
      T.post('statuses/retweet/:id', {id: element.id}, function(err, data, response){
        console.log(data)
      })
    })

  })
})
// Lebron James, KD, John Wall, James Harden, Stephen Curry, Giannis, Anthony Davis, Jamal Murray, Damian Lillard, Kyrie Irving, Nick Young
