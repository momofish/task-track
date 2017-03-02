import React from 'react';
import { Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'moment/locale/zh-cn';

import routes from './routes';
import Navbar from './components/Navbar';

// global config
moment.locale('zh-cn');
toastr.options = {
  "showDuration": "100",
  "hideDuration": "100",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
}

ReactDOM.render(<Router routes={routes} history={browserHistory} />, document.getElementById('app'));