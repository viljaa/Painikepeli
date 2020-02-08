import React, {useState} from "react";
import renderHTML from 'react-render-html';
import {Link} from 'react-router-dom';

import './Scoreboard.css'

const Scoreboard = ({socket}) =>{

    const [scores, setScores] = useState('');

    /*Listen for emits*/

    socket.on('update_scoreboard', function(scoreboard){
        setScores(scoreboard);
    });

    socket.on('newRound', function(){
        setScores('');
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
                {renderHTML(scores)}
            </div>
        </div>
    )
}


export default Scoreboard;