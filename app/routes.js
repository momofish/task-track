import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Tasks from './components/Tasks';
import MyTask from './components/MyTask';
import Calendar from './components/Calendar';
import Workload from './components/Workload';
import ProjectTask from './components/ProjectTask';

import * as k from './components/know';

export default (
  <Route path='/' component={App}>
    <IndexRedirect to="tasks" />
    <Route path='tasks' component={Tasks}>
      <IndexRoute component={Home} />
      <Route path='calendar' component={Calendar} />
      <Route path='workload' component={Workload} />
      <Route path=':category' component={MyTask} />
      <Route path='projects/:id' component={ProjectTask} />
    </Route>
    <Route path='know' component={k.Know}>
      <IndexRoute component={k.Home} />
      <Route path='q/my' component={k.MyQuestion} />
      <Route path='q/:category' component={k.Questions} />
    </Route>
  </Route>
);