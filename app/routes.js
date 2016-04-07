import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Character from './components/Character';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/characters/:id' component={Character} />
  </Route>
);
