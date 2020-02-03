import io from 'socket.io-client';

const endpoint = 'localhost:4000';
const socket = io.connect(endpoint);

function socket(){
    return socket;
}

/*EMIT EVENTS*/
function send_username(username){
    socket.emit('username', {
        username: username
    });
}

function user_click(){
    socket.emit('userClick',{
        round: 1
    });
}

/*LISTEN EVENTS*/
socket.on('userClick', function(gameRound){
    console.log(gameRound);
});

export {send_username};
export {user_click};