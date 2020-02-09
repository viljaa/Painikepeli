import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import './lobby.css';

  const Lobby = () => {

    const [username, setUsername] = useState('');
    const [invalid, setInvalid] = useState(false);

    
    /*Function for executing multiple functions onClick if username doesn't get through
      the validation*/

    const notValid = (event) =>{
      event.preventDefault();
      setInvalid(true);
    }

    return (
      <div id="lobby_container">
      <h1 className="h1_titles">PAINIKEPELI</h1>
        <div>
          <input placeholder="Valitse nimimerkki..." id="username_input" type ="text" onChange={
            (event) => setUsername(event.target.value)}/>
          <Link onClick={event => (!username || username.length > 15) ? notValid(event) : null} 
            to={`/game?username=${username}`}>
          <button id="username_btn">Liity peliin</button>
          </Link>
        </div>
        {invalid &&
          <div>
          <p className="input_error">Virheellinen syöte! Nimimerkin on oltava 1-15 merkkiä pitkä.</p>
          </div>
        }
      </div>
    )
  }

export default Lobby;
