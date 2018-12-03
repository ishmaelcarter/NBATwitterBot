var Twit = require('twit')
var T = new Twit({
    consumer_key:         'f7kgByrtb2nqtWUSgRAaU7Kur',
    consumer_secret:      'tu9QzGb2C1xwloWIDFqA1Dh3toFO4BFc0qOOO8q6tMfAdY7sdP',
    access_token:         '1067520612820602882-2sCHP6qzJcKjhP1ANSAqw9FgwDytyP',
    access_token_secret:  'pOhTfQ75M16yh17bZqw1gglvEb8MArK67Ke8QM0OlCErJ',
})

var users = ["23083404","35936474", "132389474", "50811932", "42562446", "2279776304", "159113258", "3184000707", "267425142", "317370751"];
// Lebron James, KD, John Wall, James Harden, Stephen Curry, Giannis, Anthony Davis, Jamal Murray, Damian Lillard, Kyrie Irving

var stream = T.stream('statuses/filter', {follow: users});

users.forEach(function(element) {
  T.post('friendships/create', {user_id: element}, function (err, data, response){
    console.log(data)
  })

  T.get('users/show', {user_id: element}, function(err, data, response) {
    var user = data
    console.log(data)
      T.post('statuses/update', {status: 'Now following' + ' ' + '@' + user.screen_name + ' late night tweets'}, function(err, data, response) {
        console.log(data)
      })
  })

  T.get('statuses/user_timeline', {user_id: element , count: 1}, function(err, data, response){
    console.log(data)
  })

})

stream.on('tweet', function (tweet) {
    if (users.indexOf(tweet.user.id_str) > -1) {
        console.log(tweet.user.name + ": " + tweet.text);
        T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
            console.log(data)
        })
    }
})
