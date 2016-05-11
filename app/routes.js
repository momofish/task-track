import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Tasks from './components/Tasks';
import MyTask from './components/MyTask';
import Project from './components/Project';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route component={Tasks}>
      <Route path='/tasks/my' component={MyTask} />
      <Route path='/projects/:id' component={Project} />
    </Route>
  </Route>
);
