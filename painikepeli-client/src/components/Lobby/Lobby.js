import React, {useState} from 'react';
import {Link} from 'react-router-dom';

/*import ''; CSS */

  const Lobby = () => {

    const [username, setUsername] = useState('');

    return (
      <div>
      <h1>EnterGame</h1>
        <div><input placeholder="Valitse nimimerkki..." id="username_input" type ="text" onChange={(event) => setUsername(event.target.value)}/></div>
        <Link onClick={event => (!username) ? event.preventDefault() : null} to={`/game?username=${username}`}>
          <div><button id="username_btn">Liity peliin</button></div>
        </Link>
      </div>
    )
  }

export default Lobby;
