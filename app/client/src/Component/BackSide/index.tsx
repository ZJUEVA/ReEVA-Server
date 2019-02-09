import * as React from 'react';
import { Layout } from 'antd';
import './BackSide.scss';
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

export default class App extends React.Component {

	render() {
		return (
			<Layout style={{ flexDirection: 'column', height: '100vh' }} className="App">
				<Layout.Header className="Back-App-header">
					<div>
						<div className="floatC">
							<span className="App-logo">ZJUEva 系统后台</span>
						</div>
					</div>
				</Layout.Header>

				<Switch>
					<Route exact path="/backside" component={Login} />
					<Route path="/backside/dashboard" component={Dashboard} />
				</Switch>

			</Layout>
		);
	}
}


