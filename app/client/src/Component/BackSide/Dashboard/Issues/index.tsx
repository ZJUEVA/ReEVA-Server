import React from 'react';
import { Tabs } from 'antd';
import IssueList from './IssueList';
// import { Route, Switch } from 'react-router';
const { TabPane } = Tabs;

export default class Issues extends React.Component<{ isMobile: boolean }> {
	state = {
		key: '1',
	};

	onToggleTab = (key: string) => {
		this.setState({ key });
	}
	render() {

		return (

			<Tabs defaultActiveKey="1" tabBarStyle={{ textAlign: 'center' }} onChange={this.onToggleTab} >
				<TabPane tab="个人维修" key="1">
					<IssueList isMobile={this.props.isMobile} from="/backside/issues/my-claim" xkey={this.state.key} nkey="1" />
				</TabPane>

				<TabPane tab="近期维修" key="2" >


					<IssueList isMobile={this.props.isMobile} from="/backside/issues/recently" xkey={this.state.key} nkey="2" />
				</TabPane>
				<TabPane tab="社团维修" key="3" >
					<IssueList isMobile={this.props.isMobile} from="/backside/issues" xkey={this.state.key} nkey="3" />
				</TabPane>
			</Tabs>

		);
	}
}

