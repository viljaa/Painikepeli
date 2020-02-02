import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import './lobby.css';

  const Lobby = () => {

    const [username, setUsername] = useState('');

    return (
      <div id="lobby_container">
      <h1 className="h1_titles">PAINIKEPELI</h1>
        <div><input placeholder="Valitse nimimerkki..." id="username_input" type ="text" onChange={
          (event) => setUsername(event.target.value)}/>
        <Link onClick={event => (!username) ? event.preventDefault() : null} to={`/game?username=${username}`}>
          <button id="username_btn">Liity peliin</button>
        </Link>
        </div>
      </div>
    )
  }

export default Lobby;
