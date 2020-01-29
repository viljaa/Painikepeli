import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

  const Game = ({location}) => {
    const endpoint = 'localhost:4000';

    useEffect(() => {
      const data = queryString.parse(location.search);
      const username = data.username;
      console.log('Nimimerkki:' + data.username);

      socket = io.connect(endpoint);

      socket.emit('username', {
        username: username
      });
    }, [endpoint, location.search]);

    return (
      <h1>Game</h1>
    )
  }

export default Game;
