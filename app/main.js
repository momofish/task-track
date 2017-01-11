import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import moment from 'moment';

import routes from './routes';
import Navbar from './components/Navbar';

let history = createBrowserHistory();
moment.locale('zh-cn');

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));