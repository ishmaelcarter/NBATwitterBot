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
      if (data[0]) {
        created = []
        created.push(data[0].created_at)
        created.push(data[1].created_at)
        created.push(data[2].created_at)
        day = []
        day.push(created[0].substr(0,10))
        day.push(created[1].substr(0,10))
        day.push(created[2].substr(0,10))
        hour = created[0].substr(11, 2)
        hour = parseInt(hour)
        user = data[0].user.name
        retweet = data[0].id_str
        retweets = data[0].retweet_count
        retweeted = data[0].retweeted
        console.log(user)
          if (retweeted) {
            console.log("No new tweets to see")
            }
          else if (day[0] == day[1] || day[1] == day[2]) {
            T.post('statuses/retweet/:id', {id: retweet}, function(err, data, response){
                console.log(data)
            })
            messages = ["was on Twitter a lot yesterday", "was active on Twitter yesterday", "may not be well rested today", "needs to take a break from tweeting", "might be tired today", "tweeted multiple times yesterday", "has tweeted a lot this week","has been very active"]
            message = messages[Math.floor(Math.random()*messages.length)];
            T.post('statuses/update', { status: user + " " + message , function(err, data, response) {
              console.log(user)
            }
         })
        }
      }
    })
  })
})
