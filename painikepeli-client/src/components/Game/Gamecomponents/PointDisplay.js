import React, {useState} from "react";

import './PointDisplay.css';

const PointDisplay = ({socket}) =>{

    const[points, setPoints] = useState(0);

    socket.on('addPoints', function(clientPoints){
        setPoints(clientPoints);
    });

    return (
        <div id="points_container">
            <div>
                <h1 id="title">PAINIKEPELI</h1>
            </div>
            <div>
                <h1 id="points">You have {points} points!</h1>
            </div>
        </div>
    )
}

export default PointDisplay;