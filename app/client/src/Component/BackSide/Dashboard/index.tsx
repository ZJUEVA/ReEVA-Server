//
// <reference path="../../../../../typings/react-qr-reader.d.ts" />

import React from 'react';
import { Layout, Menu, Icon, Button, Dropdown, Avatar, Modal, message } from 'antd';
const { Header, Content } = Layout;
import './Dashboard.scss';
import { Route, Switch, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Issues from './Issues';
import Members from './Members';
import Personal from './Members/Personal';
import * as jwt from 'jsonwebtoken';
import SiderMenu from './SiderMenu';
import QRScan from './QRScan';
import { request } from '../../../requset';
import { AxiosResponse } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Provider from '../../Provider';
import IssueDetailModal from './IssueDetailModal';

interface MemberInfo { username: string; nickname: string; bio: string; avatart: string; }
const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const isMobile = screenWidth < 741 ? true : false;
class RawDashboard extends React.Component<RouteComponentProps<any>> {
	state = {
		collapsed: isMobile,
		visible: false,
		delay: 300,
		result: 'nothing',
		update: 0,
		memberInfo: undefined as MemberInfo | undefined,
	};
	componentWillMount() {
		request.get(`/members/${localStorage.getItem('id')}`)
			.then((res: AxiosResponse<any>) => {
				this.setState({
					memberInfo: res.data
				});
			});
		const querycode = this.props.location.search.substr(7);
		if (querycode.length === 8) {
			request.get(`/issues/query/${querycode}`)
				.then((value: AxiosResponse<any>) => {
					Modal.confirm({
						title: '要认领这个维修任务吗？',
						content: <Provider><IssueDetailModal issue={value.data} /></Provider>,
						onOk: () => {
							request.post(`/backside/issues/claim/${querycode}`).then(() => {
								message.success('认领成功！');
							}).catch((err) => {
								message.error('认领失败！' + err.response.data.msg);
							});
						}
					});
				});
		}

	}
	showModal = () => {
		this.setState({
			visible: true,
		});
	}
	handleCancel = () => {
		this.setState({ visible: false });
	}
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}
	onClick = ({ key }: any) => {
		if (key === 'logout') {
			localStorage.removeItem('token');
			this.setState({ update: 0 });
		}
	}
	render() {
		if (localStorage.token === undefined) {
			return <Redirect to="/backside/" />;
		}
		const decode = jwt.decode(localStorage.token);
		if (typeof decode !== 'object') {
			return <Redirect to="/backside/" />;
		}
		if (!('exp' in decode!)) {
			return <Redirect to="/backside/" />;
		}
		const currentTime = Date.now() / 1000;
		if ((decode as any).exp < currentTime) {
			return <Redirect to="/backside/" />;
		}
		localStorage.setItem('id', (decode as any).data.i);



		return (
			<Layout style={{ minHeight: 'calc(100vh - 64px)', marginTop: '64px' }}>
				<Button
					type="primary"
					className="scanQR"
					shape="circle"
					icon="scan"
					onClick={this.showModal}
					style={{ zIndex: 99 }}
				/>
				<SiderMenu collapsed={this.state.collapsed} isMobile={isMobile} onCollapse={this.toggle} />
				<Layout>
					<Header style={{ background: '#fff', padding: 0, height: '48px' }}>
						<Icon
							className="trigger"
							type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={this.toggle}
						/>
						<Dropdown
							overlay={
								<Menu className="menu" onClick={this.onClick}>
									<Menu.Item key="return">
										<Link to="/" ><Icon type="home" />返回前台</Link>
									</Menu.Item>
									<Menu.Item disabled>
										<Icon type="user" />个人资料
									</Menu.Item>
									<Menu.Item key="logout">
										<Icon type="logout" /> 退出登录
									</Menu.Item>

								</Menu>}
							trigger={['click']}
						>
							<div className="right">
								<span className="action account" >
									{this.state.memberInfo !== undefined
										? (<div>
											{this.state.memberInfo.avatart !== null
												? <Avatar src={this.state.memberInfo.avatart} className="avatar" size="small" />
												: <Avatar icon="user" className="avatar" size="small" />}

											<span className="name" style={{ marginLeft: '3px' }}>
												{this.state.memberInfo!.nickname !== null
													? this.state.memberInfo!.nickname
													: this.state.memberInfo!.username}
											</span>
										</div>)
										: (<div><Avatar icon="user" className="avatar" size="small" />
											<span className="name">You</span> </div>)}

								</span>
							</div>
						</Dropdown>
					</Header>
					<Content
						style={{
							margin: isMobile ? '8px 0' : '16px 16px',
							padding: isMobile ? '8px' : '24px',
							background: '#fff', minHeight: 280, overflow: 'scroll'
						}}
					>
						<Switch>
							<Route exact path="/backside/dashboard/" render={(props) => <Personal isMobile={isMobile} />} />
							<Route path="/backside/dashboard/members" render={(props) => <Members isMobile={isMobile} />} />
							<Route path="/backside/dashboard/issues" render={(props) => <Issues isMobile={isMobile} />} />
						</Switch>
					</Content>
				</Layout>
				<QRScan visible={this.state.visible} onCancel={this.handleCancel} />
			</Layout >
		);
	}
}
const Dashboard = withRouter(RawDashboard);
export default Dashboard;