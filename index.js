var Twit = require('twit')
var T = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
})

var users = [];
T.get('friends/ids', {screen_name: 'NBABot98011077'},function (err, data, response){
  console.log(data)
  users = data.ids
})

// Lebron James, KD, John Wall, James Harden, Stephen Curry, Giannis, Anthony Davis, Jamal Murray, Damian Lillard, Kyrie Irving, Nick Young

var stream = T.stream('statuses/filter', {follow: users});

users.forEach(function(element) {
  T.post('friendships/create', {user_id: element}, function (err, data, response){
    console.log(data)
  })

  T.get('users/show', {user_id: element}, function(err, data, response) {
    var user = data
    console.log(data)
    stream.on('tweet', function (tweet) {
        if (users.indexOf(tweet.user.id_str) > -1) {
            console.log(tweet.user.name + ": " + tweet.text);
            T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
                console.log(data)
            })
        }
    })
      T.post('statuses/update', {status: 'Now following' + ' ' + '@' + user.screen_name}, function(err, data, response) {
        console.log(data)
      })
  })

  T.get('statuses/user_timeline', {user_id: element , count: 1}, function(err, data, response){
    console.log(data)
  })

})
