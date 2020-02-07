import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/*Import components*/
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import End from './components/End/End';

const App = () => (
  <Router>
    <Switch>
      <Route path='/' exact component={Lobby}/>
      <Route path='/game' component={Game}/>
      <Route path='/end' component={End}/>
    </Switch>
  </Router>
);

export default App;
