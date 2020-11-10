// Back-End JS

const express = require('express');
const port = process.env.PORT || 4000
const socket = require('socket.io');
const http = require('http');

/*APPLICATION SETUP*/
const app = express();

const server = http.createServer(app);

app.use(express.static('build'));

server.listen(port, function(){
  console.log('Listening port ' + port);
});

// Server-side routing
app.get('/*',(req,res)=>{
  res.sendFile(__dirname + '/client/build/index.html');
})

/*VALUES STORED ON SERVER*/
let gameRound = 0  //Stores rounds that have been played
let client_list = [];  //Stores all clients' data in the form of client{} objects

/*CONFIGURATION VARIABLES*/
const round_lenght = 3;  // Sets round length in minutes

/*SOCKET SETUP*/
const io = socket(server);

io.on('connection', function(socket){
  console.log('Connected socket ' + socket.id);

  // Send current scoreboard to socket on connection
  let sorted_scoreboard = scoreboard_sort(client_list);
  socket.emit('update_scoreboard', sorted_scoreboard);

  let client = {};  // Stores socketID, username and points of specific client

  // Listening for client submitting username
  socket.on('username', function(data) {
    // Declare socketID, username and points related to the connected client
    let socketID = socket.id;
    let username = data.username;
    let points = 20;

    // Add the information into the client{} object dedicated to the socket
    client = {
        id: socketID,
        username: username,
        points: points
    };

    client_list.push(client);  // Add the created object to client_list array
    
    console.log(client); // Dev purposes
  });

  // Listening user clicks on play button
  socket.on('userClick', function(data){

    // Check if client has enough points
    if (Object.values(client)[2] >= 1){
      // Update game round
      gameRound += data.round

      // Update and send current points to client
      let pointsGranted = pointCounter(gameRound);
      if (pointsGranted != 0){
        client.points += pointsGranted
        client.points -= 1 // Minus the cost of playing a round
        socket.emit('winningRound', pointsGranted, client.points);
      }
      else{
      client.points += pointsGranted
      client.points -= 1 // Minus the cost of playing a round
      socket.emit('addPoints', client.points);
      }

      // Update new points of client{} to client_list[]
      let socketID = socket.id
      let new_points = client.points
      updatePoints(socketID, new_points);

      // Update and send scoreboard to clients
      let sorted_scoreboard = scoreboard_sort(client_list);
      io.sockets.emit('update_scoreboard', sorted_scoreboard);

      // Update rounds until next winning round and send value to all clients
      let nextWinAt = nextWin(gameRound);
      io.sockets.emit('nextWin', nextWinAt);
    } 
    // If client doesn't have points
    else {
      socket.emit('noPoints');
    }
  });

  // Listen for stats reset
  socket.on('resetStats', function(data){
    client.points = data.points
    socket.emit('addPoints', client.points);
  });

  // Listen for disconnecting sockets and remove them from client_list[]
  socket.on('disconnect', function(){
    client_list.splice(client_list.findIndex((obj => obj.id == socket.id)),1);

    let sorted_scoreboard = scoreboard_sort(client_list);  // Update scoreboard
    io.sockets.emit('update_scoreboard', sorted_scoreboard);

    console.log(JSON.stringify(client_list));
    console.log('Client ' + socket.id + ' has disconnected.');
  });

});

start_clock(); // Starts the in-game round timer


/*FUNCTIONS*/

// Determines reward for player by comparing to rounds played
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

// Determines how many rounds until next winning round
function nextWin(round){
  let tillNext = 10 - (round % 10)
  return tillNext;
}

// Updates points to client_list[]
function updatePoints(id,newpoints){
  for (let i in client_list){
      if(client_list[i].id == id){
          client_list[i].points = newpoints;
          break;
      }
  }
}

// In-game clock

function start_clock(){

  let round_start = Date.parse(new Date());  // The time when the round starts in milliseconds
  let round_end = new Date(round_start + round_lenght*60*1000);  // The time when the round ends in milliseconds

  function update_time(){
    let time = time_left(round_end);

    io.sockets.emit('updateTimer', {
      minutes: time.minutes,
      seconds: time.seconds
    });

    if (time.total_time <= 0){clearInterval(timeinterval);
      gameRound = 0;
      restart_round();}
  }
  update_time();
  let timeinterval = setInterval(update_time, 1000);  // Time interval for updating the clock for display
}

function time_left(roundend){
  let total_time = Date.parse(roundend) - Date.parse(new Date());  // Total time left = (RoundEndTime - CurrentTime)
  let seconds = Math.floor( (total_time/1000) % 60 );  // Remainder of seconds
  let minutes = Math.floor( (total_time/1000/60) % 60 );  // Remainder of minutes

  // Function returns time left formatted into minutes and seconds
  return {'total_time':total_time, 'minutes': minutes, 'seconds': seconds};
}

function restart_round(){
  io.sockets.emit('newRound');  // Inform clients about the end of the round

  start_clock();  // Restart the clock
}
// End of in-game clock

// Function for sorting client scores to scoreboard in descending order
function scoreboard_sort(list){

  // Sort array by the points
  let output = list.sort(function(a,b){
    return b.points - a.points;  // Sorting in descending order
  });

  return output;
}