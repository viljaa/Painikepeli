import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import Rules from './Gamecomponents/Rules.js';
import PointDisplay from './Gamecomponents/PointDisplay.js';
import Playbutton from './Gamecomponents/PlayButton.js';
import Scoreboard from './Gamecomponents/Scoreboard.js';

import './game.css';

  const Game = ({location}) => {

    const endpoint = 'localhost:4000'

    const socket = io.connect(endpoint);

    /*EMIT EVENTS*/
    function send_username(username){
        socket.emit('username', {
            username: username
        });
    }

    /*LISTEN EVENTS*/
    socket.on('userClick', function(gameRound){
        console.log(gameRound);
    });

    useEffect(() => {
      const data = queryString.parse(location.search);
      const username = data.username;
      console.log('Nimimerkki:' + data.username);

      send_username(username)
    }, [endpoint, location.search]);

    return (
      <div>
        <div id="rules">
          <Rules />
        </div>
        <div id="app_container">
          <div id="game_container">
            <PointDisplay socket={socket} />
            <Playbutton socket={socket}/>
          </div>
          <div id="scoreboard_container">
            <Scoreboard />
          </div>
        </div>
        <div id="footer">
          <p id="footer_text">Made by Ville Jaatinen 2020</p>
        </div>
      </div>
    )
  }

export default Game;
