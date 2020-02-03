import React, {useState} from "react";

import './PointDisplay.css';

const PointDisplay = ({socket}) =>{

    const[points, setPoints] = useState(20);
    const[seconds, setSeconds] = useState(0);
    const[minutes, setMinutes] = useState(0);
    const[nextWin, setNextWin] = useState(10);
    const[wonPoints, setWonPoints] = useState(0);

    /*Listen for emits*/

    socket.on('addPoints', function(clientPoints){
        setPoints(clientPoints);
    });

    socket.on('winningRound', function(pointsGranted){
        //TODO
    });

    socket.on('updateTimer', function(time){
        setSeconds(time.seconds);
        setMinutes(time.minutes);
    });

    socket.on('nextWin', function(roundsTillNext){
        setNextWin(roundsTillNext);
    });

    socket.on('newRound', function(){
        setNextWin(10);
        socket.emit('resetStats',{
            points:20
        });
    });

    socket.on('noPoints', function(){
        //TODO
    });

    return (
        <div id="points_container">
            <div>
                <h1 id="title">PAINIKEPELI</h1>
                <div><h1 className="points">Sinulla on {points} pistettä!</h1></div>
                <h2 id="nextWin">{nextWin} kierrosta seuraavaan voittoon.</h2>
                <h2 id="clock">{minutes}:{seconds}</h2>
            </div>
        </div>
    )
}

export default PointDisplay;