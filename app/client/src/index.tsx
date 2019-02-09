import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import registerServiceWorker from './registerServiceWorker';
import App from './App';
import './index.scss';


ReactDOM.render(
	<LocaleProvider locale={zh_CN}><App /></LocaleProvider>,
	document.getElementById('root')
);
registerServiceWorker();
