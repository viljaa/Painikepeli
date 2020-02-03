import React from "react";

import './PlayButton.css';

const PlayButton = ({socket}) =>{

    function user_click(){
        socket.emit('userClick',{
            round: 1
        });
    }

    return (
        <div id="button_container">
            <button id="play_button" onClick={user_click}>PLAY</button>
        </div>
    )
}

export default PlayButton;