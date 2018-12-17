var Twit = require('twit')
var T = new Twit({
    consumer_key:         'f7kgByrtb2nqtWUSgRAaU7Kur',
    consumer_secret:      'tu9QzGb2C1xwloWIDFqA1Dh3toFO4BFc0qOOO8q6tMfAdY7sdP',
    access_token:         '1067520612820602882-2sCHP6qzJcKjhP1ANSAqw9FgwDytyP',
    access_token_secret:  'pOhTfQ75M16yh17bZqw1gglvEb8MArK67Ke8QM0OlCErJ',
})

T.get('friends/ids', {screen_name: 'NBABot98011077'},function (err, data, response){
  console.log(data)
  var users = data
  users.ids.forEach(function(element) {
    console.log(element);
    T.get('statuses/user_timeline', {user_id: element , count: 1}, function(err, data, response){
      console.log(data[0])
      retweet = data[0].id_str
      T.post('statuses/retweet/:id', {id: retweet}, function(err, data, response){
        console.log(data);
      })
    })

  })
})
// Lebron James, KD, John Wall, James Harden, Stephen Curry, Giannis, Anthony Davis, Jamal Murray, Damian Lillard, Kyrie Irving, Nick Young
