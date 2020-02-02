import React from "react";

import './PointDisplay.css';

const PointDisplay = () =>{
    return (
        <div id="points_container">
            <div>
                <h1 id="title">PAINIKEPELI</h1>
            </div>
            <div>
                <h1 id="points">You have 0 points!</h1>
            </div>
        </div>
    )
}

export default PointDisplay;