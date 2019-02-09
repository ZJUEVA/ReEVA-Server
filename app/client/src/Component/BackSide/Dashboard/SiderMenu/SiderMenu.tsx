import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
import { Link } from 'react-router-dom';
import React from 'react';
export interface SiderMenuProps {
	collapsed: boolean;
	onCollapse: Function;
	isMobile: boolean;
}

export default class SiderMenu extends React.Component<SiderMenuProps> {

	render() {
		return (
			<Sider
				breakpoint="lg"
				collapsedWidth="0"
				trigger={null}
				collapsed={this.props.collapsed}
				style={{ height: this.props.isMobile ? '100%' : 'inherit' }}
			>
				<div className="logo" />
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[location.pathname]}
					onClick={() => { if (this.props.isMobile) { this.props.onCollapse(true); } }}
				>
					<Menu.Item key="/backside/dashboard">
						<Icon type="user" />
						<span className="nav-text">个人概况</span>
						<Link to="/backside/dashboard" className="nav-text" />
					</Menu.Item>
					<Menu.Item key="2" disabled>
						<Icon type="area-chart" />
						<span className="nav-text">统计图表</span>
					</Menu.Item>
					<Menu.Item key="/backside/dashboard/members">
						<Icon type="team" />
						<span className="nav-text">成员管理</span>
						<Link to="/backside/dashboard/members" className="nav-text" />
					</Menu.Item>
					<Menu.Item key="/backside/dashboard/issues">
						<Icon type="api" />
						<span className="nav-text">维修管理</span>
						<Link to="/backside/dashboard/issues" className="nav-text" />
					</Menu.Item>
				</Menu>
			</Sider>
		);
	}

}