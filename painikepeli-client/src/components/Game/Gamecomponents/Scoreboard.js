import React, {useState} from "react";
import {Link} from 'react-router-dom';

import './Scoreboard.css'

const Scoreboard = ({socket}) =>{

    const [scores, setScores] = useState(['']);

    /*Listen for emits*/

    socket.on('update_scoreboard', function(scoreArray){
        setScores(scoreArray);
    });

    socket.on('newRound', function(){
        setScores([]);
    });

    /*Method for disconnecting socket*/
    const disconnect = () =>{
        socket.disconnect();
    }

    return (
        <div>
            <Link to={`/End`}>
                <button id="endgame_btn" onClick={disconnect}>LOPETA</button>
            </Link>
            <div id="scoreboard_content">
                <h2 id="scoreboard_title">Scoreboard:</h2>
                {
                scores.map((data,index)=>{
                    return(
                    <p>{index+1}. {data.username} {data.points}</p>
                    )
                })}
            </div>
        </div>
    )
}


export default Scoreboard;