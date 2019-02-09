import * as React from 'react';

import { request } from '../requset';
import PropTypes from 'prop-types';

export interface ContextType {
	brands: string[];
	elects: string[];
	states: string[];

}
export const contextTypes = {
	brands: PropTypes.arrayOf(PropTypes.string),
	elects: PropTypes.arrayOf(PropTypes.string),
	states: PropTypes.arrayOf(PropTypes.string)
};

export default class Provider extends React.Component {
	static childContextTypes = contextTypes;

	state = {
		brands: [],
		elects: [],
		states: [],
	};

	getChildContext() {
		return {
			brands: this.state.brands,
			elects: this.state.elects,
			states: this.state.states
		};
	}
	componentWillMount() {
		request.get('/data/json/computerBrand')
			.then(response => {
				this.setState({ brands: response.data });
			});
		request.get('/data/json/electronicType')
			.then(response => {
				this.setState({ elects: response.data });
			});
		request.get('/data/json/issueState')
			.then(response => {
				this.setState({ states: response.data });
			});
	}
	render() {
		let { children } = this.props;
		return React.Children.only(children);
	}

}