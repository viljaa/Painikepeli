import React, { useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import Rules from './Gamecomponents/Rules.js';
import PointDisplay from './Gamecomponents/PointDisplay.js';
import Playbutton from './Gamecomponents/PlayButton.js';
import Scoreboard from './Gamecomponents/Scoreboard.js';
import AlertDialog from './Gamecomponents/AlertDialog.js'

import './game.css';

  const Game = ({location}) => {

    const endpoint = 'https://vj-painikepeli.herokuapp.com/'

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

      send_username(username);
    }, [endpoint, location.search]);

    return (
      <div id = "ui_container">
        <div id="rules">
          <Rules />
        </div>
        <div id="app_container">
          <div id="game_container">
            <PointDisplay socket={socket} />
            <Playbutton socket={socket}/>
          </div>
          <div id="scoreboard_container">
            <Scoreboard socket={socket}/>
          </div>
        </div>
        <div id="footer">
          <p id="footer_text">Made by Ville Jaatinen 2020</p>
        </div>
          <AlertDialog socket ={socket}/>
      </div>
    )
  }

export default Game;
