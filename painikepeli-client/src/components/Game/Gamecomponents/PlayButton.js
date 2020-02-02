import React from "react";
import {user_click} from '../api'

import './PlayButton.css';

const PlayButton = () =>{
    return (
        <div id="button_container">
            <button id="play_button" onClick={user_click}>PLAY</button>
        </div>
    )
}

export default PlayButton;