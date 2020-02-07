//Back-End JS

const express = require('express');
const port = 4000
const socket = require('socket.io');

/*APPLICATION SETUP*/
var app = express();

//Serving static files
app.use(express.static('public'));  //Dev purposes, not used on the final page

var server = app.listen(port, function(){
  console.log('Listening port ' + port);
});

/*VALUES STORED ON SERVER*/
var gameRound = 0  //Stores rounds that have been played
let client_list = [];  //Stores all clients' data in the form of client{} objects

/*Configuration variables*/
var round_lenght = 5;  //Sets round length in minutes

/*SOCKET SETUP*/
var io = socket(server);

io.on('connection', function(socket){
  console.log('Connected socket ' + socket.id);

  //Send current scoreboard to socket on connection
  var sorted_scoreboard = scoreboard_sort(client_list);
  socket.emit('update_scoreboard', sorted_scoreboard);

  var client = {};  //Stores socketID, username and points of specific client

  //Listening for client submitting username
  socket.on('username', function(data) {
    // Declare socketID, username and points related to the connected client
    var socketID = socket.id;
    var username = data.username;
    var points = 20;

    // Add the information into the client{} object dedicated to the socket
    client = {
        id: socketID,
        username: username,
        points: points
    };

    client_list.push(client);  // Add the created object to client_list array
    
    console.log(client); //Dev purposes
  });

  //Listening user clicks on play button
  socket.on('userClick', function(data){
    if (Object.values(client)[2] >= 1){
      //Update game round and send it to all clients
      gameRound += data.round
      io.sockets.emit('userClick', gameRound);

      //Update and send current points to client
      var pointsGranted = pointCounter(gameRound);
      if (pointsGranted != 0){
        client.points += pointsGranted
        client.points -= 1 //Minus the cost of playing a round
        socket.emit('winningRound', pointsGranted, client.points);
      }
      else{
      client.points += pointsGranted
      client.points -= 1 //Minus the cost of playing a round
      socket.emit('addPoints', client.points);
      }

      //Update new points of client{} to client_list[]
      var socketID = socket.id
      var new_points = client.points
      updatePoints(socketID, new_points);
      console.log('POINTS UPDATED');

      //Update and send scoreboard to clients
      var sorted_scoreboard = scoreboard_sort(client_list);
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
    client.points = data.points
    socket.emit('addPoints', client.points);
  });

  //Listen for disconnecting sockets and remove them from client_list[]
  socket.on('disconnect', function(){
    client_list.splice(client_list.findIndex((obj => obj.id == socket.id)),1);

    var sorted_scoreboard = scoreboard_sort(client_list);  //Update scoreboard
    io.sockets.emit('update_scoreboard', sorted_scoreboard);

    console.log(JSON.stringify(client_list));  // Dev purposes
    console.log('Client ' + socket.id + ' has disconnected.');  // Dev purposes
  });

});

start_clock(); //Starts the in-game round timer


//FUNCTIONS

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

//Updates points to client_list[]
function updatePoints(id,newpoints){
  for (var i in client_list){
      if(client_list[i].id == id){
          client_list[i].points = newpoints;
          break;
      }
  }
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
function scoreboard_sort(list){

  //Variables
  var output='';
  var position = 0;

  //Sort array by the points
  list.sort(function(a,b){
    return b.points - a.points;  //Sorting in descending order
  });

  //Create output for displaying scoreboard on clients
  for (var i in list){
    position +=1;
    output = output + '<p>' + (position) + '. '
    + list[i].username + ' ' + list[i].points + '</p>';
  }

  return output;
}