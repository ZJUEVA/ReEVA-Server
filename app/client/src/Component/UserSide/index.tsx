import * as React from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import './UserSide.scss';
import { Link, Switch, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Details from './Details';

export default class App extends React.Component {

	render() {
		const menu = (
			<Menu style={{ top: '-10px' }}>
				<Menu.Item>
					<Link to="/backside" className="links">会员登录</Link>
				</Menu.Item>
			</Menu>
		);
		return (
			<Layout style={{ flexDirection: 'column', height: '100vh' }} className="App">
				<Layout.Header className="App-header">
					<div>
						<div className="floatC">
							<Link to="/" className="App-logo">ZJUEva 报修系统</Link>
						</div>
						<Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
							<a className="links" href="#">
								<Icon type="ellipsis" />
							</a>
						</Dropdown>
					</div>
				</Layout.Header>
				<Layout.Content style={{ margin: '16px', marginTop: '70px', overflow: 'initial' }}>
					<Switch>
						<Route exact path="/" component={Homepage} />
						<Route path="/details" component={Details} />
					</Switch>
				</Layout.Content>
				<Layout.Footer style={{ textAlign: 'center' }}>
					ReEva ©2018
				</Layout.Footer>
			</Layout>
		);
	}
}


