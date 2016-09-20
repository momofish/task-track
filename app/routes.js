import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from './components/App';
import Tasks from './components/Tasks';
import MyTask from './components/MyTask';
import Calendar from './components/Calendar';
import Workload from './components/Workload';
import ProjectTask from './components/ProjectTask';

export default (
  <Route path='/' component={App}>
    <IndexRedirect to="tasks" />
    <Route path='tasks' component={Tasks}>
      <Route path='calendar' component={Calendar} />
      <Route path='workload' component={Workload} />
      <Route path=':category' component={MyTask} />
      <Route path='projects/:id' component={ProjectTask} />
      <IndexRedirect to="my" />
    </Route>
  </Route>
);