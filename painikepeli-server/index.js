//Back-End JS

const express = require('express');
const port = 4000
const socket = require('socket.io');

/*APPLICATION SETUP*/
var app = express();

var server = app.listen(port, function(){
  console.log('Listening port ' + port);
});

/*VALUES STORED ON SERVER*/
var gameRound = 0  //Stores rounds that have been played
var clientPoints = {};  //Stores players' points related to client socket ids
var clientUsernames = {};  //Stores usernames related to client socket ids
/*Configuration variables*/
var round_lenght = 0.2;  //Sets round length in minutes

/*SOCKET SETUP*/
var io = socket(server);

io.on('connection', function(socket){
  console.log('Connected socket ' + socket.id);
  //Add client to clientPoints with default score value 20 for score tracking purposes
  var socketID = socket.id
  clientPoints[socketID] = 20;
  //Display for developer purposes
  console.log(clientPoints);

  //Listening for client submitting username
  socket.on('username', function(data) {
    var username = data.username
    clientUsernames[username] = socketID
    console.log(clientUsernames); //Dev purposes
  });

  //Listening user clicks on play button
  socket.on('userClick', function(data){
    if (clientPoints[socketID] >= 1){
      //Update game round and send it to all clients
      gameRound += data.round
      io.sockets.emit('userClick', gameRound);

      //Update and send current points to client
      var pointsGranted = pointCounter(gameRound);
      if (pointsGranted != 0){
        socket.emit('winningRound', pointsGranted);
      }
      clientPoints[socketID] += pointsGranted
      clientPoints[socketID] -= 1 //Minus the cost of playing a round
      socket.emit('addPoints', clientPoints[socketID]);

      //Update and send scoreboard to clients
      var sorted_scoreboard = scoreboard_sort(clientUsernames, clientPoints)
      io.sockets.emit('update_scoreboard', sorted_scoreboard);

      //Update rounds until next winning round and send value to all clients
      var nextWinAt = nextWin(gameRound);
      io.sockets.emit('nextWin', nextWinAt);
    } else {
      socket.emit('noPoints');
    }
  });

  //Listen for stats reset
  socket.on('resetStats', function(data){
    clientPoints[socketID] = data.points
    socket.emit('addPoints', clientPoints[socketID]);
  });

  //Listen for disconnecting clients and remove them from clientPoints object
  socket.on('disconnect', function(){
    delete clientPoints[socketID];
    console.log('Client ' + socketID + ' has disconnected.');
  });

});

start_clock(); //Starts the in-game round timer

//Serving static files
/*app.use(express.static('public'));*/  //Dev purposes, not used on the final page

/*FUNCTIONS*/

//Determines reward for player by comparing to rounds played
function pointCounter(round){
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

//Determines how many rounds until next winning round
function nextWin(round){
  var tillNext = 10 - (round % 10)
  return tillNext;
}


//Round timer

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

function restart_round(){
  io.sockets.emit('newRound');  //Inform clients about the end of the round
  start_clock();  //Restart the clock
}
//End of round timer

//Function for sorting client scores to scoreboard in descending order
function scoreboard_sort(socket_id, id_points){

  //Variables
  var output='';

  //Create array for storing usernames and their points
  var scoreboard = new Array();

  //SCOREBOARD SORTER START

  /*Loop for getting correct username and point values for socket id
  and storing them into an array for sorting and display purposes*/
  for (var i = 0; i < Object.keys(socket_id).length; i++){

    var username = Object.keys(socket_id)[i]

    var socketID = socket_id[Object.keys(socket_id)[i]]
    var client_points = id_points[socketID]

    var object = new Object();  //Create object for storing username and point pairs
    //Add username and it's points to object
    object['username'] = username;
    object['points'] = client_points;

    scoreboard[i] = object;  //Append object to array
  }

  //Sort created array by the points
  scoreboard.sort(function(a,b){
    return b.points - a.points;  //Sorting in descending order
  });

  //Create output for displaying scoreboard on clients
  for (var i = 0; i < scoreboard.length; i++){
    output = output + '<p>' + (i+1) + '. '
    + scoreboard[i].username + ' ' + scoreboard[i].points + '</p>';
  }

  return output;
}
