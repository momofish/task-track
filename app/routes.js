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
      <Route path='q/my(/:filter)' component={k.MyQuestions} />
      <Route path='q/add' component={k.QuestionEditor} />
      <Route path='q/v/:id' component={k.QuestionViewer} />
      <Route path='q/:category(/:filter)(/:pageNo)' component={k.Questions} />

      <Route path='b/my(/:filter)' component={k.MyBlogs} />
      <Route path='b/add' component={k.BlogEditor} />
      <Route path='b/v/:id' component={k.BlogViewer} />
      <Route path='b/:category(/:filter)(/:pageNo)' component={k.Blogs} />
    </Route>
  </Route>
);