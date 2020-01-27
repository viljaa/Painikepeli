//Back-End JS

const express = require('express');
const port = 3000
const socket = require('socket.io')

//Application setup
var app = express();
var server = app.listen(port, function(){
  console.log('Listening port ' + port);
});

//Values stored on server
var gameRound = 0  //Stores rounds that have been played
var clientScoreboard = {};  //Stores players' points

//Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('Connected socket ' + socket.id);
  //Add client to scoreboard with default score value 20 for score tracking purposes
  var socketID = socket.id
  clientScoreboard[socketID] = 20;
  //Display for developer purposes
  console.log(clientScoreboard);

  //Listening user clicks
  socket.on('userClick', function(data){
    if (clientScoreboard[socketID] >= 1){
      //Update game round and send it to all clients
      gameRound += data.round
      io.sockets.emit('userClick', gameRound);

      //Update and send current points to player
      var pointsGranted = pointCounter(gameRound);
      if (pointsGranted != 0){
        socket.emit('winningRound', pointsGranted);
      }
      clientScoreboard[socketID] += pointsGranted
      clientScoreboard[socketID] -= 1 //Minus the cost of playing a round
      socket.emit('addPoints', clientScoreboard[socketID]);

      //Update rounds until next winning round and send value to all clients
      var nextWinAt = nextWin(gameRound);
      io.sockets.emit('nextWin', nextWinAt);
    } else {
      socket.emit('noPoints');
    }
  });

  //Listen for stats reset
  socket.on('resetStats', function(data){
    clientScoreboard[socketID] = data.points
    socket.emit('addPoints', clientScoreboard[socketID]);
  });

});

//Serving static files
app.use(express.static('public'));

//Functions

function pointCounter(round){  //Determines reward for player by comparing to rounds played
  if (round % 500 == 0){
    return 250;
  } else if (round % 100 == 0) {
    return 40;
  } else if (round % 10 == 0) {
    return 5;
  } else {
    return 0;
  }
};


function nextWin(round){  //Determines how many rounds until next winning round
  var tillNext = 10 - (round % 10)
  return tillNext;
}


//Round timer
var round_lenght = 0.2;  //Round length in minutes

function start_clock(){

  var round_start = Date.parse(new Date());  //The time when the round starts in milliseconds
  var round_end = new Date(round_start + round_lenght*60*1000);  //The time when the round ends in milliseconds

  function update_time(){
    var time = time_left(round_end);

    io.sockets.emit('updateTimer', {
      minutes: time.minutes,
      seconds: time.seconds
    });

    if (time.total_time <= 0){clearInterval(timeinterval);
      gameRound = 0;
      restart_round();}
  }
  update_time();
  var timeinterval = setInterval(update_time, 1000);  //Time interval for updating the clock for display
}

function time_left(roundend){
  var total_time = Date.parse(roundend) - Date.parse(new Date());  //Total time left = (RoundEndTime - CurrentTime)
  var seconds = Math.floor( (total_time/1000) % 60 );  //Remainder of seconds
  var minutes = Math.floor( (total_time/1000/60) % 60 );  //Remainder of minutes

  return {'total_time':total_time, 'minutes': minutes, 'seconds': seconds}; //Function returns time left formatted into minutes and seconds
}

start_clock(); //Start the clock

function restart_round(){
  io.sockets.emit('newRound');  //Inform clients about the end of the round
  start_clock();  //Restart the clock
}
