import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import moment from 'moment';
import _ from 'moment/locale/zh-cn';

import routes from './routes';
import Navbar from './components/Navbar';

let history = createBrowserHistory();

// global config
moment.locale('zh-cn');
toastr.options = {
  "showDuration": "100",
  "hideDuration": "100",
  "timeOut": "1000",
  "extendedTimeOut": "1000",
}

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));