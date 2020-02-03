import React, {useState} from "react";
import renderHTML from 'react-render-html';

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

    return (
        <div id="scoreboard_content">
            <h2 id="scoreboard_title">Scoreboard:</h2>
            {renderHTML(scores)}
        </div>
    )
}


export default Scoreboard;