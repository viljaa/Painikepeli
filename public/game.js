//Front-End Application JS

//Connect client to server
const socket = io.connect('http://localhost:3000');

//Elements
var button = document.getElementById('playBtn');
var kierrosDIV = document.getElementById('kierrosDIV')
var pisteetDIV = document.getElementById('pisteetDIV')
var nextWinDIV = document.getElementById('nextWin')
var timerDIV = document.getElementById('timer')

//Variables
var kierrosNro = 0  //DEV PURPOSES: Variable for displaying rounds that have been played
var pelaajanPisteet = 20  //Variable for displaying player's points
var kierroksiaVoittoon = 10  //Variable for displaying rounds until next win

//Display player's points on load
pisteetDIV.innerHTML = '<p>Pisteesi:' + pelaajanPisteet + '</p>';
nextWinDIV.innerHTML = '<p>Kierrokset seuraavaan voittoon: ' + kierroksiaVoittoon + '</p>';

//EMIT EVENTS

button.addEventListener('click', function(){
  socket.emit('userClick',{
    round: 1
  });
});


//LISTEN FOR EVENTS

//Display round
socket.on('userClick', function(gameRound){
  kierrosNro = gameRound
  kierrosDIV.innerHTML = '<p>Kierros:' + kierrosNro + '</p>';
});

//Add and display points
socket.on('addPoints', function(pointsGranted){
  console.log('Pelaajan pisteet saapuivat: ' + pointsGranted);
  pelaajanPisteet = pointsGranted
  console.log('Pistetilanne päivitetty pelaajanPisteet muuttujaan: ' + pelaajanPisteet);
  pisteetDIV.innerHTML = '<p>Pisteesi:' + pelaajanPisteet + '</p>';
});

//Update counter for rounds until next win
socket.on('nextWin', function(nextWinAt){
  kierroksiaVoittoon = nextWinAt
  nextWinDIV.innerHTML = '<p>Kierrokset seuraavaan voittoon: ' + kierroksiaVoittoon + '</p>';
});


//"No points left" - event, ask player if they want to restart
socket.on('noPoints', function(){
  //VAATII UUDEN KÄYTTÖLIITTYMÄN, KÄYTETTÄVÄ JOTAIN MUUTA KUIN CONFIRM DIALOGIA
  if(confirm("Pisteesi ovat loppu! Haluatko aloittaa alusta?")){
    socket.emit('resetStats', {
      points: 20
    });
  }else {
    alert('KIITOS PELAAMISESTA!');
  };
});

//"New round" - event, sends reset request to server to reset points and dislpay updated points to client
socket.on('newRound', function(){
  kierroksiaVoittoon = 10;
  nextWinDIV.innerHTML = '<p>Kierrokset seuraavaan voittoon: ' + kierroksiaVoittoon + '</p>';
  socket.emit('resetStats', {
    points: 20
  });
});

//Notify user about winning round
socket.on('winningRound', function(pointsGranted){
  alert("Voitit " + pointsGranted + " pistettä!");  //PROOF OF CONCEPT
});

//"Update Timer" - event
socket.on('updateTimer', function(data){
  timerDIV.innerHTML = '<p>' + data.minutes + ' minuuttia ' + data.seconds
  + ' sekuntia kierroksen loppuun.</p>'
});
