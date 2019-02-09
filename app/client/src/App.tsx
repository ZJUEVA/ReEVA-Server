import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as React from 'react';
import Provider from './Component/Provider';
import UserSide from './Component/UserSide';
import BackSide from './Component/BackSide';

export default class App extends React.Component {
	render() {
		return (
			<Provider>
				<BrowserRouter>
					<Switch>

						<Route path="/backside/" component={BackSide} />
						<Route path="/" component={UserSide} />
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}