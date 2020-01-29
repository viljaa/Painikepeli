import React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

/*Import components*/
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';

const App = () => (
  <Router>
    <Switch>
      <Route path='/' exact component={Lobby}/>
      <Route path='/game' component={Game}/>
    </Switch>
  </Router>
);

export default App;
